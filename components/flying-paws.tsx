'use client'

import { motion } from 'framer-motion'

export interface ActivePaw {
  id: number
  startX: number
  startY: number
  delay: number
}

/**
 * Decorative flying-paw overlay for add-to-cart. Split out of CartProvider and
 * lazy-loaded (next/dynamic, ssr:false) so framer-motion stays out of the
 * shared client bundle that loads on every route — it's only pulled in on the
 * first add-to-cart click.
 */
export default function FlyingPaws({ paws }: { paws: ActivePaw[] }) {
  return (
    <>
      {paws.map((paw) => (
        <motion.div
          key={paw.id}
          initial={{
            position: 'fixed',
            left: paw.startX,
            top: paw.startY,
            x: -16,
            y: -16,
            scale: 0.5,
            opacity: 0,
            rotate: -15,
          }}
          animate={{
            left: [
              paw.startX,
              (paw.startX + (typeof window !== 'undefined' ? window.innerWidth - 60 : 0)) / 2,
              typeof window !== 'undefined' ? window.innerWidth - 60 : 0,
            ],
            top: [paw.startY, (paw.startY + 40) / 2 - 120, 40],
            scale: [0.5, 1.2, 0.1],
            opacity: [0, 1, 1, 0],
            rotate: [-15, 60, 140],
          }}
          transition={{
            duration: 1.15,
            ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease out path
            delay: paw.delay,
          }}
          className="z-[9999] pointer-events-none text-[#FF69B4] fill-[#FF69B4] stroke-black stroke-[1.5px] select-none"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8">
            <circle cx="6.5" cy="11.5" r="2" />
            <circle cx="10" cy="7.5" r="2.2" />
            <circle cx="14" cy="7.5" r="2.2" />
            <circle cx="17.5" cy="11.5" r="2" />
            <path d="M12 13.5c-1.8 0-3.5 1-4 2.8-.4 1.3.2 2.7 1.5 3.2 1 .4 3 .5 5 0 1.3-.5 1.9-1.9 1.5-3.2-.5-1.8-2.2-2.8-4-2.8z" />
          </svg>
        </motion.div>
      ))}
    </>
  )
}
