import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getAllProducts, getProductBySlug } from '@/lib/catalog'
import { getAliReviews } from '@/lib/alireviews/client'
import { adaptAliReviews } from '@/lib/alireviews/adapters'
import { ProductClient } from './product-client'

export const revalidate = 60

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
  const [product, all] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
  ])
  if (!product) notFound()

  const aliRaw = product.shopifyProductId
    ? await getAliReviews(product.shopifyProductId, { limit: 30 })
    : []
  const reviews = adaptAliReviews(aliRaw)
  const related = all.filter((p) => p.slug !== slug).slice(0, 12)

  return (
    <>
      <SiteHeader />
      <ProductClient product={product} related={related} reviews={reviews} />
      <SiteFooter />
    </>
  )
}
