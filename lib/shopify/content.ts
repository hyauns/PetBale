import { shopifyFetch } from './client'

export interface HomeAnnouncement {
  text: string
  highlightLabel: string
  codeValue: string
}

export interface HomeHero {
  starsText: string
  headlineLine1: string
  headlineLine2: string
  subtitle: string
  ctaPrimaryLabel: string
  ctaPrimaryUrl: string
  ctaSecondaryLabel: string
  ctaSecondaryUrl: string
  floatingStickerText: string
  imageUrl: string | null
  imageAlt: string
}

export interface HomeLogo {
  imageUrl: string | null
  alt: string
  sortOrder: number
}

export interface HomeFeature {
  number: number
  title: string
  imageUrl: string | null
  imageAlt: string
  sortOrder: number
}

export interface HomeCategory {
  name: string
  iconEmoji: string
  imageUrl: string | null
  targetSlug: string
  accentColor: string
  popular: boolean
  ctaText: string
  sortOrder: number
}

export interface HomeCtaBanner {
  subtitle: string
  title: string
  description: string
  card1Title: string
  card1Body: string
  card1Bottom: string
  card2Title: string
  card2Body: string
  card2Bottom: string
  ctaButtonLabel: string
  ctaButtonUrl: string
}

export interface HomeFooterLink {
  group: string
  label: string
  url: string
  sortOrder: number
}

export interface HomeContent {
  announcement: HomeAnnouncement | null
  hero: HomeHero | null
  ctaBanner: HomeCtaBanner | null
  logos: HomeLogo[]
  features: HomeFeature[]
  categories: HomeCategory[]
  footerLinks: HomeFooterLink[]
}

interface MetaField {
  key: string
  value: string | null
  reference: { image?: { url: string; altText: string | null } } | null
}

interface MetaobjectShape {
  handle: string
  fields: MetaField[]
}

function fieldMap(fields: MetaField[]): Record<string, MetaField> {
  const m: Record<string, MetaField> = {}
  for (const f of fields) m[f.key] = f
  return m
}

const v = (m: Record<string, MetaField>, key: string, fallback = ''): string =>
  m[key]?.value ?? fallback
const vNum = (m: Record<string, MetaField>, key: string, fallback = 0): number => {
  const raw = m[key]?.value
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) ? n : fallback
}
const vBool = (m: Record<string, MetaField>, key: string): boolean =>
  m[key]?.value === 'true'
const vImg = (m: Record<string, MetaField>, key: string): { url: string | null; alt: string } => {
  const ref = m[key]?.reference
  return { url: ref?.image?.url ?? null, alt: ref?.image?.altText ?? '' }
}

function adaptAnnouncement(node: MetaobjectShape | null): HomeAnnouncement | null {
  if (!node) return null
  const f = fieldMap(node.fields)
  return { text: v(f, 'text'), highlightLabel: v(f, 'highlight_label'), codeValue: v(f, 'code_value') }
}

function adaptHero(node: MetaobjectShape | null): HomeHero | null {
  if (!node) return null
  const f = fieldMap(node.fields)
  const img = vImg(f, 'image')
  return {
    starsText: v(f, 'stars_text'),
    headlineLine1: v(f, 'headline_line_1'),
    headlineLine2: v(f, 'headline_line_2'),
    subtitle: v(f, 'subtitle'),
    ctaPrimaryLabel: v(f, 'cta_primary_label'),
    ctaPrimaryUrl: v(f, 'cta_primary_url'),
    ctaSecondaryLabel: v(f, 'cta_secondary_label'),
    ctaSecondaryUrl: v(f, 'cta_secondary_url'),
    floatingStickerText: v(f, 'floating_sticker_text'),
    imageUrl: img.url,
    imageAlt: img.alt,
  }
}

function adaptCta(node: MetaobjectShape | null): HomeCtaBanner | null {
  if (!node) return null
  const f = fieldMap(node.fields)
  return {
    subtitle: v(f, 'subtitle'),
    title: v(f, 'title'),
    description: v(f, 'description'),
    card1Title: v(f, 'card_1_title'),
    card1Body: v(f, 'card_1_body'),
    card1Bottom: v(f, 'card_1_bottom'),
    card2Title: v(f, 'card_2_title'),
    card2Body: v(f, 'card_2_body'),
    card2Bottom: v(f, 'card_2_bottom'),
    ctaButtonLabel: v(f, 'cta_button_label'),
    ctaButtonUrl: v(f, 'cta_button_url'),
  }
}

