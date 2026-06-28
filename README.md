# VİS VİZE RANDEVU HİZMETLERİ — Website (Part 1)

Conversion-focused, mobile-first public website for a Turkish visa **consultancy & support** service. Built to the approved VİS VİZE design system, architected so the Part 2 admin panel/CMS can be added without rewriting the public site.

> VİS VİZE is **not** an official consulate, embassy, visa application centre or government body. It provides consultancy and support; final decisions rest with the relevant authorities.

## Stack

- **Next.js 14** (App Router, Server Components) · **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS 3** with a centralized brand token theme · **next/font** (Manrope + Inter)
- **react-hook-form + Zod** (shared schemas, client+server validation)
- **lucide-react** icons · Vitest (unit tests)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm test` | Vitest unit tests |
| `npm run format` | Prettier |

## Environment variables

See `.env.example`. Contact details, analytics IDs, the production URL, the token secret, and the (Part 2) database/email provider are all env-driven. Real business data is still pending — see `docs/CONTENT_PLACEHOLDERS.md`.

## Architecture

```
src/
  app/            # routes (App Router) + /api/leads + sitemap.ts + robots.ts
  components/     # layout, navigation, conversion, forms, countries, services, blog, faq, search, ui, legal, seo, analytics
  config/         # site.ts (contact/nav/disclaimer), form-options.ts
  content/        # repository.ts (ContentRepository) + seed/*  ← swap point for Part 2 CMS
  hooks/          # useLeadSubmit
  lib/            # analytics, seo, leads (tokens/rate-limit/dedupe), utils
  schemas/        # forms.ts (shared Zod schemas)
  types/          # content.ts, lead.ts
```

- **Data architecture** — UI reads content only through `getContentRepository()` (async, CMS-shaped, published-only). Part 1 = typed seed; Part 2 = DB implementation of the same interface. See `docs/PART_2_READINESS.md`.
- **Form architecture** — every public form validates with a shared Zod schema on the client (UX) and again on the server (trust), then POSTs to `/api/leads` (rate limit, honeypot+timing, duplicate detection, normalized `Lead`, signed thank-you token). See the form components + `src/lib/leads.ts`.
- **Search architecture** — `/arama` loads the four content collections and filters client-side (accent-insensitive), grouped by type, `noindex`. Privacy-safe analytics (counts only).
- **SEO** — `metadataBase`, per-page canonical + OG/Twitter via `lib/seo.ts`; `sitemap.ts`/`robots.ts`; JSON-LD (Organization, Breadcrumb, FAQ, Article).
- **Analytics** — centralized `trackEvent()` (no direct gtag in components, PII stripped). GA4/GTM load only when env IDs are set. Lead conversion fires once, only on a token-verified thank-you.
- **Conversion** — global utility-bar phone, header phone + Ön Başvuru, mobile sticky call/form bar, floating WhatsApp, and click-to-call banners on landing pages.

## Deployment

Optimized for Vercel (or any Node host — the app uses server rendering + a Node API route, **not** static export). Set env vars in the host. Legacy English routes redirect map is staged in `docs/LEGACY_ROUTE_MIGRATION.md`.

## Docs

- `docs/LEGACY_AUDIT.md` · `docs/IMPLEMENTATION_PLAN_PART_1.md` · `docs/CONTENT_PLACEHOLDERS.md`
- `docs/LEGACY_ROUTE_MIGRATION.md` · `docs/PART_2_READINESS.md` · `docs/QA_CHECKLIST.md`

## Admin panel (Part 2)

The full operations panel lives under `/admin` (noindex, route-guarded). Public site and admin share the design system but are functionally separate (no public header/footer on admin; no admin chrome on public).

### Demo access

The admin uses a **mock auth** seam (signed session cookie) — replace `checkCredentials`/`getCurrentUser` in `src/lib/auth/session.ts` with a real provider without touching the screens. Demo accounts (password **`visvize-demo`** for all):

| Email | Role | Sees |
| --- | --- | --- |
| `yonetici@visvize.com` | Süper Yönetici | everything |
| `editor@visvize.com` | İçerik Editörü | content modules only |
| `temsilci@visvize.com` | Müşteri Temsilcisi | leads + pipeline only |

Sign in at `/admin/giris`. The navigation is permission-filtered, so each role sees a different sidebar.

### Admin routes (Screens 21–38)

`/admin` dashboard · `/admin/leads` + `/leads/[id]` · `/admin/pipeline` (kanban) · `/admin/ulkeler` + `/[id]` · `/admin/ulke-sayfalari` + `/[id]` (landing editor) · `/admin/hizmetler` + `/[id]` · `/admin/blog` + `/[id]` · `/admin/sss` + `/[id]` · `/admin/formlar` + `/[id]` (form builder) · `/admin/ana-sayfa` (homepage editor) · `/admin/navigasyon` · `/admin/takip-ayarlari` · `/admin/genel-ayarlar` · `/admin/kullanicilar` + `/[id]` · `/admin/roller` + `/[id]` · `/admin/denetim-kayitlari` + `/[id]` · `/yasal/[slug]` (legal template, Screen 21).

### Admin architecture

- **Permissions** — `module:action` strings; `can()/canAccessModule()/canViewSensitiveData()/canPublish()` in `src/lib/auth/permissions.ts`. The server route guard `requireAdmin(module)` is the real boundary; UI gating is cosmetic.
- **Mock data** — typed, centralized in `src/lib/data/*` (leads, pipeline, users/roles, audit, forms, settings), shaped like API boundaries. Swap for a DB with no screen changes.
- **Security posture** — PII masked by default with an audited reveal flow (`SensitiveValue`); audit events immutable; form preview never creates production leads; pipeline blocks invalid transitions; tracking rejects PII params and arbitrary JS; passwords/tokens/MFA secrets never rendered.

> All admin data is **demo/mock**. Interactions (save/publish/assign/export) show realistic UI feedback (toasts/dialogs) but do not persist — they are the integration seam for a real backend.

## Part 2 preparation

Content repository abstraction, normalized lead model + single intake API, env-driven tracking, role/audit extension points, and `/admin` reserved + robots-disallowed. Full details in `docs/PART_2_READINESS.md`.
