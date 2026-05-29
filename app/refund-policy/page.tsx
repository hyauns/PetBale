import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'PetBale return and refund policy.',
  alternates: { canonical: '/refund-policy' },
}

export default async function RefundPolicyPage() {
  const page = await getShopifyPolicyPage('refund-policy')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
