'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Package, ArrowLeft, ExternalLink, LogIn } from 'lucide-react'

// Customer-facing checkout/account domain (e.g. pay.petbale.com).
// Falls back to the technical myshopify.com endpoint used by the Storefront API
// so the page still works before the custom domain is wired in Shopify Admin.
const CUSTOMER_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  ''

export function TrackOrderClient() {
  const accountUrl = CUSTOMER_DOMAIN ? `https://${CUSTOMER_DOMAIN}/account` : '#'

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
              Sign in to your account to view every order, invoice, and live shipping update in one place.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left explainer */}
          <div className="lg:col-span-5 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="font-whisker-bites text-2xl font-black uppercase text-black">HOW IT WORKS 🐶</h2>

            <div className="flex flex-col gap-5 pt-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#ffea79] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <LogIn className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">STEP 1</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">SIGN IN SECURELY</p>
                  <p className="text-[11px] font-extrabold text-zinc-500 uppercase mt-1 leading-relaxed">
                    Tap the button and enter the email you ordered with.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF69B4] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">STEP 2</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">CHECK YOUR INBOX</p>
                  <p className="text-[11px] font-extrabold text-zinc-500 uppercase mt-1 leading-relaxed">
                    Shopify sends a secure one-tap login code — no password needed.
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

          {/* Right — sign-in CTA */}
          <div className="lg:col-span-7 bg-white border border-black rounded-2xl p-6 sm:p-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#6cd1ff] flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Package className="w-8 h-8 stroke-[2.5] text-black" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-whisker-bites text-2xl sm:text-3xl font-black uppercase text-black">YOUR ORDERS, ALL IN ONE PLACE</h2>
              <p className="text-[11px] sm:text-xs font-extrabold uppercase text-zinc-500 tracking-wider leading-relaxed max-w-md">
                Sign in to your secure PetBale account to view order history and live tracking.
              </p>
            </div>

            <motion.a
              href={accountUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-[#ffea79] hover:bg-black hover:text-white border-2 border-black rounded-xl text-black font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
              <span>SIGN IN TO VIEW ORDERS</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
            </motion.a>

            <p className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider leading-relaxed">
              You&rsquo;ll be taken to our secure Shopify-powered account portal.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
