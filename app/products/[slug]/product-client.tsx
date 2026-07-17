'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/components/product-image'
import { PawLoader } from '@/components/paw-loader'
import { shopifyImageUrl } from '@/lib/shopify-image-loader'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  'dog-food': 'DOG FOOD',
  'cat-food': 'CAT FOOD',
  'dog-treats': 'DOG TREATS',
  'flea-tick': 'FLEA & TICK',
  'cat-litter': 'CAT LITTER',
  'dog-supplies': 'DOG SUPPLIES',
  'cat-supplies': 'CAT SUPPLIES',
  'fish-supplies': 'FISH SUPPLIES',
  'bird-supplies': 'BIRD SUPPLIES',
  'reptile-supplies': 'REPTILE SUPPLIES',
}

// Toggle for review trust labels ("Verified Buyer" / "verified purchases").
// Set to false during the Google Merchant compliance period because the
// imported AliReviews are not tied to verifiable on-store purchases — calling
// them "verified" is a misrepresentation risk. Flip back to true to restore the
// labels once reviews are order-backed (anh wants this re-enabled later).
const SHOW_VERIFIED_LABELS = false

// Minimum review count for the "BEST SELLER" badge. The badge used to render on
// every product unconditionally; gate it on real popularity (review volume is
// our best proxy for sales). Tune this threshold as the catalog grows.
const BEST_SELLER_MIN_REVIEWS = 15

import type { CatalogProduct } from '@/lib/catalog'
import type { DisplayReview } from '@/lib/alireviews/adapters'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { trackViewItem } from '@/lib/gtag'
import { RatingStars } from '@/components/rating-stars'

