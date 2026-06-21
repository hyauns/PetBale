/**
 * Product handles excluded from the Google Merchant feed.
 *
 * These were disapproved by Google Merchant Center under the
 * "Healthcare and Medicine" policy (Pet Pharmaceuticals / Prescription drugs /
 * misleading healthcare claims) on 2026-06-12. Pet prescription, pharmacy, and
 * supplement products require LegitScript/NABP certification we don't hold, so
 * they can't be promoted. We drop the whole product (every variant) rather than
 * only the individually-flagged variants, otherwise the remaining variants get
 * disapproved on Google's next crawl.
 *
 * Source: product_issues_2026-06-12_11-18-30.csv (46 disapproved variants → 32 products).
 */
export const FEED_EXCLUDED_HANDLES: ReadonlySet<string> = new Set([
  // Hill's Science Diet cat food — "misleading claims"
  'hill-s-science-diet-senior-11-dry-cat-food-chicken',
  'hill-s-science-diet-adult-dry-cat-food-chicken',
  'hill-s-science-diet-no-corn-no-wheat-no-soy-adult-dry-cat-food-chicken',
  'hill-s-science-diet-perfect-digestion-adult-dry-cat-food-salmon',
  'hill-s-science-diet-adult-dry-cat-food-salmon-brown-rice',
  // IAMS cat food — "misleading claims"
  'iams-trade-proactive-health-indoor-adult-dry-cat-food-weight-hairball-care-chicken',
  'iams-trade-proactive-health-adult-dry-cat-food-urinary-tract-health-chicken',
  // Flea / dewormer — "pet pharmaceuticals"
  'capstar-trade-fast-acting-oral-flea-treatment-for-cats-2-25-lbs',
  'petarmor-7-way-de-wormer-for-medium-and-large-dogs-chewables',
  // Prescription NSAIDs — "prescription drugs" / "pet pharmaceuticals"
  'novox-caplets-for-dogs-100-mg',
  'novox-caplets-for-dogs-25-mg',
  'novox-caplets-for-dogs-75-mg',
  'rimadyl-caplets-25-mg',
  'rimadyl-caplets-75-mg',
  'rimadyl-carprofen-caplets-for-dogs-100-mg-30-60-or-180-caplets',
  // Dechra medicated shampoo/spray — "prescription drugs"
  'dechra-miconahex-triz-skin-health-shampoo-for-dogs-cats-horses',
  'dechra-miconahex-triz-spray-conditioner-for-dogs-cats-horses',
  // Joint / hip supplements — "pet pharmaceuticals"
  'nutramax-cosequin-dog-joint-health-supplement-with-glucosamine-chondroitin-60-120-count',
  'nutramax-cosequin-senior-dog-joint-health-supplement-with-glucosamine-soft-chews-120-count',
  'nutramax-cosequin-dog-maximum-strength-hip-joint-supplement-plus-msm-chewable-tabs-250-count',
  'nutramax-cosequin-dog-maximum-strength-hip-joint-supplement-plus-msm-chewable-tabs-132-count',
  'nutramax-cosequin-dog-hip-joint-supplement-with-msm-plus-omega-3s-soft-chews-60-or-120-count',
  // Calming / hemp chews — "pet pharmaceuticals"
  'only-natural-pet-hemp-calming-chews-for-dogs-stress-anxiety-relief-natural-flavor-60-120-ct',
  'pet-honesty-dog-hemp-calming-max-strength-soft-chews-stress-anxiety-relief-duck-flavor-90-ct',
  'pet-honesty-dog-hemp-calming-soft-chews-stress-anxiety-relief-natural-chicken-flavor-90-ct',
  // Other supplements — "misleading claims"
  'zesty-paws-8-in-1-multivitamin-bites-for-dogs-alaskomega-chicken-flavor-soft-chew-90-and-250-ct',
  'zesty-paws-8-in-1-multivitamin-bites-for-dogs-alaskomega-peanut-butter-flavor-soft-chew-90-count',
  'zesty-paws-dog-cardio-bites-support-cardiovascular-features-alaskomega-salmon-flavor-90ct',
  'pet-honesty-dog-skin-health-omega-supplement-with-salmon-oil-salmon-flavor-soft-chews-90-ct',
  'pet-wellbeing-milk-thistle-liquid-liver-dog-supplement',
  'native-pet-the-daily-supplement-powder-for-dogs-multivitamin-1-7-oz-7-oz-14-oz-21-oz-28-oz',
  'chew-heal-dog-immune-support-mushroom-complex-soft-chews-made-in-usa-90-count',
  // --- Hollywood Feed batch disapproved 2026-06-21 (products_2026-06-21_10-52-22) ---
  // Flea / tick / pharma — "Healthcare and Medicine: Pet Pharmaceuticals" (unfixable
  // without LegitScript/NABP cert). Foods in the same export are NOT excluded yet —
  // their disapproval reason wasn't in the export; pending a GMC product-issues report.
  'capstar-oral-flea-treatment-cat-2',
  'capstar-oral-flea-treatment-dog-2',
  'capstar-oral-flea-treatment-dog-25-1',
  'elanco-k9-advantix-ii-flea-tick-mosquito-prevention-small-dog',
  'elanco-seresto-flea-tick-collar-cats-and-kittens',
  'elanco-seresto-flea-tick-collar-large-dog',
  'elanco-seresto-flea-tick-collar-small-dog',
  'frontline-plus-flea-tick-treatment-x-large-dogs-89-132-pounds',
  // Supplements — pet pharmaceuticals / health-claim policy
  'alchemy-pet-activeextend-all-in-one-longevity-liquid-supplement-formula',
  'alchemy-pet-mobility-advanced-joint-support-liquid-supplement-formula-for-dogs',
  'progility-urinary-support-soft-chew-supplements-for-dogs',
  'prudence-essentials-calm-soft-chews-advanced-anxiety-stress-support-for-dogs',
])
