/**
 * Maps the 6 UI category slugs to actual Shopify collection handles.
 *
 * Pet-specific Smart Collections were created on 2026-05-29 (rule:
 * tag:pet:X AND tag:category:Y), so the UI slugs now point to narrow,
 * pet-filtered collections instead of the broad PetSmart parents
 * (dog-supplies, cat-supplies) which mix food, toys, beds, etc.
 *
 * If a UI slug maps to multiple handles, the first one that resolves wins.
 */
export const CATEGORY_TO_SHOPIFY_HANDLES: Record<string, string[]> = {
  'dog-food': ['dog-food'], // smart collection: pet:Dog + category:Food (~892 products in catalog)
  'cat-food': ['cat-food'], // smart collection: pet:Cat + category:Food (~368)
  'dog-treats': ['dog-treats-all'], // smart collection: pet:Dog + category:Treats (~22)
  'cat-litter': ['cat-litter'], // smart collection: pet:Cat + category:Litter and Waste Disposal (~103)
  // No clean flea/tick category in PetSmart taxonomy — fall back to dog-health-wellness smart collection.
  // Currently the catalog only has ~1 product tagged "category:Flea and Tick".
  'flea-tick': ['dog-health-wellness'],
}

export function getShopifyHandlesForCategory(uiSlug: string): string[] {
  return CATEGORY_TO_SHOPIFY_HANDLES[uiSlug] ?? [uiSlug]
}
