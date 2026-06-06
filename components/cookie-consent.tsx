'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('petbale-cookie-consent')
    if (!consent) {
      // Show banner after 1.5 seconds delay for a premium loading feel
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('petbale-cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('petbale-cookie-consent', 'declined')
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[380px] bg-white border-2 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[100] font-tbj-interval select-none text-black flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ffea79] flex items-center justify-center border border-black text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-base">🍪</span>
              </div>
              <h3 className="font-whisker-bites text-sm font-black uppercase tracking-wide">Cookie Notice</h3>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss cookie notice"
              className="p-1 hover:bg-zinc-100 rounded border border-transparent active:border-black active:bg-[#ffea79] cursor-pointer"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[10px] font-extrabold uppercase text-zinc-600 tracking-wider leading-relaxed">
            We use cookies to personalize your shopping experience, remember cart contents (like weight packages), and monitor traffic under US privacy laws (CCPA/CPRA). Review our{" "}
            <Link href="/cookie-policy" className="text-[#6cd1ff] hover:underline font-black">Cookie Policy</Link> and{" "}
            <Link href="/privacy-policy" className="text-[#6cd1ff] hover:underline font-black">Privacy Policy</Link>.
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleDecline}
              className="flex-1 py-2.5 bg-zinc-100 hover:bg-black hover:text-white border border-black rounded-xl text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-center"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-2.5 bg-[#ffea79] hover:bg-black hover:text-white border border-black rounded-xl text-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-center"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
