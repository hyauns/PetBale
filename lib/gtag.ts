/**
 * Lightweight gtag.js helper shared by GA4 + Google Ads.
 *
 * The actual gtag.js loader lives in components/analytics-scripts.tsx; this file
 * only provides safe, typed wrappers for firing ecommerce events. Every helper
 * no-ops when gtag is absent (script blocked / env not set / SSR), so callers
 * never need to guard.
 *
 * IMPORTANT: the real Purchase conversion fires on Shopify's checkout
 * (pay.petbale.com) via a Custom Pixel — NOT here — because checkout completes
 * off this Next.js origin. These storefront events cover the upper funnel
 * (view_item / add_to_cart / begin_checkout) for remarketing + audiences.
 */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
export const CURRENCY = 'USD'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

interface EventItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
}

function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackViewItem(p: {
  id: string
  name: string
  price: number
  brand?: string
  category?: string
}) {
  gtagEvent('view_item', {
    currency: CURRENCY,
    value: p.price,
    items: [
      {
        item_id: p.id,
        item_name: p.name,
        item_brand: p.brand,
        item_category: p.category,
        price: p.price,
        quantity: 1,
      },
    ],
  })
}

export function trackAddToCart(p: {
  id: string
  name: string
  price: number
  quantity: number
}) {
  gtagEvent('add_to_cart', {
    currency: CURRENCY,
    value: p.price * p.quantity,
    items: [
      {
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      },
    ],
  })
}

export function trackBeginCheckout(p: { value: number; items: EventItem[] }) {
  gtagEvent('begin_checkout', {
    currency: CURRENCY,
    value: p.value,
    items: p.items,
  })
}
