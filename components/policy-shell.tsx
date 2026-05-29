import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import type { PolicyBanner } from '@/lib/shopify/pages'

interface PolicyShellProps {
  title: string
  banner: PolicyBanner
  bodyHtml?: string
  fallback?: React.ReactNode
}

export function PolicyShell({ title, banner, bodyHtml, fallback }: PolicyShellProps) {
  const hasShopifyBody = bodyHtml && bodyHtml.trim().length > 0
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#FAF6F0] text-black font-tbj-interval pb-24 pt-32 relative overflow-hidden select-none">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00000008 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black hover:bg-[#ffea79] transition-all select-none"
            >
              <span>BACK TO HOME</span>
            </Link>
          </div>

          <div
            className="w-full border-2 border-black rounded-2xl p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: banner.accentColor }}
          >
            <div className="absolute top-[-10px] right-[-10px] text-8xl opacity-10 select-none pointer-events-none">
              {banner.emoji}
            </div>
            <div className="flex flex-col gap-2.5 text-center md:text-left max-w-2xl">
              <span className="px-3.5 py-0.5 text-[9px] font-black uppercase border-2 border-black rounded bg-white text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] self-center md:self-start">
                {banner.badge}
              </span>
              <h1 className="font-whisker-bites text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
                {title}
              </h1>
              <p className="text-black/85 font-extrabold text-xs sm:text-sm uppercase tracking-wider leading-relaxed">
                {banner.subtitle}
              </p>
            </div>
            <div className="bg-white border-2 border-black px-6 py-4 rounded-xl text-center shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] min-w-[120px] select-none flex-shrink-0">
              <div className="text-sm font-black uppercase">{banner.lastUpdated}</div>
              <div className="text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider mt-0.5">
                LAST UPDATED
              </div>
            </div>
          </div>

          <div className="bg-white border border-black rounded-2xl p-8 sm:p-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {hasShopifyBody ? (
              <div
                className="policy-body flex flex-col gap-8 leading-relaxed text-zinc-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
                dangerouslySetInnerHTML={{ __html: bodyHtml! }}
              />
            ) : (
              fallback ?? (
                <p className="text-sm text-zinc-500 italic">
                  This policy is being prepared. Please check back shortly.
                </p>
              )
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
