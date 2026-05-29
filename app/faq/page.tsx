import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getFaqContent } from '@/lib/shopify/content'
import { FaqClient } from './faq-client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Quick answers about shipping, returns, payment, pet nutrition, and more — PetBale Help Center.',
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    title: 'FAQs | PetBale',
    description: 'Quick answers about shipping, returns, payment, and pet nutrition.',
    url: '/faq',
  },
}

export default async function FaqPage() {
  const content = await getFaqContent()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <SiteHeader />
      <FaqClient content={content} />
      <SiteFooter />
    </>
  )
}
