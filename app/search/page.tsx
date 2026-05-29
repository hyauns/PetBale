import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { searchProducts } from '@/lib/catalog'
import { SearchResultsClient } from './search-results-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  return {
    title: query ? `Search: ${query}` : 'Search',
    description: query ? `Search results for "${query}" at PetBale.` : 'Search the PetBale catalog.',
    robots: { index: false, follow: true },
    alternates: { canonical: '/search' },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const products = query ? await searchProducts(query, 50) : []

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-[96%] mx-auto px-6 relative z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>BACK TO HOME</span>
            </Link>
          </div>

          <div className="w-full bg-white border-2 border-black rounded-2xl p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Search results
            </span>
            <h1 className="font-whisker-bites text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-none uppercase mt-1">
              {query ? <>&ldquo;{query}&rdquo;</> : 'Search'}
            </h1>
            <p className="text-black/60 font-extrabold text-xs uppercase mt-2 tracking-wider">
              {query
                ? `${products.length} ${products.length === 1 ? 'product' : 'products'} found`
                : 'Enter a search term from the header'}
            </p>
          </div>

          <SearchResultsClient products={products} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
