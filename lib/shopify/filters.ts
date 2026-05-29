export interface SelectedFilters {
  pet: string | null
  brand: string[]
  priceMin: number | null
  priceMax: number | null
  inStock: boolean
  lifeStage: string[]
  breedSize: string[]
  foodForm: string[]
  flavor: string[]
  category: string[]
}

export const EMPTY_FILTERS: SelectedFilters = {
  pet: null,
  brand: [],
  priceMin: null,
  priceMax: null,
  inStock: false,
  lifeStage: [],
  breedSize: [],
  foodForm: [],
  flavor: [],
  category: [],
}

export const PRICE_BUCKETS = [
  { label: '$30–50', min: 30, max: 50 },
  { label: '$50–75', min: 50, max: 75 },
  { label: '$75–100', min: 75, max: 100 },
  { label: '$100–150', min: 100, max: 150 },
  { label: '$150–250', min: 150, max: 250 },
  { label: '$250+', min: 250, max: 9999 },
] as const

export const PET_TYPES = ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile'] as const
export const LIFE_STAGES = ['Adult', 'All Life Stages', 'Puppy', 'Senior', 'Kitten'] as const
export const BREED_SIZES = ['Small', 'Medium', 'Large', 'Giant', 'All'] as const
export const FOOD_FORMS = [
  'Dry', 'Wet', 'Treats', 'Freeze Dried', 'Frozen', 'Fresh',
  'Dehydrated', 'Variety Pack', 'Seed', 'Broth', 'Supplements',
] as const

function csv(s: string | undefined | null): string[] {
  if (!s) return []
  return s.split(',').map((v) => v.trim()).filter(Boolean)
}

export function parseFiltersFromSearch(
  params: Record<string, string | string[] | undefined>
): SelectedFilters {
  const g = (k: string): string | undefined => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }
  const priceRaw = g('price') // "30-100"
  let priceMin: number | null = null
  let priceMax: number | null = null
  if (priceRaw) {
    const m = priceRaw.match(/^(\d+)?-(\d+)?$/)
    if (m) {
      priceMin = m[1] ? Number(m[1]) : null
      priceMax = m[2] ? Number(m[2]) : null
    }
  }
  return {
    pet: g('pet') || null,
    brand: csv(g('brand')),
    priceMin,
    priceMax,
    inStock: g('stock') === '1',
    lifeStage: csv(g('lifestage')),
    breedSize: csv(g('breedsize')),
    foodForm: csv(g('foodform')),
    flavor: csv(g('flavor')),
    category: csv(g('category')),
  }
}

export function serializeFilters(f: SelectedFilters): string {
  const parts: string[] = []
  if (f.pet) parts.push(`pet=${encodeURIComponent(f.pet)}`)
  if (f.brand.length) parts.push(`brand=${encodeURIComponent(f.brand.join(','))}`)
  if (f.priceMin != null || f.priceMax != null) {
    parts.push(`price=${f.priceMin ?? ''}-${f.priceMax ?? ''}`)
  }
  if (f.inStock) parts.push('stock=1')
  if (f.lifeStage.length) parts.push(`lifestage=${encodeURIComponent(f.lifeStage.join(','))}`)
  if (f.breedSize.length) parts.push(`breedsize=${encodeURIComponent(f.breedSize.join(','))}`)
  if (f.foodForm.length) parts.push(`foodform=${encodeURIComponent(f.foodForm.join(','))}`)
  if (f.flavor.length) parts.push(`flavor=${encodeURIComponent(f.flavor.join(','))}`)
  if (f.category.length) parts.push(`category=${encodeURIComponent(f.category.join(','))}`)
  return parts.join('&')
}

export type ShopifyProductFilter =
  | { available: boolean }
  | { tag: string }
  | { productVendor: string }
  | { price: { min?: number; max?: number } }

export function toShopifyProductFilters(f: SelectedFilters): ShopifyProductFilter[] {
  const out: ShopifyProductFilter[] = []
  if (f.pet) out.push({ tag: `pet:${f.pet}` })
  for (const b of f.brand) out.push({ productVendor: b })
  for (const c of f.category) out.push({ tag: `category:${c}` })
  for (const ls of f.lifeStage) out.push({ tag: `lifestage:${ls}` })
  for (const bs of f.breedSize) out.push({ tag: `breed-size:${bs}` })
  for (const ff of f.foodForm) out.push({ tag: `food-form:${ff}` })
  for (const fl of f.flavor) out.push({ tag: `flavor:${fl}` })
  if (f.priceMin != null || f.priceMax != null) {
    const range: { min?: number; max?: number } = {}
    if (f.priceMin != null) range.min = f.priceMin
    if (f.priceMax != null) range.max = f.priceMax
    out.push({ price: range })
  }
  if (f.inStock) out.push({ available: true })
  return out
}

export function filterVisibility(f: SelectedFilters) {
  return {
    petType: true,
    brand: true,
    price: true,
    inStock: true,
    lifeStage: f.pet === 'Dog' || f.pet === 'Cat',
    breedSize: f.pet === 'Dog',
    foodForm: f.category.some((c) => ['Food', 'Treats', 'Food and Treats'].includes(c)),
  }
}

/**
 * When pet type or category changes, clear filters that no longer apply.
 */
export function reconcileFilters(f: SelectedFilters): SelectedFilters {
  const vis = filterVisibility(f)
  return {
    ...f,
    lifeStage: vis.lifeStage ? f.lifeStage : [],
    breedSize: vis.breedSize ? f.breedSize : [],
    foodForm: vis.foodForm ? f.foodForm : [],
  }
}

export function hasAnyFilter(f: SelectedFilters): boolean {
  return !!(
    f.pet ||
    f.brand.length ||
    f.priceMin != null ||
    f.priceMax != null ||
    f.inStock ||
    f.lifeStage.length ||
    f.breedSize.length ||
    f.foodForm.length ||
    f.flavor.length ||
    f.category.length
  )
}
