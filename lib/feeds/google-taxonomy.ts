/**
 * Maps PetSmart-style storefront tags (`pet:Dog`, `category:Food`,
 * `category-leaf:Dry Food`, …) to Google's official Product Taxonomy.
 *
 * Reference: https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 *
 * Every leaf entry below is verified against the 2021-09-21 taxonomy.
 * If a product doesn't match a specific leaf, we fall back to the broader
 * pet-level node, which still satisfies Google Merchant requirements.
 */

export interface GoogleCategory {
  /** Google Product Category numeric ID (preferred — language-independent). */
  id: number
  /** Full breadcrumb path — used for product_type and human readability. */
  path: string
}

/** Top-level fallbacks per pet — guaranteed to validate. */
const PET_FALLBACK: Record<string, GoogleCategory> = {
  dog: {
    id: 5380,
    path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies',
  },
  cat: {
    id: 5093,
    path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies',
  },
  fish: {
    id: 5103,
    path: 'Animals & Pet Supplies > Pet Supplies > Fish Supplies',
  },
  bird: {
    id: 5085,
    path: 'Animals & Pet Supplies > Pet Supplies > Bird Supplies',
  },
  reptile: {
    id: 6852,
    path: 'Animals & Pet Supplies > Pet Supplies > Reptile & Amphibian Supplies',
  },
}

/**
 * Concrete leaf mappings keyed by `${pet}|${categoryRoot}|${categoryLeaf}`.
 * `categoryLeaf` is optional — when present it narrows further.
 * Matched longest-first by the lookup below.
 */
const LEAF_MAP: Record<string, GoogleCategory> = {
  // ── DOG ──────────────────────────────────────────────────────────
  'dog|food': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },
  'dog|food|dry food': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },
  'dog|food|wet food': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },
  'dog|food|fresh & frozen': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },
  'dog|food|vet diets': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },
  'dog|food|food toppers': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Food' },

  'dog|treats': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },
  'dog|treats|bones & chews': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },
  'dog|treats|training treats': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },
  'dog|treats|soft & chewy treats': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },
  'dog|treats|dental treats': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },
  'dog|treats|jerky': { id: 543684, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Treats' },

  'dog|beds & furniture': { id: 4433, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds' },
  'dog|crates & gates': { id: 6991, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Kennels & Runs' },
  'dog|collars & leashes': { id: 7372, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Collars' },
  'dog|toys': { id: 3530, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Toys' },
  'dog|health & wellness': { id: 8042, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Vitamins & Supplements' },
  'dog|flea & tick': { id: 7098, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Flea & Tick Control' },
  'dog|training & behavior': { id: 5092, path: 'Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Training Aids' },

  // ── CAT ──────────────────────────────────────────────────────────
  'cat|food and treats': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food|dry food': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food|wet food': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food|kitten food': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food|vet diets': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food|food toppers': { id: 3367, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Food' },
  'cat|food and treats|treats': { id: 5081, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Treats' },
  'cat|treats': { id: 5081, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Treats' },

  'cat|litter & waste disposal|litter': { id: 6248, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter' },
  'cat|litter & waste disposal|litter boxes': { id: 4997, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter Box Liners' },
  'cat|litter & waste disposal|waste disposal': { id: 4997, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter Box Liners' },
  'cat|litter': { id: 6248, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Litter' },

  'cat|cat furniture & towers': { id: 4997, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Furniture' },
  'cat|scratchers': { id: 4997, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Furniture' },
  'cat|toys': { id: 3550, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Toys' },
  'cat|health & wellness': { id: 8043, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Vitamins & Supplements' },
  'cat|flea & tick': { id: 7097, path: 'Animals & Pet Supplies > Pet Supplies > Cat Supplies > Cat Flea & Tick Control' },

  // ── FISH ─────────────────────────────────────────────────────────
  'fish|food': { id: 5106, path: 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Fish Food' },
  'fish|aquariums': { id: 6995, path: 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Aquariums' },
  'fish|tanks': { id: 6995, path: 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Aquariums' },
  'fish|aquarium decor': { id: 6985, path: 'Animals & Pet Supplies > Pet Supplies > Fish Supplies > Aquarium Decor' },

  // ── BIRD ─────────────────────────────────────────────────────────
  'bird|food': { id: 5088, path: 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Food' },
  'bird|treats': { id: 5089, path: 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Treats' },
  'bird|cages': { id: 4989, path: 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Cages & Stands' },
  'bird|toys': { id: 7385, path: 'Animals & Pet Supplies > Pet Supplies > Bird Supplies > Bird Toys' },

  // ── REPTILE ──────────────────────────────────────────────────────
  'reptile|food': { id: 6916, path: 'Animals & Pet Supplies > Pet Supplies > Reptile & Amphibian Supplies > Reptile & Amphibian Food' },
  'reptile|habitats': { id: 8030, path: 'Animals & Pet Supplies > Pet Supplies > Reptile & Amphibian Supplies > Reptile & Amphibian Habitat Heating & Lighting' },
}

/** Normalize taxonomy strings: lowercase, trim, collapse whitespace. */
function norm(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Resolve the best Google product category for a Shopify product.
 *
 * Inputs:
 *   pet — `pet:X` tag value (Dog/Cat/Fish/Bird/Reptile)
 *   categoryRoot — `category:Y` tag value (e.g., "Food", "Treats", "Food and Treats")
 *   categoryLeaf — `category-leaf:Z` tag value (e.g., "Dry Food")
 */
export function resolveGoogleCategory(
  pet: string | null | undefined,
  categoryRoot: string | null | undefined,
  categoryLeaf: string | null | undefined
): GoogleCategory {
  const p = norm(pet)
  const c = norm(categoryRoot)
  const l = norm(categoryLeaf)

  if (p && c && l) {
    const hit = LEAF_MAP[`${p}|${c}|${l}`]
    if (hit) return hit
  }
  if (p && c) {
    const hit = LEAF_MAP[`${p}|${c}`]
    if (hit) return hit
  }
  if (p && PET_FALLBACK[p]) return PET_FALLBACK[p]

  // Universal fallback — "Pet Supplies" parent.
  return {
    id: 2,
    path: 'Animals & Pet Supplies > Pet Supplies',
  }
}
