import { getSiteBranding } from '@/lib/shopify/content'
import type { HomeAnnouncement } from '@/lib/shopify/content'
import { SiteHeaderInner } from './site-header-inner'

export async function SiteHeader({
  announcement,
}: {
  announcement?: HomeAnnouncement | null
}) {
  const branding = await getSiteBranding()
  return <SiteHeaderInner announcement={announcement} branding={branding} />
}
