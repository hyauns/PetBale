import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { PrivacyChoicesWidget } from '@/components/privacy-choices-widget'
import { getShopifyPolicyPage, type PolicyBanner } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Your Privacy Choices',
  description: 'Manage how PetBale shares your personal information and opt out of data sharing.',
  alternates: { canonical: '/data-sharing-opt-out' },
}

// This Shopify page has no `custom.policy_banner` metafield, so fall back to a
// sensible default banner instead of 404-ing like the strict policy pages.
const DEFAULT_BANNER: PolicyBanner = {
  badge: 'Privacy',
  emoji: '🔒',
  accentColor: '#6cd1ff',
  subtitle: 'Manage how your personal information is shared',
  lastUpdated: '',
}

/** Pull out the stylesheet href and script srcs, strip head/script tags. */
function splitOptOutBody(body: string): {
  html: string
  cssHref: string | null
  scriptSrcs: string[]
} {
  const cssHref = body.match(/<link[^>]*href="([^"]+)"[^>]*>/i)?.[1] ?? null
  const scriptSrcs = [...body.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)].map((m) => m[1])
  const html = body
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim()
  return { html, cssHref, scriptSrcs }
}

export default async function YourPrivacyChoicesPage() {
  const page = await getShopifyPolicyPage('data-sharing-opt-out')
  if (!page) notFound()

  const { html, cssHref, scriptSrcs } = splitOptOutBody(page.bodyHtml || '')

  return (
    <PolicyShell
      title={page.title}
      banner={page.banner ?? DEFAULT_BANNER}
      fallback={<PrivacyChoicesWidget html={html} cssHref={cssHref} scriptSrcs={scriptSrcs} />}
    />
  )
}
