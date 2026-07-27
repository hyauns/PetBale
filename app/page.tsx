import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
// import { LogoCloud } from '@/components/logo-cloud'
import BestSellers, { type PricingPlan } from '@/components/best-sellers'
import WhyUs from '@/components/why-us'
import ShopCategories from '@/components/shop-categories'
import { CtaBanner } from '@/components/cta-banner'
import { SiteFooter } from '@/components/site-footer'
import { adaptShopifyProducts } from '@/lib/shopify/adapters'
import { getShopifyCollectionByHandle } from '@/lib/shopify/queries'
import { getHomeContent } from '@/lib/shopify/content'
import type { CatalogProduct } from '@/lib/catalog'

export const revalidate = 60

export default async function HomePage() {
  const [collection, home] = await Promise.all([
    getShopifyCollectionByHandle('dry-food'),
    getHomeContent(),
  ])
  const dryFood = collection
    ? adaptShopifyProducts(collection.products.edges.map((e) => e.node))
    : []

  const saleItems = dryFood.filter(
    (p) => p.onSale && p.comparePrice && p.comparePrice > p.price
  )
  const featured: CatalogProduct[] = (saleItems.length > 0 ? saleItems : dryFood).slice(0, 12)

  const plans: PricingPlan[] = featured.map((p, idx) => ({
    name:
      p.name +
      (p.category.includes('cat') ? ' 🐱' : p.name.includes('TREAT') ? ' 🥩' : ' 🐶'),
    price: p.price,
    imageSrc: p.imageSrc,
    features: p.badges,
    isPopular: idx === 1 || idx === 5 || idx === 8,
    accent: p.accent,
    slug: p.slug,
    merchandiseId: p.defaultVariantId,
    optionSummary: p.optionSummary,
    multiOptions: p.variants.length > 1,
    availableForSale: p.availableForSale,
    onSale: p.onSale,
    comparePrice: p.comparePrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
  }))

  return (
    <>
      <SiteHeader announcement={home.announcement} />
      <main id="main-content">
        <HeroSection content={home.hero} />
        {/* ponytail: brand logo cloud hidden for GMC misrepresentation review (2026-07-27) — restore after approval */}
        {/* <LogoCloud logos={home.logos.length > 0 ? home.logos : undefined} /> */}
        <WhyUs features={home.features} />
        <ShopCategories categories={home.categories} />
        <BestSellers plans={plans} />
        <CtaBanner content={home.ctaBanner} />
      </main>
      <SiteFooter footerLinks={home.footerLinks} />
    </>
  )
}
