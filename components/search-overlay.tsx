'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import type { SearchHit } from '@/app/api/search/route'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const DEBOUNCE_MS = 250
const MAX_DROPDOWN_HITS = 6

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Autofocus + reset when opened
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
    setQuery('')
    setHits([])
    setHasSearched(false)
    abortRef.current?.abort()
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Debounced fetch
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setHits([])
      setHasSearched(false)
      abortRef.current?.abort()
      return
    }
    const handle = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      setLoading(true)
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=${MAX_DROPDOWN_HITS}`,
          { signal: ctrl.signal }
        )
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = (await res.json()) as { hits: SearchHit[] }
        setHits(data.hits)
        setHasSearched(true)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('[search] fetch failed', err)
          setHits([])
          setHasSearched(true)
        }
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [query])

  const submit = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    onClose()
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-[640px] lg:max-w-[860px] xl:max-w-[1024px] z-[70]"
          >
            <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(query)
                }}
                className="flex items-center gap-3 p-4 border-b-2 border-black"
              >
                <Search className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search products, brands, ingredients..."
                  className="flex-1 bg-transparent outline-none font-sans font-extrabold text-sm md:text-base placeholder:text-zinc-400 text-black"
                />
                {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="w-9 h-9 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffea79] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim().length < 2 ? (
                  <div className="px-6 py-10 text-center text-xs font-black uppercase text-zinc-400 tracking-wider">
                    Start typing to search...
                  </div>
                ) : hits.length === 0 && hasSearched && !loading ? (
                  <div className="px-6 py-10 text-center text-xs font-black uppercase text-zinc-500 tracking-wider">
                    No products found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-zinc-100">
                      {hits.map((hit) => (
                        <li key={hit.slug}>
                          <Link
                            href={`/products/${hit.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAF6F0] transition-colors group"
                          >
                            <div className="w-14 h-14 flex-shrink-0 bg-white border border-black rounded-lg overflow-hidden flex items-center justify-center p-1">
                              {hit.imageSrc ? (
                                <img
                                  src={hit.imageSrc}
                                  alt={hit.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <span className="text-2xl">🐾</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-tbj-interval font-black text-sm text-black uppercase line-clamp-1 group-hover:text-[#ff990a] transition-colors">
                                {hit.name}
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">
                                {hit.brand}
                              </div>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0">
                              <span className="text-sm font-black text-black">${hit.price.toFixed(2)}</span>
                              {hit.comparePrice && hit.comparePrice > hit.price && (
                                <span className="text-[10px] font-bold text-zinc-400 line-through">
                                  ${hit.comparePrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {hits.length > 0 && (
                      <button
                        onClick={() => submit(query)}
                        className="w-full px-6 py-4 bg-[#ffea79] border-t-2 border-black font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        View all results for &ldquo;{query}&rdquo; →
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
