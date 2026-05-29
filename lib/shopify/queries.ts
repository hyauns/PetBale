import { shopifyFetch } from './client'
import { PRODUCT_FRAGMENT } from './fragments'
import type { ShopifyCollection, ShopifyProduct } from './types'
import type { ShopifyProductFilter } from './filters'

export interface ShopifyFacetValue {
  id: string
  label: string
  count: number
  input: string
}

export interface ShopifyFacet {
  id: string
  label: string
  type: string
  values: ShopifyFacetValue[]
}

export type ShopifySortKey =
  | 'MANUAL'
  | 'BEST_SELLING'
  | 'PRICE'
  | 'CREATED'
  | 'TITLE'

export interface FilteredCollectionResult {
  collection: { id: string; handle: string; title: string } | null
  products: ShopifyProduct[]
  facets: ShopifyFacet[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}

const REVALIDATE = 60

export async function getAllShopifyProducts(): Promise<ShopifyProduct[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query GetAllProducts($cursor: String) {
      products(first: 50, after: $cursor) {
        edges {
          cursor
          node {
            ...ProductFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `

  type Page = {
    products: {
      edges: { node: ShopifyProduct }[]
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
    }
  }

  const all: ShopifyProduct[] = []
  let cursor: string | null = null
  do {
    const data: Page = await shopifyFetch<Page>({
      query,
      variables: { cursor },
      next: { revalidate: REVALIDATE },
    })
    all.push(...data.products.edges.map((e) => e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)
  return all
}

export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
    next: { revalidate: REVALIDATE },
  })
  return data.product
}

export async function searchShopifyProducts(
  query: string,
  limit = 20
): Promise<ShopifyProduct[]> {
  if (!query.trim()) return []
  const gql = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query SearchProducts($q: String!, $first: Int!) {
      products(first: $first, query: $q, sortKey: RELEVANCE) {
        edges { node { ...ProductFields } }
      }
    }
  `
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: gql,
    variables: { q: query.trim(), first: Math.min(Math.max(limit, 1), 50) },
    cache: 'no-store',
  })
  return data.products.edges.map((e) => e.node)
}

export async function getShopifyCollectionByHandle(
  handle: string
): Promise<ShopifyCollection | null> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
        }
        products(first: 50) {
          edges {
            node {
              ...ProductFields
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query,
    variables: { handle },
    next: { revalidate: REVALIDATE },
  })
  return data.collection
}

export async function getFilteredCollection(
  handle: string,
  opts: {
    filters?: ShopifyProductFilter[]
    sortKey?: ShopifySortKey
    reverse?: boolean
    first?: number
    after?: string | null
  } = {}
): Promise<FilteredCollectionResult> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query FilteredCollection(
      $handle: String!,
      $filters: [ProductFilter!],
      $sortKey: ProductCollectionSortKeys,
      $reverse: Boolean,
      $first: Int!,
      $after: String
    ) {
      collection(handle: $handle) {
        id
        handle
        title
        products(
          first: $first,
          after: $after,
          filters: $filters,
          sortKey: $sortKey,
          reverse: $reverse
        ) {
          filters {
            id label type
            values { id label count input }
          }
          edges { node { ...ProductFields } }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `
  type Resp = {
    collection: {
      id: string
      handle: string
      title: string
      products: {
        filters: ShopifyFacet[]
        edges: { node: ShopifyProduct }[]
        pageInfo: { hasNextPage: boolean; endCursor: string | null }
      }
    } | null
  }
  const data = await shopifyFetch<Resp>({
    query,
    variables: {
      handle,
      filters: opts.filters ?? [],
      sortKey: opts.sortKey ?? 'MANUAL',
      reverse: opts.reverse ?? false,
      first: opts.first ?? 24,
      after: opts.after ?? null,
    },
    next: { revalidate: REVALIDATE },
  })
  if (!data.collection) {
    return { collection: null, products: [], facets: [], pageInfo: { hasNextPage: false, endCursor: null } }
  }
  return {
    collection: {
      id: data.collection.id,
      handle: data.collection.handle,
      title: data.collection.title,
    },
    products: data.collection.products.edges.map((e) => e.node),
    facets: data.collection.products.filters,
    pageInfo: data.collection.products.pageInfo,
  }
}
