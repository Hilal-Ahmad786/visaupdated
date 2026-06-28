# Part 2 Readiness — Admin Panel & CMS

Part 1 was built so the remaining 18 admin/management screens can be added **without rewriting the public site**. This documents the extension points.

## Content: swap seed → database with zero page changes

- All public pages read content through the **`ContentRepository`** interface (`src/content/repository.ts`), never from seed modules directly.
- Part 1 ships `SeedContentRepository` (typed local data). Part 2 adds `DbContentRepository` implementing the same interface; `getContentRepository()` branches on `process.env.DATABASE_URL`.
- Domain types (`src/types/content.ts`) already carry CMS fields: `status` (published/draft/archived), `SeoMeta`, slugs, relations, `verified` flags. Drafts/archived never leak (repo filters), satisfying the "no private/draft content in public APIs" rule.
- **Country/Service/FAQ/Blog CRUD readiness**: each is a flat, typed collection keyed by slug → maps directly to DB tables + admin editors. Homepage sections, navigation, footer, and legal pages are likewise data objects (`config/site.ts`, `seed/legal.ts`) ready to become editable settings.

## Leads: normalized model + single intake

- **`Lead`** (`src/types/lead.ts`) already includes every field the admin lead screens need: reference, campaign/UTM, status enum (matches design's 9 lead statuses), consent timestamps, assignment/notes placeholders, metadata.
- All public forms funnel through **one** API route (`/api/leads`) → `persistLead()`. Part 2 replaces the in-memory store with a DB write; the lead table, pipeline, appointment-requests, form-submissions, spam, and export screens build on this one shape.
- **Spam/blocked**: honeypot + timing + rate-limit + duplicate detection already classify/reject; persist these as `status: 'spam'` for the admin "Spam / Blocked" screen.

## Auth / roles / audit (extension points, not yet implemented)

- Admin routes will live under a separate `/admin` segment (already `Disallow`ed in `robots.ts`). Add `middleware.ts` for auth gating.
- `Lead.assignedUserId` and `notes` are placeholders for user assignment.
- Recommended: add `User`, `Role`, `Permission`, `AuditLog` tables; the lead `status` history and "recent content changes" dashboard cards map to an audit log.

## Tracking settings

- Analytics is centralized (`src/lib/analytics.ts`) and reads IDs from env today. Part 2 admin "Tracking Settings" writes GA4/GTM/Ads IDs + conversion labels + per-event enable/test-mode/consent-mode into settings; `Analytics.tsx` and `trackLeadConversion()` read from there.
- **Consent mode**: `trackEvent()` is the single gate — wrap it with a consent check in Part 2 (cookie categories: necessary/analytics/advertising/functional). Map embed already uses click-to-load (no pre-consent third-party load).

## Forms (Form Builder readiness)

- Form steps/fields/copy/consent are defined in shared Zod schemas + step arrays (`src/schemas/forms.ts`, form components). The design's Form Builder will generate these from DB config; the runtime already separates schema (validation) from presentation (fields).
- Thank-you page settings + notification settings map to the existing token/verify + `notify()` stub.

## Remaining work for Part 2

Database + migrations; `DbContentRepository`; admin auth (login/2FA/reset) + RBAC + audit log; admin UI (dashboard, leads, CRUD editors, form builder, tracking, settings, media library, redirect manager, cookie settings); real email provider wiring; cookie-consent banner gating `trackEvent`/scripts; replace logo placeholder; supply verified content (see `CONTENT_PLACEHOLDERS.md`).
