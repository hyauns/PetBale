import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About PetBale',
  description: 'PetBale — the premium multi-brand pet care superstore. Our mission, values, and commitment to pets and their humans.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    title: 'About PetBale',
    description: 'PetBale — the premium multi-brand pet care superstore. Our mission, values, and commitment to pets and their humans.',
    url: '/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
