'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import type { HomeFooterLink, SiteBranding } from '@/lib/shopify/content'

const DEFAULT_LINKS: Record<string, { label: string; href: string }[]> = {
  Shop: [
    { label: 'Dog Food', href: '/collections/dog-food' },
    { label: 'Cat Food', href: '/collections/cat-food' },
    { label: 'Dog Treats', href: '/collections/dog-treats' },
    { label: 'Flea & Tick', href: '/collections/flea-tick' },
    { label: 'Cat Litter', href: '/collections/cat-litter' },
    { label: 'Deals', href: '/collections/deals' },
  ],
  Company: [
    { label: 'About PetBale', href: '/about' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Sustainability', href: '/' },
    { label: 'Track Order', href: '/track' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Payment Policy', href: '/payment-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
}

export function SiteFooterInner({
  footerLinks: shopifyLinks,
  branding,
}: {
  footerLinks?: HomeFooterLink[]
  branding?: SiteBranding | null
}) {
  const grouped = shopifyLinks && shopifyLinks.length > 0
    ? shopifyLinks.reduce<Record<string, { label: string; href: string }[]>>((acc, l) => {
        if (!acc[l.group]) acc[l.group] = []
        acc[l.group].push({ label: l.label, href: l.url })
        return acc
      }, {})
    : DEFAULT_LINKS

  const wordmarkUrl = branding?.wordmarkLogoFooterUrl ?? branding?.wordmarkLogoUrl ?? null
  const wordmarkAlt = branding?.wordmarkLogoFooterUrl
    ? (branding.wordmarkLogoFooterAlt || 'PetBale')
    : (branding?.wordmarkLogoAlt || 'PetBale')
  const wordmarkText = branding?.wordmarkText || 'PetBale'

  return (
    <footer className="bg-black text-white relative mt-0 pt-20 pb-10 font-tbj-interval select-none" aria-label="Site footer">

      {/* Top Organic Wave Divider with Bold Black Stroke */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%] pointer-events-none select-none z-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-16 sm:h-20 md:h-24 fill-black"
        >
          {/* Black Wave Fill path */}
          <path
            d="M0,60 C150,110 350,10 600,60 C850,110 1050,10 1200,60 L1200,120 L0,120 Z"
            className="fill-black"
          />
          {/* A curved stroke on top of the wave */}
          <path
            d="M0,60 C150,110 350,10 600,60 C850,110 1050,10 1200,60"
            fill="none"
            stroke="black"
            strokeWidth="6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              {wordmarkUrl ? (
                <Image
                  src={wordmarkUrl}
                  alt={wordmarkAlt}
                  width={220}
                  height={48}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              ) : (
                <span className="font-whisker-bites text-3xl font-black text-[#ffea79] uppercase tracking-tight">
                  {wordmarkText}
                </span>
              )}
            </Link>
            <p className="text-white/60 text-xs sm:text-sm font-extrabold leading-relaxed mb-8 max-w-xs uppercase tracking-wide">
              Your ultimate pet care superstore. Premium brands, quick delivery, and unbeatable prices.
            </p>

            {/* Bouncy Pop-art Social links */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, label: 'Follow PetBale on Instagram', href: 'https://instagram.com', bg: '#6cd1ff' },
                { Icon: Facebook, label: 'Follow PetBale on Facebook', href: 'https://facebook.com', bg: '#ffea79' },
                { Icon: Youtube, label: 'Watch PetBale on YouTube', href: 'https://youtube.com', bg: '#6cd1ff' },
              ].map(({ Icon, label, href, bg }, index) => (
                <motion.div
                  key={label}
                  whileHover={{
                    scale: 1.1,
                    rotate: index % 2 === 0 ? -6 : 6,
                    translateY: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    style={{ '--hover-bg': bg } as React.CSSProperties}
                    className="w-11 h-11 rounded-full bg-white border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">
                Certified by
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href="https://www.legitscript.com/"
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  aria-label="LegitScript Certified"
                  className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Image
                    src="/legitscript.png"
                    alt="LegitScript Certified"
                    width={48}
                    height={52}
                    className="h-12 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://www.safe.pharmacy/"
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  aria-label=".pharmacy Verified"
                  className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Image
                    src="/pharmacy.jpg"
                    alt=".pharmacy Verified"
                    width={130}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(grouped).map(([heading, links]) => (
            <div key={heading} className="col-span-1">
              <h3 className="font-whisker-bites text-[#ffea79] text-lg font-black tracking-wide uppercase mb-6">
                {heading}
              </h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-[#6cd1ff] font-extrabold text-xs tracking-wider transition-colors duration-150 uppercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PETBALE OPERATED BY: DOG BOWL BAKERY LLC. ALL RIGHTS RESERVED.
          </p>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest">
            Made with care for pets &amp; the planet 🌱
          </p>
        </div>

      </div>
    </footer>
  )
}
