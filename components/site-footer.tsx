import { getSiteBranding, getTrustBadges } from '@/lib/shopify/content'
import type { HomeFooterLink } from '@/lib/shopify/content'
import { SiteFooterInner } from './site-footer-inner'

export async function SiteFooter({
  footerLinks,
}: {
  footerLinks?: HomeFooterLink[]
}) {
  const [branding, trustBadges] = await Promise.all([
    getSiteBranding(),
    getTrustBadges(),
  ])
  return (
    <SiteFooterInner
      footerLinks={footerLinks}
      branding={branding}
      trustBadges={trustBadges}
    />
  )
}
