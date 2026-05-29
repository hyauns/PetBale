import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getAboutContent } from '@/lib/shopify/content'
import { AboutClient } from './about-client'

export const revalidate = 60

export default async function AboutPage() {
  const content = await getAboutContent()
  return (
    <>
      <SiteHeader />
      <AboutClient content={content} />
      <SiteFooter />
    </>
  )
}
