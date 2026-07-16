import type { CatalogProduct, CatalogVariant } from '../catalog'
import type { ShopifyMetafield, ShopifyProduct, ShopifyVariant } from './types'

const CATEGORY_ACCENTS: Record<CatalogProduct['category'], { accent: string; colorHex: string }> = {
  'dog-food': { accent: 'bg-[#ffea79]', colorHex: '#ffea79' },
  'cat-food': { accent: 'bg-[#FF69B4]', colorHex: '#FF69B4' },
  'dog-treats': { accent: 'bg-[#4AD395]', colorHex: '#4AD395' },
  'flea-tick': { accent: 'bg-[#6cd1ff]', colorHex: '#6cd1ff' },
  'cat-litter': { accent: 'bg-[#B19FFB]', colorHex: '#B19FFB' },
  'dog-supplies': { accent: 'bg-[#ffea79]', colorHex: '#ffea79' },
  'cat-supplies': { accent: 'bg-[#FF69B4]', colorHex: '#FF69B4' },
  'fish-supplies': { accent: 'bg-[#6cd1ff]', colorHex: '#6cd1ff' },
  'bird-supplies': { accent: 'bg-[#4AD395]', colorHex: '#4AD395' },
  'reptile-supplies': { accent: 'bg-[#B19FFB]', colorHex: '#B19FFB' },
}

const KNOWN_CATEGORIES = Object.keys(CATEGORY_ACCENTS) as CatalogProduct['category'][]

function pickMetafield(metafields: (ShopifyMetafield | null)[], key: string): string | null {
  return metafields.find((m) => m?.key === key)?.value ?? null
}

function pickMetafieldByNs(
  metafields: (ShopifyMetafield | null)[],
  namespace: string,
  key: string
): string | null {
  return (
    metafields.find((m) => m?.namespace === namespace && m?.key === key)?.value ?? null
  )
}

// Compliance kill-switch (Google Merchant): the AliReviews are AI-generated, so
// presenting them as genuine customer ratings is a misrepresentation risk. This
// is the single source feeding every product card, PDP header, BEST SELLER
// badge, review section, and AggregateRating JSON-LD — forcing it to zero hides
// all ratings/reviews site-wide. Flip back to false to restore once reviews are
// order-backed (anh wants this re-enabled later).
const HIDE_REVIEWS = true

function parseRating(metafields: (ShopifyMetafield | null)[]): { rating: number; reviewCount: number } {
  if (HIDE_REVIEWS) return { rating: 0, reviewCount: 0 }
  const raw = pickMetafieldByNs(metafields, 'alireviews', 'rating_info')
  const data = safeJsonParse<{ ratingValue?: number; reviewCount?: number }>(raw, {})
  return {
    rating: typeof data.ratingValue === 'number' ? data.ratingValue : 0,
    reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
  }
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function pickCategory(product: ShopifyProduct): CatalogProduct['category'] {
  const collectionHandles = product.collections.edges.map((e) => e.node.handle)
  const match = KNOWN_CATEGORIES.find((c) => collectionHandles.includes(c))
  if (match) return match

  // Use PetSmart taxonomy tags: pet:Dog, pet:Cat, pet:Fish, pet:Bird, pet:Reptile,
  // category:Food, category:Treats, category:Litter, category:Flea & Tick, ...
  const lowerTags = product.tags.map((t) => t.toLowerCase())
  const petTag = lowerTags.find((t) => t.startsWith('pet:'))?.slice(4) ?? ''
  const categoryTags = lowerTags.filter((t) => t.startsWith('category:')).map((t) => t.slice(9))
  const cats = categoryTags.join(' ')

  if (petTag === 'cat') {
    if (cats.includes('litter') || cats.includes('waste')) return 'cat-litter'
    if (cats.includes('food') || cats.includes('treats')) return 'cat-food'
    return 'cat-supplies'
  }
  if (petTag === 'dog') {
    if (cats.includes('flea') || cats.includes('tick')) return 'flea-tick'
    if (cats.includes('treat')) return 'dog-treats'
    if (cats.includes('food')) return 'dog-food'
    return 'dog-supplies'
  }
  if (petTag === 'fish') return 'fish-supplies'
  if (petTag === 'bird') return 'bird-supplies'
  if (petTag === 'reptile') return 'reptile-supplies'

  // Last-resort heuristic on productType (no fuzzy substring on 'cat' to avoid
  // matching the literal word 'category')
  const pt = product.productType.toLowerCase()
  if (pt.includes('flea') || pt.includes('tick')) return 'flea-tick'
  if (pt.includes('litter')) return 'cat-litter'
  if (pt.includes('treat')) return 'dog-treats'
  // No pet tag and no recognizable type — bucket into generic dog supplies
  // (was the now-removed 'deals' pseudo-category).
  return 'dog-supplies'
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  trade: '™',
  reg: '®',
  copy: '©',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
}

export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m)
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

