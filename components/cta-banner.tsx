'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { HomeCtaBanner } from '@/lib/shopify/content'

const DEFAULT: HomeCtaBanner = {
  subtitle: 'Shop with confidence',
  title: 'OUR DOUBLE GUARANTEE',
  description: 'We dissolve all the risk so you can focus on what matters most — keeping your beloved pets happy, active, and healthy.',
  card1Title: '100% Happiness Guarantee',
  card1Body: "If your dog or cat doesn't absolutely love the food, we'll swap it for another brand or refund your purchase. No questions asked, no hassle.",
  card1Bottom: '🔒 RISK-FREE BUYING',
  card2Title: 'Authentic & Sealed Products',
  card2Body: 'Every item we ship is brand-new, factory-sealed, and within shelf life.',
  card2Bottom: '📦 FACTORY SEALED',
  ctaButtonLabel: 'EXPLORE ALL BRANDS 🐾',
  ctaButtonUrl: '/#shop-categories',
}

export function CtaBanner({ content }: { content?: HomeCtaBanner | null }) {
  const c = content ?? DEFAULT
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      className="py-20 lg:py-24 bg-[#fafafa] border-t-3 border-black relative overflow-hidden select-none"
      aria-labelledby="cta-heading"
    >
      {/* Background Dot Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#0000000a 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }} 
      />

      {/* Background Grid Lines to enhance pop-art feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} 
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center z-10">
        
        {/* Animated Subtitle Tag with Wavy Underline */}
        <div className="inline-flex flex-col items-center mb-10">
          <span className="font-attahost text-4xl sm:text-5xl text-black tracking-wide font-normal select-none">
            {c.subtitle}
          </span>
          <div className="w-48 h-2 mt-2 select-none overflow-hidden relative">
            <motion.svg
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              className="w-full h-full stroke-black stroke-[2.5] fill-none"
            >
              <motion.path
                d="M0,5 Q12.5,0 25,5 T50,5 T75,5 T100,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.svg>
          </div>
        </div>

        {/* Bubbly Neo-brutalist Headline */}
        <h2
          id="cta-heading"
          className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase mb-4"
        >
          {c.title}
        </h2>

        {/* Clean Subheading */}
        <p className="text-black/70 text-xs sm:text-sm font-extrabold leading-relaxed mb-12 max-w-xl mx-auto uppercase tracking-wide">
          {c.description}
        </p>

        {/* 2 Double-Guarantee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-2">
          
          {/* Card 1: 100% Happiness Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ 
              rotate: -1,
              scale: 1.01,
              translateY: -4,
              boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)"
            }}
            className="bg-gradient-to-br from-[#ffea79] to-white border-3 border-black rounded-2xl p-8 sm:p-10 text-left flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            <div>
              {/* Badge Icon */}
              <div className="w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6 select-none">
                <Heart className="w-7 h-7 text-black fill-black" />
              </div>

              {/* Title */}
              <h3 className="font-whisker-bites text-2xl sm:text-3xl font-black text-black tracking-tight uppercase mb-4">
                {c.card1Title}
              </h3>

              {/* Body */}
              <p className="font-tbj-interval font-extrabold text-sm sm:text-base leading-relaxed text-black/85 uppercase">
                {c.card1Body}
              </p>
            </div>

            {/* Sticker/Sticker Element */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-black/20 flex items-center justify-between">
              <span className="text-xs font-black text-black/60 uppercase tracking-wider">{c.card1Bottom}</span>
              <div className="flex gap-1 items-center pointer-events-none select-none text-black fill-black">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <circle cx="6.5" cy="11.5" r="2" />
                  <circle cx="10" cy="7.5" r="2.2" />
                  <circle cx="14" cy="7.5" r="2.2" />
                  <circle cx="17.5" cy="11.5" r="2" />
                  <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5 -mt-1.5 rotate-[15deg]">
                  <circle cx="6.5" cy="11.5" r="2" />
                  <circle cx="10" cy="7.5" r="2.2" />
                  <circle cx="14" cy="7.5" r="2.2" />
                  <circle cx="17.5" cy="11.5" r="2" />
                  <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 2: 100% Authentic Brands */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            whileHover={{ 
              rotate: 1,
              scale: 1.01,
              translateY: -4,
              boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)"
            }}
            className="bg-gradient-to-br from-[#6cd1ff] to-white border-3 border-black rounded-2xl p-8 sm:p-10 text-left flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            <div>
              {/* Badge Icon */}
              <div className="w-14 h-14 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6 select-none">
                <ShieldCheck className="w-7 h-7 text-black fill-black/20" />
              </div>

              {/* Title */}
              <h3 className="font-whisker-bites text-2xl sm:text-3xl font-black text-black tracking-tight uppercase mb-4">
                {c.card2Title}
              </h3>

              {/* Body */}
              <p className="font-tbj-interval font-extrabold text-sm sm:text-base leading-relaxed text-black/85 uppercase">
                {c.card2Body}
              </p>
            </div>

            {/* Sticker/Sticker Element */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-black/20 flex items-center justify-between">
              <span className="text-xs font-black text-black/60 uppercase tracking-wider">{c.card2Bottom}</span>
              <div className="flex gap-1 items-center pointer-events-none select-none text-black fill-black">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <circle cx="6.5" cy="11.5" r="2" />
                  <circle cx="10" cy="7.5" r="2.2" />
                  <circle cx="14" cy="7.5" r="2.2" />
                  <circle cx="17.5" cy="11.5" r="2" />
                  <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5 -mt-1.5 rotate-[15deg]">
                  <circle cx="6.5" cy="11.5" r="2" />
                  <circle cx="10" cy="7.5" r="2.2" />
                  <circle cx="14" cy="7.5" r="2.2" />
                  <circle cx="17.5" cy="11.5" r="2" />
                  <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Action Button */}
        <div className="mt-16 flex justify-center">
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={c.ctaButtonUrl}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black text-sm sm:text-base font-black uppercase border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:border-black active:translate-x-0.5 active:translate-y-0.5 transition-all duration-300"
            >
              <span>{c.ctaButtonLabel}</span>
              <ArrowRight className="w-5 h-5 flex-shrink-0" />
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
