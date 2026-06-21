import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site'
import { getAllShopifyProducts } from '@/lib/shopify/queries'
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types'
import { resolveGoogleCategory } from '@/lib/feeds/google-taxonomy'
import { FEED_EXCLUDED_HANDLES } from '@/lib/feeds/excluded-products'
import { decodeHtmlEntities, isHexColorValue } from '@/lib/shopify/adapters'

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace).
 *
 * Spec: https://support.google.com/merchants/answer/7052112
 *
 * Each product variant is emitted as its own <item>, grouped together by
 * <g:item_group_id> = the product handle. This is required for variant-level
 * pricing, availability, and shipping.
 *
 * Regenerated on a 6-hour schedule (revalidate below). Google's scheduled
 * fetch should be configured to re-pull every 24 h, so the freshness budget
 * is plenty.
 */
export const revalidate = 21600 // 6 hours
export const dynamic = 'force-static'

const SHOP_NAME = 'PetBale'
const SHOP_DESCRIPTION =
  'PetBale — Premium multi-brand pet supply retailer. Dog food, cat food, treats, flea & tick, litter, fish, bird, and reptile supplies. Fast US delivery.'
const CURRENCY = 'USD'

/** XML 1.0 special chars + control chars Google rejects. */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // strip control chars except \t \n \r — Google validator rejects them
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
}

/** Decode HTML entities + strip tags, then collapse whitespace. */
function htmlToPlainText(html: string): string {
  if (!html) return ''
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
  // decodeHtmlEntities covers &trade; &reg; &copy; etc. on top of the basics
  return decodeHtmlEntities(stripped).replace(/\s+/g, ' ').trim()
}

/** Title Case — Google penalizes ALL CAPS. Preserves acronyms ≤ 4 chars. */
function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w+/g, (w) => {
      // keep short tokens UPPER (likely acronyms / brand stylings)
      if (w.length <= 3 && /^[a-z]+$/.test(w) && !['the', 'and', 'for', 'with', 'oz', 'lb'].includes(w)) {
        return w.toUpperCase()
      }
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
}

function formatPrice(amount: string): string {
  const n = parseFloat(amount)
  if (!Number.isFinite(n)) return ''
  return `${n.toFixed(2)} ${CURRENCY}`
}

function getTagValue(tags: string[], prefix: string): string | null {
  const lower = prefix.toLowerCase()
  const match = tags.find((t) => t.toLowerCase().startsWith(lower + ':'))
  return match ? match.slice(prefix.length + 1).trim() : null
}

function getTagValues(tags: string[], prefix: string): string[] {
  const lower = prefix.toLowerCase()
  return tags
    .filter((t) => t.toLowerCase().startsWith(lower + ':'))
    .map((t) => t.slice(prefix.length + 1).trim())
}

function pickAgeGroup(tags: string[]): string | null {
  const lifestage = getTagValue(tags, 'lifestage')
  if (!lifestage) return null
  const l = lifestage.toLowerCase()
  if (l.includes('puppy') || l.includes('kitten')) return 'newborn'
  if (l.includes('senior')) return 'adult'
  if (l.includes('adult')) return 'adult'
  return null
}

