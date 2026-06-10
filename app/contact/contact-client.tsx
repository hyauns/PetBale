'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { sendContactMessage } from './actions'

export function ContactClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setErrorMsg(null)

    startTransition(async () => {
      const res = await sendContactMessage({ name, email, message })
      if (!res.ok) {
        setErrorMsg(res.error ?? 'Failed to send. Please try again.')
        return
      }
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSubmitted(false), 4000)
    })
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00000008 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Breadcrumb Capsule */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
          >
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Hero Banner Section */}
        <div className="w-full bg-[#FF69B4] border-2 border-black rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">📬</div>
          <div className="flex flex-col gap-2.5 text-center md:text-left max-w-2xl">
            <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
              GET IN TOUCH
            </span>
            <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
              CONTACT US
            </h1>
            <p className="text-black/85 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
              Have a question about your order, a product, or shipping? Send us a message — we reply within 1 business day.
            </p>
          </div>
          <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[120px] select-none flex-shrink-0">
            <div className="text-2xl font-black">&lt; 24H</div>
            <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">REPLY TIME</div>
          </div>
        </div>

        {/* Main 2-Column Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
            <h2 className="font-whisker-bites text-2xl font-black uppercase text-black">
              OUR CHANNELS 🐶
            </h2>
            <p className="text-zinc-500 font-extrabold text-xs uppercase tracking-wide leading-relaxed">
              Feel free to connect directly through our official hotlines and support emails. The Florida address below is our registered business and returns office.
            </p>

            <div className="flex flex-col gap-5 pt-2">

              {/* Email Channel */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#6cd1ff] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">EMAIL US</h3>
                  <p className="text-sm font-black text-black uppercase mt-1">cs@petbale.com</p>
                </div>
              </div>

              {/* Hotline Channel */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#ffea79] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">CALL HOTLINE</h3>
                  <p className="text-sm font-black text-black uppercase mt-1">+1 (888) 984-6318</p>
                </div>
              </div>

              {/* HQ Address Channel */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#B19FFB] flex items-center justify-center border border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <MapPin className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">BUSINESS &amp; RETURNS</h3>
                  <p className="text-sm font-black text-black uppercase mt-1 leading-snug">
                    3832 FESCUE ST, CLERMONT, FL 34714
                  </p>
                </div>
              </div>

            </div>

            {/* Working Hours box */}
            <div className="bg-[#FAF6F0] border border-black rounded-xl p-4 mt-2">
              <h4 className="text-xs font-black uppercase text-black mb-1.5">⏰ REPLY TIME</h4>
              <p className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider leading-relaxed">
                MON–FRI: 9:00 AM – 6:00 PM ET<br />
                WE REPLY WITHIN 1 BUSINESS DAY
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-[#4AD395] border border-black rounded-xl p-4 flex items-center gap-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <CheckCircle className="w-5 h-5 stroke-[2.5] flex-shrink-0" />
                  <span className="text-xs font-black uppercase">CONGRATS! YOUR MESSAGE HAS BEEN SENT SUCCESSFULLY! 💌</span>
                </motion.div>
              )}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-[#FF69B4] border border-black rounded-xl p-4 flex items-center gap-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <AlertCircle className="w-5 h-5 stroke-[2.5] flex-shrink-0" />
                  <span className="text-xs font-black uppercase">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name-input" className="text-xs font-black uppercase text-black">Full Name</label>
                <input
                  type="text"
                  id="name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-[#FAF6F0] border border-black rounded-xl px-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all select-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email-input" className="text-xs font-black uppercase text-black">Email Address</label>
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-[#FAF6F0] border border-black rounded-xl px-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all select-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message-input" className="text-xs font-black uppercase text-black">Your Message</label>
                <textarea
                  id="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Enter your query details..."
                  className="w-full bg-[#FAF6F0] border border-black rounded-xl px-4 py-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-zinc-400 focus:outline-none focus:bg-[#ffea79] transition-all select-all"
                />
              </div>

              <motion.button
                whileHover={isPending ? undefined : { scale: 1.02 }}
                whileTap={isPending ? undefined : { scale: 0.95 }}
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-[#ffea79] hover:bg-black hover:text-white border border-black rounded-xl text-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#ffea79] disabled:hover:text-black"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{isPending ? 'SENDING…' : 'SEND MESSAGE 🚀'}</span>
              </motion.button>
            </form>

          </div>

        </div>

      </div>
    </main>
  )
}
