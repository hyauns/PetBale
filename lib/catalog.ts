import {
  adaptShopifyProduct,
  adaptShopifyProducts,
  type DescriptionBlock,
  type FeedingInstructions,
} from './shopify/adapters'
import { getShopifyHandlesForCategory } from './shopify/category-map'
import {
  getAllShopifyProducts,
  getFilteredCollection,
  getShopifyCollectionByHandle,
  getShopifyProductByHandle,
  searchShopifyProducts,
  type ShopifyFacet,
  type ShopifySortKey,
} from './shopify/queries'
import type { SelectedFilters } from './shopify/filters'
import { toShopifyProductFilters } from './shopify/filters'

export interface CatalogProduct {
  shopifyProductId: number | null
  slug: string
  name: string
  price: number
  comparePrice?: number
  onSale: boolean
  brand: string
  reviewsList: { author: string; rating: number; date: string; comment: string }[]
  imageSrc: string
  accent: string
  colorHex: string
  category:
    | 'dog-food'
    | 'cat-food'
    | 'dog-treats'
    | 'flea-tick'
    | 'cat-litter'
    | 'deals'
    | 'dog-supplies'
    | 'cat-supplies'
    | 'fish-supplies'
    | 'bird-supplies'
    | 'reptile-supplies'
  shortDescription: string
  longDescription: string
  descriptionBlocks: DescriptionBlock[]
  protein: string
  fat: string
  fiber: string
  moisture: string
  images: { src: string; alt: string }[]
  ingredients: string[]
  feedingGuide: { weight: string; amount: string }[]
  feedingInstructions?: FeedingInstructions
  benefits: { title: string; description: string }[]
  badges: string[]
  defaultVariantId: string | null
  variants: CatalogVariant[]
  rating: number
  reviewCount: number
}

export interface CatalogVariant {
  id: string
  weight: string
  price: number
  comparePrice?: number
  availableForSale: boolean
}

export async function getAllProducts(): Promise<CatalogProduct[]> {
  const products = await getAllShopifyProducts()
  return adaptShopifyProducts(products)
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await getShopifyProductByHandle(slug)
  return product ? adaptShopifyProduct(product) : null
}

export async function getProductsByCategory(category: string): Promise<CatalogProduct[]> {
  if (category === 'deals') {
    const all = await getAllProducts()
    return all.filter((p) => p.onSale && p.comparePrice && p.comparePrice > p.price)
  }
  const handles = getShopifyHandlesForCategory(category)
  const collections = await Promise.all(handles.map(getShopifyCollectionByHandle))
  const seen = new Set<string>()
  const products = []
  for (const c of collections) {
    if (!c) continue
    for (const edge of c.products.edges) {
      if (seen.has(edge.node.handle)) continue
      seen.add(edge.node.handle)
      products.push(edge.node)
    }
  }
  return adaptShopifyProducts(products)
}

export async function searchProducts(query: string, limit = 20): Promise<CatalogProduct[]> {
  const products = await searchShopifyProducts(query, limit)
  return adaptShopifyProducts(products)
}

export interface FilteredCategoryResult {
  products: CatalogProduct[]
  facets: ShopifyFacet[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}

export async function getFilteredCategoryProducts(
  category: string,
  selected: SelectedFilters,
  opts: { sortKey?: ShopifySortKey; reverse?: boolean; first?: number; after?: string | null } = {}
): Promise<FilteredCategoryResult> {
  // The "deals" pseudo-category is handled in code (no Shopify collection for it).
  if (category === 'deals') {
    const all = await getAllProducts()
    const sale = all.filter((p) => p.onSale && p.comparePrice && p.comparePrice > p.price)
    return { products: sale, facets: [], pageInfo: { hasNextPage: false, endCursor: null } }
  }
  const handles = getShopifyHandlesForCategory(category)
  const productFilters = toShopifyProductFilters(selected)
  // Fetch first matching collection only (most narrow). Map fallback for legacy slugs.
  for (const handle of handles) {
    const res = await getFilteredCollection(handle, {
      filters: productFilters,
      sortKey: opts.sortKey,
      reverse: opts.reverse,
      first: opts.first ?? 24,
      after: opts.after,
    })
    if (res.collection) {
      return {
        products: adaptShopifyProducts(res.products),
        facets: res.facets,
        pageInfo: res.pageInfo,
      }
    }
  }
  return { products: [], facets: [], pageInfo: { hasNextPage: false, endCursor: null } }
}

