'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/use-cart'

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    checkoutUrl,
    isPending,
  } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer pointer-events-auto"
          />

          {/* Sliding Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[100vw] sm:w-[440px] bg-white border-l border-black z-50 shadow-[-4px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between select-none font-tbj-interval text-black"
          >
            
            {/* Header Block */}
            <div className="p-6 border-b border-black flex items-center justify-between bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-black" />
                <h2 className="font-whisker-bites text-2xl font-black tracking-tight uppercase">
                  Your Cart
                </h2>
              </div>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 bg-white border border-black rounded-lg flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffea79] transition-colors duration-150 cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            </div>

            {/* Scrollable Body / Cart List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5 hide-scrollbar bg-[#fafafa]/50">
              
              {cartItems.length === 0 ? (
                /* Empty Cart State */
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <span className="text-6xl mb-6 select-none animate-[bounce_3s_ease-in-out_infinite]">🐶</span>
                  <h3 className="font-whisker-bites text-2xl font-black uppercase mb-3">
                    Your cart is empty!
                  </h3>
                  <p className="text-black/60 text-xs font-extrabold uppercase max-w-[240px] leading-relaxed mb-8">
                    Looks like you haven't added any premium pet care products yet.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-[#ffea79] border border-black rounded-xl font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all duration-200 cursor-pointer text-sm"
                  >
                    Start Shopping 🛍️
                  </motion.button>
                </div>
              ) : (
                /* List of Cart Items */
                cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-black rounded-xl p-4 flex gap-4 relative shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-transform duration-150"
                  >
                    {/* Product Image Square Wrapper */}
                    <div className="w-20 h-20 bg-white border border-black rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 select-none">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Product Metadata Details */}
                    <div className="flex-grow flex flex-col justify-between pr-6">
                      <div>
                        <h4 className="font-tbj-interval font-black text-sm text-black leading-tight uppercase line-clamp-1">
                          {item.name}
                        </h4>
                        
                        {/* Size/Weight Pill Badge */}
                        <div className="inline-flex mt-1.5 px-2 py-0.5 border border-black rounded-full bg-[#6cd1ff]/20 text-[9px] font-black uppercase select-none">
                          {item.weight}
                        </div>
                      </div>

                      {/* Controls and Price line */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-black rounded-lg overflow-hidden h-8 bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-full bg-white hover:bg-black hover:text-white flex items-center justify-center border-r border-black font-black text-xs transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <span className="w-8 text-center text-xs font-black select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full bg-white hover:bg-black hover:text-white flex items-center justify-center border-l border-black font-black text-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Price display label */}
                        <span className="font-tbj-interval font-black text-sm text-black select-none">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item Trash Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-3 text-black/40 hover:text-red-500 hover:scale-105 transition-all duration-150 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary Block */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-black bg-white space-y-4 shadow-[0px_-4px_12px_rgba(0,0,0,0.03)]">
                {/* Calculations Row */}
                <div className="flex items-center justify-between">
                  <span className="font-tbj-interval font-extrabold text-sm text-black/60 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-whisker-bites text-3xl font-black text-black">
                    ${cartSubtotal}
                  </span>
                </div>
                
                {/* Free Shipping Alert Banner */}
                {cartSubtotal >= 40 ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-[#4AD395] border border-black rounded-xl text-black font-black text-[10px] uppercase text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none flex items-center justify-center gap-1.5"
                  >
                    <span>🎉</span>
                    <span>CONGRATS! YOU'VE UNLOCKED FREE SHIPPING!</span>
                    <span>📦</span>
                  </motion.div>
                ) : (
                  <div className="p-3 bg-[#ffea79]/10 border border-dashed border-black rounded-xl text-black/60 font-black text-[10px] uppercase text-center select-none flex items-center justify-center gap-1.5">
                    <span>🚚</span>
                    <span>ADD <strong className="text-black">${40 - cartSubtotal}</strong> MORE TO UNLOCK FREE SHIPPING!</span>
                  </div>
                )}

                {/* Info Text */}
                <p className="text-[9px] font-black text-black/40 uppercase leading-normal tracking-wide text-center">
                  * Shipping and taxes calculated at checkout.
                </p>

                {/* Oversized Neo-Brutalist Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!checkoutUrl || isPending}
                  onClick={() => {
                    if (checkoutUrl) window.location.href = checkoutUrl
                  }}
                  className="w-full py-4 bg-[#ffea79] text-black font-black uppercase text-base border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:border-black active:translate-x-0.5 active:translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Checkout</span>
                  <span>🚀</span>
                </motion.button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
