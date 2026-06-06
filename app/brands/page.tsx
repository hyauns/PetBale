import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getBrandIndex, pickFeatured } from '@/lib/brands'
import { SITE_URL } from '@/lib/site'
import { BrandsClient } from './brands-client'

export const revalidate = 300 // 5 minutes — brand list is slow-changing.

export const metadata: Metadata = {
  title: 'Shop All Pet Brands',
  description:
    'Browse every pet brand at PetBale — Blue Buffalo, Purina, Royal Canin, Hill\'s Science Diet, Wellness, and more. Shipped brand-new, sealed, from our Florida facility.',
  alternates: { canonical: '/brands' },
  openGraph: {
    type: 'website',
    title: 'Shop All Pet Brands | PetBale',
    description: 'Browse every pet brand at PetBale — a US-based multi-brand pet store.',
    url: '/brands',
  },
}

export default async function BrandsPage() {
  const index = await getBrandIndex()
  const featured = pickFeatured(index.brands, 6)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pet Brands at PetBale',
    numberOfItems: index.totalBrands,
    itemListElement: index.brands.slice(0, 50).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `${SITE_URL}/shop?brand=${encodeURIComponent(b.name)}`,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/brands` },
    ],
  }

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />
      <BrandsClient
        groups={index.groups}
        letters={index.letters}
        totalBrands={index.totalBrands}
        totalProducts={index.totalProducts}
        featured={featured}
      />
      <SiteFooter />
    </>
  )
}
