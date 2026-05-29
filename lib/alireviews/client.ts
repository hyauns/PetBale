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

  const params = new URLSearchParams({
    product_id: String(numeric),
    sort: opts.sort ?? 'by_date',
    direction: opts.direction ?? 'desc',
  })
  if (opts.cursor) params.set('cursor', opts.cursor)

  try {
    const res = await fetch(`${BASE}/reviews?${params}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) {
      console.warn(`[alireviews] HTTP ${res.status} for product ${numeric}`)
      return []
    }
    const body = (await res.json()) as AliReviewsResponse
    if (!body.status || !body.data?.reviews) return []
    const reviews = body.data.reviews
    return opts.limit ? reviews.slice(0, opts.limit) : reviews
  } catch (err) {
    console.warn('[alireviews] fetch failed', err)
    return []
  }
}

export function extractShopifyId(gid: string): number | null {
  const m = gid.match(/(\d+)$/)
  return m ? Number(m[1]) : null
}
