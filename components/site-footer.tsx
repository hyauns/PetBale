import { getSiteBranding, getTrustBadges, getPaymentSettings } from '@/lib/shopify/content'
import type { HomeFooterLink } from '@/lib/shopify/content'
import { SiteFooterInner } from './site-footer-inner'

export async function SiteFooter({
  footerLinks,
}: {
  footerLinks?: HomeFooterLink[]
}) {
  const [branding, trustBadges, payment] = await Promise.all([
    getSiteBranding(),
    getTrustBadges(),
    getPaymentSettings(),
  ])
  return (
    <SiteFooterInner
      footerLinks={footerLinks}
      branding={branding}
      trustBadges={trustBadges}
      cardBrands={payment.cardBrands}
      digitalWallets={payment.digitalWallets}
    />
  )
}
