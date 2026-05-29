import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContactClient } from './contact-client'

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <ContactClient />
      <SiteFooter />
    </>
  )
}
