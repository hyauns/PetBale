'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { ActivePaw } from '@/components/flying-paws'
import {
  cartCreate,
  cartDiscountCodesUpdate,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  getCart,
} from '@/lib/shopify/mutations'
import type { ShopifyCart, ShopifyCartLine } from '@/lib/shopify/types'
import { trackAddToCart } from '@/lib/gtag'

export interface CartItem {
  id: string // Shopify cart line ID
  merchandiseId: string
  slug: string
  name: string
  weight: string
  price: number
  imageSrc: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (merchandiseId: string, quantity?: number, clientX?: number, clientY?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, qty: number) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  cartSubtotal: number
  checkoutUrl: string | null
  isPending: boolean
  /** Code of the currently-applied (applicable) discount, if any. */
  appliedDiscountCode: string | null
  /** Total discount amount, in USD. */
  discountAmount: number
  /** Order total after discount, in USD. */
  cartTotal: number
  /** Apply a discount code. Resolves true if it stuck (applicable), false otherwise. */
  applyDiscount: (code: string) => Promise<boolean>
  removeDiscount: () => Promise<void>
  isDiscountPending: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ID_KEY = 'petbale_shopify_cart_id'
const LEGACY_CART_KEY = 'petbale_cart'

function safePrice(amount: string | undefined): number {
  const n = parseFloat(amount ?? '0')
  return Number.isFinite(n) ? n : 0
}

function mapLine(line: ShopifyCartLine): CartItem {
  const m = line.merchandise
  const sizeOption =
    m.selectedOptions?.find((o) => /size|weight|pack/i.test(o.name)) ?? m.selectedOptions?.[0]
  const price = safePrice(m.price?.amount)
  if (price === 0) {
    console.warn('[cart] line price parsed as 0 — raw merchandise =', m)
  }
  return {
    id: line.id,
    merchandiseId: m.id,
    slug: m.product?.handle ?? '',
    name: (m.product?.title ?? m.title ?? '').toUpperCase(),
    weight: sizeOption?.value ?? m.title ?? '',
    price,
    imageSrc: m.image?.url ?? '',
    quantity: line.quantity,
  }
}

function mapCart(cart: ShopifyCart): CartItem[] {
  // The Cart API clamps sold-out DENY variants to quantity 0 — hide those lines.
  return cart.lines.edges.filter((e) => e.node.quantity > 0).map((e) => mapLine(e.node))
}

// Lazy-loaded so framer-motion stays out of the shared bundle on every route —
// the paw chunk only loads on the first add-to-cart click.
const FlyingPaws = dynamic(() => import('@/components/flying-paws'), { ssr: false })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isDiscountPending, setIsDiscountPending] = useState(false)
  const [activePaws, setActivePaws] = useState<ActivePaw[]>([])

  const applyCart = useCallback((next: ShopifyCart | null) => {
    setCart(next)
    setCartItems(next ? mapCart(next) : [])
    if (next) localStorage.setItem(CART_ID_KEY, next.id)
  }, [])

  // Hydrate from existing Shopify cart on first mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Purge legacy cart storage from pre-Shopify code
    localStorage.removeItem(LEGACY_CART_KEY)
    const savedId = localStorage.getItem(CART_ID_KEY)
    if (!savedId) return
    let cancelled = false
    getCart(savedId)
      .then((c) => {
        if (cancelled) return
        if (c) applyCart(c)
        else localStorage.removeItem(CART_ID_KEY)
      })
      .catch((err) => {
        console.error('[cart] failed to hydrate', err)
        localStorage.removeItem(CART_ID_KEY)
      })
    return () => {
      cancelled = true
    }
  }, [applyCart])

  const ensureCart = useCallback(
    async (merchandiseId?: string, quantity?: number): Promise<ShopifyCart> => {
      if (cart) return cart
      const created = await cartCreate(merchandiseId, quantity)
      applyCart(created)
      return created
    },
    [cart, applyCart]
  )

  const addToCart = useCallback(
    async (merchandiseId: string, quantity = 1, clientX?: number, clientY?: number) => {
      setIsPending(true)

      // Spawn flying paws animation from click coordinates to cart badge
      if (clientX !== undefined && clientY !== undefined && typeof window !== 'undefined') {
        const now = Date.now()
        setActivePaws((prev) => [
          ...prev,
          { id: now, startX: clientX, startY: clientY, delay: 0 },
          { id: now + 1, startX: clientX + 12, startY: clientY - 12, delay: 0.15 }
        ])

        // Remove paws after flight finishes
        setTimeout(() => {
          setActivePaws((prev) => prev.filter((p) => p.id !== now && p.id !== now + 1))
        }, 1600)
      }

      // Execute cart mutation in parallel to avoid network-blocking latency
      const apiPromise = (async () => {
        try {
          let resultCart: ShopifyCart
          if (!cart) {
            resultCart = await ensureCart(merchandiseId, quantity)
          } else {
            resultCart = await cartLinesAdd(cart.id, [{ merchandiseId, quantity }])
            applyCart(resultCart)
          }
          // GA4/Google-Ads add_to_cart — pull price/name from the updated line.
          const added = mapCart(resultCart).find((i) => i.merchandiseId === merchandiseId)
          if (added) {
            trackAddToCart({ id: merchandiseId, name: added.name, price: added.price, quantity })
          }
        } catch (err) {
          console.error('[cart] addToCart failed', err)
        } finally {
          setIsPending(false)
        }
      })()

      // Handle drawer open transition in parallel
      if (clientX !== undefined && clientY !== undefined) {
        setTimeout(() => {
          setIsCartOpen(true)
        }, 1100)
      } else {
        setIsCartOpen(true)
      }

      // Still await the background API promise so the outer call behaves normally
      await apiPromise
    },
    [cart, ensureCart, applyCart]
  )

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) return
      setIsPending(true)
      try {
        const updated = await cartLinesRemove(cart.id, [lineId])
        applyCart(updated)
      } catch (err) {
        console.error('[cart] removeFromCart failed', err)
      } finally {
        setIsPending(false)
      }
    },
    [cart, applyCart]
  )

  const updateQuantity = useCallback(
    async (lineId: string, qty: number) => {
      if (!cart) return
      if (qty <= 0) {
        await removeFromCart(lineId)
        return
      }
      setIsPending(true)
      try {
        const updated = await cartLinesUpdate(cart.id, [{ id: lineId, quantity: qty }])
        applyCart(updated)
      } catch (err) {
        console.error('[cart] updateQuantity failed', err)
      } finally {
        setIsPending(false)
      }
    },
    [cart, applyCart, removeFromCart]
  )

  const clearCart = useCallback(async () => {
    if (!cart) return
    const allLineIds = cart.lines.edges.map((e) => e.node.id)
    if (!allLineIds.length) return
    setIsPending(true)
    try {
      const updated = await cartLinesRemove(cart.id, allLineIds)
      applyCart(updated)
    } finally {
      setIsPending(false)
    }
  }, [cart, applyCart])

  const applyDiscount = useCallback(
    async (code: string): Promise<boolean> => {
      const trimmed = code.trim()
      if (!trimmed || !cart) return false
      setIsDiscountPending(true)
      try {
        const updated = await cartDiscountCodesUpdate(cart.id, [trimmed])
        const stuck = updated.discountCodes?.some((d) => d.applicable) ?? false
        if (!stuck) {
          // Don't leave a dead/non-applicable code on the cart → checkout.
          applyCart(await cartDiscountCodesUpdate(cart.id, []))
          return false
        }
        applyCart(updated)
        return true
      } catch (err) {
        console.error('[cart] applyDiscount failed', err)
        return false
      } finally {
        setIsDiscountPending(false)
      }
    },
    [cart, applyCart]
  )

  const removeDiscount = useCallback(async () => {
    if (!cart) return
    setIsDiscountPending(true)
    try {
      applyCart(await cartDiscountCodesUpdate(cart.id, []))
    } catch (err) {
      console.error('[cart] removeDiscount failed', err)
    } finally {
      setIsDiscountPending(false)
    }
  }, [cart, applyCart])

  const cartCount = cart?.totalQuantity ?? 0
  const cartSubtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0
  const checkoutUrl = cart?.checkoutUrl ?? null
  const appliedDiscountCode = cart?.discountCodes?.find((d) => d.applicable)?.code ?? null
  const discountAmount = cart
    ? (cart.discountAllocations ?? []).reduce(
        (sum, a) => sum + parseFloat(a.discountedAmount.amount),
        0
      )
    : 0
  const cartTotal = cart ? parseFloat(cart.cost.totalAmount.amount) : 0

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        checkoutUrl,
        isPending,
        appliedDiscountCode,
        discountAmount,
        cartTotal,
        applyDiscount,
        removeDiscount,
        isDiscountPending,
      }}
    >
      {children}

      {/* Global Flying Paws Animation Overlay — lazy, only mounted while paws fly */}
      {activePaws.length > 0 && <FlyingPaws paws={activePaws} />}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
