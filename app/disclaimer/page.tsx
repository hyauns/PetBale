import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage, type PolicyBanner } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Important information about PetBale content: not veterinary advice, supplement/FDA notice, and product information from third-party brands.',
  alternates: { canonical: '/disclaimer' },
}

// This Shopify page has no `custom.policy_banner` metafield, so fall back to a
// sensible default banner instead of 404-ing like the strict policy pages.
const DEFAULT_BANNER: PolicyBanner = {
  badge: 'Legal',
  emoji: '⚠️',
  accentColor: '#ffea79',
  subtitle: 'Please read before relying on any information on this site',
  lastUpdated: '',
}

export default async function DisclaimerPage() {
  const page = await getShopifyPolicyPage('disclaimer')
  if (!page) notFound()
  return (
    <PolicyShell
      title={page.title}
      banner={page.banner ?? DEFAULT_BANNER}
      bodyHtml={page.bodyHtml}
    />
  )
}
