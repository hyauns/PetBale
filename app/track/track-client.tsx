'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Mail, Package, ArrowLeft, ExternalLink } from 'lucide-react'

// Customer-facing checkout/account domain (e.g. pay.petbale.com).
// Falls back to the technical myshopify.com endpoint used by the Storefront API
// so the page still works before the custom domain is wired in Shopify Admin.
const CUSTOMER_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  ''
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function TrackOrderClient() {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setErrorMsg(null)
    const url = `https://${CUSTOMER_DOMAIN}/account?email=${encodeURIComponent(email.trim())}`
    window.location.href = url
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="w-full bg-[#6cd1ff] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">📦</div>
          <div className="flex flex-col gap-2.5 text-center md:text-left max-w-2xl">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              ORDER STATUS
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              TRACK YOUR ORDER
            </h1>
            <p className="text-black/85 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
              Enter the email used at checkout. We&rsquo;ll send a secure link to view all of your recent orders and tracking information.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left explainer */}
          <div className="lg:col-span-5 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="font-whisker-bites text-2xl font-black uppercase text-black">HOW IT WORKS 🐶</h2>

            <div className="flex flex-col gap-5 pt-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#ffea79] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">STEP 1</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">ENTER YOUR EMAIL</p>
                  <p className="text-[11px] font-extrabold text-zinc-500 uppercase mt-1 leading-relaxed">
                    Use the same email you placed the order with.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF69B4] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">STEP 2</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">CHECK YOUR INBOX</p>
                  <p className="text-[11px] font-extrabold text-zinc-500 uppercase mt-1 leading-relaxed">
                    We&rsquo;ll email you a secure one-tap login link.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#4AD395] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Package className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">STEP 3</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">VIEW & TRACK</p>
                  <p className="text-[11px] font-extrabold text-zinc-500 uppercase mt-1 leading-relaxed">
                    See order details and live shipping status.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF6F0] border border-black rounded-xl p-4 mt-2">
              <h4 className="text-xs font-black uppercase text-black mb-1.5">💡 NEED HELP?</h4>
              <p className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider leading-relaxed">
                EMAIL{' '}
                <Link href="/contact" className="text-black underline decoration-2 underline-offset-2 hover:text-[#FF69B4] transition-colors">
                  SUPPORT
                </Link>{' '}
                IF YOU CAN&rsquo;T FIND YOUR ORDER.
              </p>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-7 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="track-email" className="text-xs font-black uppercase text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  id="track-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMsg) setErrorMsg(null)
                  }}
                  required
                  placeholder="you@email.com"
                  className="w-full bg-[#FAF6F0] border border-black rounded-xl px-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all select-all"
                />
                {errorMsg && (
                  <p className="text-[10px] font-black uppercase text-[#FF69B4] mt-1">{errorMsg}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3.5 bg-[#ffea79] hover:bg-black hover:text-white border border-black rounded-xl text-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>FIND MY ORDER 🚀</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </motion.button>

              <p className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider leading-relaxed text-center mt-1">
                YOU&rsquo;LL BE REDIRECTED TO OUR SECURE ORDER PORTAL TO RECEIVE A LOGIN LINK.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
