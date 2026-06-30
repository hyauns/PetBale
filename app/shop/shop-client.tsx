'use client'

import React, { useState, useMemo } from 'react'
import { ProductImage } from '@/components/product-image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import type { CatalogProduct } from '@/lib/catalog'
import { useCart } from '@/hooks/use-cart'
import { RatingStars } from '@/components/rating-stars'
import { CardLinkSpinner } from '@/components/card-link-spinner'
import { ActiveFilterChips, FilterSidebar, type BrandOption } from '@/components/filters/filter-sidebar'
import { MobileFilterDrawer, MobileSortByAccordion, MobileCategoriesAccordion } from '@/components/filters/mobile-filter-drawer'
import { Pagination } from '@/components/pagination'
import type { SelectedFilters } from '@/lib/shopify/filters'

const PET_CATEGORY_MAP: Record<string, string[]> = {
  Dog: ['dog-food', 'dog-treats', 'flea-tick'],
  Cat: ['cat-food', 'cat-litter'],
}

const CATEGORIES = [
  { id: 'dog-food', name: 'Dog Food 🐶' },
  { id: 'cat-food', name: 'Cat Food 🐱' },
  { id: 'dog-treats', name: 'Dog Treats 🦴' },
  { id: 'flea-tick', name: 'Flea & Tick 🛡️' },
  { id: 'cat-litter', name: 'Cat Litter 🧹' },
  { id: 'deals', name: 'Deals & Offers 🎁' },
]

const PAGE_SIZE = 24

export function ShopClient({
  products,
  brands,
  selectedFilters,
  currentPage = 1,
}: {
  products: CatalogProduct[]
  brands?: BrandOption[]
  selectedFilters?: SelectedFilters
  currentPage?: number
}) {
  const { addToCart } = useCart()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [categoryFiltersOpen, setCategoryFiltersOpen] = useState(false)
  const [sortFiltersOpen, setSortFiltersOpen] = useState(false)

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.some(catId => {
          if (catId === 'deals') {
            return product.onSale && product.comparePrice && product.comparePrice > product.price
          }
          return product.category === catId
        })
      )
    }
    if (selectedFilters?.pet) {
      const allowed = PET_CATEGORY_MAP[selectedFilters.pet]
      if (allowed) result = result.filter((p) => allowed.includes(p.category))
      else result = []
    }
    if (selectedFilters?.brand?.length) {
      result = result.filter((p) => selectedFilters.brand.includes(p.brand))
    }
    if (selectedFilters?.priceMin != null) {
      result = result.filter((p) => p.price >= selectedFilters.priceMin!)
    }
    if (selectedFilters?.priceMax != null) {
      result = result.filter((p) => p.price <= selectedFilters.priceMax!)
    }
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, selectedCategories, selectedFilters, sortBy])

  const totalCount = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, safePage])

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00000008 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-[96%] mx-auto px-6 relative z-10">

        <div className="w-full bg-[#6cd1ff] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">🛍️</div>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-attahost text-2xl text-black">PetBale Superstore</span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              Shop All Products
            </h1>
            <p className="text-black/60 font-extrabold text-xs uppercase max-w-md tracking-wider leading-relaxed">
              Premium multi-brand pet essentials — food, treats, litter, and care — delivered across the US.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="bg-white border-2 border-black px-5 py-2.5 rounded-xl text-black font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none">
              📦 Free Shipping over $40
            </div>
            <div className="bg-[#ffea79] border-2 border-black px-5 py-2.5 rounded-xl text-black font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none animate-[pulse_2s_infinite]">
              🎁 10% Off code: SUMMER
            </div>
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
                        checked={selectedCategories.includes(cat.id)}
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

            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="w-full py-3 bg-[#FAF6F0] hover:bg-black hover:text-white border border-black rounded-xl text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Clear Filters 🧹
              </button>
            )}

            {selectedFilters && (
              <div className="pt-6 border-t border-black/10">
                <FilterSidebar facets={[]} selected={selectedFilters} brands={brands} />
              </div>
            )}
          </aside>

          <div className="lg:hidden w-full select-none">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full py-3.5 px-5 bg-white border border-black rounded-xl text-black text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Open Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
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
              isChecked={(id) => selectedCategories.includes(id)}
              onSelect={handleCategoryToggle}
            />
            {selectedCategories.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCategories([])
                  setMobileFiltersOpen(false)
                }}
                className="w-full mt-auto py-3.5 bg-[#FAF6F0] hover:bg-black hover:text-white border border-black rounded-xl text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Clear Filters 🧹
              </button>
            )}
            {selectedFilters && (
              <div className="pt-4 border-t border-black/10">
                <FilterSidebar facets={[]} selected={selectedFilters} brands={brands} />
              </div>
            )}
          </MobileFilterDrawer>

          <div className="lg:col-span-9">
            {selectedFilters && <ActiveFilterChips selected={selectedFilters} />}
            {totalCount > 0 && (
              <p className="text-[11px] lg:text-xs font-black uppercase tracking-wider text-zinc-500 mb-4">
                Showing {(safePage - 1) * PAGE_SIZE + 1}
                –{Math.min(safePage * PAGE_SIZE, totalCount)} of {totalCount} products
              </p>
            )}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-black rounded-2xl p-12 text-center py-20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-6xl mb-6 select-none inline-block animate-bounce">🦖</span>
                <h3 className="font-whisker-bites text-2xl font-black uppercase mb-3 text-black">
                  No Products Found!
                </h3>
                <p className="text-black/60 text-xs font-extrabold uppercase max-w-[320px] mx-auto leading-relaxed mb-8">
                  We couldn't find any premium pet care products matching your filter selections.
                </p>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-6 py-3.5 bg-[#ffea79] border border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer text-xs"
                >
                  Reset Filters 🛍️
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleProducts.map((product, i) => (
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
              <Pagination currentPage={safePage} totalPages={totalPages} />
            )}
          </div>

        </div>

      </div>

    </main>
  )
}
