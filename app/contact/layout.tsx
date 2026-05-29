import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PetBale',
  description: 'Get in touch with PetBale customer care. We respond within one business day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: 'Contact PetBale',
    description: 'Get in touch with PetBale customer care. We respond within one business day.',
    url: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
