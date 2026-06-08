# Google Ads — Conversion & Remarketing Tracking

PetBale is a **headless Shopify** store: the storefront is this Next.js app
(`petbale.com`) but **checkout completes on Shopify** (`pay.petbale.com`).
Tracking therefore lives in **two places**.

```
petbale.com (Next.js)                 pay.petbale.com (Shopify checkout)
─────────────────────                 ──────────────────────────────────
gtag base tag (AW-…)                  Custom Pixel
view_item                             → conversion: PURCHASE  ← the money event
add_to_cart                             (real order value + Enhanced Conversions)
begin_checkout
   │  user clicks "Proceed to Checkout"
   └───────────────────────────────────▶ redirect to Shopify checkout
```

---

## 1. Storefront (already implemented in code)

Set the env var and redeploy — nothing else to code:

```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
```

- `components/analytics-scripts.tsx` loads `gtag.js` and `config`s the Ads ID
  (shares the loader with GA4 if present).
- `lib/gtag.ts` fires `view_item`, `add_to_cart`, `begin_checkout`
  (product page, add-to-cart, checkout button).

These feed **remarketing audiences** and the upper funnel. They are NOT the
purchase conversion.

---

## 2. Purchase conversion (Shopify Custom Pixel) — the important one

### a) Create the conversion action in Google Ads
Google Ads → **Goals → Conversions → New conversion action → Website**, source
**"manually using code"**. Note the **Conversion ID** (`AW-XXXXXXXXX`) and
**Conversion label** (a short string). Turn ON **Enhanced Conversions** (choose
"Google tag" / code) and accept the terms.

### b) Add the Custom Pixel in Shopify
Shopify Admin → **Settings → Customer events → Add custom pixel** → name it
`Google Ads Purchase` → paste the code below → **Save** → **Connect**.

```js
// PetBale — Google Ads Purchase conversion
analytics.subscribe("checkout_completed", (event) => {
  const checkout = event.data.checkout;

  const AW_ID = "AW-XXXXXXXXX";          // ← Conversion ID
  const LABEL = "XXXXXXXXXXXXXXXXXX";     // ← Conversion label

  // Load gtag.js inside the pixel sandbox
  const s = document.createElement("script");
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + AW_ID;
  s.async = true;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", AW_ID);

  // Enhanced Conversions — Google hashes these client-side before sending.
  // Bridges attribution across petbale.com → pay.petbale.com (no gclid needed).
  gtag("set", "user_data", {
    email: checkout.email,
    phone_number: checkout.phone,
    address: {
      first_name: checkout.billingAddress && checkout.billingAddress.firstName,
      last_name:  checkout.billingAddress && checkout.billingAddress.lastName,
      postal_code: checkout.billingAddress && checkout.billingAddress.zip,
      country:     checkout.billingAddress && checkout.billingAddress.countryCode,
    },
  });

  gtag("event", "conversion", {
    send_to: AW_ID + "/" + LABEL,
    value: checkout.totalPrice.amount,
    currency: checkout.totalPrice.currencyCode,
    transaction_id: checkout.order.id,   // dedup key — prevents double counting
  });
});
```

### c) Verify
- Place a test order (or use Google Tag Assistant on the checkout).
- Google Ads → the conversion action shows **"Recording conversions"** within
  a few hours; status moves from "Unverified" once a real conversion lands.
- `transaction_id` = Shopify order id, so refreshing the thank-you page won't
  double-count.

---

## Why not the "Google & YouTube" Shopify app?
It works, but it injects its own tag and would **double-fire** alongside this
setup, and gives less control over value/label. Pick one. We chose the Custom
Pixel for a headless store. If you ever install the app instead, remove this
pixel (and vice-versa).

## Consent note (optional)
The on-site cookie banner currently does not gate scripts (US CCPA notice
model). If you later target the EU, wire **Google Consent Mode v2**
(`gtag('consent', 'default', {...})`) before the `config` calls and update it
from the banner's Accept/Decline.
