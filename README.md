# WAKWA SUPPLY & TRANSPORTATION — Website

**Stack chosen: vanilla HTML5 + Tailwind (CDN) + vanilla JS + Leaflet.** Zero-build, opens instantly, deploys to Vercel as static. Mirrors the Next.js architecture (`content/*.js` = CMS-ready data, `lib/pricing.js` = editable model, `lib/mailer.js` = provider swap). State: fallback path per brief.

## Run
- Preview: open `index.html` or `npx serve .`
- Deploy (Vercel): `vercel --prod` (static, see `vercel.json`).

## Setup
1. Find-replace placeholders (see below).
2. Swap Unsplash URLs with real photos (see `public/images/README.md`).
3. Set IDs in `.env.example` → Vercel env (GA/Meta/GTM only load after cookie consent).
4. Wire `/api/quote`: `lib/mailer.js` has the Resend template stub.

## Customise
- Colours/logo: `assets/css/styles.css` (`:root` tokens) + `assets/img/favicon.svg`.
- Copy/data: `content/site.js`, `content/services.js`, `content/data.js` (fleet, materials, FAQs, projects, posts, coverage).
- Pricing: `lib/pricing.js` — every rate is a named constant.
- Add service: append to `WAKWA_SERVICES` (slug, title, body, included…) — index + detail pages render automatically.
- Add blog post: append to `WAKWA_POSTS`.

## First 10 Things To Customise
1. `[[PHONE]]`, `[[WHATSAPP]]`, `[[DISPATCH_PHONE]]`
2. `[[EMAIL]]`, `[[ADDRESS]]`, `[[CITY]]`, `[[COUNTRY]]`
3. `[[REG_NO]]` licences
4. Real fleet counts/tonnage in Home stats
5. Depot addresses (Contact + Coverage)
6. Social links `[[SOCIAL_*]]`
7. `[[DEVELOPER]]` credit
8. GA/Meta/GTM IDs
9. OPS email for quote notifications
10. Photos (CONTENT-CHECKLIST.md)

## Placeholders used
`[[PHONE]] [[WHATSAPP]] [[DISPATCH_PHONE]] [[EMAIL]] [[ADDRESS]] [[CITY]] [[COUNTRY]] [[REG_NO]] [[SOCIAL_FACEBOOK]] [[SOCIAL_X]] [[SOCIAL_INSTAGRAM]] [[SOCIAL_LINKEDIN]] [[SOCIAL_TIKTOK]] [[SOCIAL_YOUTUBE]] [[DEVELOPER]] [[SAMPLE]] [[XXX 000X]]`

## Next-phase features (shipped)
- **Driver app + telematics:** `driver.html` (PIN `2468`, GPS pings, auto-share, POD sign-off) → `lib/telematics.js` → live `track.html` (map + stages + 15s refresh). `/api/track.js` syncs across devices on Vercel; offline it uses a localStorage bus. Production: swap endpoint for your GPS vendor webhook or KV (ephemeral serverless memory noted in file).
- **Invoicing + payments:** `lib/invoices.js` (VAT-16% totals, `INV-YYYY-####`, print CSS) + `lib/payments.js` (M-Pesa STK + Stripe behind `mode:'stub'|'live'`) + `billing.html`. APIs: `api/mpesa/stk.js`, `api/stripe/checkout.js` (env-gated, TODOs marked for Daraja/Stripe SDK calls).
- **Portal v2:** `portal.html` + `lib/auth.js` (demo `client@demo/1234`, `driver@demo/2468`, `admin@demo/7890`; swap for Supabase/Auth.js, same API). Tabs: Shipments (live stage + track links), Invoices (receipts + pay), Documents/POD (upload ≤2MB browser-stored; S3/R2 signed-URL path documented).
- **CMS adapter:** `lib/cms.js` — `WakwaCMS.get(collection)` remote-first with local fallback + 5-min cache. Set `window.WAKWA_CMS.provider` to `sanity`/`contentful` + IDs; schema contract = current `content/*.js` shapes.
- **Chat:** `assets/js/chat.js` — Tawk.to (`tawkSrc`) or Crisp (`crispId`), loads only after consent. Default `none`.
- **Analytics:** `assets/js/analytics.js` — GA4 + Meta Pixel + GTM from `window.WAKWA_ANALYTICS` (map to `GA_ID`/`META_PIXEL_ID`/`GTM_ID`), initialised by `site.js` only on consent=yes. `WakwaAnalytics.track()` used by quote/track/driver/billing events. No tags fire on Decline.

## Structure
```
index.html about.html services.html service-detail.html fleet.html supply.html coverage.html city.html quote.html thank-you.html track.html driver.html projects.html blog.html blog-post.html careers.html partners.html portal.html billing.html admin-quotes.html contact.html faq.html privacy.html terms.html cookies.html search.html 404.html
assets/css/styles.css assets/js/site.js assets/js/analytics.js assets/js/chat.js assets/img/favicon.svg
content/site.js content/services.js content/data.js lib/pricing.js lib/mailer.js lib/cms.js lib/telematics.js lib/auth.js lib/invoices.js lib/payments.js
api/quote.js api/track.js api/mpesa/stk.js api/stripe/checkout.js
tools/load-calculator.html locales/en.json locales/sw.json
vercel.json robots.txt sitemap.xml
```
