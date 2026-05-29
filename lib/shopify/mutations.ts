import { shopifyFetch } from './client'
import { CART_FRAGMENT } from './fragments'
import type { ShopifyCart } from './types'

export async function cartCreate(merchandiseId?: string, quantity = 1): Promise<ShopifyCart> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  const input = merchandiseId
    ? { lines: [{ merchandiseId, quantity }] }
    : {}
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] }
  }>({ query: mutation, variables: { input }, cache: 'no-store' })
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join('; '))
  }
  return data.cartCreate.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = /* GraphQL */ `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
  `
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart
}

export async function cartLinesAdd(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] }
  }>({ query: mutation, variables: { cartId, lines }, cache: 'no-store' })
  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join('; '))
  }
  return data.cartLinesAdd.cart
}

export async function cartLinesUpdate(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: { message: string }[] }
  }>({ query: mutation, variables: { cartId, lines }, cache: 'no-store' })
  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join('; '))
  }
  return data.cartLinesUpdate.cart
}

export async function cartLinesRemove(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const mutation = /* GraphQL */ `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: { message: string }[] }
  }>({ query: mutation, variables: { cartId, lineIds }, cache: 'no-store' })
  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join('; '))
  }
  return data.cartLinesRemove.cart
}
