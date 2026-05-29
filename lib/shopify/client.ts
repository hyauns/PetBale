const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2024-10'

if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
  console.warn(
    '[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN — Storefront calls will fail.'
  )
}

const ENDPOINT = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

export interface ShopifyFetchOptions {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  next?: { revalidate?: number; tags?: string[] }
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  next,
}: ShopifyFetchOptions): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN ?? '',
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next,
  })

  if (!res.ok) {
    throw new Error(`Shopify ${res.status}: ${await res.text()}`)
  }

  const body = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (body.errors?.length) {
    throw new Error(`Shopify GraphQL: ${body.errors.map((e) => e.message).join('; ')}`)
  }
  if (!body.data) {
    throw new Error('Shopify GraphQL: empty response')
  }
  return body.data
}