/** Build one <item> element per variant. */
function renderVariant(product: ShopifyProduct, variant: ShopifyVariant): string {
  const productUrl = `${SITE_URL}/products/${product.handle}`
  const variantUrl = `${productUrl}?variant=${variant.id.split('/').pop()}`

  // Variant title: blank/Default Title means the product has no real variants.
  const hasRealVariant =
    variant.title && variant.title.toLowerCase() !== 'default title' && variant.title !== ''
  const baseTitle = toTitleCase(decodeHtmlEntities(product.title))
  const variantTitle = hasRealVariant
    ? `${baseTitle} — ${decodeHtmlEntities(variant.title)}`
    : baseTitle

  const description = htmlToPlainText(product.description || product.descriptionHtml).slice(0, 5000)
  const safeDescription =
    description || `${baseTitle} from ${product.vendor ? decodeHtmlEntities(product.vendor) : SHOP_NAME}.`

  // Image
  const featured = product.featuredImage?.url
  const variantImage = variant.image?.url
  const primaryImage = variantImage || featured || product.images.edges[0]?.node.url || ''
  const additionalImages = product.images.edges
    .map((e) => e.node.url)
    .filter((u) => u && u !== primaryImage)
    .slice(0, 10)

  // Availability
  const available = variant.availableForSale
  const availability = available ? 'in_stock' : 'out_of_stock'

  // Pricing
  const regularPrice = formatPrice(variant.price.amount)
  let salePriceTag = ''
  if (variant.compareAtPrice) {
    const compare = parseFloat(variant.compareAtPrice.amount)
    const current = parseFloat(variant.price.amount)
    if (Number.isFinite(compare) && compare > current) {
      // Sale: <g:price> = compare (regular), <g:sale_price> = current
      const regular = formatPrice(variant.compareAtPrice.amount)
      const sale = formatPrice(variant.price.amount)
      return buildItem({
        id: variant.id.split('/').pop() ?? variant.id,
        itemGroupId: product.handle,
        title: variantTitle,
        description: safeDescription,
        link: variantUrl,
        imageLink: primaryImage,
        additionalImages,
        availability,
        price: regular,
        salePrice: sale,
        brand: product.vendor ? decodeHtmlEntities(product.vendor) : SHOP_NAME,
        mpn: variant.sku || '',
        condition: 'new',
        product,
        variant,
      })
    }
  }
  // No sale
  return buildItem({
    id: variant.id.split('/').pop() ?? variant.id,
    itemGroupId: product.handle,
    title: variantTitle,
    description: safeDescription,
    link: variantUrl,
    imageLink: primaryImage,
    additionalImages,
    availability,
    price: regularPrice,
    salePrice: salePriceTag,
    brand: product.vendor ? decodeHtmlEntities(product.vendor) : SHOP_NAME,
    mpn: variant.sku || '',
    condition: 'new',
    product,
    variant,
  })
}

interface ItemFields {
  id: string
  itemGroupId: string
  title: string
  description: string
  link: string
  imageLink: string
  additionalImages: string[]
  availability: string
  price: string
  salePrice: string
  brand: string
  mpn: string
  condition: string
  product: ShopifyProduct
  variant: ShopifyVariant
}

