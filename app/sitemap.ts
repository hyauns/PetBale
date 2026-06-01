import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getProductHandlesForSitemap } from '@/lib/shopify/queries'
import { CATEGORY_TO_SHOPIFY_HANDLES } from '@/lib/shopify/category-map'

export const revalidate = 3600

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/brands', priority: 0.7, changeFrequency: 'weekly' },
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
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
]

/**
 * Every collection slug we render at /collections/[slug]:
 *  - 6 UI category slugs (dog-food, cat-food, …)
 *  - 31 pet-specific Smart Collections (dog-dry-food, cat-dry-food, …)
 *  - 6 broad PetSmart category handles used in the mega menu
 */
const COLLECTION_SLUGS: string[] = [
  // UI category slugs
  ...Object.keys(CATEGORY_TO_SHOPIFY_HANDLES),
  'deals',
  // Dog smart collections
  'dog-dry-food',
  'dog-vet-diets',
  'dog-fresh-frozen',
  'dog-food-toppers',
  'dog-treats-all',
  'dog-treats-bones-chews',
  'dog-treats-training',
  'dog-treats-soft-chewy',
  'dog-treats-dental',
  'dog-treats-jerky',
  'dog-beds-furniture',
  'dog-crates-gates',
  'dog-collars-leashes',
  'dog-toys',
  'dog-health-wellness',
  'dog-training-behavior',
  // Cat smart collections
  'cat-dry-food',
  'cat-wet-food',
  'cat-kitten-food',
  'cat-vet-diets',
  'cat-food-toppers',
  'cat-treats-all',
  'cat-litter-only',
  'cat-litter-boxes',
  'cat-waste-disposal',
  'cat-furniture-towers',
  'cat-scratchers',
  'cat-toys',
  'cat-health-wellness',
  // Mega menu broad handles
  'dog-supplies',
  'cat-supplies',
  'fish-supplies',
  'bird-supplies',
  'reptile-supplies',
  'health-and-wellness',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const collectionEntries: MetadataRoute.Sitemap = COLLECTION_SLUGS.map((slug) => ({
    url: `${SITE_URL}/collections/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  let productEntries: MetadataRoute.Sitemap = []
  try {
    const products = await getProductHandlesForSitemap()
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      // Real per-product timestamp from Shopify, so Google sees genuine change
      // dates instead of every URL sharing the build time.
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (err) {
    console.warn('[sitemap] failed to load products', err)
  }

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
