'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import type { BrandSummary } from '@/lib/brands'

const FEATURED_ACCENTS = [
  '#ffea79',
  '#FF69B4',
  '#6cd1ff',
  '#4AD395',
  '#B19FFB',
  '#ffb224',
]

function brandHref(name: string): string {
  return `/shop?brand=${encodeURIComponent(name)}`
}

export function BrandsClient({
  groups,
  letters,
  totalBrands,
  totalProducts,
  featured,
}: {
  groups: { letter: string; brands: BrandSummary[] }[]
  letters: string[]
  totalBrands: number
  totalProducts: number
  featured: BrandSummary[]
}) {
  const [query, setQuery] = useState('')

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    const flat = groups.flatMap((g) => g.brands)
    return flat.filter((b) => b.name.toLowerCase().includes(q))
  }, [groups, query])

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
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK</span>
          </Link>
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
            <Link href="/" className="hover:text-[#ff990a] transition-colors">HOME</Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500 uppercase" aria-current="page">BRANDS</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="w-full bg-[#B19FFB] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">🏆</div>
          <div className="flex flex-col gap-2.5 text-center md:text-left max-w-3xl">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              BRAND DIRECTORY
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              Shop By Brand
            </h1>
            <p className="text-black/85 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
              Every premium pet brand we carry — sourced directly from authorized US distributors, sealed and within shelf life.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[140px]">
              <div className="text-2xl lg:text-3xl font-black">{totalBrands}</div>
              <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">BRANDS</div>
            </div>
            <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[140px]">
              <div className="text-2xl lg:text-3xl font-black">{totalProducts.toLocaleString()}</div>
              <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">PRODUCTS</div>
            </div>
          </div>
        </div>

        {/* Search + A-Z anchor nav */}
        <div className="bg-white border border-black rounded-2xl p-5 lg:p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-10 flex flex-col gap-4 sticky top-28 z-30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 stroke-[2.5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full bg-[#FAF6F0] border border-black rounded-xl pl-11 lg:pl-12 pr-4 py-3 lg:py-3.5 text-xs lg:text-sm font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all"
            />
          </div>
          {!query && (
            <div className="flex items-center gap-1 lg:gap-2 flex-wrap">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#group-${letter}`}
                  className="inline-flex items-center justify-center min-w-[32px] h-8 lg:min-w-[36px] lg:h-9 px-2 bg-[#FAF6F0] hover:bg-[#ffea79] border border-black rounded-lg text-xs lg:text-sm font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Search results vs. grouped view */}
        {filteredBrands ? (
          <div>
            <h2 className="font-whisker-bites text-xl lg:text-2xl font-black uppercase text-black mb-5 tracking-tight">
              {filteredBrands.length === 0
                ? `No brands match "${query}"`
                : `${filteredBrands.length} ${filteredBrands.length === 1 ? 'match' : 'matches'}`}
            </h2>
            {filteredBrands.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredBrands.map((b) => (
                  <BrandRow key={b.name} brand={b} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured brands */}
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="font-whisker-bites text-xl lg:text-2xl font-black uppercase text-black mb-5 tracking-tight flex items-center gap-2">
                  <span>🔥 Featured Brands</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
                  {featured.map((b, i) => (
                    <Link
                      key={b.name}
                      href={brandHref(b.name)}
                      className="bg-white border-2 border-black rounded-2xl p-5 lg:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center gap-3 group"
                      style={{ backgroundColor: FEATURED_ACCENTS[i % FEATURED_ACCENTS.length] }}
                    >
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white border-2 border-black flex items-center justify-center font-whisker-bites text-2xl lg:text-3xl font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                        {b.name.charAt(0)}
                      </div>
                      <h3 className="font-tbj-interval text-xs lg:text-sm font-black text-black uppercase text-center leading-tight line-clamp-2">
                        {b.name}
                      </h3>
                      <div className="text-[10px] lg:text-[11px] font-extrabold uppercase text-black/60 tracking-wider">
                        {b.count} {b.count === 1 ? 'product' : 'products'}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All brands grouped by letter */}
            <section className="space-y-10">
              {groups.map(({ letter, brands }) => (
                <div key={letter} id={`group-${letter}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-5 pb-3 border-b-2 border-black">
                    <span className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-black text-white rounded-xl font-whisker-bites text-2xl lg:text-3xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {letter}
                    </span>
                    <span className="text-[10px] lg:text-xs font-black uppercase text-zinc-500 tracking-widest">
                      {brands.length} {brands.length === 1 ? 'brand' : 'brands'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {brands.map((b) => (
                      <BrandRow key={b.name} brand={b} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function BrandRow({ brand }: { brand: BrandSummary }) {
  return (
    <Link
      href={brandHref(brand.name)}
      className="bg-white border border-black rounded-xl px-4 py-3 lg:px-5 lg:py-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:bg-[#ffea79] transition-all flex items-center justify-between gap-3 group"
    >
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-tbj-interval text-xs lg:text-sm font-black text-black uppercase truncate">
          {brand.name}
        </span>
        <span className="text-[9px] lg:text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">
          {brand.count} {brand.count === 1 ? 'product' : 'products'}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 stroke-[2.5] text-black flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  )
}
