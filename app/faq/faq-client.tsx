'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, Mail, Search } from 'lucide-react'
import type { FaqContent, FaqItem } from '@/lib/shopify/content'

const CATEGORY_ORDER = ['Shipping', 'Returns', 'Orders', 'Products', 'Pet Health', 'Support', 'Account']

const CATEGORY_META: Record<string, { emoji: string; accent: string }> = {
  Shipping: { emoji: '🚚', accent: '#6cd1ff' },
  Returns: { emoji: '↩️', accent: '#FF69B4' },
  Orders: { emoji: '🧾', accent: '#ffea79' },
  Products: { emoji: '🛍️', accent: '#4AD395' },
  'Pet Health': { emoji: '🐶', accent: '#B19FFB' },
  Support: { emoji: '💬', accent: '#ffb224' },
  Account: { emoji: '🔒', accent: '#FAF6F0' },
}

const DEFAULTS = {
  heroBadge: 'HELP CENTER',
  heroTitle: 'FREQUENTLY ASKED QUESTIONS',
  heroSubtitle: 'Quick answers about shipping, returns, payment, pet nutrition, and more. Can’t find what you’re looking for? Our team is just an email away.',
  heroEmoji: '❓',
  ctaTitle: 'STILL HAVE QUESTIONS?',
  ctaSubtitle: 'Our pet care specialists reply within one business day.',
  ctaButtonLabel: 'CONTACT SUPPORT',
  ctaButtonUrl: '/contact',
}

export function FaqClient({ content }: { content: FaqContent }) {
  const get = (k: keyof typeof DEFAULTS) => (content[k as keyof FaqContent] as string) || DEFAULTS[k]
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const grouped = useMemo(() => {
    const byCategory: Record<string, FaqItem[]> = {}
    for (const item of content.items) {
      const cat = CATEGORY_META[item.category] ? item.category : 'General'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push(item)
    }
    return byCategory
  }, [content.items])

  const availableCategories = useMemo(() => {
    const found = Object.keys(grouped)
    return CATEGORY_ORDER.filter((c) => found.includes(c)).concat(
      found.filter((c) => !CATEGORY_ORDER.includes(c))
    )
  }, [grouped])

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all: { cat: string; item: FaqItem }[] = []
    for (const cat of availableCategories) {
      if (activeCategory && cat !== activeCategory) continue
      for (const item of grouped[cat] || []) {
        if (q && !item.question.toLowerCase().includes(q) && !item.answer.toLowerCase().includes(q)) continue
        all.push({ cat, item })
      }
    }
    return all
  }, [grouped, availableCategories, activeCategory, query])

  const grouping = useMemo(() => {
    const out: { cat: string; items: FaqItem[] }[] = []
    for (const { cat, item } of visibleItems) {
      const last = out[out.length - 1]
      if (last && last.cat === cat) last.items.push(item)
      else out.push({ cat, items: [item] })
    }
    return out
  }, [visibleItems])

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="w-full bg-[#ffea79] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">{get('heroEmoji')}</div>
          <div className="flex flex-col gap-2.5 text-center md:text-left max-w-2xl">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              {get('heroBadge')}
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              {get('heroTitle')}
            </h1>
            <p className="text-black/85 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
              {get('heroSubtitle')}
            </p>
          </div>
          <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[120px] flex-shrink-0">
            <div className="text-2xl font-black">{content.items.length}</div>
            <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">ANSWERS</div>
          </div>
        </div>

        {/* Search + category chips */}
        <div className="bg-white border border-black rounded-2xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-8 flex flex-col gap-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 stroke-[2.5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full bg-[#FAF6F0] border border-black rounded-xl pl-11 pr-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3.5 py-1.5 text-[10px] font-black uppercase border border-black rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all ${
                activeCategory === null ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FAF6F0]'
              }`}
            >
              All ({content.items.length})
            </button>
            {availableCategories.map((cat) => {
              const meta = CATEGORY_META[cat] || { emoji: '📄', accent: '#FAF6F0' }
              const count = grouped[cat]?.length ?? 0
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(active ? null : cat)}
                  className="px-3.5 py-1.5 text-[10px] font-black uppercase border border-black rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                  style={{ backgroundColor: active ? meta.accent : 'white' }}
                >
                  <span>{meta.emoji}</span>
                  <span>{cat}</span>
                  <span className="text-[9px] font-bold text-zinc-500">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ accordion groups */}
        {grouping.length === 0 ? (
          <div className="bg-white border border-black rounded-2xl p-12 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-6xl mb-4 select-none inline-block animate-bounce">🔎</span>
            <h3 className="font-whisker-bites text-2xl font-black uppercase mt-4 mb-2 text-black">No matches</h3>
            <p className="text-black/60 text-xs font-extrabold uppercase">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {grouping.map(({ cat, items }) => {
              const meta = CATEGORY_META[cat] || { emoji: '📄', accent: '#FAF6F0' }
              return (
                <section key={cat} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-black flex items-center justify-center text-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: meta.accent }}
                    >
                      {meta.emoji}
                    </div>
                    <h2 className="font-whisker-bites text-2xl font-black uppercase text-black tracking-tight">
                      {cat}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {items.map((item) => {
                      const id = `${cat}::${item.question}`
                      const open = openIds.has(id)
                      return (
                        <div
                          key={id}
                          className="bg-white border border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <button
                            onClick={() => toggle(id)}
                            className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#FAF6F0] transition-colors"
                            aria-expanded={open}
                          >
                            <span className="font-black uppercase text-sm text-black leading-snug flex-1">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 flex-shrink-0 stroke-[2.5] text-black transition-transform ${
                                open ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden border-t border-black/10"
                              >
                                <div className="px-5 py-4 text-sm font-bold text-zinc-700 leading-relaxed whitespace-pre-wrap normal-case">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#FF69B4] border-2 border-black rounded-2xl p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 pointer-events-none">💌</div>
          <div className="flex flex-col gap-2 text-center md:text-left max-w-xl">
            <h3 className="font-whisker-bites text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
              {get('ctaTitle')}
            </h3>
            <p className="text-black/85 font-extrabold text-xs uppercase tracking-wider leading-relaxed">
              {get('ctaSubtitle')}
            </p>
          </div>
          <Link
            href={get('ctaButtonUrl')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black border border-black rounded-xl font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all text-xs flex-shrink-0"
          >
            <Mail className="w-4 h-4 stroke-[2.5]" />
            <span>{get('ctaButtonLabel')}</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
