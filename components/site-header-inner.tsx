'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import shopifyImageLoader from '@/lib/shopify-image-loader'
import { Menu, X, Search, User, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/use-cart'
import { SearchOverlay } from '@/components/search-overlay'
import { EMPTY_BRANDING, type HomeAnnouncement, type SiteBranding } from '@/lib/shopify/content'
import { MENU } from '@/lib/menu'

const DEFAULT_ANNOUNCEMENT: HomeAnnouncement = {
  text: 'Free shipping on orders $40+ · Ships within the contiguous U.S.',
  highlightLabel: '',
  codeValue: '',
}

const PET_ACCENTS: Record<string, string> = {
  dog: '#ffea79',
  cat: '#FF69B4',
  fish: '#6cd1ff',
  bird: '#4AD395',
  reptile: '#B19FFB',
}

export function SiteHeaderInner({
  announcement,
  branding,
}: {
  announcement?: HomeAnnouncement | null
  branding?: SiteBranding | null
}) {
  const ann = announcement ?? DEFAULT_ANNOUNCEMENT
  const b = branding ?? EMPTY_BRANDING
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileExpandedPet, setMobileExpandedPet] = useState<string | null>(null)
  const { cartCount, setIsCartOpen } = useCart()

  const activeSection = activeMega ? MENU.find((s) => s.id === activeMega) : null

  // Lock body scroll when mobile menu is open to prevent page scroll propagation
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [mobileOpen])

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileExpandedPet(null)
  }

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full">
      {/* Announcement Bar */}
      <div className="w-full bg-black py-2 px-4 flex items-center justify-center text-center z-50 border-b border-neutral-800">
        <span className="font-sans font-extrabold text-[10px] md:text-xs tracking-[0.2em] text-white uppercase select-none">
          {ann.text}{ann.codeValue ? <> <span className="text-[#ffea79]">&quot;{ann.codeValue}&quot;</span></> : null}
        </span>
      </div>

      {/* Capsule Header Wrapper + mega menu container */}
      <div
        className="w-full px-2 md:px-4 pt-3 pb-2 flex flex-col items-center"
        onMouseLeave={() => setActiveMega(null)}
      >
        <header className="relative w-full max-w-[98%] h-14 md:h-16 bg-white rounded-full border-2 border-black flex items-center justify-between px-6 shadow-md transition-all duration-300">

          {/* Left Section: Menu & Shop */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 text-black hover:scale-105 transition-transform"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
            <Link
              href="/shop"
              onMouseEnter={() => setActiveMega('dog')}
              className="font-sans font-extrabold text-sm md:text-base text-black tracking-wide hover:opacity-85 transition-opacity hidden sm:flex items-center gap-1"
            >
              Shop
              <ChevronDown className={`w-3.5 h-3.5 stroke-[2.5] transition-transform ${activeMega ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Overlapping Logo Badge (Narutomaki Mascot) */}
          <div className="absolute left-[24%] sm:left-[20%] md:left-[22%] top-auto -bottom-4 sm:-bottom-6 w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-md z-30 transition-transform hover:scale-110 duration-300 select-none overflow-hidden">
            {b.mascotLogoUrl ? (
              <Image
                src={b.mascotLogoUrl}
                alt={b.mascotLogoAlt}
                width={64}
                height={64}
                loader={shopifyImageLoader}
                className="w-7 h-7 sm:w-11 sm:h-11 md:w-13 md:h-13 object-contain"
                priority
              />
            ) : (
              <svg viewBox="0 0 100 100" fill="none" className="w-7 h-7 sm:w-11 sm:h-11 md:w-13 md:h-13" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" fill="white" stroke="black" strokeWidth="4" />
                <path
                  d="M50 50
                     A 6 6 0 0 1 44 44
                     A 12 12 0 0 1 56 38
                     A 18 18 0 0 1 68 50
                     A 24 24 0 0 1 44 74
                     A 30 30 0 0 1 20 50
                     A 36 36 0 0 1 50 14"
                  stroke="#FF69B4"
                  strokeWidth="9"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="38" cy="46" r="3.5" fill="black" />
                <circle cx="62" cy="46" r="3.5" fill="black" />
                <path d="M46 54 Q50 58 54 54" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
                <ellipse cx="32" cy="50" rx="4" ry="2.5" fill="#FFB6C1" />
                <ellipse cx="68" cy="50" rx="4" ry="2.5" fill="#FFB6C1" />
              </svg>
            )}
          </div>

          {/* Middle Section: Center Brand Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center select-none group z-20">
            {b.wordmarkLogoUrl ? (
              <Image
                src={b.wordmarkLogoUrl}
                alt={b.wordmarkLogoAlt}
                width={200}
                height={40}
                sizes="(min-width: 640px) 221px, 154px"
                loader={shopifyImageLoader}
                className="h-7 sm:h-10 w-auto object-contain group-hover:scale-102 transition-transform"
                priority
              />
            ) : (
              <span className="font-whisker-bites text-xl sm:text-4xl font-black text-black leading-none group-hover:scale-102 transition-transform uppercase tracking-tight">
                {b.wordmarkText}
              </span>
            )}
          </Link>

          {/* Right Section: Icons & Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 z-20">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-black hover:scale-105 transition-transform p-1 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
            <a
              href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'pay.petbale.com'}/account`}
              className="text-black hover:scale-105 transition-transform p-1 hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[2.5]" />
            </a>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer
                w-9 h-9 rounded-full
                sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:rounded-full sm:font-sans sm:font-extrabold sm:text-xs sm:md:text-sm sm:uppercase sm:tracking-wider sm:gap-2"
            >
              <ShoppingBag className="w-5 h-5 text-white sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffea79] text-black flex items-center justify-center text-[9px] font-black leading-none border border-black shadow-sm
                sm:static sm:w-5 sm:h-5 sm:text-[10px] sm:border-0 sm:shadow-none">
                {cartCount}
              </span>
            </button>
          </div>

        </header>

        {/* Mega Menu Panel — desktop only */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="hidden lg:block w-full max-w-[1680px] mt-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Pet tab strip */}
              <div className="flex items-stretch border-b-2 border-black bg-[#FAF6F0]">
                {MENU.map((s) => {
                  const active = s.id === activeSection.id
                  return (
                    <button
                      key={s.id}
                      onMouseEnter={() => setActiveMega(s.id)}
                      className="flex-1 py-4 px-5 font-whisker-bites text-xl font-black uppercase tracking-wide transition-colors cursor-pointer border-r-2 border-black last:border-r-0 flex items-center justify-center gap-2.5"
                      style={{ backgroundColor: active ? PET_ACCENTS[s.id] : 'transparent' }}
                    >
                      <span className="text-2xl">{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 p-8">
                {activeSection.columns.map((col) => (
                  <div key={col.title} className="flex flex-col gap-3.5">
                    <h3 className="font-whisker-bites text-lg font-black uppercase text-black tracking-wide pb-2.5 border-b-2 border-black/10">
                      {col.title}
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveMega(null)}
                            className="text-sm font-black uppercase text-zinc-700 hover:text-black hover:underline decoration-2 underline-offset-2 transition-colors block leading-snug"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="border-t-2 border-black/10 bg-[#FAF6F0] px-8 py-4 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-zinc-500 tracking-wider">
                  Premium {activeSection.label} essentials, fast US delivery
                </span>
                <Link
                  href={activeSection.shopAllHref}
                  onClick={() => setActiveMega(null)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#ffea79] hover:text-black transition-colors border border-black"
                >
                  Shop All {activeSection.label} {activeSection.emoji}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>

    {/* Mobile Drawer — rendered as a root-level sibling of the header so iOS
        Safari does not trap touch events inside the header's fixed/flex wrapper.
        Single scrollable container with a sticky header. */}
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black z-[60] lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[360px] bg-white border-r-2 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] z-[70] lg:hidden overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            {/* Sticky drawer header — stays pinned while the body scrolls under it */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b-2 border-black bg-[#FAF6F0]">
              <h2 className="font-whisker-bites text-xl font-black uppercase text-black tracking-wide">
                Shop
              </h2>
              <button
                onClick={closeMobile}
                className="p-1 rounded-lg border border-transparent active:border-black active:bg-[#ffea79] transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Drawer body */}
            <nav className="px-4 py-4 pb-36 flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={closeMobile}
                className="font-sans font-extrabold text-sm text-black uppercase tracking-wider py-3 px-3 bg-[#ffea79] border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors text-center"
              >
                Shop All 🛒
              </Link>

              {MENU.map((section) => {
                const expanded = mobileExpandedPet === section.id
                return (
                  <div key={section.id} className="border border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <button
                      onClick={() => setMobileExpandedPet(expanded ? null : section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between font-whisker-bites text-base font-black uppercase tracking-wide border-b border-black/10"
                      style={{ backgroundColor: expanded ? PET_ACCENTS[section.id] : '#FAF6F0' }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{section.emoji}</span>
                        <span>{section.label}</span>
                      </span>
                      {expanded ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                    </button>

                    {expanded && (
                      <div className="bg-white">
                        <div className="p-3 flex flex-col gap-3">
                          <Link
                            href={section.shopAllHref}
                            onClick={closeMobile}
                            className="text-[11px] font-black uppercase text-black hover:underline px-2 py-1.5 bg-[#FAF6F0] border border-black/20 rounded-lg text-center"
                          >
                            Shop All {section.label} {section.emoji}
                          </Link>
                          {section.columns.map((col) => (
                            <div key={col.title} className="flex flex-col gap-1.5">
                              <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">
                                {col.title}
                              </h4>
                              <ul className="flex flex-col gap-1">
                                {col.items.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      onClick={closeMobile}
                                      className="text-[12px] font-extrabold text-zinc-700 hover:text-black px-2 py-1.5 block leading-tight"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
