# Deployment Guide — Coolify

PetBale is a Next.js 16 (App Router) storefront. This guide walks you through deploying it to a self-hosted [Coolify](https://coolify.io/) instance using the included `Dockerfile`.

## 1. Prerequisites

- A Coolify server already installed and running.
- A Git repository hosting this project (GitHub, GitLab, or self-hosted Gitea).
- DNS for your domain pointed at the Coolify server (e.g. `petbale.com` → server IP).

## 2. Environment variables

Add these in **Coolify → Project → Environment Variables** before the first build. Variables prefixed `NEXT_PUBLIC_` are inlined into the client bundle at **build time** — mark them `Available at build time` in Coolify.

### Required (build-time)

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `12ujgr-dk.myshopify.com` | Technical Shopify endpoint used to call the Storefront API (no `https://`) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | `shpat_…` | Storefront API access token |
| `NEXT_PUBLIC_SHOPIFY_CUSTOMER_DOMAIN` | `pay.petbale.com` | Public Shopify domain used for `/track` redirect and (auto) checkout URL. Set this after wiring a custom domain in Shopify Admin → Settings → Domains. |
| `NEXT_PUBLIC_SITE_URL` | `https://petbale.com` | Final public origin — used by `metadataBase`, `sitemap.xml`, `robots.txt`, OG tags. **Do not include a trailing slash.** |

### Required (runtime-only)

| Variable | Example | Notes |
|---|---|---|
| `ALI_REVIEWS_API_KEY` | `…` | Bearer token for `pub.kudosi.ai` |
| `RESEND_API_KEY` | `re_…` | For contact form. Optional if contact form is not used. |
| `CONTACT_FROM_EMAIL` | `noreply@petbale.com` | Verified Resend sender |
| `CONTACT_TO_EMAIL` | `cs@petbale.com` | Where contact submissions land |

### Optional (build-time)

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXX` | GA4 — empty disables script |
| `NEXT_PUBLIC_META_PIXEL_ID` | `1234567890123456` | Meta Pixel — empty disables script |

## 3. Coolify configuration

1. **Create application** → **Public Repository** (or **Private Repository** + GitHub App).
2. **Build pack**: `Dockerfile`.
3. **Dockerfile location**: `Dockerfile` (root).
4. **Port**: `3000` (default — matches `EXPOSE 3000` in the Dockerfile).
5. **Health check**: Coolify will auto-detect the `HEALTHCHECK` directive in the Dockerfile, which hits `GET /api/health`.
6. **Domain**: add `petbale.com` and `www.petbale.com`. Coolify auto-provisions a Let's Encrypt certificate.
7. **Build-time secrets**: under "Build Variables", paste the build-time envs listed above. Tick "Is build variable".

Once the variables are in place, hit **Deploy**. The first build takes 3–5 minutes.

## 4. Post-deploy checklist

- [ ] `https://petbale.com` loads the homepage
- [ ] `https://petbale.com/api/health` returns `{"status":"ok",...}`
- [ ] `https://petbale.com/robots.txt` resolves
- [ ] `https://petbale.com/sitemap.xml` lists products and collections
- [ ] Add to cart → checkout URL redirects to `https://12ujgr-dk.myshopify.com/checkouts/...` (Shopify-hosted)
- [ ] Contact form delivers test mail (if Resend wired)
- [ ] Favicon + wordmark show from Shopify metaobject

## 5. Shopify Admin still required

The storefront is headless — these steps live in Shopify Admin:

- **Settings → Payments**: enable Shopify Payments / Stripe with `DOG BOWL BAKERY LLC` and EIN.
- **Settings → Shipping**: add at least one zone (US contiguous) and a rate matching `Shipping Policy`.
- **Settings → Taxes**: configure US state sales tax.
- **Settings → Customer accounts**: choose **Show login link** so `/track` works.
- **Settings → Notifications → Sender email**: set to `cs@petbale.com`.
- **Online Store → Preferences**: disable the password page once ready to launch.

## 6. Updating the live site

Push to your default branch → Coolify detects the webhook → rebuilds and rolls the new container. Smart Collections, product activations, and metaobject content propagate automatically (revalidate cache is 60 s for content; the smart-collection rebuild is server-side in Shopify).

## 7. Rollback

In Coolify → **Deployments**, pick a previous successful build and click **Rollback**. The standalone image is small (~80 MB), so rollback is near-instant.

## 8. Troubleshooting

- **`metadataBase` warning at build**: set `NEXT_PUBLIC_SITE_URL` correctly.
- **Empty product images**: confirm Shopify CDN hostname matches one of the `remotePatterns` in `next.config.mjs`.
- **502 from Coolify proxy**: the container is healthy but the port is wrong. Confirm `PORT=3000` and the application's exposed port match.
- **Contact form silently fails**: `RESEND_API_KEY` missing or DNS verification incomplete on Resend dashboard.
- **Healthcheck failing**: container may need longer warm-up — increase `start-period` in the Dockerfile if cold start is slow on your hardware.

---

Operator: **DOG BOWL BAKERY LLC** — 3832 FESCUE ST, CLERMONT, FL 34714.
