import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TrackOrderClient } from './track-client'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your PetBale order. Enter the email used at checkout and we will email you the tracking link.',
  alternates: { canonical: '/track' },
  openGraph: {
    type: 'website',
    title: 'Track Your Order | PetBale',
    description: 'Check the status of your PetBale order.',
    url: '/track',
  },
}

export default function TrackPage() {
  return (
    <>
      <SiteHeader />
      <TrackOrderClient />
      <SiteFooter />
    </>
  )
}