function adaptLogo(node: MetaobjectShape): HomeLogo {
  const f = fieldMap(node.fields)
  const img = vImg(f, 'image')
  return { imageUrl: img.url, alt: v(f, 'alt', img.alt), sortOrder: vNum(f, 'sort_order') }
}

function adaptFeature(node: MetaobjectShape): HomeFeature {
  const f = fieldMap(node.fields)
  const img = vImg(f, 'image')
  return {
    number: vNum(f, 'number'),
    title: v(f, 'title'),
    imageUrl: img.url,
    imageAlt: img.alt,
    sortOrder: vNum(f, 'sort_order'),
  }
}

function adaptCategory(node: MetaobjectShape): HomeCategory {
  const f = fieldMap(node.fields)
  const img = vImg(f, 'image')
  return {
    name: v(f, 'name'),
    iconEmoji: v(f, 'icon_emoji'),
    imageUrl: img.url,
    targetSlug: v(f, 'target_slug'),
    accentColor: v(f, 'accent_color', '#ffea79'),
    popular: vBool(f, 'popular'),
    ctaText: v(f, 'cta_text', 'EXPLORE ➔'),
    sortOrder: vNum(f, 'sort_order'),
  }
}

function adaptFooterLink(node: MetaobjectShape): HomeFooterLink {
  const f = fieldMap(node.fields)
  return {
    group: v(f, 'group'),
    label: v(f, 'label'),
    url: v(f, 'url', '/'),
    sortOrder: vNum(f, 'sort_order'),
  }
}

const FIELDS_FRAGMENT = /* GraphQL */ `
  fragment Fields on Metaobject {
    handle
    fields {
      key
      value
      reference {
        ... on MediaImage {
          image { url altText }
        }
      }
    }
  }
`

interface RawResp {
  announcement: MetaobjectShape | null
  hero: MetaobjectShape | null
  cta: MetaobjectShape | null
  logos: { edges: { node: MetaobjectShape }[] }
  features: { edges: { node: MetaobjectShape }[] }
  categories: { edges: { node: MetaobjectShape }[] }
  footerLinks: { edges: { node: MetaobjectShape }[] }
}

export async function getHomeContent(): Promise<HomeContent> {
  const query = /* GraphQL */ `
    ${FIELDS_FRAGMENT}
    query HomeContent {
      announcement: metaobject(handle: { type: "home_announcement", handle: "main" }) { ...Fields }
      hero: metaobject(handle: { type: "home_hero", handle: "main" }) { ...Fields }
      cta: metaobject(handle: { type: "home_cta_banner", handle: "main" }) { ...Fields }
      logos: metaobjects(type: "home_logo", first: 50) { edges { node { ...Fields } } }
      features: metaobjects(type: "home_feature", first: 20) { edges { node { ...Fields } } }
      categories: metaobjects(type: "home_category", first: 20) { edges { node { ...Fields } } }
      footerLinks: metaobjects(type: "home_footer_link", first: 100) { edges { node { ...Fields } } }
    }
  `
  try {
    const data = await shopifyFetch<RawResp>({ query, next: { revalidate: 60 } })
    const sortBy = <T extends { sortOrder: number }>(arr: T[]) =>
      arr.sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      announcement: adaptAnnouncement(data.announcement),
      hero: adaptHero(data.hero),
      ctaBanner: adaptCta(data.cta),
      logos: sortBy(data.logos.edges.map((e) => adaptLogo(e.node))),
      features: sortBy(data.features.edges.map((e) => adaptFeature(e.node))),
      categories: sortBy(data.categories.edges.map((e) => adaptCategory(e.node))),
      footerLinks: sortBy(data.footerLinks.edges.map((e) => adaptFooterLink(e.node))),
    }
  } catch (err) {
    console.warn('[home-content] fetch failed, returning empty', err)
    return {
      announcement: null,
      hero: null,
      ctaBanner: null,
      logos: [],
      features: [],
      categories: [],
      footerLinks: [],
    }
  }
}

export function groupFooterLinks(links: HomeFooterLink[]): Record<string, HomeFooterLink[]> {
  const out: Record<string, HomeFooterLink[]> = {}
  for (const l of links) {
    if (!out[l.group]) out[l.group] = []
    out[l.group].push(l)
  }
  return out
}

// ── About page content ─────────────────────────────────────────────────

export interface AboutValue {
  title: string
  description: string
  icon: string
  colorHex: string
  sortOrder: number
}

