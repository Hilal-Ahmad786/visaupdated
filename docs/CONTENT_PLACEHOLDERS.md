# Content Placeholders — Awaiting Verified Data

Everything below uses **clearly-identifiable placeholders** in code/config. None of it is fabricated as fact. Provide verified values (env vars or, in Part 2, the admin panel) before going live.

## Contact & company (set via `.env.local`, see `.env.example`)

| Item | Placeholder | Where |
| --- | --- | --- |
| Display phone | `0850 000 00 00` | `NEXT_PUBLIC_PHONE_DISPLAY` |
| `tel:` phone (E.164) | `+908500000000` | `NEXT_PUBLIC_PHONE_E164` |
| WhatsApp display | `0500 000 00 00` | `NEXT_PUBLIC_WHATSAPP_DISPLAY` |
| WhatsApp E.164 | `905000000000` | `NEXT_PUBLIC_WHATSAPP_E164` |
| Email | `info@visvize.com` | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Office address | "Adres bilgisi yakında eklenecektir" | `src/config/site.ts` (move to env/admin) |
| Working hours | Mon–Fri 09:00–18:00 etc. | `src/config/site.ts` |
| Registered legal name | "VİS VİZE RANDEVU HİZMETLERİ" | `src/config/site.ts` `brand.legalName` |
| Tax / trade registry info | — (none) | needed for legal/footer |
| Production domain | `https://www.visvize.com` | `NEXT_PUBLIC_SITE_URL` |
| Map embed URL | none (click-to-load placeholder) | `MapPlaceholder` prop |

## Brand asset

- **Logo file**: no image asset existed in the source repo. `src/components/layout/Logo.tsx` renders a navy+gold SVG **wordmark placeholder** following the brand direction. Drop the official logo into `/public` and swap the SVG for `next/image`.
- **OG image**: `/og-default.png` is referenced but not present — add a 1200×630 social image.

## Marketing / tracking (env now, admin in Part 2)

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_ADS_LEAD_CONVERSION_LABEL` — all blank; analytics & conversions are inert until set.

## Trust / proof (intentionally hidden until verified)

- **Testimonials**: `src/content/seed/testimonials.ts` is empty; repository filters to `verified === true` only → **none render**. Add real, consented reviews.
- **Trust metrics** (supported countries, response time): `verified: false` in `src/content/seed/settings.ts` → **About page hides them**. Confirm real figures.
- **Statistics / years of experience / client counts / awards / team profiles / office photos**: none created (no fabrication). Add when verified.

## Service / pricing

- **Service prices**: only qualitative `pricingNote` shown ("ücret kapsama göre belirlenir"). No numeric prices invented. Provide a pricing model if prices should be displayed.
- **Supported countries list**: seed contains Almanya, Fransa, İtalya, İspanya, Hollanda, Yunanistan (all Schengen). Confirm the real supported-country set and expand seed/CMS.

## Legal content

- `src/content/seed/legal.ts` holds **placeholder** KVKK / Açık Rıza / Gizlilik / Çerez / Kullanım Şartları / Yasal Bilgilendirme text with a prominent "awaiting final approved text" notice. Replace with lawyer-approved copy.

## Infrastructure

- **Email provider**: `EMAIL_PROVIDER` blank → lead notification is a no-op stub. Configure a transactional provider (Resend/Postmark) + `EMAIL_API_KEY` to enable admin/visitor emails.
- **Newsletter**: not implemented (no provider). Blog uses a consultation CTA instead, per the "only if infrastructure exists" rule.
- **Lead storage**: in-memory for Part 1. Connect `DATABASE_URL` + a `DbContentRepository`/lead store in Part 2.
