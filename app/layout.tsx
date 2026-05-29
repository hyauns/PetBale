import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/hooks/use-cart'
import { CartDrawer } from '@/components/cart-drawer'
import { CookieConsent } from '@/components/cookie-consent'
import { Analytics } from '@vercel/analytics/next'
import { AnalyticsScripts } from '@/components/analytics-scripts'
import { getSiteBranding } from '@/lib/shopify/content'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding()

  const icon: { url: string; type?: string; sizes?: string }[] = []
  if (branding.faviconSvgUrl) {
    icon.push({ url: branding.faviconSvgUrl, type: 'image/svg+xml' })
  } else {
    icon.push({ url: '/icon.svg', type: 'image/svg+xml' })
  }
  if (branding.faviconPng32Url) {
    icon.push({ url: branding.faviconPng32Url, sizes: '32x32', type: 'image/png' })
  } else {
    icon.push({ url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' })
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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Premium Multi-Brand Pet Care Superstore`,
      description: SITE_DESCRIPTION,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
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
