import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getAllProducts, getProductBySlug } from '@/lib/catalog'
import { getAliReviews } from '@/lib/alireviews/client'
import { adaptAliReviews } from '@/lib/alireviews/adapters'
import { ProductClient } from './product-client'
import { SITE_URL } from '@/lib/site'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  'dog-food': 'Dog Food',
  'cat-food': 'Cat Food',
  'dog-treats': 'Dog Treats',
  'flea-tick': 'Flea & Tick',
  'cat-litter': 'Cat Litter',
  deals: 'Deals',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }

  const title = product.name
  const description = (product.shortDescription || product.longDescription || `${product.name} by ${product.brand}`).slice(0, 200)
  const url = `/products/${slug}`
  const image = product.images[0]?.src || product.imageSrc

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [productBase, all] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
  ])
  if (!productBase) notFound()

  const aliRaw = productBase.shopifyProductId
    ? await getAliReviews(productBase.shopifyProductId, { limit: 30 })
    : []
  const reviews = adaptAliReviews(aliRaw)
  const related = all.filter((p) => p.slug !== slug).slice(0, 12)

  // Ali doesn't always write the alireviews.rating_info metafield (esp. for
  // CSV-imported reviews), leaving rating/reviewCount at 0 — which hides the
  // whole review section even though reviews exist via the public API. When
  // that happens, derive the aggregate from the fetched reviews instead.
  const product =
    productBase.reviewCount === 0 && aliRaw.length > 0
      ? {
          ...productBase,
          reviewCount: aliRaw.length,
          rating: aliRaw.reduce((sum, r) => sum + (r.star || 0), 0) / aliRaw.length,
        }
      : productBase

  const categoryLabel = CATEGORY_LABELS[product.category] ?? 'Shop'
  const inStock = product.variants.some((v) => v.availableForSale)

  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.shortDescription || product.longDescription || '').slice(0, 5000),
    image: product.images.length > 0 ? product.images.map((i) => i.src) : [product.imageSrc],
    sku: product.shopifyProductId ? String(product.shopifyProductId) : product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'PetBale',
      },
    },
  }

  if (product.rating > 0 && product.reviewCount > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}/collections/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${slug}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />
      <ProductClient product={product} related={related} reviews={reviews} />
      <SiteFooter />
    </>
  )
}
