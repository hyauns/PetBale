/**
 * Self-check for feed categorization. No framework — run with Node 22:
 *   node --experimental-strip-types lib/feeds/categorization.test.ts
 * Covers the acceptance cases in docs/pet_feed_categorization_spec.md §7.
 */
import assert from 'node:assert/strict'
import {
  isBarkControlDevice,
  assignCategory,
  assignPetType,
  assignAdsEligibility,
} from './categorization.ts'

// §7 acceptance cases
assert.equal(assignCategory('Royal Canin Adult Dry Dog Food'), 'DogFood')
assert.equal(assignCategory('Blue Buffalo Dry Cat Food'), 'CatFood')
assert.equal(assignCategory('Yaheetech Cat Multi-Level Play House'), 'Furniture')
assert.equal(isBarkControlDevice('Sunbeam Ultrasonic Egg Dog Bark Control'), true)

// ads eligibility flows only from Dog/Cat food
assert.equal(assignAdsEligibility(assignCategory('Royal Canin Adult Dry Dog Food')), 'Ads-DogFood')
assert.equal(assignAdsEligibility(assignCategory('Blue Buffalo Dry Cat Food')), 'Ads-CatFood')
assert.equal(assignAdsEligibility(assignCategory('Yaheetech Cat Play House')), 'FreeOnly')

// bark-control patterns + a benign collar (must NOT be flagged)
for (const t of ['Anti-Bark Collar', 'Bark Deterrent Device', 'Pet Shock Collar']) {
  assert.equal(isBarkControlDevice(t), true, t)
}
assert.equal(isBarkControlDevice('Reflective Nylon Dog Collar'), false)

// retailer word order "...dog dry food" / "...cat dry food" / "puppy food"
assert.equal(assignCategory('Royal Canin Breed Health Nutrition Bulldog Adult Dog Dry Food'), 'DogFood')
assert.equal(assignCategory('Purina ONE Tender Selects Adult Cat Dry Food - Salmon'), 'CatFood')
assert.equal(assignCategory('Wellness Complete Health Puppy Food - Natural'), 'DogFood')
assert.equal(assignCategory('Blue Buffalo Tastefuls Kitten Dry Food - Chicken'), 'CatFood')
// not dog/cat food: containers + other-animal food stay out of DogFood/CatFood
assert.equal(assignCategory('Vittles Vault Stackable Pet Food Container'), 'Other')
assert.equal(assignCategory('Tetra TetraMin Tropical Flakes Fish Food'), 'Other') // not dog/cat
assert.equal(assignCategory('Kaytee Fiesta Parrot Food'), 'Other') // not dog/cat

// priority: food beats topper exclusion / treats
assert.equal(assignCategory('Chicken Food Topper for Dogs'), 'DogTreats')
assert.equal(assignCategory('Wholesome Dry Dog Food Topper'), 'DogTreats') // topper → not DogFood

// pet type
assert.equal(assignPetType('Royal Canin Adult Dry Dog Food'), 'Dog')
assert.equal(assignPetType('Blue Buffalo Dry Cat Food'), 'Cat')
assert.equal(assignPetType('Tetra Aquarium Goldfish Flakes'), 'Fish')

console.log('categorization self-check OK')
