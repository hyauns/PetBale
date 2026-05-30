'use client'

import Script from 'next/script'

/**
 * Renders Shopify's official "data sale opt-out" (CCPA/CPRA) widget on the
 * headless storefront.
 *
 * The Shopify page body ships as raw HTML containing a <link> stylesheet, an
 * empty <div id="pc--optOutFormContainer"> the script fills in, and two
 * <script> tags (Shopify opt-out JS + hCaptcha). React's dangerouslySetInnerHTML
 * neither executes <script> tags nor renders <link>/<meta> cleanly (hydration
 * mismatch), so we split them:
 *   - descriptive text + the opt-out container -> dangerouslySetInnerHTML (SSR)
 *   - stylesheet -> a real <link> (React hoists + dedupes it)
 *   - scripts    -> next/script so they actually run and build the form
 */
export function PrivacyChoicesWidget({
  html,
  cssHref,
  scriptSrcs,
}: {
  html: string
  cssHref?: string | null
  scriptSrcs: string[]
}) {
  return (
    <>
      {cssHref ? <link rel="stylesheet" href={cssHref} /> : null}
      <div
        className="policy-body flex flex-col gap-6 leading-relaxed text-zinc-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {scriptSrcs.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  )
}
