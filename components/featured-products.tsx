'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Star } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Beef & Marrow Blend',
    subtitle: 'For Dogs',
    description: 'Grass-fed beef with nutrient-dense bone marrow, liver, heart, and seasonal vegetables. A complete & balanced daily meal.',
    price: '£12.50',
    weight: '500g',
    rating: 4.9,
    reviews: 238,
    tag: 'Best Seller',
    tagColor: 'bg-copper text-cream',
    image: '/images/product-beef-blend.png',
    protein: '74%',
  },
  {
    id: 2,
    name: 'Wild Salmon & Greens',
    subtitle: 'For Cats & Dogs',
    description: 'Cold-water wild salmon with spinach, kale, and flaxseed. Rich in Omega-3 DHA/EPA for coat health and brain function.',
    price: '£13.75',
    weight: '500g',
    rating: 4.8,
    reviews: 182,
    tag: 'New Formula',
    tagColor: 'bg-moss text-cream',
    image: '/images/product-salmon-blend.png',
    protein: '68%',
  },
  {
    id: 3,
    name: 'Free-Range Chicken & Veg',
    subtitle: 'For Dogs',
    description: 'Tender free-range chicken with sweet potato, peas, and parsley. The ideal starter raw meal for transitioning pets.',
    price: '£11.25',
    weight: '500g',
    rating: 4.7,
    reviews: 315,
    tag: 'Great for Beginners',
    tagColor: 'bg-copper-light text-bark',
    image: '/images/product-chicken-blend.png',
    protein: '70%',
  },
]

export function FeaturedProducts() {
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'translateY(0)'
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const allEls = [headingRef.current, ...cardsRef.current]
    allEls.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="py-24 lg:py-32 bg-background"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headingRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-copper" aria-hidden="true" />
              <span className="text-copper text-xs font-medium tracking-[0.2em] uppercase">
                Our Range
              </span>
            </span>
            <h2
              id="products-heading"
              className="font-serif text-[clamp(1.8rem,4vw,3rem)] font-light leading-[1.1] text-foreground text-balance"
            >
              Meals they&apos;ll
              <em className="font-semibold italic"> beg for.</em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-bark transition-colors duration-200 flex-shrink-0"
          >
            View all products
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => { cardsRef.current[i] = el }}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500 font-tbj-interval"
            >
              {/* Product image */}
              <div className="relative h-56 overflow-hidden bg-linen">
                <Image
                  src={product.image}
                  alt={`${product.name} — raw pet food`}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Tag */}
                <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold tracking-wide uppercase rounded-full ${product.tagColor}`}>
                  {product.tag}
                </span>
                {/* Protein badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-bark/85 backdrop-blur-sm flex flex-col items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none">{product.protein}</span>
                  <span className="text-white/60 text-[8px] leading-none mt-0.5">protein</span>
                </div>
              </div>

              {/* Product info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-medium tracking-[0.15em] uppercase mb-1">
                      {product.subtitle}
                    </p>
                    <h3 className="font-serif text-xl font-medium text-foreground leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-bark text-base">{product.price}</p>
                    <p className="text-muted-foreground text-xs">{product.weight}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex" aria-label={`Rated ${product.rating} out of 5`}>
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${j < Math.floor(product.rating) ? 'fill-copper text-copper' : 'text-border fill-border'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">
                  {product.description}
                </p>

                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-bark text-cream text-sm font-medium rounded-lg hover:bg-bark/90 transition-all duration-200 group/btn"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
