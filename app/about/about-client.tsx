'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Shield, Award, Sparkles, Leaf, Star, Zap, ThumbsUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AboutContent, AboutValue } from '@/lib/shopify/content'

const FALLBACK_VALUES: AboutValue[] = [
  {
    title: 'PETS FIRST 🐶',
    description: 'We hand-pick trusted brands so you can shop quality pet care with confidence.',
    icon: 'Heart',
    colorHex: '#FF69B4',
    sortOrder: 1,
  },
  {
    title: 'AUTHENTIC & SEALED 🛡️',
    description: 'We ship brand-new, sealed products sourced through verified US supply channels.',
    icon: 'Shield',
    colorHex: '#6cd1ff',
    sortOrder: 2,
  },
  {
    title: 'PREMIUM BRANDS 🏆',
    description: 'Handpicked premium feeds, high-value dehydrated treats, and dust-free clumping clay litters.',
    icon: 'Award',
    colorHex: '#ffea79',
    sortOrder: 3,
  },
  {
    title: 'ECO-FRIENDLY 🌱',
    description: 'Thoughtful packaging and fast, reliable US shipping on every order.',
    icon: 'Sparkles',
    colorHex: '#4AD395',
    sortOrder: 4,
  },
]

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Shield, Award, Sparkles, Leaf, Star, Zap, ThumbsUp,
}

const DEFAULTS = {
  heroBadge: 'WHO WE ARE',
  heroTitle: 'WE LOVE PETS!',
  heroSubtitle: 'Founded in 2024, PetBale is a US-based pet supply retailer. We carry premium dog and cat food, treats, flea & tick, litter, and more from 100+ trusted pet brands.',
  heroEmoji: '🐾',
  establishedYear: '2024',
  establishedLabel: 'ESTABLISHED',
  storyTitle: 'OUR STORY & PHILOSOPHY 🚀',
  storyParagraph1: 'We believe that pets are more than just animals—they are members of the family who deserve great care. Finding the right food and supplies across dozens of brands can be overwhelming, so we make it easy to shop quality options from names you already trust.',
  storyParagraph2: "That is why we started PetBale. We curate a 100+ brand catalog from leading US pet nutrition makers — Blue Buffalo, Purina, Royal Canin, Hill's Science Diet, Wellness, and more — and ship every order brand-new, sealed, and within shelf life directly from our US-based brand and distributor fulfillment partners. PetBale is a brand operated by Dog Bowl Bakery LLC.",
  storyCtaLabel: 'SHOP OUR PRODUCTS',
  storyCtaUrl: '/shop',
  mascotEmojiBg: '🐱',
  mascotEmoji: '🐶',
  mascotTitle: 'PAW-PERFECT STANDARD',
  mascotQuote: 'BRAND-NEW, SEALED PRODUCTS AND FRIENDLY US SUPPORT ON EVERY ORDER.',
  valuesSectionTitle: 'OUR CORE PHILOSOPHIES',
}

export function AboutClient({ content }: { content?: AboutContent }) {
  const c = content
  const get = (k: keyof typeof DEFAULTS): string => (c && (c[k as keyof AboutContent] as string)) || DEFAULTS[k]
  const VALUES = (c && c.values.length > 0) ? c.values : FALLBACK_VALUES

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00000008 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Breadcrumb Capsule */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
          >
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Hero Banner Section */}
        <div className="w-full bg-[#6cd1ff] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">{get('heroEmoji')}</div>
          <div className="flex flex-col gap-2.5 text-center md:text-left max-w-2xl">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              {get('heroBadge')}
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              {get('heroTitle')}
            </h1>
            <p className="text-black/75 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
              {get('heroSubtitle')}
            </p>
          </div>
          <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[120px] select-none flex-shrink-0">
            <div className="text-2xl font-black">{get('establishedYear')}</div>
            <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">{get('establishedLabel')}</div>
          </div>
        </div>

        {/* 2-Column Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Left Story Column */}
          <div className="lg:col-span-7 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="font-whisker-bites text-3xl font-black uppercase text-black">
              {get('storyTitle')}
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm font-extrabold uppercase tracking-wider leading-relaxed">
              {get('storyParagraph1')}
            </p>
            <p className="text-zinc-600 text-xs sm:text-sm font-extrabold uppercase tracking-wider leading-relaxed">
              {get('storyParagraph2')}
            </p>

            <Link
              href={get('storyCtaUrl')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ffea79] text-black border border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all text-xs self-start"
            >
              <span>{get('storyCtaLabel')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Mascot Illustration Column */}
          <div className="lg:col-span-5 bg-[#FF69B4] border border-black rounded-2xl p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] text-8xl opacity-10 select-none pointer-events-none">{get('mascotEmojiBg')}</div>
            <span className="text-7xl mb-4 select-none animate-bounce">{get('mascotEmoji')}</span>
            <h3 className="font-whisker-bites text-2xl font-black text-black uppercase mb-2">
              {get('mascotTitle')}
            </h3>
            <p className="text-black/80 font-extrabold text-xs uppercase tracking-wider leading-relaxed max-w-[280px]">
              &ldquo;{get('mascotQuote')}&rdquo;
            </p>
          </div>

        </div>

        {/* Philosophy Core Values Grid */}
        <div className="mb-6">
          <h2 className="font-whisker-bites text-3xl font-black uppercase text-center mb-10">
            {get('valuesSectionTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val) => {
              const IconComponent = ICON_MAP[val.icon] ?? Heart
              return (
                <motion.div
                  key={val.title}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-black rounded-xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 flex flex-col gap-4 h-[220px]"
                >
                  <div
                    className={cn("w-10 h-10 rounded-lg flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]")}
                    style={{ backgroundColor: val.colorHex }}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-tbj-interval font-black text-sm text-black uppercase mb-1">{val.title}</h3>
                    <p className="text-zinc-500 font-extrabold text-[10px] uppercase tracking-wide leading-relaxed">{val.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}
