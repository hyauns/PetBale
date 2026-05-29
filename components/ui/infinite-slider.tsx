'use client'

import React from 'react'

type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  reverse?: boolean
  speed?: number
  speedOnHover?: number
}

export function InfiniteSlider({
  children,
  gap = 42,
  reverse = false,
  speed = 60,
  speedOnHover,
}: InfiniteSliderProps) {
  const duration = `${speed}s`
  const list = React.Children.toArray(children)
  
  return (
    <div className="w-full overflow-hidden flex relative select-none">
      <style>{`
        @keyframes infinite-slider-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - ${gap / 2}px)); }
        }
        .slider-container-animate {
          display: flex;
          align-items: center;
          width: max-content;
          animation: infinite-slider-scroll-left ${duration} linear infinite;
        }
        .slider-container-animate:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div 
        className="slider-container-animate"
        style={{
          gap: `${gap}px`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {list.map((item, index) => (
          <div key={`logo-original-${index}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
        {list.map((item, index) => (
          <div key={`logo-dup-${index}`} className="flex-shrink-0" aria-hidden="true">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
