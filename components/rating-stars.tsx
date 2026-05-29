interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
  lg: 'w-5 h-5',
} as const

export function RatingStars({ rating, size = 'sm', className }: RatingStarsProps) {
  const filledCount = Math.round(rating)
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ''}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < filledCount
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'white'}
            stroke={filled ? 'none' : 'currentColor'}
            strokeWidth={filled ? 0 : 1.5}
            className={`${SIZE_CLASS[size]} text-black`}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        )
      })}
    </div>
  )
}
