'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 15000, suffix: '+', label: 'Happy pets fed monthly', prefix: '' },
  { value: 98, suffix: '%', label: 'Customer satisfaction rate', prefix: '' },
  { value: 4.9, suffix: '/5', label: 'Average review score', prefix: '' },
  { value: 3, suffix: ' yrs', label: 'Of premium raw nutrition', prefix: '' },
]

function AnimatedNumber({ target, suffix, prefix, duration = 1800 }: { target: number; suffix: string; prefix: string; duration?: number }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCurrent(target * eased)
            if (progress < 1) requestAnimationFrame(animate)
            else setCurrent(target)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  const display = target % 1 !== 0 ? current.toFixed(1) : Math.round(current).toLocaleString()

  return (
    <span ref={ref} aria-label={`${prefix}${target}${suffix}`}>
      {prefix}{display}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section
      className="py-16 lg:py-20 bg-background border-y border-border"
      aria-labelledby="stats-heading"
    >
      <h2 id="stats-heading" className="sr-only">PetBale by the numbers</h2>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:px-8">
              <p className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-light text-bark leading-none mb-2">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </p>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
