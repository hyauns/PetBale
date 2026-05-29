import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getAllShopifyProducts } from '@/lib/shopify/queries'
import { CATEGORY_TO_SHOPIFY_HANDLES } from '@/lib/shopify/category-map'

export const revalidate = 3600

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/brands', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/search', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/track', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/shipping-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/payment-policy', priority: 0.3, changeFrequency: 'yearly' },
]

const CATEGORY_SLUGS = [...Object.keys(CATEGORY_TO_SHOPIFY_HANDLES), 'deals']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const collectionEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/collections/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await getAllShopifyProducts()
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (err) {
    console.warn('[sitemap] failed to load products', err)
  }

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
