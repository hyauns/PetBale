'use client'

import React from 'react'

type ProgressiveBlurProps = React.ComponentPropsWithoutRef<'div'> & {
  blurIntensity?: number
  direction?: 'left' | 'right' | 'top' | 'bottom'
}

export function ProgressiveBlur({
  blurIntensity = 1,
  className = '',
  direction = 'left',
  ...props
}: ProgressiveBlurProps) {
  // Simulates a smooth progressive fade out blur effect towards the edges
  const hasCustomGradient = className.includes('bg-gradient') || className.includes('from-')
  
  const gradientClass = hasCustomGradient
    ? ''
    : (direction === 'left' 
        ? 'bg-gradient-to-r from-white via-white/80 to-transparent'
        : 'bg-gradient-to-l from-white via-white/80 to-transparent')
      
  return (
    <div className={`${gradientClass} ${className} pointer-events-none z-10`} {...props} />
  )
}
