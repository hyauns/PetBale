import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How PetBale uses cookies and similar tracking technologies.',
  alternates: { canonical: '/cookie-policy' },
}

export default async function CookiePolicyPage() {
  const page = await getShopifyPolicyPage('cookie-policy')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