export interface AboutContent {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroEmoji: string
  establishedYear: string
  establishedLabel: string
  storyTitle: string
  storyParagraph1: string
  storyParagraph2: string
  storyCtaLabel: string
  storyCtaUrl: string
  mascotEmojiBg: string
  mascotEmoji: string
  mascotTitle: string
  mascotQuote: string
  valuesSectionTitle: string
  values: AboutValue[]
}

const EMPTY_ABOUT: AboutContent = {
  heroBadge: '',
  heroTitle: '',
  heroSubtitle: '',
  heroEmoji: '',
  establishedYear: '',
  establishedLabel: '',
  storyTitle: '',
  storyParagraph1: '',
  storyParagraph2: '',
  storyCtaLabel: '',
  storyCtaUrl: '',
  mascotEmojiBg: '',
  mascotEmoji: '',
  mascotTitle: '',
  mascotQuote: '',
  valuesSectionTitle: '',
  values: [],
}

interface AboutPageRaw {
  fields: { key: string; value: string | null }[]
}

function pv(fields: { key: string; value: string | null }[], key: string): string {
  return fields.find((f) => f.key === key)?.value || ''
}

function adaptAboutValue(node: AboutPageRaw): AboutValue {
  const f = node.fields
  const sortRaw = pv(f, 'sort_order')
  return {
    title: pv(f, 'title'),
    description: pv(f, 'description'),
    icon: pv(f, 'icon') || 'Heart',
    colorHex: pv(f, 'color_hex') || '#ffea79',
    sortOrder: sortRaw ? parseInt(sortRaw, 10) : 99,
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  const query = /* GraphQL */ `
    query AboutContent {
      page: metaobject(handle: { type: "about_page", handle: "main" }) {
        fields { key value }
      }
      values: metaobjects(type: "about_value", first: 12) {
        edges { node { fields { key value } } }
      }
    }
  `
  try {
    const data = await shopifyFetch<{
      page: AboutPageRaw | null
      values: { edges: { node: AboutPageRaw }[] }
    }>({ query, next: { revalidate: 60 } })
    const page = data.page
    if (!page) return EMPTY_ABOUT
    const f = page.fields
    const values = data.values.edges
      .map((e) => adaptAboutValue(e.node))
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      heroBadge: pv(f, 'hero_badge'),
      heroTitle: pv(f, 'hero_title'),
      heroSubtitle: pv(f, 'hero_subtitle'),
      heroEmoji: pv(f, 'hero_emoji'),
      establishedYear: pv(f, 'established_year'),
      establishedLabel: pv(f, 'established_label'),
      storyTitle: pv(f, 'story_title'),
      storyParagraph1: pv(f, 'story_paragraph_1'),
      storyParagraph2: pv(f, 'story_paragraph_2'),
      storyCtaLabel: pv(f, 'story_cta_label'),
      storyCtaUrl: pv(f, 'story_cta_url') || '/shop',
      mascotEmojiBg: pv(f, 'mascot_emoji_bg'),
      mascotEmoji: pv(f, 'mascot_emoji'),
      mascotTitle: pv(f, 'mascot_title'),
      mascotQuote: pv(f, 'mascot_quote'),
      valuesSectionTitle: pv(f, 'values_section_title'),
      values,
    }
  } catch (err) {
    console.warn('[about-content] fetch failed, returning empty', err)
    return EMPTY_ABOUT
  }
}

// ── FAQ page content ───────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
  category: string
  sortOrder: number
}

export interface FaqContent {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroEmoji: string
  ctaTitle: string
  ctaSubtitle: string
  ctaButtonLabel: string
  ctaButtonUrl: string
  items: FaqItem[]
}

const EMPTY_FAQ: FaqContent = {
  heroBadge: '',
  heroTitle: '',
  heroSubtitle: '',
  heroEmoji: '',
  ctaTitle: '',
  ctaSubtitle: '',
  ctaButtonLabel: '',
  ctaButtonUrl: '/contact',
  items: [],
}

interface FaqRaw {
  fields: { key: string; value: string | null }[]
}

function fv(fields: { key: string; value: string | null }[], key: string): string {
  return fields.find((f) => f.key === key)?.value || ''
}

function adaptFaqItem(node: FaqRaw): FaqItem {
  const f = node.fields
  const sortRaw = fv(f, 'sort_order')
  return {
    question: fv(f, 'question'),
    answer: fv(f, 'answer'),
    category: fv(f, 'category') || 'General',
    sortOrder: sortRaw ? parseInt(sortRaw, 10) : 99,
  }
}

