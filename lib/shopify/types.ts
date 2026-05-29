export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width?: number
  height?: number
}

export interface ShopifyMetafield {
  key: string
  namespace: string
  value: string
  type: string
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable?: number | null
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  selectedOptions: { name: string; value: string }[]
  image: ShopifyImage | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  vendor: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyVariant }[] }
  collections: { edges: { node: { handle: string; title: string } }[] }
  metafields: (ShopifyMetafield | null)[]
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: { edges: { node: ShopifyProduct }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: { totalAmount: ShopifyMoney }
  merchandise: {
    id: string
    title: string
    selectedOptions: { name: string; value: string }[]
    image: ShopifyImage | null
    product: { handle: string; title: string }
    price: ShopifyMoney
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoney
    totalAmount: ShopifyMoney
  }
  lines: { edges: { node: ShopifyCartLine }[] }
}
