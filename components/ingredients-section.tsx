'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const qualities = [
  'Human-grade, farm-traceable meat',
  'Seasonal British vegetables',
  'Cold-pressed organic oils',
  'No artificial additives',
  'Ethically sourced, species-appropriate',
  'Tested for pathogens before dispatch',
]

export function IngredientsSection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'translateY(0)'
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.15 }
    )

    ;[leftRef.current, rightRef.current].forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = `opacity 0.8s ease ${i * 150}ms, transform 0.8s ease ${i * 150}ms`
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="py-24 lg:py-32 bg-linen overflow-hidden"
      aria-labelledby="ingredients-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <div ref={leftRef} className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[5/4]">
              <Image
                src="/images/ingredients-quality.png"
                alt="Fresh whole raw ingredients: grass-fed beef, salmon, and vegetables on a chopping board"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 bg-cream/95 backdrop-blur-sm rounded-xl p-5 shadow-lg max-w-[200px]">
                <p className="font-serif text-3xl font-semibold text-bark leading-none mb-1">98%</p>
                <p className="text-muted-foreground text-xs leading-relaxed">of customers saw visible improvement within 3 weeks</p>
              </div>
            </div>

            {/* Decorative element */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-2 border-copper/20 -z-10"
              aria-hidden="true"
            />
            <div
              className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-copper/10 -z-10"
              aria-hidden="true"
            />
          </div>

          {/* Right: Content */}
          <div ref={rightRef} className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-copper" aria-hidden="true" />
              <span className="text-copper text-xs font-medium tracking-[0.2em] uppercase">
                Quality Promise
              </span>
            </span>
            <h2
              id="ingredients-heading"
              className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-[1.1] text-foreground text-balance mb-6"
            >
              Every ingredient
              <br />
              <em className="font-semibold italic">earns its place.</em>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 font-light max-w-md">
              We obsess over provenance. Each ingredient is hand-selected from
              farms and suppliers who share our commitment to animal welfare and
              environmental responsibility.
            </p>

            <ul className="space-y-3 mb-10" aria-label="Quality standards">
              {qualities.map((q) => (
                <li key={q} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-4 h-4 text-copper mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-foreground/75 text-sm leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/ingredients"
              className="group inline-flex items-center gap-2 text-bark text-sm font-medium border-b border-bark pb-0.5 hover:gap-3 transition-all duration-200"
            >
              See our sourcing standards
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
