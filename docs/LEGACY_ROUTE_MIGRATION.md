# Legacy Route Migration

The previous site (`Hilal-Ahmad786/visaupdated`) used English routes. New site uses Turkish slugs aligned to the design system. Map below.

| Legacy URL | New URL | Action | Notes |
| --- | --- | --- | --- |
| `/` | `/` | Keep | Rebuilt |
| `/application` | `/online-on-basvuru` | **301 Redirect** | Pre-application |
| `/appointment` | `/randevu-talebi` | **301 Redirect** | |
| `/blog` | `/blog` | Keep | |
| `/contact` | `/iletisim` | **301 Redirect** | |
| `/countries` | `/vize-ulkeleri` | **301 Redirect** | |
| `/faq` | `/sss` | **301 Redirect** | |
| `/services` | `/hizmetler` | **301 Redirect** | |
| `/tesekkurler` | `/tesekkurler` | Keep | Now token-verified |
| (none) | `/schengen-vizesi` | New | |
| (none) | `/vize-sureci` | New | |
| (none) | `/hakkimizda` | New | |
| (none) | `/arama` | New | noindex |
| (none) | `/vize-ulkeleri/[slug]` | New | dynamic |
| (none) | `/hizmetler/[slug]` | New | dynamic |
| (none) | `/blog/[slug]` | New | dynamic |
| (none) | `/sss/[slug]` | New | dynamic |
| (none) | `/yasal/[slug]` | New | legal |

## Implementation

Add to `next.config.mjs` (uncomment/extend when cutting over from the legacy deployment):

```js
async redirects() {
  return [
    { source: '/application', destination: '/online-on-basvuru', permanent: true },
    { source: '/appointment', destination: '/randevu-talebi', permanent: true },
    { source: '/contact', destination: '/iletisim', permanent: true },
    { source: '/countries', destination: '/vize-ulkeleri', permanent: true },
    { source: '/faq', destination: '/sss', permanent: true },
    { source: '/services', destination: '/hizmetler', permanent: true },
  ];
}
```

> These are staged here rather than committed live because the legacy English routes are a **separate deployment**. Enable them on the domain that previously served the old site so existing inbound links/SEO are preserved. Do **not** blanket-redirect unknown URLs to `/` — let `not-found.tsx` return a real 404.
