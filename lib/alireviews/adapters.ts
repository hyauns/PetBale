import type { AliReview } from './client'

export interface DisplayReview {
  id: number
  author: string
  rating: number
  date: string
  comment: string
  media: string[]
  reply: string | null
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return d.toISOString().slice(0, 10)
}

export function adaptAliReview(r: AliReview): DisplayReview {
  return {
    id: r.id,
    author: r.author || 'Anonymous',
    rating: r.star,
    date: formatDate(r.created_at),
    comment: r.content,
    media: r.media ?? [],
    reply: r.reply || null,
  }
}

export function adaptAliReviews(reviews: AliReview[]): DisplayReview[] {
  return reviews.map(adaptAliReview)
}
