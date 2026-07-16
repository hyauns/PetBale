import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getAllProducts, getProductBySlug } from '@/lib/catalog'
import type { DisplayReview } from '@/lib/alireviews/adapters'
import { ProductClient } from './product-client'
import { SITE_URL } from '@/lib/site'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  'dog-food': 'Dog Food',
  'cat-food': 'Cat Food',
  'dog-treats': 'Dog Treats',
  'flea-tick': 'Flea & Tick',
  'cat-litter': 'Cat Litter',
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

  // Reviews hidden site-wide during the Merchant compliance period — the
  // AliReviews are AI-generated (see HIDE_REVIEWS in lib/shopify/adapters.ts).
  // Skip the API fetch and never resurrect the aggregate from it.
  const reviews: DisplayReview[] = []
  const related = all.filter((p) => p.slug !== slug).slice(0, 12)

  const product = productBase

  const categoryLabel = CATEGORY_LABELS[product.category] ?? 'Shop'
  const inStock = product.variants.some((v) => v.availableForSale)

  // Google Merchant / Rich Results expects a future priceValidUntil on offers.
  // Roll it ~1 year out; the page revalidates (60s) so it never goes stale.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

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
    // One Offer per variant, url mirroring the Google feed's ?variant= links,
    // so Merchant Center price checks match the exact variant it crawled.
    offers: (product.variants.length > 0
      ? product.variants
      : [{ id: null, price: product.price, availableForSale: inStock }]
    ).map((v) => ({
      '@type': 'Offer',
      url:
        'id' in v && v.id
          ? `${SITE_URL}/products/${slug}?variant=${v.id.split('/').pop()}`
          : `${SITE_URL}/products/${slug}`,
      priceCurrency: 'USD',
      price: v.price.toFixed(2),
      priceValidUntil,
      availability: v.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'PetBale',
      },
      // No shippingDetails here: free shipping depends on ORDER total ($40+),
      // which per-product OfferShippingDetails can't express. Shipping lives in
      // the Organization-level ShippingService (layout.tsx) + GMC settings.
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    })),
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
