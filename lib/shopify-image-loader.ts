/**
 * Shopify-CDN image loader for next/image.
 *
 * WHY: routing Shopify images through Next's own optimizer means the Coolify VPS
 * has to download the original, resize, and re-encode (AVIF encode is very CPU
 * heavy) on first hit — that is the 1-2s stall on /collections, /shop and PDPs.
 *
 * Shopify's CDN already does this at its global edge: appending `?width=N`
 * returns a resized image, and it auto-negotiates WebP via the Accept header.
 * So we hand resizing to Shopify (instant, cached at edge) and bypass the local
 * optimizer entirely. Non-Shopify URLs are returned untouched.
 */

function isShopifyCdn(src: string): boolean {
  return /(^|\/\/)([^/]*\.)?(shopify\.com|shopifycdn\.com)\//.test(src)
}

/** Build a width-constrained Shopify CDN URL (also usable for raw <img>). */
export function shopifyImageUrl(src: string, width: number, quality?: number): string {
  if (!src || !isShopifyCdn(src)) return src
  try {
    const url = new URL(src)
    url.searchParams.set('width', String(Math.round(width)))
    if (quality) url.searchParams.set('quality', String(quality))
    return url.toString()
  } catch {
    return src
  }
}

/** next/image custom loader signature. */
export default function shopifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  return shopifyImageUrl(src, width, quality)
}
