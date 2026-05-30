'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube, Music2, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { HomeFooterLink, SiteBranding, TrustBadge } from '@/lib/shopify/content'
import { PaymentIcons } from './payment-icons'

// Local fallback images shipped in /public — used when a trust_badge metaobject
// entry has no uploaded image yet. Lookup by metaobject `name`.
const LOCAL_BADGE_FALLBACKS: Record<string, { src: string; width: number; height: number; className: string }> = {
  'LegitScript Certified': { src: '/legitscript.png', width: 48, height: 52, className: 'h-12 w-auto object-contain' },
  '.pharmacy Verified': { src: '/pharmacy.jpg', width: 130, height: 40, className: 'h-10 w-auto object-contain' },
}

const BUSINESS_INFO = {
  address: '3832 Fescue St, Clermont, FL 34714',
  email: 'cs@petbale.com',
  phone: '+1 (651) 377-4420',
  phoneTel: '+16513774420',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=3832+Fescue+St+Clermont+FL+34714',
}

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
    { label: 'Brands', href: '/brands' },
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

// "Your Privacy Choices" opt-out icon (CCPA/CPRA). Uses its own colors via the
// fill fallbacks so it stays the recognizable blue/white toggle on the footer.
function PrivacyChoicesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      height="22px"
      width="22px"
      role="img"
      aria-label="Your Privacy Choices"
      focusable="false"
      className="flex-shrink-0"
    >
      <path
        fill="var(--chirp-ui-elements-privacy-02, #fff)"
        d="M2 11.794A4.795 4.795 0 0 1 6.795 7h10.41a4.795 4.795 0 0 1 0 9.589H6.796A4.794 4.794 0 0 1 2 11.795Z"
      />
      <path
        fill="var(--chirp-ui-elements-privacy-primary, #06f)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.795 7.822h6.321l-2.1 7.945H6.794a3.973 3.973 0 0 1 0-7.945ZM2 11.794A4.795 4.795 0 0 1 6.795 7h10.41a4.795 4.795 0 0 1 0 9.589H6.796A4.794 4.794 0 0 1 2 11.795Zm3.94-.136 1.216 1.273 2.629-3.124a.41.41 0 0 1 .585 0 .412.412 0 0 1 0 .586l-2.921 3.412a.416.416 0 0 1-.59 0l-1.504-1.561a.412.412 0 0 1 0-.586.41.41 0 0 1 .585 0Z"
      />
      <path
        fill="var(--chirp-ui-elements-privacy-02, #fff)"
        d="M14.473 13.26a.42.42 0 0 0 .003.585c.16.16.433.156.585.003l1.485-1.464 1.461 1.46a.42.42 0 0 0 .585-.003.42.42 0 0 0 0-.585l-1.457-1.461 1.457-1.488a.417.417 0 0 0 0-.585.424.424 0 0 0-.585-.004l-1.46 1.492-1.486-1.488a.42.42 0 0 0-.585.003.424.424 0 0 0-.003.586l1.488 1.484-1.488 1.464Z"
      />
    </svg>
  )
}

