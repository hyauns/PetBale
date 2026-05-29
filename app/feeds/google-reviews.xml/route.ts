import { NextResponse } from 'next/server'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { getAllShopifyProducts } from '@/lib/shopify/queries'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { getAliReviews, extractShopifyId, type AliReview } from '@/lib/alireviews/client'

/**
 * Google Merchant Center product reviews feed (Product Ratings program).
 *
 * Schema: https://support.google.com/merchants/answer/7045996
 * Validator: http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd
 *
 * One <review> per individual customer review. Products are linked back to
 * Merchant Center items via brand+MPN (SKU) since the Storefront API does not
 * expose GTIN/barcode.
 *
 * Generation strategy:
 *  - Only includes products with rating_info metafield indicating >0 reviews
 *  - Batches AliReviews API calls (10 in flight) to keep total time bounded
 *  - Caps to ~25 most-recent reviews per product to stay under feed-size limits
 *  - Returns valid, empty <reviews/> when ALI_REVIEWS_API_KEY is unset
 *    (i.e. before merchant imports reviews) — Google accepts an empty feed
 *
 * Cached 6h. Google fetches once per day.
 */
export const revalidate = 21600
export const dynamic = 'force-static'

const MAX_REVIEWS_PER_PRODUCT = 25
const BATCH_SIZE = 10

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
}

function htmlToPlainText(html: string): string {
  if (!html) return ''
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim()
}

function toISO(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

function pickMetafield(
  metafields: ShopifyProduct['metafields'],
  namespace: string,
  key: string
): string | null {
  return metafields.find((m) => m?.namespace === namespace && m?.key === key)?.value ?? null
}

function hasAnyReviews(product: ShopifyProduct): boolean {
  const raw = pickMetafield(product.metafields, 'alireviews', 'rating_info')
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { reviewCount?: number }
    return typeof parsed.reviewCount === 'number' && parsed.reviewCount > 0
  } catch {
    return false
  }
}

interface ReviewBundle {
  product: ShopifyProduct
  reviews: AliReview[]
}

async function batchFetchReviews(products: ShopifyProduct[]): Promise<ReviewBundle[]> {
  const out: ReviewBundle[] = []
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const slice = products.slice(i, i + BATCH_SIZE)
    const settled = await Promise.all(
      slice.map(async (p) => {
        const numeric = extractShopifyId(p.id)
        if (!numeric) return { product: p, reviews: [] as AliReview[] }
        const reviews = await getAliReviews(numeric, {
          sort: 'by_date',
          direction: 'desc',
          limit: MAX_REVIEWS_PER_PRODUCT,
        })
        return { product: p, reviews }
      })
    )
    out.push(...settled.filter((b) => b.reviews.length > 0))
  }
  return out
}

function renderReview(product: ShopifyProduct, review: AliReview): string {
  const productUrl = `${SITE_URL}/products/${product.handle}`
  const brand = product.vendor || SITE_NAME

  // Identifiers — use first variant's SKU as MPN. The reviews feed accepts
  // brand+MPN OR GTIN; brand+MPN is sufficient.
  const firstSku = product.variants.edges[0]?.node.sku || ''

  const reviewTimestamp = toISO(review.created_at)
  const author = review.author?.trim() || 'Anonymous'
  const content = htmlToPlainText(review.content).slice(0, 4000)
  const rating = Math.max(1, Math.min(5, Math.round(review.star)))

  return `    <review>
      <review_id>${xmlEscape(String(review.id))}</review_id>
      <reviewer>
        <name>${xmlEscape(author)}</name>
      </reviewer>
      <review_timestamp>${xmlEscape(reviewTimestamp)}</review_timestamp>
      <content>${xmlEscape(content || 'No comment provided.')}</content>
      <review_url type="singleton">${xmlEscape(productUrl)}</review_url>
      <ratings>
        <overall min="1" max="5">${rating}</overall>
      </ratings>
      <products>
        <product>
          <product_ids>
            <brands>
              <brand>${xmlEscape(brand)}</brand>
            </brands>${
              firstSku
                ? `
            <mpns>
              <mpn>${xmlEscape(firstSku)}</mpn>
            </mpns>
            <skus>
              <sku>${xmlEscape(firstSku)}</sku>
            </skus>`
                : ''
            }
          </product_ids>
          <product_name>${xmlEscape(product.title)}</product_name>
          <product_url>${xmlEscape(productUrl)}</product_url>
        </product>
      </products>
    </review>`
}

export async function GET() {
  let products: ShopifyProduct[] = []
  try {
    products = await getAllShopifyProducts()
  } catch (err) {
    console.error('[feed:google-reviews] failed to fetch products', err)
    return new NextResponse('Reviews feed temporarily unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // Pre-filter: only products that have rating_info > 0 reviews. Saves
  // thousands of AliReviews API calls.
  const reviewableProducts = products.filter(hasAnyReviews)

  const bundles = await batchFetchReviews(reviewableProducts)

  const reviewXml: string[] = []
  for (const { product, reviews } of bundles) {
    for (const r of reviews) {
      reviewXml.push(renderReview(product, r))
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd">
  <version>2.3</version>
  <aggregator>
    <name>${xmlEscape(SITE_NAME)}</name>
  </aggregator>
  <publisher>
    <name>${xmlEscape(SITE_NAME)}</name>
    <favicon>${xmlEscape(SITE_URL + '/favicon.ico')}</favicon>
  </publisher>
  <reviews>
${reviewXml.join('\n')}
  </reviews>
</feed>
`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=21600',
    },
  })
}
