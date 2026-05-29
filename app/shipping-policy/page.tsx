import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'PetBale shipping zones, rates, and delivery times.',
  alternates: { canonical: '/shipping-policy' },
}

export default async function ShippingPolicyPage() {
  const page = await getShopifyPolicyPage('shipping-policy')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
