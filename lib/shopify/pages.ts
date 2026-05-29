import { shopifyFetch } from './client'

export interface PolicyBanner {
  badge: string
  emoji: string
  accentColor: string
  subtitle: string
  lastUpdated: string
}

export interface ShopifyPolicyPage {
  title: string
  bodyHtml: string
  banner: PolicyBanner | null
}

interface RawPage {
  title: string
  body: string
  metafield: { value: string } | null
}

function parseBanner(raw: string | null | undefined): PolicyBanner | null {
  if (!raw) return null
  try {
    const j = JSON.parse(raw) as Partial<{
      badge: string
      emoji: string
      accent_color: string
      subtitle: string
      last_updated: string
    }>
    return {
      badge: j.badge ?? '',
      emoji: j.emoji ?? '🛡️',
      accentColor: j.accent_color ?? '#ffea79',
      subtitle: j.subtitle ?? '',
      lastUpdated: j.last_updated ?? '',
    }
  } catch {
    return null
  }
}

export async function getShopifyPolicyPage(
  handle: string
): Promise<ShopifyPolicyPage | null> {
  const query = /* GraphQL */ `
    query PolicyPage($handle: String!) {
      page(handle: $handle) {
        title
        body
        metafield(namespace: "custom", key: "policy_banner") {
          value
        }
      }
    }
  `
  try {
    const data = await shopifyFetch<{ page: RawPage | null }>({
      query,
      variables: { handle },
      next: { revalidate: 300 },
    })
    if (!data.page) return null
    return {
      title: data.page.title,
      bodyHtml: data.page.body,
      banner: parseBanner(data.page.metafield?.value ?? null),
    }
  } catch (err) {
    console.warn('[policy] fetch failed for', handle, err)
    return null
  }
}
