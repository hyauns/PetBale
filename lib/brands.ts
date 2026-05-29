import { getAllProducts } from './catalog'

export interface BrandSummary {
  name: string
  count: number
  /** First letter, uppercase. Falls back to "#" for non-alphabetic. */
  letter: string
}

export interface BrandIndex {
  brands: BrandSummary[]
  groups: { letter: string; brands: BrandSummary[] }[]
  letters: string[]
  totalBrands: number
  totalProducts: number
}

const SKIP_BRANDS = new Set(['', 'PETBALE'])

function letterOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase()
  return /^[A-Z]$/.test(c) ? c : '#'
}

export async function getBrandIndex(): Promise<BrandIndex> {
  const products = await getAllProducts()
  const counts = new Map<string, number>()

  for (const p of products) {
    const brand = (p.brand || '').trim()
    if (!brand || SKIP_BRANDS.has(brand.toUpperCase())) continue
    counts.set(brand, (counts.get(brand) ?? 0) + 1)
  }

  const brands: BrandSummary[] = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, letter: letterOf(name) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))

  const groupMap = new Map<string, BrandSummary[]>()
  for (const b of brands) {
    if (!groupMap.has(b.letter)) groupMap.set(b.letter, [])
    groupMap.get(b.letter)!.push(b)
  }
  // Build the canonical A→Z (then #) ordering for the visible groups.
  const ordered = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['#'])
  const groups = ordered
    .filter((l) => groupMap.has(l))
    .map((letter) => ({ letter, brands: groupMap.get(letter)! }))

  return {
    brands,
    groups,
    letters: groups.map((g) => g.letter),
    totalBrands: brands.length,
    totalProducts: products.length,
  }
}

/** Top N brands by product count — for the featured section. */
export function pickFeatured(brands: BrandSummary[], n: number): BrandSummary[] {
  return [...brands].sort((a, b) => b.count - a.count).slice(0, n)
}
