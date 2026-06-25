/**
 * Title-based product categorization for the Google Merchant feed.
 *
 * Spec: docs/pet_feed_categorization_spec.md. Drives the custom_label_* slots:
 *   custom_label_0 = ads eligibility (Ads-DogFood / Ads-CatFood / FreeOnly)
 *   custom_label_3 = pet type
 *   custom_label_4 = detailed category
 *
 * Classification is intentionally title-driven (not tag-driven) so the
 * acceptance tests in the spec hold verbatim. Each function matches in priority
 * order: first pattern that hits wins.
 */

/** Spec §1a — devices that mis-match "dog barking sound" searches. Drop entirely. */
const BARK_CONTROL_RE =
  /bark control|anti-?\s?bark|ultrasonic bark|bark deterrent|bark stop|shock collar/i

export function isBarkControlDevice(title: string): boolean {
  return BARK_CONTROL_RE.test(title)
}

/** Spec §2 — custom_label_4. Priority order; first match wins. */
export function assignCategory(title: string): string {
  const t = title.toLowerCase()

  // 1: Food (focus)
  if (/dry dog food|wet dog food|dog food/.test(t) && !t.includes('topper')) return 'DogFood'
  if (/dry cat food|wet cat food|cat food|kitten food/.test(t) && !t.includes('topper'))
    return 'CatFood'

  // 2: Treats
  if (/dog treat|dog dental|food topper/.test(t) && !t.includes('cat')) return 'DogTreats'
  if (/cat treat|cat dental|catnip/.test(t)) return 'CatTreats'

  // 3: Health / supplement
  if (
    /supplement|vitamin|flea|tick|allergy|probiotic|medication|dewormer|ear cleaner|cleanser/.test(
      t,
    )
  )
    return 'Health'

  // 4: Pet-type specific
  if (/aquarium|fish tank|terrarium|filter/.test(t) || t.includes('gallon')) return 'Aquarium'
  if (/bird|cage|perch|flight/.test(t)) return 'Bird'

  // 5: Litter
  if (/litter|scoop|litter box/.test(t)) return 'Litter'

  // 6: Equipment
  if (/harness|leash|collar/.test(t) && !t.includes('bark')) return 'Harness'
  if (/bed|crate|kennel|gate|playpen|play house|playhouse/.test(t)) return 'Furniture'
  if (/shampoo|grooming|brush|nail clipper/.test(t)) return 'Grooming'
  if (/toy|scratcher|interactive|catnip/.test(t)) return 'Toys'

  return 'Other'
}

/** Spec §3 — custom_label_3. */
export function assignPetType(title: string): string {
  const t = title.toLowerCase()
  if (/ dog | dog-|dog | dogs| puppy/.test(t)) return 'Dog'
  if (/ cat | cat-|cat | cats| kitten/.test(t)) return 'Cat'
  if (/bird|parrot|canary|cockatiel/.test(t)) return 'Bird'
  if (/fish|aquarium|goldfish/.test(t)) return 'Fish'
  if (/rabbit|hamster|guinea pig|ferret/.test(t)) return 'SmallAnimal'
  return 'Other'
}

/** Spec §4 — custom_label_0. Only Dog/Cat food run paid ads; everything else free-only. */
export function assignAdsEligibility(category: string): string {
  if (category === 'DogFood') return 'Ads-DogFood'
  if (category === 'CatFood') return 'Ads-CatFood'
  return 'FreeOnly'
}
