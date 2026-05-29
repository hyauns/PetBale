export interface MenuItem {
  label: string
  href: string
}

export interface MenuColumn {
  title: string
  items: MenuItem[]
}

export interface MegaMenuSection {
  /** Key used as React key + identifier */
  id: string
  /** Top-level menu label shown in header */
  label: string
  /** Emoji prefix (e.g. "🐶") */
  emoji: string
  /** Direct link when user clicks the top-level label */
  shopAllHref: string
  /** Columns inside the mega menu panel */
  columns: MenuColumn[]
}

export const MENU: MegaMenuSection[] = [
  {
    id: 'dog',
    label: 'Dog',
    emoji: '🐶',
    shopAllHref: '/collections/dog-supplies',
    columns: [
      {
        title: 'Food',
        items: [
          { label: 'Dry Food', href: '/collections/dog-dry-food' },
          { label: 'Vet-Authorized Diets', href: '/collections/dog-vet-diets' },
          { label: 'Fresh & Frozen', href: '/collections/dog-fresh-frozen' },
          { label: 'Food Toppers', href: '/collections/dog-food-toppers' },
          { label: 'Shop All Dog Food', href: '/collections/dog-supplies?category=Food' },
        ],
      },
      {
        title: 'Treats',
        items: [
          { label: 'All Treats', href: '/collections/dog-treats-all' },
          { label: 'Bones, Bully Sticks & Chews', href: '/collections/dog-treats-bones-chews' },
          { label: 'Training Treats', href: '/collections/dog-treats-training' },
          { label: 'Soft & Chewy Treats', href: '/collections/dog-treats-soft-chewy' },
          { label: 'Dental Treats', href: '/collections/dog-treats-dental' },
          { label: 'Jerky Treats', href: '/collections/dog-treats-jerky' },
        ],
      },
      {
        title: 'Beds & Crates',
        items: [
          { label: 'Beds & Furniture', href: '/collections/dog-beds-furniture' },
          { label: 'Crates, Gates & Containment', href: '/collections/dog-crates-gates' },
        ],
      },
      {
        title: 'Walking & Training',
        items: [
          { label: 'Collars, Harnesses & Leashes', href: '/collections/dog-collars-leashes' },
          { label: 'Training & Behavior', href: '/collections/dog-training-behavior' },
          { label: 'Toys', href: '/collections/dog-toys' },
        ],
      },
      {
        title: 'Health',
        items: [
          { label: 'Health & Wellness', href: '/collections/dog-health-wellness' },
          { label: 'Shop All Dog', href: '/collections/dog-supplies' },
        ],
      },
    ],
  },
  {
    id: 'cat',
    label: 'Cat',
    emoji: '🐱',
    shopAllHref: '/collections/cat-supplies',
    columns: [
      {
        title: 'Food',
        items: [
          { label: 'Dry Food', href: '/collections/cat-dry-food' },
          { label: 'Wet Food', href: '/collections/cat-wet-food' },
          { label: 'Kitten Food', href: '/collections/cat-kitten-food' },
          { label: 'Vet-Authorized Diets', href: '/collections/cat-vet-diets' },
          { label: 'Food Toppers', href: '/collections/cat-food-toppers' },
          { label: 'Shop All Cat Food', href: '/collections/cat-supplies?category=Food' },
        ],
      },
      {
        title: 'Treats',
        items: [
          { label: 'All Treats', href: '/collections/cat-treats-all' },
        ],
      },
      {
        title: 'Litter & Waste',
        items: [
          { label: 'Cat Litter', href: '/collections/cat-litter-only' },
          { label: 'Litter Boxes', href: '/collections/cat-litter-boxes' },
          { label: 'Waste Disposal', href: '/collections/cat-waste-disposal' },
        ],
      },
      {
        title: 'Furniture & Toys',
        items: [
          { label: 'Furniture & Towers', href: '/collections/cat-furniture-towers' },
          { label: 'Scratchers', href: '/collections/cat-scratchers' },
          { label: 'Toys', href: '/collections/cat-toys' },
        ],
      },
      {
        title: 'Health',
        items: [
          { label: 'Health & Wellness', href: '/collections/cat-health-wellness' },
          { label: 'Shop All Cat', href: '/collections/cat-supplies' },
        ],
      },
    ],
  },
  {
    id: 'fish',
    label: 'Fish',
    emoji: '🐟',
    shopAllHref: '/collections/fish-supplies',
    columns: [
      {
        title: 'By Type',
        items: [
          { label: 'Betta', href: '/collections/betta' },
          { label: 'Cichlid', href: '/collections/cichlid' },
          { label: 'Goldfish', href: '/collections/goldfish' },
          { label: 'Koi & Pond', href: '/collections/koi-and-pond' },
          { label: 'Marine & Freshwater', href: '/collections/marine-and-freshwater' },
        ],
      },
      {
        title: 'Aquarium Care',
        items: [
          { label: 'Filters & Pumps', href: '/collections/filters-and-pumps' },
          { label: 'Filter Media', href: '/collections/filter-media' },
          { label: 'Cleaning & Water Care', href: '/collections/cleaning-and-water-care' },
          { label: 'Test Kits', href: '/collections/test-kits' },
          { label: 'Aquarium Substrate', href: '/collections/aquarium-substrate' },
        ],
      },
      {
        title: 'Decor',
        items: [
          { label: 'Decor, Gravel & Substrate', href: '/collections/decor-gravel-and-substrate' },
          { label: 'Ornaments', href: '/collections/ornaments' },
        ],
      },
      {
        title: 'Shop All',
        items: [
          { label: 'Fish Shops', href: '/collections/fish-shops' },
          { label: 'All Fish Supplies', href: '/collections/fish-supplies' },
        ],
      },
    ],
  },
  {
    id: 'bird',
    label: 'Bird',
    emoji: '🦜',
    shopAllHref: '/collections/bird-supplies',
    columns: [
      {
        title: 'By Type',
        items: [
          { label: 'Parakeet', href: '/collections/parakeet' },
          { label: 'Cockatiel', href: '/collections/cockatiel' },
          { label: 'Conure', href: '/collections/conure' },
          { label: 'Parrot', href: '/collections/parrot' },
          { label: 'Finch & Canary', href: '/collections/finch-and-canary' },
          { label: 'Wild Bird', href: '/collections/wild-bird' },
        ],
      },
      {
        title: 'Food',
        items: [
          { label: 'Pet Bird Food', href: '/collections/pet-bird-food' },
          { label: 'Wild Bird Food', href: '/collections/wild-bird-food' },
          { label: 'Seed & Suet', href: '/collections/seed-and-suet' },
        ],
      },
      {
        title: 'Cages & Perches',
        items: [
          { label: 'Cages & Stands', href: '/collections/cages-and-stands' },
          { label: 'Stands', href: '/collections/stands' },
          { label: 'Cage Covers', href: '/collections/cage-covers' },
          { label: 'Window Perches', href: '/collections/window-perches' },
        ],
      },
      {
        title: 'Care',
        items: [
          { label: 'Cleaning & Care', href: '/collections/cleaning-and-care' },
          { label: 'Deodorizers & Filters', href: '/collections/deodorizers-and-filters' },
          { label: 'All Bird Supplies', href: '/collections/bird-supplies' },
        ],
      },
    ],
  },
  {
    id: 'reptile',
    label: 'Reptile',
    emoji: '🦎',
    shopAllHref: '/collections/reptile-supplies',
    columns: [
      {
        title: 'By Type',
        items: [
          { label: 'Bearded Dragon', href: '/collections/bearded-dragon' },
          { label: 'Chameleon', href: '/collections/chameleon' },
          { label: 'Frog', href: '/collections/frog' },
          { label: 'Snake', href: '/collections/snake' },
          { label: 'Snakes, Turtles & More', href: '/collections/snakes-turtles-and-more' },
          { label: 'Turtle', href: '/collections/turtle' },
          { label: 'Live Reptiles', href: '/collections/live-reptiles' },
        ],
      },
      {
        title: 'Habitats',
        items: [
          { label: 'Terrariums', href: '/collections/terrariums' },
          { label: 'Habitat Decor', href: '/collections/habitat-decor' },
          { label: 'Habitat Accessories', href: '/collections/habitat-accessories' },
          { label: 'Houses & Pens', href: '/collections/houses-and-pens' },
          { label: 'Cages & Accessories', href: '/collections/cages-and-accessories' },
        ],
      },
      {
        title: 'Heating & Lighting',
        items: [
          { label: 'Heating & Lighting', href: '/collections/heating-and-lighting' },
          { label: 'Environmental Control', href: '/collections/environmental-control-and-lighting' },
          { label: 'Bulbs & Lamps', href: '/collections/bulbs-and-lamps' },
          { label: 'Light Fixtures', href: '/collections/light-fixtures' },
          { label: 'Humidity & Temp', href: '/collections/humidity-and-temperature-control' },
        ],
      },
      {
        title: 'Food & Feeding',
        items: [
          { label: 'Food & Feeding', href: '/collections/food-and-feeding' },
          { label: 'Feeders & Waterers', href: '/collections/feeders-and-waterers' },
          { label: 'All Reptile Supplies', href: '/collections/reptile-supplies' },
        ],
      },
    ],
  },
]
