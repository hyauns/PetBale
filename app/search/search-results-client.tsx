'use client'

import { ProductImage } from '@/components/product-image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { CatalogProduct } from '@/lib/catalog'
import { useCart } from '@/hooks/use-cart'
import { RatingStars } from '@/components/rating-stars'
import { CardLinkSpinner } from '@/components/card-link-spinner'

export function SearchResultsClient({ products }: { products: CatalogProduct[] }) {
  const { addToCart } = useCart()

  if (products.length === 0) {
    return (
      <div className="bg-white border border-black rounded-2xl p-12 text-center py-20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-6xl mb-6 select-none inline-block animate-bounce">🔍</span>
        <h3 className="font-whisker-bites text-2xl font-black uppercase mb-3 text-black">
          Nothing matched
        </h3>
        <p className="text-black/60 text-xs font-extrabold uppercase max-w-[320px] mx-auto leading-relaxed mb-8">
          Try a different keyword, brand, or ingredient.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3.5 bg-[#ffea79] border border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer text-xs"
        >
          Browse Superstore 🛍️
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
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
            disabled={!product.defaultVariantId}
            onClick={(e) => {
              e.stopPropagation()
              if (product.defaultVariantId) addToCart(product.defaultVariantId)
            }}
            className="w-full py-3 bg-[#ffea79] text-black font-black text-sm border border-black rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0 text-black" />
            <span>ADD TO CART</span>
          </motion.button>
        </div>
      ))}
    </div>
  )
}
