import { getSiteBranding } from '@/lib/shopify/content'
import type { HomeFooterLink } from '@/lib/shopify/content'
import { SiteFooterInner } from './site-footer-inner'

export async function SiteFooter({
  footerLinks,
}: {
  footerLinks?: HomeFooterLink[]
}) {
  const branding = await getSiteBranding()
  return <SiteFooterInner footerLinks={footerLinks} branding={branding} />
}
