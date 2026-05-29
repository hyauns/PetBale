'use client'

import { useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BREED_SIZES,
  EMPTY_FILTERS,
  FOOD_FORMS,
  LIFE_STAGES,
  PET_TYPES,
  PRICE_BUCKETS,
  filterVisibility,
  hasAnyFilter,
  reconcileFilters,
  serializeFilters,
  type SelectedFilters,
} from '@/lib/shopify/filters'
import type { ShopifyFacet } from '@/lib/shopify/queries'

export interface BrandOption {
  label: string
  count: number
}

export interface FilterSidebarProps {
  facets: ShopifyFacet[]
  selected: SelectedFilters
  brands?: BrandOption[]
  className?: string
}

function findFacet(facets: ShopifyFacet[], match: string): ShopifyFacet | undefined {
  const lc = match.toLowerCase()
  return facets.find(
    (f) => f.id.toLowerCase().includes(lc) || f.label.toLowerCase().includes(lc)
  )
}

export function FilterSidebar({ facets, selected, brands, className }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const brandFacet = findFacet(facets, 'vendor') ?? findFacet(facets, 'brand')
  const brandOptions: BrandOption[] = brandFacet
    ? brandFacet.values.map((v) => ({ label: v.label, count: v.count }))
    : brands ?? []

  const lifeStageFacet = findFacet(facets, 'life_stage')
  const breedSizeFacet = findFacet(facets, 'breed_size')
  const foodFormFacet = findFacet(facets, 'food_form')
  const flavorFacet =
    findFacet(facets, 'primary_flavor') ?? findFacet(facets, 'flavor')

  function apply(next: SelectedFilters) {
    const cleaned = reconcileFilters(next)
    const qs = serializeFilters(cleaned)
    // Preserve any non-filter params (e.g. sort)
    const preserved = new URLSearchParams(searchParams.toString())
    for (const k of ['pet', 'brand', 'price', 'stock', 'lifestage', 'breedsize', 'foodform', 'flavor', 'category']) {
      preserved.delete(k)
    }
    const merged = qs ? [qs, preserved.toString()].filter(Boolean).join('&') : preserved.toString()
    startTransition(() => {
      router.replace(merged ? `${pathname}?${merged}` : pathname, { scroll: false })
    })
  }

  const vis = filterVisibility(selected)
  const showFoodForm = vis.foodForm || !!foodFormFacet
  const showFlavor = !!flavorFacet
  const sortedFlavorOptions = useMemo(
    () => (flavorFacet ? flavorFacet.values.slice().sort((a, b) => b.count - a.count) : []),
    [flavorFacet]
  )

  return (
    <div className={`flex flex-col gap-5 ${className ?? ''}`}>
      {hasAnyFilter(selected) && (
        <button
          onClick={() => apply(EMPTY_FILTERS)}
          className="w-full py-2.5 bg-[#FAF6F0] hover:bg-black hover:text-white border border-black rounded-xl text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          Clear All Filters ✕
        </button>
      )}

      <Section title="Pet Type">
        <div className="flex flex-col gap-2.5">
          {PET_TYPES.map((pt) => {
            const active = selected.pet === pt
            return (
              <label key={pt} className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="radio"
                  name="pet"
                  className="sr-only peer"
                  checked={active}
                  onChange={() => apply({ ...selected, pet: active ? null : pt })}
                />
                <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center bg-white peer-checked:bg-[#ffea79] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
                <span className={`text-xs font-black uppercase leading-none ${active ? 'text-black' : 'text-zinc-700'}`}>
                  {pt}
                </span>
              </label>
            )
          })}
        </div>
      </Section>

      {brandOptions.length > 0 && (
        <Section title="Brand">
          <SearchableBrandList
            options={brandOptions}
            selected={selected.brand}
            onToggle={(b) => {
              const next = selected.brand.includes(b)
                ? selected.brand.filter((x) => x !== b)
                : [...selected.brand, b]
              apply({ ...selected, brand: next })
            }}
          />
        </Section>
      )}

      <Section title="Price">
        <div className="flex flex-wrap gap-2">
          {PRICE_BUCKETS.map((b) => {
            const active = selected.priceMin === b.min && selected.priceMax === b.max
            return (
              <button
                key={b.label}
                onClick={() =>
                  apply({
                    ...selected,
                    priceMin: active ? null : b.min,
                    priceMax: active ? null : b.max,
                  })
                }
                className={`px-3 py-1.5 text-[10px] font-black uppercase border border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${active ? 'bg-[#ffea79] text-black' : 'bg-white text-zinc-700 hover:bg-[#FAF6F0]'}`}
              >
                {b.label}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Availability">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-black uppercase text-zinc-700">In stock only</span>
          <button
            type="button"
            onClick={() => apply({ ...selected, inStock: !selected.inStock })}
            className={`relative w-10 h-5 rounded-full border border-black transition-colors ${selected.inStock ? 'bg-[#4AD395]' : 'bg-white'}`}
            aria-pressed={selected.inStock}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-black transition-transform ${selected.inStock ? 'translate-x-5' : ''}`}
            />
          </button>
        </label>
      </Section>

      {(vis.lifeStage || !!lifeStageFacet) && (
        <Section title="Life Stage">
          <CheckboxList
            options={lifeStageFacet ? lifeStageFacet.values : toCheckboxOptions(LIFE_STAGES)}
            selected={selected.lifeStage}
            onToggle={(v) =>
              apply({
                ...selected,
                lifeStage: selected.lifeStage.includes(v)
                  ? selected.lifeStage.filter((x) => x !== v)
                  : [...selected.lifeStage, v],
              })
            }
          />
        </Section>
      )}

      {(vis.breedSize || !!breedSizeFacet) && (
        <Section title="Breed Size">
          <CheckboxList
            options={breedSizeFacet ? breedSizeFacet.values : toCheckboxOptions(BREED_SIZES)}
            selected={selected.breedSize}
            onToggle={(v) =>
              apply({
                ...selected,
                breedSize: selected.breedSize.includes(v)
                  ? selected.breedSize.filter((x) => x !== v)
                  : [...selected.breedSize, v],
              })
            }
          />
        </Section>
      )}

      {showFoodForm && (
        <Section title="Food Form">
          <CheckboxList
            options={foodFormFacet ? foodFormFacet.values : toCheckboxOptions(FOOD_FORMS)}
            selected={selected.foodForm}
            onToggle={(v) =>
              apply({
                ...selected,
                foodForm: selected.foodForm.includes(v)
                  ? selected.foodForm.filter((x) => x !== v)
                  : [...selected.foodForm, v],
              })
            }
          />
        </Section>
      )}

      {showFlavor && flavorFacet && (
        <Section title="Flavor">
          <CheckboxList
            options={sortedFlavorOptions}
            selected={selected.flavor}
            onToggle={(v) =>
              apply({
                ...selected,
                flavor: selected.flavor.includes(v)
                  ? selected.flavor.filter((x) => x !== v)
                  : [...selected.flavor, v],
              })
            }
            truncateAt={8}
          />
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setOpen(!open)}
        className="font-whisker-bites text-base font-black uppercase text-black tracking-wide pb-2 border-b border-black/10 flex items-center justify-between cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CheckboxOption {
  label: string
  count?: number
}

function CheckboxList({
  options,
  selected,
  onToggle,
  truncateAt,
}: {
  options: readonly CheckboxOption[]
  selected: string[]
  onToggle: (v: string) => void
  /** When set, only show first N options and reveal a "Show all" button. */
  truncateAt?: number
}) {
  const [showAll, setShowAll] = useState(false)
  const showMore = truncateAt !== undefined && !showAll && options.length > truncateAt
  const visible = showMore ? options.slice(0, truncateAt) : options
  const scrollable = truncateAt !== undefined

  return (
    <div className={`flex flex-col gap-2.5 ${scrollable ? 'max-h-72 overflow-y-auto pr-1' : ''}`}>
      {visible.map((opt) => {
        const active = selected.includes(opt.label)
        const hasCount = opt.count !== undefined
        return (
          <label
            key={opt.label}
            className={`flex items-center cursor-pointer select-none ${hasCount ? 'gap-2.5' : 'gap-3'}`}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={active}
              onChange={() => onToggle(opt.label)}
            />
            <div className={`w-4 h-4 border border-black rounded flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${active ? 'bg-[#ffea79]' : 'bg-white'}`}>
              {active && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-black">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`font-black uppercase ${active ? 'text-black' : 'text-zinc-700'} ${hasCount ? 'text-[11px] leading-tight flex-1 truncate' : 'text-xs leading-none'}`}>
              {opt.label}
            </span>
            {hasCount && <span className="text-[9px] font-bold text-zinc-400">{opt.count}</span>}
          </label>
        )
      })}
      {showMore && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[10px] font-black uppercase text-[#ff990a] hover:underline cursor-pointer text-left"
        >
          Show all ({options.length})
        </button>
      )}
    </div>
  )
}

function toCheckboxOptions(labels: readonly string[]): CheckboxOption[] {
  return labels.map((label) => ({ label }))
}

function SearchableBrandList({
  options,
  selected,
  onToggle,
}: {
  options: BrandOption[]
  selected: string[]
  onToggle: (b: string) => void
}) {
  const [q, setQ] = useState('')
  const [showAll, setShowAll] = useState(false)
  const filtered = useMemo(() => {
    const lc = q.trim().toLowerCase()
    const items = lc
      ? options.filter((v) => v.label.toLowerCase().includes(lc))
      : options
    return items.slice().sort((a, b) => b.count - a.count)
  }, [options, q])
  const visible = showAll ? filtered : filtered.slice(0, 10)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search brands..."
          className="w-full pl-7 pr-2 py-1.5 text-[11px] font-bold border border-black rounded-lg outline-none focus:bg-[#FAF6F0]"
        />
      </div>
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {visible.map((v) => {
          const active = selected.includes(v.label)
          return (
            <label key={v.label} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={active}
                onChange={() => onToggle(v.label)}
              />
              <div className={`w-4 h-4 border border-black rounded flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${active ? 'bg-[#ffea79]' : 'bg-white'}`}>
                {active && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-black">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-[11px] font-black uppercase leading-tight flex-1 truncate text-zinc-700">
                {v.label}
              </span>
              <span className="text-[9px] font-bold text-zinc-400">{v.count}</span>
            </label>
          )
        })}
        {filtered.length === 0 && (
          <span className="text-[10px] font-bold text-zinc-400 italic">No matches</span>
        )}
      </div>
      {filtered.length > 10 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[10px] font-black uppercase text-[#ff990a] hover:underline cursor-pointer text-left"
        >
          Show all ({filtered.length})
        </button>
      )}
    </div>
  )
}

export interface ActiveFilterChipsProps {
  selected: SelectedFilters
}

export function ActiveFilterChips({ selected }: ActiveFilterChipsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  if (!hasAnyFilter(selected)) return null

  function apply(next: SelectedFilters) {
    const cleaned = reconcileFilters(next)
    const qs = serializeFilters(cleaned)
    const preserved = new URLSearchParams(searchParams.toString())
    for (const k of ['pet', 'brand', 'price', 'stock', 'lifestage', 'breedsize', 'foodform', 'flavor', 'category']) {
      preserved.delete(k)
    }
    const merged = qs ? [qs, preserved.toString()].filter(Boolean).join('&') : preserved.toString()
    startTransition(() => {
      router.replace(merged ? `${pathname}?${merged}` : pathname, { scroll: false })
    })
  }

  const chips: { label: string; onRemove: () => void }[] = []
  if (selected.pet) chips.push({ label: selected.pet, onRemove: () => apply({ ...selected, pet: null }) })
  for (const b of selected.brand) chips.push({ label: b, onRemove: () => apply({ ...selected, brand: selected.brand.filter((x) => x !== b) }) })
  if (selected.priceMin != null || selected.priceMax != null) {
    chips.push({
      label: `$${selected.priceMin ?? 0}–${selected.priceMax ?? '∞'}`,
      onRemove: () => apply({ ...selected, priceMin: null, priceMax: null }),
    })
  }
  if (selected.inStock) chips.push({ label: 'In stock', onRemove: () => apply({ ...selected, inStock: false }) })
  for (const v of selected.lifeStage) chips.push({ label: v, onRemove: () => apply({ ...selected, lifeStage: selected.lifeStage.filter((x) => x !== v) }) })
  for (const v of selected.breedSize) chips.push({ label: `${v} Breed`, onRemove: () => apply({ ...selected, breedSize: selected.breedSize.filter((x) => x !== v) }) })
  for (const v of selected.foodForm) chips.push({ label: v, onRemove: () => apply({ ...selected, foodForm: selected.foodForm.filter((x) => x !== v) }) })
  for (const v of selected.flavor) chips.push({ label: v, onRemove: () => apply({ ...selected, flavor: selected.flavor.filter((x) => x !== v) }) })

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 bg-white border border-black rounded-full text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none"
        >
          {c.label}
          <button
            onClick={c.onRemove}
            aria-label={`Remove ${c.label}`}
            className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-[#ff990a]"
          >
            <X className="w-2.5 h-2.5 stroke-[3]" />
          </button>
        </span>
      ))}
    </div>
  )
}
