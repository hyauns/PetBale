import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PolicyShell } from '@/components/policy-shell'
import { getShopifyPolicyPage } from '@/lib/shopify/pages'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Payment Policy',
  description: 'PetBale accepted payment methods and billing policy.',
  alternates: { canonical: '/payment-policy' },
}

export default async function PaymentPolicyPage() {
  const page = await getShopifyPolicyPage('payment-policy')
  if (!page || !page.banner) notFound()
  return <PolicyShell title={page.title} banner={page.banner} bodyHtml={page.bodyHtml} />
}
