import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getFilteredCategoryProducts } from '@/lib/catalog'
import { parseFiltersFromSearch } from '@/lib/shopify/filters'
import { CollectionClient } from './collection-client'
import { SITE_URL } from '@/lib/site'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, { title: string; description: string }> = {
  'dog-food': {
    title: 'Dog Food',
    description: 'Premium dry & wet dog food from trusted brands. Free shipping over $49 — fast US delivery.',
  },
  'cat-food': {
    title: 'Cat Food',
    description: 'Wet, dry, and prescription cat food. Premium brands, vet-approved formulas.',
  },
  'dog-treats': {
    title: 'Dog Treats',
    description: 'Healthy dog treats, training rewards, and chews from the brands dogs love.',
  },
  'flea-tick': {
    title: 'Flea & Tick',
    description: 'Flea and tick prevention, treatment, and shampoos for dogs and cats.',
  },
  'cat-litter': {
    title: 'Cat Litter',
    description: 'Clumping, non-clumping, and natural cat litter from leading brands.',
  },
  deals: {
    title: 'Deals & Sale',
    description: 'Save big on premium pet food, treats, and supplies. Limited-time offers.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_LABELS[slug] ?? {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Shop ${slug.replace(/-/g, ' ')} at PetBale — premium brands, fast US delivery.`,
  }
  const url = `/collections/${slug}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.description,
      url,
    },
  }
}

function brandsFromProducts(products: { brand: string }[]): { label: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const p of products) {
    if (!p.brand) continue
    counts[p.brand] = (counts[p.brand] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

const PAGE_SIZE = 24
const MAX_PRODUCTS = 240 // Cap the collection fetch at 10 pages worth of products.

function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = v ? parseInt(v, 10) : 1
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const selected = parseFiltersFromSearch(sp)
  const currentPage = parsePage(sp.page)

  const { products: allProducts, facets } = await getFilteredCategoryProducts(slug, selected, {
    first: MAX_PRODUCTS,
  })
  const brands = brandsFromProducts(allProducts)
  const totalCount = allProducts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const products = allProducts.slice(start, start + PAGE_SIZE)
  const categoryLabel = CATEGORY_LABELS[slug]?.title ?? slug.replace(/-/g, ' ')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${SITE_URL}/collections/${slug}` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />
      <CollectionClient
        slug={slug}
        products={products}
        facets={facets}
        brands={brands}
        selectedFilters={selected}
        currentPage={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
      <SiteFooter />
    </>
  )
}
