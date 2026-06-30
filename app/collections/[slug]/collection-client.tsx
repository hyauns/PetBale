'use client'

import React, { useState, useMemo } from 'react'
import { ProductImage } from '@/components/product-image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import type { CatalogProduct } from '@/lib/catalog'
import { useCart } from '@/hooks/use-cart'
import { cn } from '@/lib/utils'
import { RatingStars } from '@/components/rating-stars'
import { CardLinkSpinner } from '@/components/card-link-spinner'
import { ActiveFilterChips, FilterSidebar, type BrandOption } from '@/components/filters/filter-sidebar'
import { MobileFilterDrawer, MobileSortByAccordion, MobileCategoriesAccordion } from '@/components/filters/mobile-filter-drawer'
import { Pagination } from '@/components/pagination'
import type { SelectedFilters } from '@/lib/shopify/filters'
import type { ShopifyFacet } from '@/lib/shopify/queries'

interface CollectionDetails {
  title: string
  emoji: string
  description: string
  accentClass: string
  colorHex: string
  badgeText: string
}

const COLLECTIONS_MAP: Record<string, CollectionDetails> = {
  'dog-food': {
    title: 'Dog Food Collection',
    emoji: '🐶',
    description: 'Dry, wet, and raw dog food from trusted brands like Blue Buffalo, Purina, and Royal Canin — shipped fast across the US.',
    accentClass: 'bg-[#ffea79]',
    colorHex: '#ffea79',
    badgeText: 'CANINE PREMIUM'
  },
  'cat-food': {
    title: 'Cat Food Blends',
    emoji: '🐱',
    description: 'Wet, dry, and veterinary-diet cat food from leading brands, with recipes for every life stage.',
    accentClass: 'bg-[#FF69B4]',
    colorHex: '#FF69B4',
    badgeText: 'FELINE FAVORITES'
  },
  'dog-treats': {
    title: 'Dehydrated Treats',
    emoji: '🦴',
    description: 'Dehydrated chews, dental treats, and single-ingredient rewards from quality pet brands.',
    accentClass: 'bg-[#4AD395]',
    colorHex: '#4AD395',
    badgeText: 'HIGH-VALUE TREATS'
  },
  'flea-tick': {
    title: 'Flea & Tick Shield',
    emoji: '🛡️',
    description: 'Flea and tick prevention, treatment, and shampoos for dogs and cats from trusted brands.',
    accentClass: 'bg-[#6cd1ff]',
    colorHex: '#6cd1ff',
    badgeText: 'FLEA & TICK'
  },
  'cat-litter': {
    title: 'Cat Litter & Carbon',
    emoji: '🧹',
    description: 'Clumping, crystal, and natural cat litter that locks in odor and keeps boxes fresh.',
    accentClass: 'bg-[#B19FFB]',
    colorHex: '#B19FFB',
    badgeText: 'ODOR CONTROL'
  },
  'deals': {
    title: 'Special Deals & Offers',
    emoji: '🎁',
    description: 'Limited-time markdowns on pet food, treats, and supplies across our catalog.',
    accentClass: 'bg-[#ffb224]',
    colorHex: '#ffb224',
    badgeText: 'USA SUMMER DEALS'
  }
}

const CATEGORIES = [
  { id: 'dog-food', name: 'Dog Food 🐶' },
  { id: 'cat-food', name: 'Cat Food 🐱' },
  { id: 'dog-treats', name: 'Dog Treats 🦴' },
  { id: 'flea-tick', name: 'Flea & Tick 🛡️' },
  { id: 'cat-litter', name: 'Cat Litter 🧹' },
  { id: 'deals', name: 'Deals & Offers 🎁' },
]

