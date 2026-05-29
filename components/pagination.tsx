'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Optional override for the link base (defaults to current pathname). */
  basePath?: string
  /** Extra search params to preserve on every link (e.g. filters). */
  preserveParams?: Record<string, string | string[] | undefined>
}

/**
 * Build the array of page numbers to display, with `null` representing an ellipsis.
 * Always shows: first, last, current, and 1 page on either side of current.
 *   1 ... 4 [5] 6 ... 30
 */
function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | null)[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push(null)
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push(null)
  pages.push(total)
  return pages
}

export function Pagination({ currentPage, totalPages, basePath, preserveParams }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const base = basePath ?? pathname

  const buildHref = (page: number) => {
    const sp = new URLSearchParams(searchParams.toString())
    // Apply any caller-provided overrides
    if (preserveParams) {
      for (const [k, v] of Object.entries(preserveParams)) {
        if (v === undefined) sp.delete(k)
        else if (Array.isArray(v)) sp.set(k, v.join(','))
        else sp.set(k, v)
      }
    }
    if (page <= 1) sp.delete('page')
    else sp.set('page', String(page))
    const qs = sp.toString()
    return qs ? `${base}?${qs}` : base
  }

  const pages = buildPageList(currentPage, totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center flex-wrap gap-2 lg:gap-3 mt-10 mb-2"
    >
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label="Previous page"
          className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 bg-white border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs lg:text-sm font-black uppercase hover:bg-[#ffea79] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 bg-zinc-100 border border-black/20 rounded-xl text-xs lg:text-sm font-black uppercase text-zinc-300 cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === null ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="px-1 lg:px-2 text-sm lg:text-base font-black text-zinc-400 select-none"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className="inline-flex items-center justify-center min-w-[36px] lg:min-w-[42px] h-9 lg:h-11 px-2 bg-black text-white border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs lg:text-sm font-black"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-label={`Page ${p}`}
            className="inline-flex items-center justify-center min-w-[36px] lg:min-w-[42px] h-9 lg:h-11 px-2 bg-white border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs lg:text-sm font-black hover:bg-[#ffea79] transition-colors"
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label="Next page"
          className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 bg-white border border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs lg:text-sm font-black uppercase hover:bg-[#ffea79] transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 bg-zinc-100 border border-black/20 rounded-xl text-xs lg:text-sm font-black uppercase text-zinc-300 cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </span>
      )}
    </nav>
  )
}