function buildItem(f: ItemFields): string {
  const { product, variant } = f
  const pet = getTagValue(product.tags, 'pet')
  const catRoot = getTagValue(product.tags, 'category')
  const catLeaf = getTagValue(product.tags, 'category-leaf')
  const googleCat = resolveGoogleCategory(pet, catRoot, catLeaf)

  // product_type: full breadcrumb taken from PetSmart tags (anchored to our shop)
  const productTypeParts: string[] = []
  if (pet) productTypeParts.push(pet)
  if (catRoot) productTypeParts.push(catRoot)
  if (catLeaf) productTypeParts.push(catLeaf)
  const productType = productTypeParts.join(' > ')

  // Identifier rules: Google accepts brand + MPN; we never have GTIN via
  // Storefront API. If MPN missing, mark identifier_exists=no.
  const hasIdentifiers = !!(f.brand && f.mpn)

  // Optional structured attributes
  const rawSize = variant.selectedOptions.find((o) => /size|weight|pack/i.test(o.name))?.value
  // Skip hex-color junk that bad catalog data dumped into the Size option —
  // Google rejects "#038DFF" as a size value.
  const size = rawSize && !isHexColorValue(rawSize) ? rawSize : undefined
  const color = variant.selectedOptions.find((o) => /color/i.test(o.name))?.value
  const ageGroup = pickAgeGroup(product.tags)
  const material = getTagValue(product.tags, 'material')
  const flavor = getTagValue(product.tags, 'flavor')

  // Custom labels for campaign targeting in Google Ads (optional).
  const customLabel0 = pet ?? ''
  const customLabel1 = catRoot ?? ''
  const customLabel2 = catLeaf ?? ''
  const customLabel3 = product.vendor ? decodeHtmlEntities(product.vendor) : ''
  // custom_label_4: which products we advertise on Google Ads. We only run ads
  // on IN-STOCK products selling for $1–150 → `ads_1_150`. Out-of-stock items in
  // that price range go to `oos_1_150` (so they're excluded from ads but re-enter
  // `ads_1_150` automatically once back in stock); anything above $150 is
  // `over_150`. Campaigns target only `ads_1_150`. Uses the current selling price
  // (the sale price when on sale). Replaces the old `sale` flag — sale status is
  // still derivable from the <g:sale_price> field.
  const sellingPrice = parseFloat(variant.price.amount)
  const inPriceRange =
    Number.isFinite(sellingPrice) && sellingPrice >= 1 && sellingPrice <= 150
  let customLabel4: string
  if (inPriceRange) {
    customLabel4 = f.availability === 'in_stock' ? 'ads_1_150' : 'oos_1_150'
  } else {
    customLabel4 = 'over_150'
  }

  const additional = f.additionalImages
    .map((u) => `      <g:additional_image_link>${xmlEscape(u)}</g:additional_image_link>`)
    .join('\n')

  return `    <item>
      <g:id>${xmlEscape(f.id)}</g:id>
      <g:item_group_id>${xmlEscape(f.itemGroupId)}</g:item_group_id>
      <title>${xmlEscape(f.title)}</title>
      <description>${xmlEscape(f.description)}</description>
      <link>${xmlEscape(f.link)}</link>
      <g:image_link>${xmlEscape(f.imageLink)}</g:image_link>
${additional ? additional + '\n' : ''}      <g:availability>${f.availability}</g:availability>
      <g:price>${xmlEscape(f.price)}</g:price>
${f.salePrice ? `      <g:sale_price>${xmlEscape(f.salePrice)}</g:sale_price>\n` : ''}      <g:brand>${xmlEscape(f.brand)}</g:brand>
${f.mpn ? `      <g:mpn>${xmlEscape(f.mpn)}</g:mpn>\n` : ''}      <g:identifier_exists>${hasIdentifiers ? 'yes' : 'no'}</g:identifier_exists>
      <g:condition>${f.condition}</g:condition>
      <g:google_product_category>${googleCat.id}</g:google_product_category>
      <g:product_type>${xmlEscape(productType || googleCat.path)}</g:product_type>
${size ? `      <g:size>${xmlEscape(size)}</g:size>\n` : ''}${color ? `      <g:color>${xmlEscape(color)}</g:color>\n` : ''}${ageGroup ? `      <g:age_group>${ageGroup}</g:age_group>\n` : ''}${material ? `      <g:material>${xmlEscape(material)}</g:material>\n` : ''}${flavor ? `      <g:flavor>${xmlEscape(flavor)}</g:flavor>\n` : ''}      <g:custom_label_0>${xmlEscape(customLabel0)}</g:custom_label_0>
      <g:custom_label_1>${xmlEscape(customLabel1)}</g:custom_label_1>
      <g:custom_label_2>${xmlEscape(customLabel2)}</g:custom_label_2>
      <g:custom_label_3>${xmlEscape(customLabel3)}</g:custom_label_3>
${customLabel4 ? `      <g:custom_label_4>${xmlEscape(customLabel4)}</g:custom_label_4>\n` : ''}      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>8.99 USD</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>3</g:min_transit_time>
        <g:max_transit_time>7</g:max_transit_time>
      </g:shipping>
    </item>`
}

export async function GET() {
  let products: ShopifyProduct[] = []
  try {
    products = await getAllShopifyProducts()
  } catch (err) {
    console.error('[feed:google] failed to fetch products', err)
    return new NextResponse('Feed temporarily unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const items: string[] = []
  for (const product of products) {
    if (!product.availableForSale) continue
    // Skip products disapproved by Google Merchant under the Healthcare &
    // Medicine policy (pet pharmaceuticals / prescription drugs / health claims).
    if (FEED_EXCLUDED_HANDLES.has(product.handle)) continue
    for (const edge of product.variants.edges) {
      items.push(renderVariant(product, edge.node))
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xmlEscape(SHOP_NAME)} — Product Feed</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>${xmlEscape(SHOP_DESCRIPTION)}</description>
${items.join('\n')}
  </channel>
</rss>
`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Coolify edge / CDN cache for 1h; Google fetch picks fresh on schedule
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=21600',
    },
  })
}
