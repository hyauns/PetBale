import { PawLoader } from '@/components/paw-loader'

/**
 * Instant loading fallback for the product detail route. Next.js swaps the
 * page for this the moment a product link is clicked, so the user gets
 * immediate feedback instead of a frozen screen while the server renders the
 * PDP (Shopify + AliReviews fetch). Kept dependency-free (no async header) so
 * the fallback paints instantly.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-background text-center">
      <PawLoader size={84} count={4} />
      <p className="font-black uppercase tracking-wide text-black/60 text-sm">
        Fetching the goods…
      </p>
    </div>
  )
}
