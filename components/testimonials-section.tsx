'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote: "Switching to PetBale was the best decision I made for Archie. His coat went from dull and patchy to absolutely gleaming within a month. I can't believe I waited so long.",
    author: 'Sarah M.',
    location: 'Edinburgh',
    pet: 'Labrador, 4 yrs',
    rating: 5,
    avatar: '/images/happy-dog.png',
    avatarIsdog: true,
  },
  {
    id: 2,
    quote: "Finally a raw food brand that actually tells you where everything comes from. Remy had terrible digestive issues for years — gone within two weeks of PetBale. Remarkable.",
    author: 'Tom K.',
    location: 'Bristol',
    pet: 'Border Collie, 2 yrs',
    rating: 5,
    avatar: null,
    avatarIsdog: false,
  },
  {
    id: 3,
    quote: "Our vet was skeptical at first, but even she noticed the difference. Luna&apos;s energy levels are through the roof, her teeth are cleaner, and she&apos;s visibly happier at mealtime.",
    author: 'Priya D.',
    location: 'London',
    pet: 'Bengal Cat, 3 yrs',
    rating: 5,
    avatar: null,
    avatarIsdog: false,
  },
]

const initials = (name: string) => name.split(' ').map(n => n[0]).join('')

export function TestimonialsSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

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
      { threshold: 0.1 }
    )

    const allEls = [headingRef.current, ...cardsRef.current]
    allEls.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="py-24 lg:py-32 bg-linen"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-copper" aria-hidden="true" />
            <span className="text-copper text-xs font-medium tracking-[0.2em] uppercase">Real Results</span>
            <span className="w-6 h-px bg-copper" aria-hidden="true" />
          </span>
          <h2
            id="testimonials-heading"
            className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-[1.1] text-foreground text-balance"
          >
            Pets don&apos;t lie.
            <br />
            <em className="font-semibold italic">Neither do their owners.</em>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => { cardsRef.current[i] = el }}
              className={`relative bg-cream rounded-xl p-8 border border-border/60 flex flex-col ${i === 1 ? 'md:mt-6' : ''}`}
            >
              <Quote
                className="w-8 h-8 text-copper/20 mb-5"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-copper text-copper" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-foreground/75 text-sm leading-relaxed flex-1 mb-6 font-light">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                {t.avatarIsdog && t.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={`${t.pet}`} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-bark flex items-center justify-center flex-shrink-0">
                    <span className="text-cream text-xs font-semibold">{initials(t.author)}</span>
                  </div>
                )}
                <div>
                  <p className="text-foreground text-sm font-medium">{t.author}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.location} &middot; {t.pet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
