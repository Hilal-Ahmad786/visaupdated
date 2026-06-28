# Implementation Plan — Part 1 (Public Website)

Maps each approved screen to its route, components, data, forms, SEO, and states. **Status: all routes implemented and building.**

## Screen → route map

| # | Screen | Route | Page component | Key shared components | Data (repo) | Form | SEO | States |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1–2 | Homepage | `/` | `app/page.tsx` | Hero, TrustStrip, CountryCard, ServiceCard, ProcessTimeline, ArticleCard, FAQAccordion, ClickToCallBanner | countries, services, articles, testimonials | SimpleLeadForm (hero + bottom) | default + FAQ JSON-LD | verified-only testimonials hide |
| 3–4 | Schengen landing | `/schengen-vizesi` | `app/schengen-vizesi/page.tsx` | CountryDetail | `schengenLanding` seed + countries | SimpleLeadForm (preset) | metadataFromSeo + FAQ JSON-LD | — |
| 5–6 | Online pre-application | `/online-on-basvuru` | `app/online-on-basvuru/page.tsx` | PreApplicationForm (4-step) | countries | PreApplicationForm | buildMetadata | validation/submitting/duplicate/error |
| 7 | Thank-you | `/tesekkurler` | `app/tesekkurler/page.tsx` | ThankYouConversion | — (token verify) | — | **noindex** | verified / duplicate / unverified-direct |
| 8 | Appointment request | `/randevu-talebi` | `app/randevu-talebi/page.tsx` | AppointmentForm (3-step) | countries | AppointmentForm | buildMetadata | availability disclaimer, validation |
| 9 | Contact | `/iletisim` | `app/iletisim/page.tsx` | Phone/WhatsApp/Email cards, MapPlaceholder, ContactForm, FAQAccordion | — | ContactForm (conditional ref #) | buildMetadata | map click-to-load |
| 10 | Countries listing | `/vize-ulkeleri` | `app/vize-ulkeleri/page.tsx` | CountriesExplorer (client), CountryCard | countries | SimpleLeadForm | buildMetadata | search/region filter, empty, unsupported-country |
| 11 | Country detail | `/vize-ulkeleri/[countrySlug]` | dynamic | CountryDetail, ApplicantStatusTabs | getCountryBySlug | SimpleLeadForm (preset) | metadataFromSeo + FAQ JSON-LD | notFound, missing |
| 12 | Services listing | `/hizmetler` | `app/hizmetler/page.tsx` | ServiceCard (grouped by category) | services, categories | SimpleLeadForm | buildMetadata + FAQ JSON-LD | — |
| 13 | Service detail | `/hizmetler/[serviceSlug]` | dynamic | ServiceDetail | getServiceBySlug | SimpleLeadForm (service) | metadataFromSeo + FAQ JSON-LD | notFound |
| 14 | Visa process | `/vize-sureci` | `app/vize-sureci/page.tsx` | ProcessTimeline, responsibility cards, FAQAccordion | — | SimpleLeadForm | buildMetadata + FAQ JSON-LD | processing-time disclaimer |
| 15 | About | `/hakkimizda` | `app/hakkimizda/page.tsx` | SectionHeading, FAQAccordion | siteSettings (verified-only metrics) | SimpleLeadForm | buildMetadata | optional sections hide cleanly |
| 16 | FAQ | `/sss` + `/sss/[faqSlug]` | listing + dynamic | FaqExplorer (client), FAQAccordion, FaqQuestionForm | faqs, categories | FaqQuestionForm | FAQ JSON-LD (published only) | search, empty |
| 17 | Blog listing | `/blog` | `app/blog/page.tsx` | BlogFilters (client), ArticleCard, Pagination | articles, categories | SimpleLeadForm (blog) | buildMetadata | featured, search, empty |
| 18 | Blog detail | `/blog/[articleSlug]` | dynamic | ArticleReader (progress+TOC), FAQAccordion | getArticleBySlug | SimpleLeadForm (blog) | metadataFromSeo + Article + breadcrumb JSON-LD | outdated-content note, prev/next |
| 19 | Global search | `/arama` | `app/arama/page.tsx` | SearchExperience (client) | all 4 content types | — | **noindex** | no-results, empty-query, best-match |
| 20 | 404 | `app/not-found.tsx` | framework not-found | PhoneLink, quick links | — (static) | mailto report | **noindex**, real 404 | recovery actions |
| — | Legal template | `/yasal/[slug]` | dynamic | StatusAlert, LegalDisclaimer | `legalPages` seed | — | buildMetadata | placeholder notice |

## Cross-cutting

- **Forms** → unified `POST /api/leads` (server validation, rate limit, honeypot+timing, duplicate detection, signed token) → redirect to `/tesekkurler?ref&t&type`.
- **Analytics** → `trackEvent()` everywhere; GA4/GTM loaded only if env IDs set; lead conversion fires only on verified thank-you.
- **SEO** → `metadataBase`, per-page canonical, OG/Twitter, `sitemap.ts`, `robots.ts`, JSON-LD (Organization global; Breadcrumb/FAQ/Article per page).
- **Conversion elements** (global): utility-bar phone, header phone + Ön Başvuru, `MobileConversionBar`, `FloatingWhatsApp`, `ClickToCallBanner` on landing pages.
