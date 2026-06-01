'use client'

import { useLinkStatus } from 'next/link'
import { PawLoader } from './paw-loader'

/**
 * In-place navigation feedback for a product card. Must be rendered as a
 * descendant of the card's <Link>; it reads that link's pending state via
 * useLinkStatus and overlays a paw spinner on the card the instant it's
 * tapped — so the user knows the click registered before the page swaps.
 */
export function CardLinkSpinner() {
  const { pending } = useLinkStatus()

  if (!pending) return null

  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/65 backdrop-blur-[1px] pointer-events-none"
    >
      <PawLoader size={48} count={4} />
    </span>
  )
}
