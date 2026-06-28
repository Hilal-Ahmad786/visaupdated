# Legacy Audit — `Hilal-Ahmad786/visaupdated` (main)

Audit of the previous visa-services repository performed before the VİS VİZE Part 1 rebuild.

## Existing stack

| Area | Finding |
| --- | --- |
| Framework | Next.js 14.2 App Router |
| Language | TypeScript (non-strict) |
| Styling | Tailwind CSS 3.4, generic blue theme (`primary: #2563eb`) |
| Forms | react-hook-form + zod present (unused/under-used) |
| Animation | framer-motion 11 |
| Icons | @heroicons/react |
| Output | **`output: 'export'` (static HTML export)** |
| Package manager | Mixed: both `package-lock.json` and `pnpm-lock.yaml` committed |

## Structure observed

- `app/`: 10 thin page components (`page.tsx` per route) — homepage, application, appointment, blog, contact, countries, faq, services, tesekkurler. Content largely hardcoded English ("Global Visa").
- `components/`: ~13 components (Header, Footer, Hero, CountryCard, ServiceCard, ContactForm, PhoneLink, WhatsAppButton, GoogleAnalytics, ad placeholders).
- `lib/`: `constants.ts` (generic English site config + flat country/visa lists), `gtag.ts`, and a **`conversions/` module** (typed conversion config with ~25 event types).
- `hooks/useConversion.ts`.

## Useful parts (preserved / adapted)

- **Conversion/analytics concept** (`lib/conversions/*`, `lib/gtag.ts`): the idea of a centralized, typed event taxonomy was sound. **Adapted**, not copied, into `src/lib/analytics.ts` — decoupled from UI, PII-stripped, and with Google Ads IDs/labels moved to env (the legacy file **hardcoded** `AW-16630919138/...` IDs, which is a leak/maintenance risk).
- App Router + TS + Tailwind + RHF + Zod baseline — same core stack retained (upgraded config, strict mode added).
- Route ideas (countries, services, blog, contact, faq, tesekkurler) informed the new Turkish slug map.

## Parts requiring refactor

- Forms: present but without server validation, anti-spam, duplicate protection, or a normalized lead model → rebuilt with shared Zod schemas validated **both** client and server, honeypot+timing, rate limiting, signed thank-you tokens.
- SEO: ad-hoc; no canonical/sitemap/structured-data strategy → rebuilt with `lib/seo.ts`, `sitemap.ts`, `robots.ts`, JSON-LD.

## Parts removed / replaced

- **`output: 'export'`** — incompatible with the new requirements (server-side form validation, API routes, dynamic metadata, real HTTP 404, ISR). Removed; the app now uses server components + a Node API route.
- Generic blue visual theme and English "Global Visa" branding/content — replaced wholesale with the approved VİS VİZE navy/gold design system and Turkish copy.
- Hardcoded business content inside pages — replaced with the typed content model + `ContentRepository` abstraction.
- Hardcoded Google Ads conversion IDs — moved to env / future admin settings.
- Mixed lockfiles — standardized on a single npm `package-lock.json` for the new project.
- framer-motion + heroicons — dropped in favor of CSS transitions and a single icon family (`lucide-react`) per the design system ("one consistent outline icon family").

## Security / stability concerns found

- Static export prevented any server-side validation → all trust was client-side (spoofable).
- Conversion IDs committed in source.
- No rate limiting, honeypot, or duplicate-submit protection on forms.
- No `noindex` discipline (thank-you/search pages indexable).

## Migration risks

- The legacy site is a separate deployment with different (English) routes; redirect mapping is required (see `LEGACY_ROUTE_MIGRATION.md`).
- No real business data (phone, address, prices, reviews) existed in legacy either — these remain placeholders (see `CONTENT_PLACEHOLDERS.md`).

## Recommended direction (taken)

Rebuild on the same core stack but with: strict TS, a centralized design system, a data-driven content layer behind a repository interface (CMS-ready for Part 2), server-validated forms with a normalized lead model, centralized contact settings + analytics, and full SEO/structured-data. Reuse only the conversion-taxonomy concept from the legacy code.
