'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'

export interface CategoryItem {
  id: string
  name: string
}

export interface SortOption {
  value: string
  label: string
}

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured 🔥' },
  { value: 'price-low', label: 'Price: Low to High 📈' },
  { value: 'price-high', label: 'Price: High to Low 📉' },
  { value: 'name', label: 'Alphabetical A-Z 🔤' },
]

export function MobileFilterDrawer({
  isOpen,
  onClose,
  title = 'Filters',
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 left-0 h-[100dvh] w-[80vw] max-w-[320px] bg-white border-r border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] z-50 p-6 flex flex-col gap-6 overflow-y-auto overscroll-contain lg:hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/10 flex-shrink-0">
              <h2 className="font-whisker-bites text-xl font-black uppercase text-black tracking-wide flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span>{title}</span>
              </h2>
              <button
                onClick={onClose}
                aria-label="Close filters"
                className="p-1 hover:bg-zinc-100 rounded-lg border border-transparent active:border-black active:bg-[#ffea79] transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="flex flex-col gap-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AccordionShell({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col border border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={onToggle}
        className="w-full bg-[#FAF6F0] p-4 font-whisker-bites text-sm font-black uppercase text-black flex items-center justify-between border-b border-black hover:bg-[#ffea79] transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MobileSortByAccordion({
  open,
  onToggle,
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
}: {
  open: boolean
  onToggle: () => void
  value: string
  onChange: (v: string) => void
  options?: SortOption[]
}) {
  return (
    <AccordionShell title="Sort By" open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group select-none">
            <input
              type="radio"
              name="mobile-sort"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center peer-checked:bg-[#ffea79] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-black opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-xs font-black uppercase text-zinc-700 peer-checked:text-black transition-colors leading-none">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </AccordionShell>
  )
}

export function MobileCategoriesAccordion({
  title = 'Collections',
  open,
  onToggle,
  categories,
  isChecked,
  onSelect,
}: {
  title?: string
  open: boolean
  onToggle: () => void
  categories: CategoryItem[]
  isChecked: (id: string) => boolean
  onSelect: (id: string) => void
}) {
  return (
    <AccordionShell title={title} open={open} onToggle={onToggle}>
      <div className="flex flex-col gap-3.5">
        {categories.map((cat) => {
          const checked = isChecked(cat.id)
          return (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onSelect(cat.id)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border border-black rounded bg-white peer-checked:bg-[#ffea79] transition-all flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase text-zinc-700 peer-checked:text-black group-hover:text-black transition-colors leading-none">
                {cat.name}
              </span>
            </label>
          )
        })}
      </div>
    </AccordionShell>
  )
}
