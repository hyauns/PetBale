'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HomeHero } from '@/lib/shopify/content'

const DEFAULT: HomeHero = {
  starsText: 'FREE US SHIPPING OVER $40',
  headlineLine1: 'PREMIUM PET CARE,',
  headlineLine2: 'TRUSTED BRANDS',
  subtitle: 'SHOP DOG FOOD, CAT FOOD, TREATS, FLEA & TICK, LITTER, AND PET ESSENTIALS FROM 100+ TRUSTED BRANDS — DELIVERED FAST ACROSS THE US.',
  ctaPrimaryLabel: 'SHOP DOG FOOD',
  ctaPrimaryUrl: '/collections/dog-food',
  ctaSecondaryLabel: 'SHOP CAT FOOD',
  ctaSecondaryUrl: '/collections/cat-food',
  floatingStickerText: 'FREE SHIPPING $40+',
  imageUrl: '/images/ramen-hero-products.webp',
  imageAlt: 'PetBale products',
}

export function HeroSection({ content }: { content?: HomeHero | null }) {
  const c = content ?? DEFAULT
  const leftContentRef = useRef<HTMLDivElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (leftContentRef.current) {
      leftContentRef.current.style.opacity = '0'
      leftContentRef.current.style.transform = 'translateX(-28px)'
      leftContentRef.current.style.transition = 'opacity 0.8s ease 100ms, transform 0.8s ease 100ms'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (leftContentRef.current) {
            leftContentRef.current.style.opacity = '1'
            leftContentRef.current.style.transform = 'translateX(0)'
          }
        })
      })
    }
    if (rightContentRef.current) {
      rightContentRef.current.style.opacity = '0'
      rightContentRef.current.style.transform = 'translateY(28px)'
      rightContentRef.current.style.transition = 'opacity 0.8s ease 300ms, transform 0.8s ease 300ms'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (rightContentRef.current) {
            rightContentRef.current.style.opacity = '1'
            rightContentRef.current.style.transform = 'translateY(0)'
          }
        })
      })
    }
  }, [])

  return (
    <section 
      className="relative min-h-[550px] md:min-h-[650px] lg:min-h-[720px] w-full flex items-center pt-36 sm:pt-28 md:pt-32 lg:pt-36 pb-12 md:pb-16 overflow-hidden bg-gradient-to-tr from-[#6CD1FF] via-[#B8ECFF] to-[#E3F7FF]" 
      aria-label="Hero"
    >
      <div className="max-w-[98%] mx-auto px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Spacer for desktop layout alignment */}
        <div className="hidden lg:block lg:col-span-2"></div>

        {/* Left Column: Copy & Actions */}
        <div ref={leftContentRef} className="lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left px-4 sm:px-8 lg:px-0 lg:pl-[5.33%]">
          
          {/* Stars & Verification */}
          <div className="flex items-center gap-1.5 mb-3 select-none">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF5C8A] text-[#FF5C8A]">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                </svg>
              ))}
            </div>
          </div>
          
          <span className="font-sans font-extrabold text-[11px] xs:text-xs md:text-sm text-black tracking-[0.2em] uppercase mb-4 leading-none">
            {c.starsText}
          </span>

          {/* Main Title */}
          <h1 className="font-whisker-bites font-black text-[clamp(2.2rem,7.5vw,4.5rem)] text-black leading-[0.9] uppercase tracking-tighter mb-5 flex flex-col items-center lg:items-start gap-1">
            <span className="whitespace-nowrap block">{c.headlineLine1}</span>
            <span className="whitespace-nowrap block">{c.headlineLine2}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans font-extrabold text-[13px] xs:text-sm md:text-base text-black/85 tracking-[0.1em] max-w-md mx-auto lg:mx-0 mb-8 uppercase leading-normal">
            {c.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-2 xxs:gap-2.5 xs:gap-3 sm:gap-4 w-full">
            <Link
              href={c.ctaPrimaryUrl}
              className="bg-[#ffea79] hover:bg-[#ffd835] hover:scale-[1.02] text-black font-sans font-extrabold text-[11px] xxs:text-[12px] xs:text-xs sm:text-sm uppercase tracking-wider px-3 xxs:px-4 xs:px-5 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md transition-all duration-200 border-2 border-black whitespace-nowrap"
            >
              {c.ctaPrimaryLabel}
            </Link>
            <Link
              href={c.ctaSecondaryUrl}
              className="bg-[#ffea79] hover:bg-[#ffd835] hover:scale-[1.02] text-black font-sans font-extrabold text-[11px] xxs:text-[12px] xs:text-xs sm:text-sm uppercase tracking-wider px-3 xxs:px-4 xs:px-5 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md transition-all duration-200 border-2 border-black whitespace-nowrap"
            >
              {c.ctaSecondaryLabel}
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Products Display */}
        <div ref={rightContentRef} className="lg:col-span-6 relative flex flex-col items-center justify-center lg:-ml-36 xl:-ml-44 translate-y-6 sm:translate-y-8 lg:translate-y-10">
          
          {/* Floating Leaf Left */}
          <div className="absolute left-[5%] top-[15%] z-20 animate-[bounce_4s_ease-in-out_infinite] select-none">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-[#57B757] stroke-black stroke-[3]">
              <path d="M50,10 C70,25 80,45 70,75 C55,80 35,70 20,50 C15,30 30,15 50,10 Z" />
              <path d="M50,10 C50,30 45,50 70,75" fill="none" stroke="black" strokeWidth="2" />
            </svg>
          </div>

          {/* Floating Red Chili Right */}
          <div className="absolute -right-[3%] top-[30%] z-20 animate-[bounce_3s_ease-in-out_infinite] select-none">
            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#E24C38] stroke-black stroke-[3] rotate-[45deg]">
              <path d="M20,50 C20,30 40,20 60,30 C70,35 80,50 60,70 C40,90 20,70 20,50 Z" />
            </svg>
          </div>

          {/* Floating Narutomaki Flower Left Bottom */}
          <div className="absolute left-[2%] bottom-[15%] z-20 animate-[spin_20s_linear_infinite] select-none">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
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
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Pop-art Jagged Cloud Sticker */}
          <div className="absolute -top-6 right-[8%] z-20 rotate-[12deg] drop-shadow-md hover:scale-105 transition-transform duration-300">
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-white stroke-black stroke-[3]">
                <path d="M50,15 C55,15 58,19 62,18 C66,17 69,12 73,14 C77,16 77,22 80,25 C83,28 89,28 90,32 C91,36 86,40 86,45 C86,50 91,54 90,58 C89,62 83,62 80,65 C77,68 77,74 73,76 C69,78 66,73 62,72 C58,71 55,75 50,75 C45,75 42,71 38,72 C34,73 31,78 27,76 C23,74 23,68 20,65 C17,62 11,62 10,58 C9,54 14,50 14,45 C14,40 9,36 10,32 C11,28 17,28 20,25 C23,22 23,16 27,14 C31,12 34,17 38,18 C42,19 45,15 50,15 Z" />
              </svg>
              <span className="relative z-10 font-sans font-black text-center text-xs sm:text-sm md:text-base text-black uppercase leading-none tracking-wider max-w-[75%] px-1 select-none flex flex-col items-center gap-1 -translate-y-1.5 md:-translate-y-2">
                {c.floatingStickerText.split(' ').map((word, idx) => (
                  <span key={idx} className="block whitespace-nowrap">{word}</span>
                ))}
              </span>
            </div>
          </div>

          {/* Main 3D Product Podium Image */}
          <div className="relative w-full max-w-[820px] aspect-[4/3] drop-shadow-2xl hover:scale-[1.01] transition-transform duration-500">
            <Image
              src={c.imageUrl ?? '/images/ramen-hero-products.webp'}
              alt={c.imageAlt || 'Hero image'}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </div>

    </section>
  )
}
