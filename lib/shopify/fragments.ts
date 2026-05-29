export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    productType
    tags
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          handle
          title
        }
      }
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "ingredients_json" }
        { namespace: "custom", key: "guaranteed_analysis_json" }
        { namespace: "custom", key: "feeding_instructions_json" }
        { namespace: "custom", key: "pet_type" }
        { namespace: "custom", key: "food_form" }
        { namespace: "custom", key: "life_stage" }
        { namespace: "custom", key: "breed_size" }
        { namespace: "custom", key: "primary_flavor" }
        { namespace: "custom", key: "category_path" }
        { namespace: "custom", key: "category_leaf" }
        { namespace: "alireviews", key: "rating_info" }
      ]
    ) {
      namespace
      key
      value
      type
    }
  }
`

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
              product {
                handle
                title
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`
