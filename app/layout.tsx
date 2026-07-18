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

// 48 contiguous states + DC (shipping policy: no Alaska, Hawaii).
const CONTIGUOUS_US_STATES = [
  'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
  'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const SHIPPING_DESTINATION = {
  '@type': 'DefinedRegion',
  addressCountry: 'US',
  addressRegion: CONTIGUOUS_US_STATES,
}

const TRANSIT_TIME = {
  '@type': 'ServicePeriod',
  duration: {
    '@type': 'QuantitativeValue',
    minValue: 3,
    maxValue: 7,
    unitCode: 'DAY',
  },
}

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: SITE_NAME,
  legalName: 'DOG BOWL BAKERY LLC',
  foundingDate: '2025',
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
    telephone: '+1-239-441-1004',
    areaServed: 'US',
    availableLanguage: ['English'],
  },
  // Site-wide shipping policy: order-value-based (free $40+), so it lives here
  // at Organization level — per-product OfferShippingDetails can't express an
  // order-total threshold. GMC shipping settings are the authoritative source.
  hasShippingService: {
    '@type': 'ShippingService',
    name: 'Standard shipping',
    handlingTime: {
      '@type': 'ServicePeriod',
      duration: {
        '@type': 'QuantitativeValue',
        minValue: 2,
        maxValue: 4,
        unitCode: 'DAY',
      },
      businessDays: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
      ],
    },
    shippingConditions: [
      {
        '@type': 'ShippingConditions',
        shippingDestination: SHIPPING_DESTINATION,
        orderValue: {
          '@type': 'MonetaryAmount',
          minValue: 0,
          maxValue: 39.99,
          currency: 'USD',
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 8.99,
          currency: 'USD',
        },
        transitTime: TRANSIT_TIME,
      },
      {
        '@type': 'ShippingConditions',
        shippingDestination: SHIPPING_DESTINATION,
        orderValue: {
          '@type': 'MonetaryAmount',
          minValue: 40,
          currency: 'USD',
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'USD',
        },
        transitTime: TRANSIT_TIME,
      },
    ],
  },
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
      <head>
        {/* Every product/hero/logo image is served from Shopify's CDN — open the
            connection early so the LCP hero isn't stuck waiting on TLS handshake. */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        {/* Preload the two fonts on the critical render path: the default body
            face (applied to *) and the hero headline face — cuts FOUT on LCP text. */}
        <link
          rel="preload"
          href="/fonts/TBJInterval-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/WhiskerBites.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
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
