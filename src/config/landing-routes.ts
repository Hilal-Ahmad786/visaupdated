/**
 * Lightweight, client-safe registry of Google Ads landing-page routes.
 *
 * This module intentionally holds ONLY slug strings (no page content) so client
 * components — e.g. the mobile conversion bar deciding whether to hide itself —
 * can import it without pulling the full 36-page configuration into the browser
 * bundle. The rich, typed configuration lives in `src/data/googleAdsLandingPages.ts`,
 * which validates itself against these arrays.
 */

/** Canonical, indexable landing-page slugs (no leading slash). */
export const LANDING_PAGE_SLUGS = [
  // 01 — Genel Vize Danışmanlığı
  'almanya-vizesi',
  'fransa-vizesi',
  'hollanda-vizesi',
  'yunanistan-vizesi',
  'macaristan-vizesi',
  'danimarka-vizesi',
  'avusturya-vizesi',
  'polonya-vizesi',
  // 02 — Vize Randevu Hizmeti
  'almanya-vize-randevu',
  'fransa-vize-randevu',
  'hollanda-vize-randevu',
  'yunanistan-vize-randevu',
  'macaristan-vize-randevu',
  'danimarka-vize-randevu',
  'avusturya-vize-randevu',
  'polonya-vize-randevu',
  // 03 — Schengen ve Turistik Vize
  'almanya-schengen-vizesi',
  'yunanistan-schengen-vizesi',
  'fransa-schengen-vizesi',
  'hollanda-schengen-vizesi',
  'macaristan-schengen-vizesi',
  'almanya-turistik-vize',
  'hollanda-turistik-vize',
  'fransa-turistik-vize',
  // 04 — Öğrenci ve Erasmus Vizesi
  'almanya-ogrenci-vizesi',
  'polonya-ogrenci-vizesi',
  'fransa-ogrenci-vizesi',
  'hollanda-ogrenci-vizesi',
  'almanya-erasmus-vizesi',
  'polonya-erasmus-vizesi',
  // 05 — Çalışma, Aile ve Ticari Vize
  'almanya-isci-vizesi',
  'hollanda-isci-vizesi',
  'polonya-isci-vizesi',
  'almanya-aile-birlesimi-vizesi',
  'fransa-aile-birlesimi-vizesi',
  'almanya-ticari-vize',
] as const;

export type LandingPageSlug = (typeof LANDING_PAGE_SLUGS)[number];

/**
 * Permanent (308) alias redirects. Keys are alternative ad-group slugs that must
 * redirect to the canonical page. Aliases are NEVER added to the sitemap.
 */
export const LANDING_ALIAS_REDIRECTS: Record<string, LandingPageSlug> = {
  'almanya-calisma-vizesi': 'almanya-isci-vizesi',
  'hollanda-calisma-vizesi': 'hollanda-isci-vizesi',
  'polonya-calisma-vizesi': 'polonya-isci-vizesi',
};

const slugSet = new Set<string>(LANDING_PAGE_SLUGS);

/** True when a path (with or without leading slash) is a canonical landing page. */
export function isLandingRoute(pathname: string): boolean {
  const slug = pathname.replace(/^\//, '');
  return slugSet.has(slug);
}
