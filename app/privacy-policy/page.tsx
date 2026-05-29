import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PetBale collects, uses, and protects your information.',
  alternates: { canonical: '/privacy-policy' },
}

export default async function PrivacyPolicyPage() {
  const page = await getShopifyPolicyPage('privacy-policy')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
