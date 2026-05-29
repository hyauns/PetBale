import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/hooks/use-cart'
import { CartDrawer } from '@/components/cart-drawer'
import { CookieConsent } from '@/components/cookie-consent'
import { Analytics } from '@vercel/analytics/next'
import { AnalyticsScripts } from '@/components/analytics-scripts'
import { JsonLd } from '@/components/json-ld'
import { getSiteBranding } from '@/lib/shopify/content'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding()

  // Build the icon list in the order browsers should prefer.
  // Only fall back to the boilerplate /icon.svg + /icon-light-32x32.png when
  // *nothing* has been uploaded to Shopify — those files are placeholders that
  // ship with the Next.js scaffold and would otherwise win over the PNG.
  const icon: { url: string; type?: string; sizes?: string }[] = []
  if (branding.faviconSvgUrl) {
    icon.push({ url: branding.faviconSvgUrl, type: 'image/svg+xml' })
  }
  if (branding.faviconPng32Url) {
    icon.push({ url: branding.faviconPng32Url, sizes: '32x32', type: 'image/png' })
  }
  if (icon.length === 0) {
    icon.push(
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' }
    )
  }
  const apple = branding.appleTouchIconUrl || '/apple-icon.png'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — Premium Multi-Brand Pet Care Superstore`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: ['pet food', 'dog food', 'cat food', 'pet care', 'pet store', 'pet supplies', 'flea tick', 'cat litter'],
    applicationName: SITE_NAME,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Premium Multi-Brand Pet Care Superstore`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      locale: 'en_US',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Premium pet supplies`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Premium Multi-Brand Pet Care Superstore`,
      description: SITE_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon,
      apple,
    },
  }
}

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: SITE_NAME,
  legalName: 'DOG BOWL BAKERY LLC',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  image: DEFAULT_OG_IMAGE,
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3832 FESCUE ST',
    addressLocality: 'CLERMONT',
    addressRegion: 'FL',
    postalCode: '34714',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'cs@petbale.com',
    telephone: '+1-651-755-5757',
    areaServed: 'US',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://instagram.com',
    'https://facebook.com',
    'https://youtube.com',
  ],
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
        <CartProvider>
          {children}
          <CartDrawer />
          <CookieConsent />
        </CartProvider>
        <Analytics />
        <AnalyticsScripts />
      </body>
    </html>
  )
}