export function ProductClient({
  product,
  related,
  reviews,
  initialVariantId,
}: {
  product: CatalogProduct
  related: CatalogProduct[]
  reviews: DisplayReview[]
  initialVariantId?: string | null
}) {
  const router = useRouter()
  const { addToCart } = useCart()
  const activeSlug = product.slug

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [{ src: product.imageSrc, alt: product.name }]

  const [imageIndex, setImageIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  // Track which gallery src has finished loading so the PawLoader shows until the
  // (Shopify-CDN-resized) main image is ready, then fades in.
  const [loadedMainSrc, setLoadedMainSrc] = useState<string | null>(null)
  const variants = product.variants
  // Default to the cheapest in-stock variant so PDP opens on a purchasable size
  // matching the "From $X" price cards show, not a sold-out one.
  const inStockVariants = variants.filter((v) => v.availableForSale)
  const initialVariant =
    (inStockVariants.length > 0 ? inStockVariants : variants).reduce<
      (typeof variants)[number] | null
    >((min, v) => (!min || v.price < min.price ? v : min), null)
  // initialVariantId comes from the server-resolved ?variant= feed param, so
  // the first render (and Google's crawl) already shows the feed variant's price.
  const [activeVariantId, setActiveVariantId] = useState<string | null>(
    initialVariantId ?? initialVariant?.id ?? product.defaultVariantId
  )
  const [activeTab, setActiveTab] = useState('about')
  const [scrollProgress, setScrollProgress] = useState(0)

  const activeVariant =
    variants.find((v) => v.id === activeVariantId) ?? initialVariant
  const soldOut = !activeVariant?.availableForSale
  const activePrice = activeVariant?.price ?? product.price
  const activeComparePrice = activeVariant?.comparePrice ?? product.comparePrice

  // Mobile sticky Add-to-Cart bar: visible whenever the real in-page Add-to-Cart
  // button is NOT in the viewport (so it shows on load while the gallery is up
  // top, hides when the buy box is reached, and reappears once scrolled past).
  const addToCartRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  useEffect(() => {
    const check = () => {
      const el = addToCartRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const inView = r.top < window.innerHeight && r.bottom > 0
      setShowStickyBar(!inView)
    }
    check()
    // capture=true so it also catches scrolls from any nested scroll container
    window.addEventListener('scroll', check, { passive: true, capture: true })
    window.addEventListener('resize', check)
    // re-check once layout settles after images load
    const t = setTimeout(check, 500)
    return () => {
      window.removeEventListener('scroll', check, { capture: true } as EventListenerOptions)
      window.removeEventListener('resize', check)
      clearTimeout(t)
    }
  }, [])

  const handleAddToCart = (e: { clientX: number; clientY: number }) => {
    if (activeVariantId && !soldOut) addToCart(activeVariantId, 1, e.clientX, e.clientY)
  }

  // Mobile address bar quirk: when it hides on scroll-down the visible area
  // grows but a fixed bottom:0 bar stays at the (shorter) layout-viewport
  // bottom, leaving a gap. Only listen to visualViewport RESIZE (fires when the
  // URL bar toggles, not during scroll → no jitter) and clamp to <=0 so we can
  // only nudge the bar DOWN to close a gap, never lift it (safe no-op otherwise).
  const [vvBottom, setVvBottom] = useState(0)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => {
      setVvBottom(Math.min(0, document.documentElement.clientHeight - vv.height))
    }
    update()
    vv.addEventListener('resize', update)
    return () => vv.removeEventListener('resize', update)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const maxScroll = target.scrollWidth - target.clientWidth
    if (maxScroll > 0) {
      setScrollProgress(target.scrollLeft / maxScroll)
    }
  }

  useEffect(() => {
    setImageIndex(0)
    setSlideDirection(0)
  }, [activeSlug])

  // Fire a GA4/Google-Ads view_item once per product (remarketing signal).
  useEffect(() => {
    trackViewItem({
      id: product.defaultVariantId ?? activeVariantId ?? product.slug,
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug])

  // 3D tilt
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), springConfig)

  const handleMouseMoveCard = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeaveCard = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Slider drag
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    setIsDragging(true)
    startX.current = e.pageX - sliderRef.current.offsetLeft
    scrollLeft.current = sliderRef.current.scrollLeft
    velocity.current = 0
    lastX.current = e.pageX
    lastTime.current = Date.now()
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      startMomentum()
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      startMomentum()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - startX.current) * 2.5
    sliderRef.current.scrollLeft = scrollLeft.current - walk

    const currentTime = Date.now()
    const dt = currentTime - lastTime.current
    if (dt > 0) {
      const dx = e.pageX - lastX.current
      velocity.current = dx / dt
    }
    lastX.current = e.pageX
    lastTime.current = currentTime
  }

  const startMomentum = () => {
    if (!sliderRef.current) return
    let currentVelocity = velocity.current * 16
    const friction = 0.95

    const step = () => {
      if (Math.abs(currentVelocity) < 0.15 || !sliderRef.current) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
        return
      }
      sliderRef.current.scrollLeft -= currentVelocity
      currentVelocity *= friction
      animationFrameId.current = requestAnimationFrame(step)
    }
    animationFrameId.current = requestAnimationFrame(step)
  }

  const feeding = product.feedingInstructions

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 relative overflow-hidden select-none">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-32 lg:pt-36 pb-6 relative z-10">
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white border-2 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-black">
          <Link href="/" className="hover:text-[#ff990a] transition-colors">HOME</Link>
          <span className="text-zinc-400">/</span>
          <Link href={`/collections/${product.category}`} className="text-[#ff990a] hover:underline">
            {CATEGORY_LABELS[product.category] ?? 'SHOP'}
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-500 uppercase truncate max-w-[150px] sm:max-w-none" aria-current="page">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative flex flex-col gap-6">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMoveCard}
                onMouseLeave={handleMouseLeaveCard}
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="bg-white border-3 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 flex items-center justify-center h-[380px] sm:h-[480px] relative overflow-hidden"
              >
                {(product.onSale || product.comparePrice) && (
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className="px-3.5 py-1 text-xs font-black uppercase border-2 border-black rounded-md bg-[#ffb224] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                      Sales
                    </span>
                  </div>
                )}

                {/* PawLoader fills the frame until the main photo's bytes arrive. */}
                {loadedMainSrc !== galleryImages[imageIndex].src && (
                  <span
                    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <PawLoader count={4} size={60} />
                  </span>
                )}

                {/* Highly sensitive spring-sliding image supporting direction-aware motion */}
                <motion.img
                  key={imageIndex}
                  src={shopifyImageUrl(galleryImages[imageIndex].src, 1000)}
                  alt={galleryImages[imageIndex].alt || product.name}
                  onLoad={() => setLoadedMainSrc(galleryImages[imageIndex].src)}
                  ref={(img) => {
                    if (img?.complete) setLoadedMainSrc(galleryImages[imageIndex].src)
                  }}
                  initial={{ opacity: 0.8, x: slideDirection * 35 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 15 // Highly sensitive distance threshold
                    const velocityThreshold = 100 // Highly sensitive flick velocity threshold
                    
                    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                      // Swipe Left -> Go to Next image (comes from right)
                      setSlideDirection(1)
                      setImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
                    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                      // Swipe Right -> Go to Prev image (comes from left)
                      setSlideDirection(-1)
                      setImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                    }
                  }}
                  className="max-w-full max-h-[85%] object-contain select-none cursor-grab active:cursor-grabbing pointer-events-auto touch-pan-y transition-transform duration-300 hover:scale-105"
                />

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSlideDirection(-1)
                        setImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-black bg-white hover:bg-neutral-100 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20 cursor-pointer select-none transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-black stroke-[2.5]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSlideDirection(1)
                        setImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-black bg-white hover:bg-neutral-100 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20 cursor-pointer select-none transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5]" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                      {galleryImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSlideDirection(i > imageIndex ? 1 : -1)
                            setImageIndex(i)
                          }}
                          className={cn(
                            'w-2 h-2 rounded-full border border-black transition-all duration-300 cursor-pointer',
                            imageIndex === i ? 'bg-black w-4' : 'bg-white'
                          )}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>

              {galleryImages.length > 1 && (
                <div className="hidden sm:flex gap-4 justify-start flex-wrap">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSlideDirection(i > imageIndex ? 1 : -1)
                        setImageIndex(i)
                      }}
                      className={cn(
                        'w-20 h-20 bg-white rounded-xl overflow-hidden border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center p-2',
                        imageIndex === i && 'border-3 border-[#ff990a] -translate-y-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                      )}
                    >
                      <ProductImage src={img.src} alt={img.alt} width={120} height={120} pawSize={22} className="max-w-full max-h-full object-contain pointer-events-none" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">

              <div className="flex flex-col gap-2.5">
                {product.reviewCount >= BEST_SELLER_MIN_REVIEWS && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-0.5 text-[10px] font-black uppercase border-2 border-black rounded bg-[#FFEA79] text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      BEST SELLER
                    </span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight sm:leading-none uppercase">
                  {product.name}
                </h1>
                <div className="text-sm font-black text-[#ff990a] uppercase tracking-widest -mt-1.5 mb-0.5">
                  BRAND: {product.brand || 'PETBALE'}
                </div>

                <button
                  onClick={() => {
                    const reviewsEl = document.getElementById('reviews-section')
                    if (reviewsEl) reviewsEl.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex items-center gap-1.5 mt-1 hover:opacity-85 active:scale-[0.98] transition-all cursor-pointer text-left self-start"
                >
                  <RatingStars rating={product.rating} size="lg" className="gap-1" />
                  {product.rating > 0 ? (
                    <span className="text-xs font-black text-zinc-700 ml-1.5 uppercase underline decoration-dashed decoration-2 underline-offset-4">
                      {product.rating.toFixed(1)} ({product.reviewCount} Customer Reviews)
                    </span>
                  ) : (
                    <span className="text-xs font-black text-zinc-400 ml-1.5 uppercase">
                      No reviews yet
                    </span>
                  )}
                </button>
              </div>

              <p className="text-base text-zinc-800 leading-relaxed font-tbj-interval border-t-2 border-dashed border-black/10 pt-4">
                {product.shortDescription}
              </p>

              {(() => {
                // Hide the selector when the only variant has no real label
                // (bad catalog data dumped a hex color into "Size").
                const showSelector =
                  variants.length > 1 || (variants.length === 1 && !!variants[0].weight)
                if (!showSelector) return null
                const allColor = variants.every((v) => v.colorHex && !v.weight)
                return (
                  <div className="flex flex-col gap-2.5 pt-2">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                      {allColor ? 'SELECT COLOR' : 'SELECT SIZE (PACK WEIGHT)'}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {variants.map((v) => {
                        const selected = activeVariantId === v.id
                        // Color swatch for hex-only variants (e.g. carriers in
                        // multiple colors mislabeled under "Size").
                        if (v.colorHex && !v.weight) {
                          return (
                            <button
                              key={v.id}
                              onClick={() => setActiveVariantId(v.id)}
                              disabled={!v.availableForSale}
                              aria-label={`Color option ${v.colorHex}`}
                              title={v.colorHex}
                              style={{ backgroundColor: v.colorHex }}
                              className={cn(
                                'w-11 h-11 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all duration-200',
                                selected && 'ring-4 ring-[#6cd1ff] ring-offset-2 -translate-y-0.5',
                                !v.availableForSale && 'opacity-40 cursor-not-allowed'
                              )}
                            />
                          )
                        }
                        return (
                          <button
                            key={v.id}
                            onClick={() => setActiveVariantId(v.id)}
                            disabled={!v.availableForSale}
                            className={cn(
                              'px-5 py-2.5 text-sm font-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all duration-200 uppercase',
                              selected
                                ? 'bg-[#6cd1ff] text-black border-3 -translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-white text-zinc-700',
                              !v.availableForSale && 'opacity-40 cursor-not-allowed line-through'
                            )}
                          >
                            {v.weight || 'Option'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              <div ref={addToCartRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pt-6 border-t-2 border-dashed border-black/10 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">TOTAL PRICE</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-black select-none">
                      ${activePrice.toFixed(2)}
                    </span>
                    {activeComparePrice && activeComparePrice > activePrice && (
                      <span className="text-xl sm:text-2xl font-bold text-zinc-400 line-through select-none">
                        ${activeComparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!activeVariantId || soldOut}
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#6cd1ff] text-black font-black text-base border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:border-[#6cd1ff] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                  <span>{soldOut ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                </motion.button>
              </div>

              {/* Shipping & returns summary (Google Merchant transparency) */}
              <div className="mt-4 rounded-xl border-2 border-black/10 bg-zinc-50 p-4 text-xs font-semibold text-zinc-700 leading-relaxed">
                <p><span aria-hidden="true">📦</span> U.S. delivery: 5–11 business days.</p>
                <p className="mt-1"><span aria-hidden="true">🚚</span> Free shipping $40+; $8.99 under $40.</p>
                <p className="mt-1"><span aria-hidden="true">↩️</span> 30-day returns on eligible items.</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 relative z-10">
        <div className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

          <div className="flex border-b-3 border-black mb-6 gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('about')}
              className={cn(
                'px-5 py-2.5 font-black text-xs sm:text-sm uppercase rounded-t-xl transition-all duration-200 cursor-pointer border-t-3 border-x-3 border-black -mb-[3px]',
                activeTab === 'about'
                  ? 'bg-[#6cd1ff] text-black shadow-[2px_-2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-50 text-zinc-500 border-b-3 border-black'
              )}
            >
              About This Item
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={cn(
                'px-5 py-2.5 font-black text-xs sm:text-sm uppercase rounded-t-xl transition-all duration-200 cursor-pointer border-t-3 border-x-3 border-black -mb-[3px]',
                activeTab === 'ingredients'
                  ? 'bg-[#ffea79] text-black shadow-[2px_-2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-50 text-zinc-500 border-b-3 border-black'
              )}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('feeding')}
              className={cn(
                'px-5 py-2.5 font-black text-xs sm:text-sm uppercase rounded-t-xl transition-all duration-200 cursor-pointer border-t-3 border-x-3 border-black -mb-[3px]',
                activeTab === 'feeding'
                  ? 'bg-[#6cd1ff] text-black shadow-[2px_-2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-50 text-zinc-500 border-b-3 border-black'
              )}
            >
              Feeding Guide
            </button>
          </div>

          <div className="min-h-[160px] font-tbj-interval">
            {activeTab === 'about' && (
              <div className="flex flex-col gap-4">
                {product.descriptionBlocks.length === 0 ? (
                  <>
                    <h3 className="text-lg font-black text-black uppercase tracking-tight">Product Overview</h3>
                    <p className="text-base text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </>
                ) : (
                  product.descriptionBlocks.map((block, i) => {
                    if (block.kind === 'heading') {
                      return (
                        <h3
                          key={i}
                          className="text-lg font-black text-black uppercase tracking-tight mt-3 pb-1 border-b-2 border-dashed border-black/10"
                        >
                          {block.text}
                        </h3>
                      )
                    }
                    if (block.kind === 'list') {
                      return (
                        <ul key={i} className="flex flex-col gap-2.5">
                          {block.items.map((item, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-3 text-base text-zinc-800 leading-relaxed font-medium"
                            >
                              <span className="mt-2 w-2 h-2 rounded-full bg-[#ff990a] flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p
                        key={i}
                        className="text-base text-zinc-800 leading-relaxed font-medium"
                      >
                        {block.text}
                      </p>
                    )
                  })
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-black uppercase tracking-tight">VITAL FRESH BLEND INGREDIENTS</h3>
                {product.ingredients.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic">Ingredient details not available for this product.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {product.ingredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 border-2 border-black rounded-full font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-zinc-50 text-black uppercase"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-zinc-400 mt-2">
                  * Ingredients sourced as listed by the brand.
                </p>
              </div>
            )}

            {activeTab === 'feeding' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2">
                  <span>📏</span>
                  <span>FEEDING GUIDE</span>
                </h3>
                {!feeding || (!feeding.summary && !feeding.transition && !feeding.caloricContent) ? (
                  <p className="text-sm text-zinc-500 italic">
                    Feeding instructions not available for this product. Consult your veterinarian for guidance.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {feeding.summary && (
                      <div className="bg-[#FAF6F0] border-2 border-black rounded-xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                          {feeding.summary}
                        </p>
                      </div>
                    )}

                    {feeding.transition && (
                      <div className="bg-[#fff6da] border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-3 items-start">
                        <span className="text-2xl flex-shrink-0">🔄</span>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                            Transition
                          </div>
                          <p className="text-sm text-zinc-800 leading-relaxed">
                            {feeding.transition}
                          </p>
                        </div>
                      </div>
                    )}

                    {feeding.caloricContent && (
                      <div className="bg-[#fff0eb] border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-3 items-start">
                        <span className="text-2xl flex-shrink-0">🔥</span>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                            Caloric Content
                          </div>
                          <p className="text-sm text-zinc-800 leading-relaxed">
                            {feeding.caloricContent}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-zinc-400">
                  * Portion requirements vary by breed, activity, and life stage. Adjust as needed.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {product.reviewCount > 0 && (
        <section id="reviews-section" className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 relative z-10 scroll-mt-32">
          <div className="bg-white border-3 border-black rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-3 border-black pb-6 mb-6">
              <div>
                <span className="font-attahost text-2xl text-black">Customer Feedback</span>
                <h2 className="font-whisker-bites text-3xl sm:text-4xl font-black text-black tracking-tight uppercase mt-1">
                  Reviews & Ratings
                </h2>
              </div>
              <div className="flex items-center gap-4 bg-zinc-50 border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center">
                  <span className="text-4xl font-black text-black">{product.rating.toFixed(1)}</span>
                  <div className="justify-center mt-1 flex">
                    <RatingStars rating={product.rating} size="md" />
                  </div>
                </div>
                <div className="text-xs font-black text-zinc-500 uppercase tracking-wide leading-snug">
                  Based on {product.reviewCount} {SHOW_VERIFIED_LABELS ? 'verified purchases' : 'reviews'}
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 italic text-center py-4">
                Reviews are being loaded. Please check back shortly.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-tbj-interval">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#FAF6F0] border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <span className="text-sm font-black text-black uppercase">{review.author}</span>
                          <span className="block text-[10px] font-bold text-zinc-400 mt-0.5">{review.date}</span>
                        </div>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>

                      <p className="text-sm text-zinc-800 leading-relaxed font-medium whitespace-pre-line">
                        “{review.comment}”
                      </p>

                      {review.media.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {review.media.slice(0, 4).map((src, i) => (
                            <a
                              key={i}
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-16 h-16 border-2 border-black rounded-lg overflow-hidden bg-white flex items-center justify-center hover:scale-105 transition-transform"
                            >
                              <Image src={src} alt="Review photo" width={120} height={120} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}

                      {review.reply && (
                        <div className="mt-3 p-3 bg-white border border-black/30 rounded-lg">
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#ff990a] mb-1">
                            Store reply
                          </div>
                          <p className="text-xs text-zinc-700 leading-relaxed">{review.reply}</p>
                        </div>
                      )}
                    </div>

                    {SHOW_VERIFIED_LABELS && (
                      <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-1.5 text-[10px] font-black text-[#4AD395] uppercase">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Buyer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      <section className="pt-32 pb-24 mt-20 relative overflow-hidden bg-[#FAF6F0] w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2">
        <div className="text-center mb-10 relative z-10 max-w-3xl mx-auto px-4">
          <span className="font-attahost text-3xl text-black">Complete Your Pack</span>
          <h2 className="font-whisker-bites text-4xl sm:text-5xl font-black text-black tracking-tight uppercase mt-2">
            Related Blends
          </h2>
        </div>

        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className="w-full max-w-[96%] mx-auto flex gap-6 overflow-x-auto py-6 px-4 z-10 relative cursor-grab active:cursor-grabbing hide-scrollbar"
        >
          {related.map((plan) => (
            <div
              key={plan.slug}
              onClick={() => {
                if (!isDragging) router.push(`/products/${plan.slug}`)
              }}
              className="w-[280px] sm:w-[320px] flex-shrink-0 cursor-pointer bg-white rounded-xl p-5 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] transition-all duration-200 flex flex-col justify-between h-[450px]"
            >
              <div className="flex-1 flex flex-col justify-start">
                <div className="w-full h-56 bg-white rounded-lg overflow-hidden relative mb-3 flex items-center justify-center p-3">
                  <ProductImage src={plan.imageSrc} alt={plan.name} width={400} height={400} sizes="(min-width: 1024px) 25vw, 50vw" className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="text-lg font-black text-black mb-1.5 truncate leading-snug">{plan.name}</h3>

                <div className="flex items-center gap-1 mb-2">
                  <RatingStars rating={plan.rating} size="sm" />
                  {plan.rating > 0 && (
                    <span className="text-[10px] font-black text-black ml-1">{plan.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-black/10">
                <span className="text-2xl font-black text-black">
                  {plan.variants.length > 1 && (
                    <span className="text-xs font-black text-zinc-400 uppercase mr-1">From</span>
                  )}
                  ${plan.price.toFixed(2)}
                </span>
                <button className="py-2 px-4 rounded-lg bg-[#ffea79] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-64 md:w-[512px] lg:w-[640px] xl:w-[768px] h-3 bg-white border-2 border-black rounded-full mx-auto mt-8 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-20">
          <div
            className="h-full bg-black transition-all duration-75 ease-out"
            style={{ width: `${50 + scrollProgress * 50}%` }}
          />
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>

      {/* Mobile sticky Add-to-Cart bar — shows whenever the in-page button is off-screen */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t-3 border-black shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] px-4 pt-3"
            style={{ bottom: vvBottom, paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none shrink-0">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">TOTAL</span>
                <span className="text-2xl font-black text-black select-none">${activePrice.toFixed(2)}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={!activeVariantId || soldOut}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#6cd1ff] text-black font-black text-base border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                <span>{soldOut ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
