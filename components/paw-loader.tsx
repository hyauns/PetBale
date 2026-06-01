import { cn } from '@/lib/utils'

/**
 * Brand paw print — same shape used by the add-to-cart fly animation in
 * hooks/use-cart.tsx (4 toes + pad). Kept here as a single source so the loader
 * and the cart effect stay visually identical.
 */
function PawShape() {
  return (
    <>
      <circle cx="6.5" cy="11.5" r="2" />
      <circle cx="10" cy="7.5" r="2.2" />
      <circle cx="14" cy="7.5" r="2.2" />
      <circle cx="17.5" cy="11.5" r="2" />
      <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
    </>
  )
}

/**
 * PawLoader — pet-themed loading spinner. A ring of `count` paw prints orbits
 * (CSS animation in globals.css) while each paw fades in sequence to read as
 * paws walking in a circle. Server-safe (no client hooks).
 */
export function PawLoader({
  size = 48,
  count = 4,
  className,
}: {
  size?: number
  /** Number of paws around the ring. */
  count?: 2 | 4
  className?: string
}) {
  const radius = size * 0.36
  const pawSize = size * 0.34

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('paw-loader relative inline-block', className)}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="paw-loader__paw absolute left-1/2 top-1/2 fill-[#FF69B4] stroke-black"
            style={{
              width: pawSize,
              height: pawSize,
              marginLeft: -pawSize / 2,
              marginTop: -pawSize / 2,
              transform: `rotate(${angle}deg) translateY(-${radius}px)`,
              strokeWidth: 1.2,
              // Stagger the fade so the trail chases around the ring.
              animationDelay: `${(i / count) * 1.1 - 1.1}s`,
            }}
          >
            <PawShape />
          </svg>
        )
      })}
    </span>
  )
}