export function CollectionClient({
  slug,
  products,
  facets,
  brands,
  selectedFilters,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  pageSize = 24,
}: {
  slug: string
  products: CatalogProduct[]
  facets?: ShopifyFacet[]
  brands?: BrandOption[]
  selectedFilters?: SelectedFilters
  currentPage?: number
  totalPages?: number
  totalCount?: number
  pageSize?: number
}) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [sortBy, setSortBy] = useState<string>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [categoryFiltersOpen, setCategoryFiltersOpen] = useState(false)
  const [sortFiltersOpen, setSortFiltersOpen] = useState(false)

  const handleCategoryToggle = (id: string) => {
    router.push(`/collections/${id}`)
    setMobileFiltersOpen(false)
  }

  const details = useMemo(() => {
    return (
      COLLECTIONS_MAP[slug] || {
        title: slug.replace(/-/g, ' ').toUpperCase(),
        emoji: '🐾',
        description: 'Explore our multi-brand selection of pet food, treats, litter, and care essentials.',
        accentClass: 'bg-[#ffea79]',
        colorHex: '#ffea79',
        badgeText: 'PETBALE STORE',
      }
    )
  }, [slug])

  const sortedProducts = useMemo(() => {
    const result = [...products]
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, sortBy])

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-[96%] mx-auto px-6 relative z-10">

        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <Link
            href="/#shop-categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK</span>
          </Link>
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
            <Link href="/" className="hover:text-[#ff990a] transition-colors">HOME</Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500 uppercase" aria-current="page">{details.title.toUpperCase()}</span>
          </nav>
        </div>

        <div className={cn(
          'w-full border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6',
          details.accentClass
        )}>
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">{details.emoji}</div>

          <div className="flex flex-col gap-2.5 text-center md:text-left">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              {details.badgeText}
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              {details.title}
            </h1>
            <p className="text-black/75 font-extrabold text-xs uppercase max-w-xl tracking-wider leading-relaxed">
              {details.description}
            </p>
          </div>

          <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[120px] select-none flex-shrink-0">
            <div className="text-2xl font-black">{products.length}</div>
            <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">PRODUCTS</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-6 bg-white border border-black rounded-2xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">

            <div className="flex flex-col gap-3">
              <h3 className="font-whisker-bites text-lg font-black uppercase text-black tracking-wide pb-2 border-b border-black/10 flex items-center justify-between">
                <span>Sort By</span>
                <ArrowUpDown className="w-4 h-4 text-black" />
              </h3>

              <div className="pt-2 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-black rounded-xl px-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer focus:outline-none select-none"
                >
                  <option value="featured">Featured 🔥</option>
                  <option value="price-low">Price: Low to High 📈</option>
                  <option value="price-high">Price: High to Low 📉</option>
                  <option value="name">Alphabetical A-Z 🔤</option>
                </select>
                <div className="absolute right-3.5 top-[22px] pointer-events-none text-black">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-whisker-bites text-lg font-black uppercase text-black tracking-wide pb-2 border-b border-black/10 flex items-center justify-between">
                <span>Collections</span>
                <SlidersHorizontal className="w-4 h-4 text-black" />
              </h3>

              <div className="flex flex-col gap-3.5 pt-2">
                {CATEGORIES.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={slug === cat.id}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border border-black rounded bg-white peer-checked:bg-[#ffea79] transition-all flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105" />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-xs font-black uppercase text-zinc-700 peer-checked:text-black group-hover:text-black transition-colors leading-none">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedFilters && facets && (
              <div className="pt-6 border-t border-black/10">
                <FilterSidebar facets={facets} selected={selectedFilters} brands={brands} />
              </div>
            )}
          </aside>

          <div className="lg:hidden w-full select-none">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full py-3.5 px-5 bg-white border border-black rounded-xl text-black text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Open Filters</span>
            </button>
          </div>

          <MobileFilterDrawer isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
            <MobileSortByAccordion
              open={sortFiltersOpen}
              onToggle={() => setSortFiltersOpen(!sortFiltersOpen)}
              value={sortBy}
              onChange={setSortBy}
            />
            <MobileCategoriesAccordion
              open={categoryFiltersOpen}
              onToggle={() => setCategoryFiltersOpen(!categoryFiltersOpen)}
              categories={CATEGORIES}
              isChecked={(id) => slug === id}
              onSelect={handleCategoryToggle}
            />
            {selectedFilters && facets && (
              <div className="pt-4 border-t border-black/10">
                <FilterSidebar facets={facets} selected={selectedFilters} brands={brands} />
              </div>
            )}
          </MobileFilterDrawer>

          <div className="lg:col-span-9">
            {selectedFilters && <ActiveFilterChips selected={selectedFilters} />}
            {sortedProducts.length > 0 && totalCount !== undefined && (
              <p className="text-[11px] lg:text-xs font-black uppercase tracking-wider text-zinc-500 mb-4">
                Showing {(currentPage - 1) * pageSize + 1}
                –{Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
              </p>
            )}
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-black rounded-2xl p-12 text-center py-20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-6xl mb-6 select-none inline-block animate-bounce">📦</span>
                <h3 className="font-whisker-bites text-2xl font-black uppercase mb-3 text-black">
                  Collection is Empty!
                </h3>
                <p className="text-black/60 text-xs font-extrabold uppercase max-w-[320px] mx-auto leading-relaxed mb-8">
                  Looks like we don't have active stock in this collection yet. Check back soon for premium brand shipments!
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3.5 bg-[#ffea79] border border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer text-xs"
                >
                  Browse Superstore 🛍️
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product, i) => (
                  <div
                    key={product.slug}
                    className="relative bg-white border border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1.5px] transition-all duration-150 flex flex-col justify-between h-[490px]"
                  >

                    {product.onSale && product.comparePrice && product.comparePrice > product.price ? (
                      <div className="absolute -top-3 -right-2 bg-[#FF69B4] text-white border border-black px-2.5 py-1 rounded font-black text-[9px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none rotate-[-3deg] z-20">
                        Sale 🏷️
                      </div>
                    ) : null}

                    <Link href={`/products/${product.slug}`} className="relative flex-1 flex flex-col justify-start cursor-pointer">
                      <CardLinkSpinner />
                      <div className="w-full h-60 bg-white rounded-lg overflow-hidden flex items-center justify-center p-3 select-none">
                        <ProductImage
                          src={product.imageSrc}
                          alt={product.name}
                          width={400}
                          height={400}
                          priority={i < 4}
                          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="max-w-full max-h-full object-contain pointer-events-none"
                        />
                      </div>

                      <div className="mt-3">
                        <h3 className="font-tbj-interval font-black text-base text-black uppercase leading-tight line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                          BRAND: {product.brand}
                        </div>

                        <div className="flex items-center gap-0.5 mt-2">
                          <RatingStars rating={product.rating} size="sm" />
                          {product.rating > 0 && (
                            <span className="text-[9px] font-black text-black ml-1 uppercase">
                              {product.rating.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 mt-3 select-none">
                          <span className="text-2xl font-black text-black">${product.price.toFixed(2)}</span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-base font-bold text-zinc-400 line-through">${product.comparePrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!product.defaultVariantId || !product.availableForSale}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (product.defaultVariantId && product.availableForSale) addToCart(product.defaultVariantId, 1, e.clientX, e.clientY)
                      }}
                      className="w-full py-3 bg-[#ffea79] text-black font-black text-sm border border-black rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4 flex-shrink-0 text-black" />
                      <span>{product.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                    </motion.button>

                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </div>

        </div>

      </div>

    </main>
  )
}
