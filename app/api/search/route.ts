import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/catalog'

export const runtime = 'edge'

export interface SearchHit {
  slug: string
  name: string
  brand: string
  price: number
  comparePrice?: number
  imageSrc: string
  category: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '6', 10) || 6, 1), 20)

  if (!q) return NextResponse.json({ hits: [] satisfies SearchHit[] })

  try {
    const products = await searchProducts(q, limit)
    const hits: SearchHit[] = products.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: p.price,
      comparePrice: p.comparePrice,
      imageSrc: p.imageSrc,
      category: p.category,
    }))
    return NextResponse.json({ hits })
  } catch (err) {
    console.error('[search] failed', err)
    return NextResponse.json({ hits: [], error: 'search-failed' }, { status: 500 })
  }
}