export async function getFaqContent(): Promise<FaqContent> {
  const query = /* GraphQL */ `
    query FaqContent {
      page: metaobject(handle: { type: "faq_page", handle: "main" }) {
        fields { key value }
      }
      items: metaobjects(type: "faq_item", first: 100) {
        edges { node { fields { key value } } }
      }
    }
  `
  try {
    const data = await shopifyFetch<{
      page: FaqRaw | null
      items: { edges: { node: FaqRaw }[] }
    }>({ query, next: { revalidate: 60 } })
    if (!data.page) return EMPTY_FAQ
    const f = data.page.fields
    const items = data.items.edges
      .map((e) => adaptFaqItem(e.node))
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return {
      heroBadge: fv(f, 'hero_badge'),
      heroTitle: fv(f, 'hero_title'),
      heroSubtitle: fv(f, 'hero_subtitle'),
      heroEmoji: fv(f, 'hero_emoji'),
      ctaTitle: fv(f, 'cta_title'),
      ctaSubtitle: fv(f, 'cta_subtitle'),
      ctaButtonLabel: fv(f, 'cta_button_label'),
      ctaButtonUrl: fv(f, 'cta_button_url') || '/contact',
      items,
    }
  } catch (err) {
    console.warn('[faq-content] fetch failed', err)
    return EMPTY_FAQ
  }
}

// ── Site Branding (logos + favicon) ─────────────────────────────────────

export interface SiteBranding {
  mascotLogoUrl: string | null
  mascotLogoAlt: string
  wordmarkLogoUrl: string | null
  wordmarkLogoAlt: string
  wordmarkLogoFooterUrl: string | null
  wordmarkLogoFooterAlt: string
  wordmarkText: string
  faviconSvgUrl: string | null
  faviconPng32Url: string | null
  appleTouchIconUrl: string | null
}

export const EMPTY_BRANDING: SiteBranding = {
  mascotLogoUrl: null,
  mascotLogoAlt: 'PetBale mascot',
  wordmarkLogoUrl: null,
  wordmarkLogoAlt: 'PetBale',
  wordmarkLogoFooterUrl: null,
  wordmarkLogoFooterAlt: 'PetBale',
  wordmarkText: 'PetBale',
  faviconSvgUrl: null,
  faviconPng32Url: null,
  appleTouchIconUrl: null,
}

interface BrandingField {
  key: string
  value: string | null
  reference: {
    image?: { url: string; altText: string | null }
    url?: string
  } | null
}

function bv(fields: BrandingField[], key: string): string | null {
  return fields.find((f) => f.key === key)?.value ?? null
}

function bRefImage(fields: BrandingField[], key: string): { url: string; alt: string } | null {
  const ref = fields.find((f) => f.key === key)?.reference
  if (!ref) return null
  if (ref.image?.url) return { url: ref.image.url, alt: ref.image.altText ?? '' }
  if (ref.url) return { url: ref.url, alt: '' }
  return null
}

export async function getSiteBranding(): Promise<SiteBranding> {
  const query = /* GraphQL */ `
    query SiteBranding {
      branding: metaobject(handle: { type: "site_branding", handle: "main" }) {
        fields {
          key
          value
          reference {
            ... on MediaImage { image { url altText } }
            ... on GenericFile { url }
          }
        }
      }
    }
  `
  try {
    const data = await shopifyFetch<{ branding: { fields: BrandingField[] } | null }>({
      query,
      next: { revalidate: 300 },
    })
    if (!data.branding) return EMPTY_BRANDING
    const f = data.branding.fields
    const mascot = bRefImage(f, 'mascot_logo')
    const wordmark = bRefImage(f, 'wordmark_logo')
    const wordmarkFooter = bRefImage(f, 'wordmark_logo_footer')
    const fav = bRefImage(f, 'favicon_svg')
    const favPng = bRefImage(f, 'favicon_png_32')
    const apple = bRefImage(f, 'apple_touch_icon')
    return {
      mascotLogoUrl: mascot?.url ?? null,
      mascotLogoAlt: mascot?.alt || 'PetBale mascot',
      wordmarkLogoUrl: wordmark?.url ?? null,
      wordmarkLogoAlt: wordmark?.alt || 'PetBale',
      wordmarkLogoFooterUrl: wordmarkFooter?.url ?? null,
      wordmarkLogoFooterAlt: wordmarkFooter?.alt || 'PetBale',
      wordmarkText: bv(f, 'wordmark_text') || 'PetBale',
      faviconSvgUrl: fav?.url ?? null,
      faviconPng32Url: favPng?.url ?? null,
      appleTouchIconUrl: apple?.url ?? null,
    }
  } catch (err) {
    console.warn('[site-branding] fetch failed, using empty', err)
    return EMPTY_BRANDING
  }
}
