# PetBale email templates

Brand-consistent Liquid templates for Shopify customer notifications. Drop-in replacements for the default templates — no app required, no code deploy needed.

## Files

| File | Replaces Shopify notification |
|---|---|
| `order-confirmation.liquid` | Order confirmation |
| `shipping-confirmation.liquid` | Shipping confirmation |
| `order-cancelled.liquid` | Order cancelled |
| `order-refunded.liquid` | Order refunded |

## How to install (one-time, per template)

1. Open the `.liquid` file in any text editor → select all → copy
2. Shopify Admin → **Settings → Notifications**
3. Under **Customer notifications**, click the matching name (e.g. "Order confirmation")
4. Click **Edit code** (button near the top right of the body field)
5. Paste — replacing the entire body
6. **Subject line** (above the body) — set to one of:
   - Order confirmation: `Thanks for your order, {{ customer.first_name }} 🐾 [{{ order_name }}]`
   - Shipping confirmation: `Your order {{ order_name }} is on the way 📦`
   - Order cancelled: `Order {{ order_name }} cancelled — refund details inside`
   - Order refunded: `Refund issued for order {{ order_name }} 💚`
7. Click **Save**
8. Use **Preview** + **Send test email** (to your own inbox) to verify rendering

## Shared visual system

All templates use the PetBale neobrutalism palette:

| Token | Value | Used for |
|---|---|---|
| Primary yellow | `#ffea79` | Status bar (confirmed), refund highlight, CTA button |
| Brand pink | `#FF69B4` | Support callout block |
| Brand black | `#000000` | Borders (2px), wordmark, primary text |
| Cream BG | `#FAF6F0` | Outer wrapper background |
| Sky blue | `#6cd1ff` | Shipping status bar |
| Green | `#4AD395` | Refund status bar |
| Text gray | `#525252` | Body copy |

Each email has the same structure:
1. **Brand bar** — PETBALE wordmark (Georgia serif fallback since Whisker Bites can't load in email)
2. **Status pill** — colored rounded bar with order number and status icon
3. **White hero card** — 2px black border, 4px black shadow, big uppercase headline, body copy, CTA button
4. **Pink support callout** — quick contact CTA
5. **Footer NAP** — DOG BOWL BAKERY LLC, address, phone, cs@petbale.com, unsubscribe

## Liquid variables used

These are all standard Shopify notification variables — they exist by default and need no setup:

- Order context: `order_name`, `order.order_status_url`, `order_status_url`, `customer.first_name`
- Money: `total_price`, `subtotal_price`, `shipping_price`, `tax_price`, `total_discounts`, `amount` (refund only)
- Items: `line_items` (loop with `line.title`, `line.variant.title`, `line.image`, `line.quantity`, `line.line_price`)
- Refund: `refund_line_items` (each has `.line_item` and `.quantity`, `.subtotal`)
- Shipping: `shipping_address.first_name`, `shipping_address.street`, `shipping_address.city`, `shipping_address.province_code`, `shipping_address.zip`
- Tracking: `fulfillment.tracking_url`, `fulfillment.tracking_number`, `fulfillment.tracking_company`
- Cancel: `cancel_reason`, `cancel_reason_label`
- Shop: `shop.url`, `shop.name`

Reference: https://shopify.dev/docs/api/liquid/objects/order#order-properties

## Testing checklist before going live

Open the Preview tab in Shopify after pasting:
- [ ] Logo PETBALE wordmark renders bold
- [ ] Status bar colored correctly per email type
- [ ] Line items show product image + title + qty + price
- [ ] All money values display with `$` sign
- [ ] Shipping address block renders if order requires shipping
- [ ] CTA button is large, black, with white uppercase text
- [ ] Footer shows full NAP: DOG BOWL BAKERY LLC + 3832 FESCUE ST CLERMONT FL 34714 + +1 (888) 984-6318 + cs@petbale.com
- [ ] Unsubscribe link present (compliance)

Send a test to yourself + check on:
- [ ] Gmail web
- [ ] Gmail mobile app
- [ ] Apple Mail (iOS + macOS)
- [ ] Outlook web (Outlook for Windows has the worst Liquid CSS support — verify table layout still holds)

## Customizing further

Each template is plain Liquid + inline CSS. Common tweaks:

**Change brand color tokens**: search-replace `#ffea79` (primary) or `#FF69B4` (pink) across the file. Update README table too.

**Add a related-products section** to Order Confirmation: append before the support callout. Use Shopify's `{% for product in shop.frontpage_products limit: 3 %}` or query a specific collection. Note: the notification email Liquid context is more limited than storefront Liquid, so test carefully.

**Localize**: wrap any user-facing string in `{{ 'your.key' | t }}` after defining keys in Settings → Notifications → languages. Currently all copy is hardcoded English (US store).

**Disable an email type entirely**: Shopify doesn't let you disable Order confirmation (legally required). For others, edit subject to blank — Shopify will still send but with no body.

## Why these templates instead of the default?

Default Shopify templates work but look generic and Shopify-branded. These match the petbale.com storefront's visual identity:
- Same yellow/pink/black palette
- Same uppercase + bold headline treatment
- Same rounded-corner card + 4px shadow neobrutalism style
- NAP footer matches Shopify policy pages (Google Merchant requirement)
- Single visual system across all 4 transactional emails so the brand feels consistent end-to-end
