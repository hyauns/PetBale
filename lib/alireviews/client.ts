export interface AliReview {
  id: number
  product_id: number
  author: string
  star: number
  content: string
  email?: string
  media: string[]
  total_likes: number
  total_dislikes: number
  created_at: string
  reply?: string | null
}

interface AliReviewsResponse {
  status: boolean
  message: string
  data: {
    reviews: AliReview[]
    cursor: string | null
  }
}

const BASE = 'https://pub.kudosi.ai/public'
const API_KEY = process.env.ALI_REVIEWS_API_KEY

export interface AliReviewsOptions {
  sort?: 'by_date' | 'by_rating' | 'by_content' | 'by_media'
  direction?: 'asc' | 'desc'
  cursor?: string
  /** Soft cap on how many reviews to return (after fetch). */
  limit?: number
}

export async function getAliReviews(
  productId: number | string,
  opts: AliReviewsOptions = {}
): Promise<AliReview[]> {
  if (!API_KEY) {
    console.warn('[alireviews] ALI_REVIEWS_API_KEY missing — skipping')
    return []
  }
  const numeric = typeof productId === 'string' ? extractShopifyId(productId) : productId
  if (!numeric) return []

  const limit = opts.limit ?? 100
  const all: AliReview[] = []
  let cursor = opts.cursor

  try {
    // The public API is cursor-paginated (~9 reviews/page). Follow the cursor
    // until it's empty or we've collected enough, so products with many reviews
    // aren't truncated to the first page.
    for (let page = 0; page < 12; page++) {
      const params = new URLSearchParams({
        product_id: String(numeric),
        sort: opts.sort ?? 'by_date',
        direction: opts.direction ?? 'desc',
      })
      if (cursor) params.set('cursor', cursor)

      const res = await fetch(`${BASE}/reviews?${params}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: 'application/json',
        },
        next: { revalidate: 300 },
      })
      if (!res.ok) {
        console.warn(`[alireviews] HTTP ${res.status} for product ${numeric}`)
        break
      }
      const body = (await res.json()) as AliReviewsResponse
      if (!body.status || !body.data?.reviews) break
      all.push(...body.data.reviews)
      cursor = body.data.cursor || undefined
      if (!cursor || all.length >= limit) break
    }
  } catch (err) {
    console.warn('[alireviews] fetch failed', err)
  }

  return all.slice(0, limit)
}

export function extractShopifyId(gid: string): number | null {
  const m = gid.match(/(\d+)$/)
  return m ? Number(m[1]) : null
}
