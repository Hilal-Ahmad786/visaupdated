# QA Checklist — Part 1

Legend: ✅ done/verified · 🔶 implemented, needs manual device/browser pass · ⬜ Part 2 / external dependency

## Build & code health
- ✅ `npm run build` succeeds (30+ routes)
- ✅ `npm run typecheck` (tsc strict, `noUncheckedIndexedAccess`) — no errors
- ✅ `next lint` — no warnings or errors
- ✅ Unit tests pass (`npm test` — form schemas + thank-you token verification)

## Responsive
- 🔶 Mobile (390px): sticky conversion bar, full-width forms, drawer nav, safe-area padding
- 🔶 Tablet: 2-col country/service grids, hero stacking
- 🔶 Desktop (1240px container) + large desktop
- 🔶 No horizontal scroll / no CTA covering footer (body has `pb-16 md:pb-0` for the mobile bar)

## Content
- ✅ Turkish copy throughout; no lorem ipsum
- ✅ No fabricated stats/reviews/prices/addresses/guarantees
- ✅ Legal disclaimer consistent on landing/lead pages + footer
- ✅ Placeholders clearly marked (`CONTENT_PLACEHOLDERS.md`)

## SEO
- ✅ Unique title/description per page; `metadataBase` + canonical
- ✅ Open Graph / Twitter metadata
- ✅ `sitemap.xml` (published countries/services/FAQs/articles + core pages; excludes thank-you/search)
- ✅ `robots.txt` (disallows /api, /tesekkurler, /arama, /admin; sitemap ref)
- ✅ `noindex` on thank-you, search, 404, legal-miss
- ✅ JSON-LD: Organization (global), Breadcrumb, FAQ (published only), Article
- ✅ Real HTTP 404 via `not-found.tsx`

## Forms
- ✅ Client + server Zod validation (never client-only)
- ✅ Honeypot + min-time + rate limit + duplicate detection
- ✅ Disabled/submitting state, duplicate-click guard
- ✅ Reference number (`VV-YYYY-NNNNNN`), no raw IDs exposed
- ✅ Thank-you only confirms success with a valid signed token; direct access shows neutral state
- 🔶 Manual end-to-end happy-path on a device

## Analytics
- ✅ Centralized `trackEvent`; no direct gtag in components
- ✅ PII stripped (names/phones/emails/messages/raw query never sent)
- ✅ Lead conversion fires once, only on verified thank-you (transaction_id dedupe)
- ⬜ Live GA4/GTM/Ads verification (needs real IDs)

## Accessibility (WCAG 2.2 AA targets)
- ✅ One `<h1>` per page, semantic landmarks, skip link
- ✅ Labeled inputs, errors linked via `aria-describedby`, `role="alert"`
- ✅ Accessible accordion (button/aria-expanded/region) + tabs (tablist/tabpanel) + progress bars
- ✅ Visible focus ring, ≥44px tap targets, reduced-motion handling
- 🔶 Screen-reader pass (VoiceOver/NVDA), zoom 200%, keyboard-only full sweep

## Security
- ✅ Server-side validation + sanitization; safe error messages (no stack traces)
- ✅ Rate limiting; honeypot; signed HMAC tokens (constant-time compare)
- ✅ No secrets in client; security headers in `next.config.mjs`
- ✅ Published-only content (no draft/admin exposure); escaped search (client filter)
- ⬜ Production rate-limit backed by Redis (in-memory for Part 1)

## Browser
- 🔶 Chrome / Safari / Firefox / Edge — desktop + mobile manual pass