const SHORT_DESC_MAX = 180

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > max * 0.6 ? lastSpace : max
  return slice.slice(0, cut).trimEnd() + '...'
}

function extractShortDescription(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const source = match ? stripHtml(match[1]) : stripHtml(html)
  return truncateAtWord(source, SHORT_DESC_MAX)
}

export type DescriptionBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }

const FEATURES_HEADING = /feature|benefit|highlight|why\b|key\s|product\s+detail/i

// Splits a run of jammed features like "...operationPowerful motor..."
// into ["...operation", "Powerful motor..."] using lowercase→Uppercase+lowercase
// boundaries. The double lookahead avoids splitting inside acronyms like "eTEC".
function splitJammedFeatures(text: string): string[] {
  return text
    .split(/(?<=[a-z\)\d%])(?=[A-Z][a-z])/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseDescriptionBlocks(html: string): DescriptionBlock[] {
  if (!html) return []

  const matches = [...html.matchAll(/<(p|ul|ol|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)]

  if (matches.length === 0) {
    const plain = stripHtml(html)
    return plain ? [{ kind: 'paragraph', text: plain }] : []
  }

  const blocks: DescriptionBlock[] = []
  let featuresMode = false

  for (const m of matches) {
    const tag = m[1].toLowerCase()
    const inner = m[2]

    if (tag === 'ul' || tag === 'ol') {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((li) => stripHtml(li[1]))
        .filter(Boolean)
      if (items.length) blocks.push({ kind: 'list', items })
      continue
    }

    if (tag.startsWith('h')) {
      const text = stripHtml(inner)
      if (text) {
        blocks.push({ kind: 'heading', text })
        if (FEATURES_HEADING.test(text)) featuresMode = true
      }
      continue
    }

    // <p>
    const wholeStrong = inner.match(/^\s*<strong>([\s\S]*?)<\/strong>\s*$/i)
    if (wholeStrong) {
      const text = stripHtml(wholeStrong[1])
      if (text) {
        blocks.push({ kind: 'heading', text })
        if (FEATURES_HEADING.test(text)) featuresMode = true
      }
      continue
    }

    const text = stripHtml(inner)
    if (!text) continue

    if (featuresMode) {
      const items = splitJammedFeatures(text)
      if (items.length > 1) {
        blocks.push({ kind: 'list', items })
      } else {
        blocks.push({ kind: 'paragraph', text })
      }
    } else {
      blocks.push({ kind: 'paragraph', text })
    }
  }

  return blocks
}

function splitIngredients(text: string): string[] {
  // Split on commas that are NOT inside parentheses
  return text
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseIngredients(metafields: (ShopifyMetafield | null)[]): string[] {
  const raw = pickMetafield(metafields, 'ingredients_json')
  const data = safeJsonParse<{ plain_text?: string; recipes?: { recipe: string | null; text: string }[] }>(
    raw,
    {}
  )
  const text = data.recipes?.[0]?.text || data.plain_text || ''
  if (!text) return []
  return splitIngredients(text)
}

interface NutrientRow {
  nutrient: string
  amount: string
  unit: string
}

function findNutrient(rows: NutrientRow[], nameLc: string): string {
  const row = rows.find((r) => r.nutrient?.toLowerCase().includes(nameLc))
  if (!row) return 'N/A'
  return `${row.amount}${row.unit || ''}`
}

function parseAnalysis(metafields: (ShopifyMetafield | null)[]): {
  protein: string
  fat: string
  fiber: string
  moisture: string
} {
  const raw = pickMetafield(metafields, 'guaranteed_analysis_json')
  const data = safeJsonParse<{ rows: NutrientRow[] }>(raw, { rows: [] })
  const rows = data.rows || []
  return {
    protein: findNutrient(rows, 'protein'),
    fat: findNutrient(rows, 'fat'),
    fiber: findNutrient(rows, 'fiber'),
    moisture: findNutrient(rows, 'moisture'),
  }
}

export interface FeedingInstructions {
  summary: string
  transition: string
  caloricContent: string
}

function parseFeeding(metafields: (ShopifyMetafield | null)[]): FeedingInstructions {
  const raw = pickMetafield(metafields, 'feeding_instructions_json')
  const data = safeJsonParse<{ summary?: string; transition?: string; caloric_content?: string }>(raw, {})
  return {
    summary: data.summary || '',
    transition: data.transition || '',
    caloricContent: data.caloric_content || '',
  }
}

function deriveBadges(product: ShopifyProduct, metafields: (ShopifyMetafield | null)[]): string[] {
  const badges: string[] = []
  const flavor = pickMetafield(metafields, 'primary_flavor')
  const foodForm = pickMetafield(metafields, 'food_form')
  const lifeStage = pickMetafield(metafields, 'life_stage')
  const breedSize = pickMetafield(metafields, 'breed_size')
  if (flavor) badges.push(flavor)
  if (foodForm) badges.push(foodForm)
  if (lifeStage && lifeStage !== 'All Life Stages') badges.push(lifeStage)
  if (breedSize && breedSize !== 'All') badges.push(`${breedSize} Breed`)
  // Append a couple of product tags as fallback fillers
  for (const tag of product.tags) {
    if (badges.length >= 4) break
    if (!badges.includes(tag)) badges.push(tag)
  }
  return badges.slice(0, 4)
}

// Cheapest IN-STOCK variant, falling back to the cheapest overall. Cards show
// this price as "From $X" and single-variant quick-add adds it directly — a
// sold-out DENY variant gets its quantity clamped to 0 by the Cart API and
// shows as $0.00, so never pick one while stock exists elsewhere.
function pickPrimaryVariant(product: ShopifyProduct): ShopifyVariant | null {
  const edges = product.variants.edges
  const pool = edges.filter((e) => e.node.availableForSale)
  return (pool.length > 0 ? pool : edges)
    .map((e) => e.node)
    .reduce<ShopifyVariant | null>(
      (min, v) =>
        !min || parseFloat(v.price.amount) < parseFloat(min.price.amount) ? v : min,
      null
    )
}

/** Chewy-style "9 Flavors, 3 Sizes" — distinct values per real option name. */
function summarizeOptions(product: ShopifyProduct): string | null {
  const counts = new Map<string, Set<string>>()
  for (const { node: v } of product.variants.edges) {
    for (const o of v.selectedOptions) {
      if (o.name.toLowerCase() === 'title' || isHexColorValue(o.value)) continue
      if (!counts.has(o.name)) counts.set(o.name, new Set())
      counts.get(o.name)!.add(o.value)
    }
  }
  const parts = [...counts.entries()]
    .filter(([, vals]) => vals.size > 1)
    .sort((a, b) => b[1].size - a[1].size)
    .map(([name, vals]) => `${vals.size} ${name}${/s$/i.test(name) ? '' : 's'}`)
  return parts.length > 0 ? parts.join(', ') : null
}

// Rx / vet-authorization products must never be orderable on the storefront,
// regardless of Shopify stock or inventory policy (which the PetSmart sync can
// flip back to CONTINUE / restock). Hard-block by tag here — the single choke
// point every product passes through. ponytail: tag match, revisit if Rx ever
// gets a real prescription-checkout flow.
function isPrescriptionOnly(product: ShopifyProduct): boolean {
  return product.tags.some((t) => t.toLowerCase() === 'vet-authorization')
}

/** True when a value is only hex color code(s) — e.g. "#000000" or
 *  "#8A4512,#2FB534". Bad catalog data dumped color hexes into the Size option. */
export function isHexColorValue(value: string | null | undefined): boolean {
  const v = (value ?? '').trim()
  if (!v) return false
  return v.split(',').every((t) => /^#[0-9a-fA-F]{3,8}$/.test(t.trim()))
}

/** Raw "size" value as Shopify provides it (option value or variant title). */
function getSizeRaw(variant: ShopifyVariant): string {
  const sizeOption = variant.selectedOptions.find(
    (o) => /size|weight|pack/i.test(o.name)
  )
  if (sizeOption) return sizeOption.value
  if (variant.title && variant.title !== 'Default Title') return variant.title
  return variant.selectedOptions[0]?.value ?? ''
}

function mapVariants(product: ShopifyProduct): CatalogVariant[] {
  const rx = isPrescriptionOnly(product)
  return product.variants.edges.map(({ node: v }) => {
    const raw = getSizeRaw(v)
    const isHex = isHexColorValue(raw)
    return {
      id: v.id,
      // Hex junk → no text label (UI hides it or shows a swatch instead).
      weight: isHex ? '' : decodeHtmlEntities(raw) || '1 unit',
      colorHex: isHex ? raw.split(',')[0].trim() : null,
      price: parseFloat(v.price.amount),
      comparePrice: v.compareAtPrice
        ? parseFloat(v.compareAtPrice.amount)
        : undefined,
      availableForSale: rx ? false : v.availableForSale,
      sku: v.sku ?? null,
    }
  })
}

export function adaptShopifyProduct(product: ShopifyProduct): CatalogProduct {
  const variant = pickPrimaryVariant(product)
  const price = variant ? parseFloat(variant.price.amount) : 0
  const compareAt = variant?.compareAtPrice
    ? parseFloat(variant.compareAtPrice.amount)
    : undefined
  const onSale = !!(compareAt && compareAt > price)

  const category = pickCategory(product)
  const { accent, colorHex } = CATEGORY_ACCENTS[category]
  const metafields = product.metafields ?? []
  const analysis = parseAnalysis(metafields)
  const featured = product.featuredImage?.url ?? product.images.edges[0]?.node.url ?? ''

  const shopifyIdMatch = product.id.match(/(\d+)$/)
  return {
    shopifyProductId: shopifyIdMatch ? Number(shopifyIdMatch[1]) : null,
    slug: product.handle,
    name: decodeHtmlEntities(product.title).toUpperCase(),
    price,
    comparePrice: compareAt,
    onSale,
    brand: product.vendor ? decodeHtmlEntities(product.vendor) : 'PETBALE',
    reviewsList: [],
    imageSrc: featured,
    accent,
    colorHex,
    category,
    shortDescription: extractShortDescription(product.descriptionHtml || product.description || ''),
    longDescription: stripHtml(product.descriptionHtml || product.description || ''),
    descriptionBlocks: parseDescriptionBlocks(product.descriptionHtml || ''),
    protein: analysis.protein,
    fat: analysis.fat,
    fiber: analysis.fiber,
    moisture: analysis.moisture,
    images: product.images.edges.map((e) => ({
      src: e.node.url,
      alt: e.node.altText || decodeHtmlEntities(product.title),
    })),
    ingredients: parseIngredients(metafields),
    feedingGuide: [],
    feedingInstructions: parseFeeding(metafields),
    benefits: [],
    badges: deriveBadges(product, metafields),
    defaultVariantId: variant?.id ?? null,
    optionSummary: summarizeOptions(product),
    availableForSale: isPrescriptionOnly(product) ? false : product.availableForSale,
    variants: mapVariants(product),
    ...parseRating(metafields),
  }
}

export function adaptShopifyProducts(products: ShopifyProduct[]): CatalogProduct[] {
  return products.map(adaptShopifyProduct)
}
