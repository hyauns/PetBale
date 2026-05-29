import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 flex-wrap select-none ${className ?? ''}`}
    >
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center w-7 h-7 bg-white border border-black rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffea79] transition-colors"
      >
        <Home className="w-3.5 h-3.5 stroke-[2.5] text-black" />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 stroke-[2.5] text-black/40" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[10px] font-black uppercase tracking-wider text-zinc-700 hover:text-black hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-[10px] font-black uppercase tracking-wider text-black truncate max-w-[260px] inline-block"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