export function SiteFooterInner({
  footerLinks: shopifyLinks,
  branding,
  trustBadges = [],
  cardBrands = [],
  digitalWallets = [],
}: {
  footerLinks?: HomeFooterLink[]
  branding?: SiteBranding | null
  trustBadges?: TrustBadge[]
  cardBrands?: string[]
  digitalWallets?: string[]
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

      <div className="w-full max-w-[96%] mx-auto px-6 lg:px-8 relative z-10">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
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

            {/* Trust badges — render from Shopify metaobject, fall back to bundled images by name */}
            {trustBadges.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">
                  Trusted by
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {trustBadges.map((badge) => {
                    const fallback = LOCAL_BADGE_FALLBACKS[badge.name]
                    const src = badge.imageUrl ?? fallback?.src
                    if (!src) return null
                    const inner = (
                      <Image
                        src={src}
                        alt={badge.imageAlt}
                        width={badge.imageUrl ? 130 : fallback?.width ?? 130}
                        height={badge.imageUrl ? 50 : fallback?.height ?? 50}
                        className={fallback?.className ?? 'h-12 w-auto object-contain'}
                      />
                    )
                    const wrapper = 'bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200'
                    return badge.link ? (
                      <a
                        key={badge.name}
                        href={badge.link}
                        target="_blank"
                        rel="noreferrer noopener nofollow"
                        aria-label={badge.name}
                        className={wrapper}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div key={badge.name} aria-label={badge.name} className={wrapper}>
                        {inner}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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

          {/* Contact column — NAP + conditional social */}
          <div className="col-span-2 lg:col-span-2">
            <h3 className="font-whisker-bites text-[#ffea79] text-lg font-black tracking-wide uppercase mb-6">
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-3">
              {[
                { Icon: Mail, label: `Email ${BUSINESS_INFO.email}`, href: `mailto:${BUSINESS_INFO.email}`, text: BUSINESS_INFO.email, bg: '#6cd1ff' },
                { Icon: Phone, label: `Call ${BUSINESS_INFO.phone}`, href: `tel:${BUSINESS_INFO.phoneTel}`, text: BUSINESS_INFO.phone, bg: '#ffea79' },
                { Icon: MapPin, label: `Find us at ${BUSINESS_INFO.address}`, href: BUSINESS_INFO.mapsUrl, text: BUSINESS_INFO.address, bg: '#4AD395', external: true },
              ].map(({ Icon, label, href, text, bg, external }, index) => (
                <div key={label} className="flex items-center gap-3.5">
                  <motion.a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer noopener' : undefined}
                    aria-label={label}
                    whileHover={{
                      scale: 1.1,
                      rotate: index % 2 === 0 ? -6 : 6,
                      translateY: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ '--hover-bg': bg } as React.CSSProperties}
                    className="w-11 h-11 rounded-full bg-white border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[var(--hover-bg)] transition-colors duration-200 flex-shrink-0"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </motion.a>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer noopener' : undefined}
                    className="text-white/80 hover:text-white text-sm font-extrabold uppercase tracking-wide leading-snug transition-colors"
                  >
                    {text}
                  </a>
                </div>
              ))}
            </address>

            {/* Conditional social icons — render only when URL is set in site_branding */}
            {(() => {
              const social: { Icon: typeof Mail; label: string; href: string; bg: string }[] = []
              if (branding?.socialInstagramUrl) social.push({ Icon: Instagram, label: 'Follow PetBale on Instagram', href: branding.socialInstagramUrl, bg: '#FF69B4' })
              if (branding?.socialFacebookUrl) social.push({ Icon: Facebook, label: 'Follow PetBale on Facebook', href: branding.socialFacebookUrl, bg: '#6cd1ff' })
              if (branding?.socialYoutubeUrl) social.push({ Icon: Youtube, label: 'Watch PetBale on YouTube', href: branding.socialYoutubeUrl, bg: '#FF69B4' })
              if (branding?.socialTiktokUrl) social.push({ Icon: Music2, label: 'Follow PetBale on TikTok', href: branding.socialTiktokUrl, bg: '#ffea79' })
              if (branding?.socialXUrl) social.push({ Icon: Twitter, label: 'Follow PetBale on X', href: branding.socialXUrl, bg: '#B19FFB' })
              if (social.length === 0) return null
              return (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <h4 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">Follow us</h4>
                  <div className="flex items-center gap-3 flex-wrap">
                    {social.map(({ Icon, label, href, bg }, index) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={label}
                        whileHover={{
                          scale: 1.1,
                          rotate: index % 2 === 0 ? -6 : 6,
                          translateY: -2,
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{ '--hover-bg': bg } as React.CSSProperties}
                        className="w-11 h-11 rounded-full bg-white border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[var(--hover-bg)] transition-colors duration-200"
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Your Privacy Choices (CCPA/CPRA data-sharing opt-out) */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <Link
                href="/data-sharing-opt-out"
                className="inline-flex items-center gap-2 text-white/60 hover:text-[#6cd1ff] font-extrabold text-xs tracking-wider transition-colors duration-150 uppercase"
              >
                <PrivacyChoicesIcon />
                <span>Your Privacy Choices</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright | payment icons | tagline */}
        <div className="mt-12 pt-8 border-t-2 border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest text-center sm:text-left order-2 sm:order-1">
            &copy; {new Date().getFullYear()} PETBALE OPERATED BY: DOG BOWL BAKERY LLC. ALL RIGHTS RESERVED.
          </p>
          <PaymentIcons
            cardBrands={cardBrands}
            digitalWallets={digitalWallets}
            className="order-1 sm:order-2 shrink-0"
          />
          <p className="text-white/40 text-xs font-black uppercase tracking-widest text-center sm:text-right order-3">
            Made with care for pets &amp; the planet 🌱
          </p>
        </div>

      </div>
    </footer>
  )
}
