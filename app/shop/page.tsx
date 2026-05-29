import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getAllProducts } from '@/lib/catalog'
import { parseFiltersFromSearch } from '@/lib/shopify/filters'
import { ShopClient } from './shop-client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shop All Pet Supplies',
  description: 'Browse the full PetBale catalog — dog food, cat food, treats, flea & tick, litter, and more. Filter by brand, pet, and price.',
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    title: 'Shop All Pet Supplies | PetBale',
    description: 'Browse the full PetBale catalog — dog food, cat food, treats, flea & tick, litter, and more.',
    url: '/shop',
  },
}

function brandsFromProducts(products: { brand: string }[]) {
  const counts: Record<string, number> = {}
  for (const p of products) {
    if (!p.brand) continue
    counts[p.brand] = (counts[p.brand] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const selected = parseFiltersFromSearch(sp)
  const products = await getAllProducts()
  const brands = brandsFromProducts(products)
  return (
    <>
      <SiteHeader />
      <ShopClient products={products} brands={brands} selectedFilters={selected} />
      <SiteFooter />
    </>
  )
}
