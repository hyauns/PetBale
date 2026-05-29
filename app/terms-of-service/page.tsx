import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using PetBale.',
  alternates: { canonical: '/terms-of-service' },
}

export default async function TermsOfServicePage() {
  const page = await getShopifyPolicyPage('terms-of-service')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
