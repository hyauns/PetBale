import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JsonLd } from '@/components/json-ld'
import { getFilteredCategoryProducts } from '@/lib/catalog'
import { parseFiltersFromSearch, hasAnyFilter } from '@/lib/shopify/filters'
import { CollectionClient } from './collection-client'
import { SITE_URL } from '@/lib/site'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, { title: string; description: string }> = {
  // UI category slugs
  'dog-food': {
    title: 'Dog Food',
    description: 'Premium dry & wet dog food from trusted brands. Free shipping over $40 — fast US delivery.',
  },
  'cat-food': {
    title: 'Cat Food',
    description: 'Wet, dry, and prescription cat food from premium brands, including veterinary diets.',
  },
  'dog-treats': {
    title: 'Dog Treats',
    description: 'Healthy dog treats, training rewards, and chews from the brands dogs love.',
  },
  'flea-tick': {
    title: 'Flea & Tick',
    description: 'Flea and tick prevention, treatment, and shampoos for dogs and cats.',
  },
  'cat-litter': {
    title: 'Cat Litter',
    description: 'Clumping, non-clumping, and natural cat litter from leading brands.',
  },

  // Dog smart collections
  'dog-dry-food': {
    title: 'Dry Dog Food',
    description: 'Premium kibble & dry dog food from Blue Buffalo, Purina, Royal Canin and more. Fast US delivery.',
  },
  'dog-vet-diets': {
    title: 'Veterinary Diet Dog Food',
    description: 'Prescription & therapeutic dog diets for weight, digestion, kidney, and skin support.',
  },
  'dog-fresh-frozen': {
    title: 'Fresh & Frozen Dog Food',
    description: 'Gently cooked, raw, and frozen dog food for real-ingredient nutrition. Shipped fast across the US.',
  },
  'dog-food-toppers': {
    title: 'Dog Food Toppers & Mixers',
    description: 'Broths, gravies, and meal mixers to make every bowl more tempting and nutritious.',
  },
  'dog-treats-all': {
    title: 'All Dog Treats',
    description: 'Every dog treat in one place — biscuits, chews, jerky, dental, and training rewards.',
  },
  'dog-treats-bones-chews': {
    title: 'Dog Bones & Chews',
    description: 'Long-lasting bones, bully sticks, and chews to keep dogs busy and teeth clean.',
  },
  'dog-treats-training': {
    title: 'Dog Training Treats',
    description: 'Small, low-calorie training treats for fast, reward-based learning and recall.',
  },
  'dog-treats-soft-chewy': {
    title: 'Soft & Chewy Dog Treats',
    description: 'Tender, soft-baked dog treats — easy on senior teeth and great for training.',
  },
  'dog-treats-dental': {
    title: 'Dog Dental Treats & Chews',
    description: 'Dental chews and treats that fight plaque, tartar, and bad breath between brushings.',
  },
  'dog-treats-jerky': {
    title: 'Dog Jerky Treats',
    description: 'High-protein meat jerky treats for dogs, made from real chicken, beef, and more.',
  },
  'dog-beds-furniture': {
    title: 'Dog Beds & Furniture',
    description: 'Orthopedic beds, bolster beds, and cozy dog furniture for every size and sleep style.',
  },
  'dog-crates-gates': {
    title: 'Dog Crates & Gates',
    description: 'Crates, kennels, pens, and pet gates for safe training, travel, and containment.',
  },
  'dog-collars-leashes': {
    title: 'Dog Collars & Leashes',
    description: 'Collars, harnesses, and leashes built for comfort, control, and durability.',
  },
  'dog-toys': {
    title: 'Dog Toys',
    description: 'Chew, fetch, plush, and puzzle toys to keep dogs active and mentally engaged.',
  },
  'dog-health-wellness': {
    title: 'Dog Health & Wellness',
    description: 'Supplements, dental care, grooming, and wellness essentials for a healthier dog.',
  },
  'dog-training-behavior': {
    title: 'Dog Training & Behavior',
    description: 'Training aids, clickers, deterrents, and calming solutions for better dog behavior.',
  },

  // Cat smart collections
  'cat-dry-food': {
    title: 'Dry Cat Food',
    description: 'Premium dry cat food & kibble from top brands. Complete nutrition, fast US delivery.',
  },
  'cat-wet-food': {
    title: 'Wet Cat Food',
    description: 'Pâtés, gravies, and shredded wet cat food cats crave — high moisture, real protein.',
  },
  'cat-kitten-food': {
    title: 'Kitten Food',
    description: 'High-protein wet & dry kitten food for healthy growth in the first year.',
  },
  'cat-vet-diets': {
    title: 'Veterinary Diet Cat Food',
    description: 'Prescription cat diets for urinary, kidney, digestive, and weight management.',
  },
  'cat-food-toppers': {
    title: 'Cat Food Toppers & Mixers',
    description: 'Broths, lickable treats, and mixers to boost flavor and hydration at mealtime.',
  },
  'cat-treats-all': {
    title: 'Cat Treats',
    description: 'Crunchy, soft, lickable, and dental cat treats from the brands cats love.',
  },
  'cat-litter-only': {
    title: 'Cat Litter',
    description: 'Clumping, non-clumping, clay, and natural cat litter for odor control and easy cleanup.',
  },
  'cat-litter-boxes': {
    title: 'Litter Boxes',
    description: 'Open, covered, and high-sided litter boxes for cleaner, lower-mess homes.',
  },
  'cat-waste-disposal': {
    title: 'Litter & Waste Disposal',
    description: 'Litter scoops, liners, deodorizers, and waste disposal systems for tidy cat care.',
  },
  'cat-furniture-towers': {
    title: 'Cat Trees & Towers',
    description: 'Cat trees, towers, and condos with perches and scratchers for climbing and rest.',
  },
  'cat-scratchers': {
    title: 'Cat Scratchers',
    description: 'Scratching posts, pads, and ramps that protect furniture and satisfy natural instincts.',
  },
  'cat-toys': {
    title: 'Cat Toys',
    description: 'Wands, balls, catnip, and interactive toys to keep cats playful and active.',
  },
  'cat-health-wellness': {
    title: 'Cat Health & Wellness',
    description: 'Supplements, dental, grooming, and wellness essentials for a healthier cat.',
  },

  // Mega menu broad handles
  'dog-supplies': {
    title: 'Dog Supplies',
    description: 'Everything for dogs — food, treats, toys, beds, collars, health, and training. Fast US delivery.',
  },
  'cat-supplies': {
    title: 'Cat Supplies',
    description: 'Everything for cats — food, litter, treats, toys, furniture, and wellness. Fast US delivery.',
  },
  'fish-supplies': {
    title: 'Fish & Aquarium Supplies',
    description: 'Fish food, tanks, filters, and aquarium essentials for freshwater and saltwater setups.',
  },
  'bird-supplies': {
    title: 'Bird Supplies',
    description: 'Bird food, cages, perches, and toys for parrots, finches, and feathered friends.',
  },
  'reptile-supplies': {
    title: 'Reptile Supplies',
    description: 'Reptile food, habitats, heating, and lighting for snakes, lizards, and turtles.',
  },
  'health-and-wellness': {
    title: 'Pet Health & Wellness',
    description: 'Supplements, dental care, flea & tick, and wellness essentials for dogs and cats.',
  },
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const meta = CATEGORY_LABELS[slug] ?? {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Shop ${slug.replace(/-/g, ' ')} at PetBale — premium brands, fast US delivery.`,
  }

  // Pagination: keep a self-referencing canonical so deep pages stay
  // discoverable instead of all collapsing onto page 1.
  const page = parsePage(sp.page)
  const url = page > 1 ? `/collections/${slug}?page=${page}` : `/collections/${slug}`

  // Faceted filter combinations are near-infinite — index only the clean
  // collection (and its numbered pages) to avoid crawl-budget bloat.
  const filtered = hasAnyFilter(parseFiltersFromSearch(sp))

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      title: meta.title,
      description: meta.description,
      url,
    },
  }
}

function brandsFromProducts(products: { brand: string }[]): { label: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const p of products) {
    if (!p.brand) continue
    counts[p.brand] = (counts[p.brand] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

const PAGE_SIZE = 24
const MAX_PRODUCTS = 240 // Cap the collection fetch at 10 pages worth of products.

function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = v ? parseInt(v, 10) : 1
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const selected = parseFiltersFromSearch(sp)
  const currentPage = parsePage(sp.page)

  const { products: allProducts, facets } = await getFilteredCategoryProducts(slug, selected, {
    first: MAX_PRODUCTS,
  })
  const brands = brandsFromProducts(allProducts)
  const totalCount = allProducts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const products = allProducts.slice(start, start + PAGE_SIZE)
  const categoryLabel = CATEGORY_LABELS[slug]?.title ?? slug.replace(/-/g, ' ')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${SITE_URL}/collections/${slug}` },
    ],
  }

  // ItemList of the products on the current page so crawlers see the listing
  // structure (positions continue across pagination). Mirrors /brands.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryLabel} | PetBale`,
    url: `${SITE_URL}/collections/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: start + i + 1,
        name: p.name,
        url: `${SITE_URL}/products/${p.slug}`,
      })),
    },
  }

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />
      <CollectionClient
        slug={slug}
        products={products}
        facets={facets}
        brands={brands}
        selectedFilters={selected}
        currentPage={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
      <SiteFooter />
    </>
  )
}
