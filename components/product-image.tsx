'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useState } from 'react'
import { PawLoader } from './paw-loader'
import shopifyImageLoader from '@/lib/shopify-image-loader'
import { cn } from '@/lib/utils'

/**
 * ProductImage — next/image for Shopify product photos with two behaviours:
 *  1. Resizing is offloaded to Shopify's CDN (shopifyImageLoader) instead of the
 *     slow self-hosted Next optimizer — see lib/shopify-image-loader.ts.
 *  2. While the photo downloads, a brand PawLoader (4 paws orbiting, same as the
 *     product-nav spinner) fills the box instead of a blank white square; the
 *     image fades in on load. Reuses the PawLoader motif per project convention.
 *
 * Drop-in for the inline <Image> used in the product grids: it fills a centring
 * box and keeps `object-contain`, so layout is unchanged.
 */
export function ProductImage({
  className,
  pawSize = 44,
  onLoad,
  ...props
}: ImageProps & { pawSize?: number }) {
  const [loaded, setLoaded] = useState(false)

  // LCP images (above-the-fold, passed priority/eager) must paint immediately:
  // the opacity-0 fade gate would hide the pixel until hydration + onLoad + the
  // 300ms transition, delaying LCP. Skip the loader and fade for those.
  const eager = props.priority || props.loading === 'eager'

  // Cached images can finish loading before React attaches onLoad, which would
  // leave the loader stuck. Catch that via the ref's `complete` flag on mount.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setLoaded(true)
  }, [])

  return (
    <span className="relative flex h-full w-full items-center justify-center">
      {!loaded && !eager && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <PawLoader count={4} size={pawSize} />
        </span>
      )}
      <Image
        {...props}
        ref={imgRef}
        loader={shopifyImageLoader}
        className={cn(
          className,
          !eager && 'transition-opacity duration-300',
          loaded || eager ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
      />
    </span>
  )
}
