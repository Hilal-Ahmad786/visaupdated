/**
 * Central, typed configuration for the provider appointment-process consultancy
 * landing pages (AS Visa / BLS / iDATA / Kosmos search intent).
 *
 * These pages target users searching for appointment help at third-party visa
 * application centres. VİS Vize is an INDEPENDENT, private consultancy — never
 * an official centre. Every page therefore carries the mandatory disclaimer and
 * names the provider ONLY to describe the user's search intent. This module is
 * SERVER-ONLY (imported by the route, the parent index and the sitemap); client
 * components receive just their own page's serialisable data as props.
 *
 * Content is composed from compact per-page definitions + shared builders, so
 * all 41 pages are genuinely differentiated by provider/city/country without
 * duplicated page files.
 */

import { siteUrl } from '@/config/site';

export type RandevuProvider = 'AS Visa' | 'BLS' | 'iDATA' | 'Kosmos';

export interface RandevuFaqItem {
  question: string;
  answer: string;
}

/** Fully-resolved landing-page configuration (the shape rendered by the route). */
export interface RandevuLandingPage {
  slug: string;
  providerName: RandevuProvider;
  pageIntent: string;
  country: string;
  city: string;
  h1: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  finalUrl: string;
  faqItems: RandevuFaqItem[];
}

export const RANDEVU_BASE_PATH = '/vize-randevu-danismanligi';

/** Constant eyebrow used across every page (per compliance brief). */
const HERO_EYEBROW = 'Bağımsız Vize Randevu Süreci Danışmanlığı';

const CTA_PRIMARY = 'Ön Değerlendirme Formu';
const CTA_SECONDARY = 'WhatsApp ile Bilgi Al';

/**
 * The mandatory, above-the-fold disclaimer box text. Includes the required
 * "resmi kurum ücretleri ile firmamızın hizmet bedeli ayrıdır" sentence so a
 * single prominent box satisfies the whole compliance requirement.
 */
export const RANDEVU_DISCLAIMER =
  'VİS Vize Randevu Hizmetleri Ltd. Şti. bağımsız ve özel bir vize danışmanlık firmasıdır. ' +
  'Resmi bir devlet kurumu, konsolosluk, büyükelçilik veya vize başvuru merkezi değildir. ' +
  'Randevu tarihi, vize sonucu veya vize onayı garanti edilmez. ' +
  'Resmi kurum ücretleri ile firmamızın hizmet bedeli birbirinden ayrıdır.';

/** Shared, page-agnostic section content (identical on every page). */
export const RANDEVU_SERVICES = {
  title: 'Bu hizmet kapsamında neler sunulur?',
  items: [
    'Randevu süreci hakkında bilgilendirme',
    'Evrak ve form kontrol desteği',
    'Başvuru türüne uygun belge planlaması',
    'Randevu öncesi dosya hazırlığı kontrolü',
    'Süreç boyunca danışmanlık ve takip desteği',
  ],
} as const;

export const RANDEVU_NOT_GUARANTEED = {
  title: 'Ne garanti edilmez?',
  items: [
    'Randevu tarihi garanti edilmez',
    'Vize onayı garanti edilmez',
    'Resmi kurumlar adına işlem yapıldığı iddia edilmez',
    'Başvuru sonucu üzerinde karar yetkisi yoktur',
  ],
} as const;

export const RANDEVU_PROCESS = {
  title: 'Nasıl ilerliyoruz?',
  steps: [
    'Ön değerlendirme formunu doldurun',
    'Seyahat amacınızı ve başvuru türünüzü belirleyelim',
    'Evrak ve form kontrol sürecini planlayalım',
    'Randevu süreci hakkında bilgilendirme ve takip desteği sunalım',
    'Başvuru gününe kadar dosya hazırlığınızı kontrol edelim',
  ],
} as const;

/** Neutral, non-affiliated description of each provider (search-intent only). */
const PROVIDER_CONTEXT: Record<RandevuProvider, string> = {
  'AS Visa': 'AS Visa başvuru merkezi',
  BLS: 'BLS International başvuru merkezi',
  iDATA: 'iDATA başvuru merkezi',
  Kosmos: 'Kosmos Vize başvuru merkezi',
};

type TitleWord = 'Danışmanlığı' | 'Desteği' | 'Bilgilendirme';

/** Compact per-page definition — everything else is derived by `assemble`. */
interface PageDef {
  slug: string;
  provider: RandevuProvider;
  /** Display city (e.g. "Ankara") — empty for generic/country pages. */
  city?: string;
  /** Display country (e.g. "Macaristan") — empty for generic/city pages. */
  country?: string;
  /** Title suffix word; defaults to "Desteği" (base pages use "Danışmanlığı"). */
  titleWord?: TitleWord;
}

const PAGE_DEFS: PageDef[] = [
  // ---------------- AS Visa ----------------
  { slug: 'as-visa-randevu-destegi', provider: 'AS Visa', titleWord: 'Danışmanlığı' },
  { slug: 'as-visa-ankara-randevu-destegi', provider: 'AS Visa', city: 'Ankara' },
  { slug: 'as-visa-istanbul-randevu-destegi', provider: 'AS Visa', city: 'İstanbul' },
  { slug: 'as-visa-macaristan-randevu-destegi', provider: 'AS Visa', country: 'Macaristan' },
  { slug: 'as-visa-portekiz-randevu-destegi', provider: 'AS Visa', country: 'Portekiz' },
  { slug: 'as-visa-slovenya-randevu-destegi', provider: 'AS Visa', country: 'Slovenya' },

  // ---------------- BLS ----------------
  { slug: 'bls-randevu-destegi', provider: 'BLS', titleWord: 'Danışmanlığı' },
  { slug: 'bls-ispanya-randevu-destegi', provider: 'BLS', country: 'İspanya' },
  { slug: 'bls-ankara-randevu-destegi', provider: 'BLS', city: 'Ankara' },
  { slug: 'bls-izmir-randevu-destegi', provider: 'BLS', city: 'İzmir' },
  { slug: 'bls-istanbul-randevu-destegi', provider: 'BLS', city: 'İstanbul' },

  // ---------------- iDATA ----------------
  { slug: 'idata-randevu-destegi', provider: 'iDATA', titleWord: 'Danışmanlığı' },
  { slug: 'idata-almanya-randevu-destegi', provider: 'iDATA', country: 'Almanya' },
  { slug: 'idata-italya-randevu-destegi', provider: 'iDATA', country: 'İtalya' },
  { slug: 'idata-ankara-randevu-destegi', provider: 'iDATA', city: 'Ankara' },
  { slug: 'idata-izmir-randevu-destegi', provider: 'iDATA', city: 'İzmir' },
  { slug: 'idata-istanbul-randevu-destegi', provider: 'iDATA', city: 'İstanbul' },
  { slug: 'idata-bursa-randevu-destegi', provider: 'iDATA', city: 'Bursa' },
  { slug: 'idata-gaziantep-randevu-destegi', provider: 'iDATA', city: 'Gaziantep' },
  { slug: 'idata-trabzon-randevu-destegi', provider: 'iDATA', city: 'Trabzon' },
  { slug: 'idata-antalya-randevu-destegi', provider: 'iDATA', city: 'Antalya' },
  { slug: 'idata-gayrettepe-randevu-destegi', provider: 'iDATA', city: 'Gayrettepe', titleWord: 'Bilgilendirme' },
  { slug: 'idata-altunizade-randevu-destegi', provider: 'iDATA', city: 'Altunizade', titleWord: 'Bilgilendirme' },

  // ---------------- Kosmos ----------------
  { slug: 'kosmos-randevu-destegi', provider: 'Kosmos', titleWord: 'Danışmanlığı' },
  { slug: 'kosmos-yunanistan-randevu-destegi', provider: 'Kosmos', country: 'Yunanistan' },
  { slug: 'kosmos-istanbul-randevu-destegi', provider: 'Kosmos', city: 'İstanbul' },
  { slug: 'kosmos-ankara-randevu-destegi', provider: 'Kosmos', city: 'Ankara' },
  { slug: 'kosmos-izmir-randevu-destegi', provider: 'Kosmos', city: 'İzmir' },
  { slug: 'kosmos-trabzon-randevu-destegi', provider: 'Kosmos', city: 'Trabzon' },
  { slug: 'kosmos-bursa-randevu-destegi', provider: 'Kosmos', city: 'Bursa' },
  { slug: 'kosmos-canakkale-randevu-destegi', provider: 'Kosmos', city: 'Çanakkale' },
  { slug: 'kosmos-fethiye-randevu-destegi', provider: 'Kosmos', city: 'Fethiye' },
  { slug: 'kosmos-antalya-randevu-destegi', provider: 'Kosmos', city: 'Antalya' },
  { slug: 'kosmos-ayvalik-randevu-destegi', provider: 'Kosmos', city: 'Ayvalık' },
  { slug: 'kosmos-bodrum-randevu-destegi', provider: 'Kosmos', city: 'Bodrum', titleWord: 'Bilgilendirme' },
  { slug: 'kosmos-kusadasi-randevu-destegi', provider: 'Kosmos', city: 'Kuşadası' },
  { slug: 'kosmos-marmaris-randevu-destegi', provider: 'Kosmos', city: 'Marmaris' },
  { slug: 'kosmos-gaziantep-randevu-destegi', provider: 'Kosmos', city: 'Gaziantep' },
  { slug: 'kosmos-edirne-randevu-destegi', provider: 'Kosmos', city: 'Edirne' },
  { slug: 'kosmos-kirklareli-randevu-destegi', provider: 'Kosmos', city: 'Kırklareli' },
  { slug: 'kosmos-corlu-randevu-destegi', provider: 'Kosmos', city: 'Çorlu' },
];

/* ---------------- Derived-text builders ---------------- */

/** "AS Visa Ankara" / "AS Visa Macaristan" / "AS Visa" */
function providerLabel(def: PageDef): string {
  const location = def.city || def.country;
  return location ? `${def.provider} ${location}` : def.provider;
}

function buildFaqItems(def: PageDef): RandevuFaqItem[] {
  const label = providerLabel(def);
  const centre = PROVIDER_CONTEXT[def.provider];

  return [
    {
      // Provider/location-aware first item → unique FAQ set (and FAQ schema) per page.
      question: `${label} randevu sürecinde ne tür destek veriyorsunuz?`,
      answer:
        `${centre} üzerinden randevu arayan başvuru sahiplerine; randevu süreci hakkında ` +
        'bilgilendirme, evrak ve form kontrolü, başvuru türüne uygun belge planlaması ve ' +
        'başvuru öncesi dosya hazırlığı konularında bağımsız danışmanlık desteği sunuyoruz. ' +
        'VİS Vize resmi bir başvuru merkezi değildir; randevu tarihi veya vize onayı garanti edilmez.',
    },
    {
      question: 'VİS Vize resmi başvuru merkezi mi?',
      answer:
        'Hayır. VİS Vize özel ve bağımsız bir danışmanlık firmasıdır. Resmi kurum, konsolosluk, ' +
        'büyükelçilik veya resmi başvuru merkezi değildir.',
    },
    {
      question: 'Randevu tarihi garanti ediyor musunuz?',
      answer:
        'Hayır. Randevu uygunluğu ilgili sistemlerin ve resmi süreçlerin durumuna bağlıdır. ' +
        'Firmamız randevu süreci bilgilendirme ve danışmanlık desteği sunar.',
    },
    {
      question: 'Vize onayı garanti edilir mi?',
      answer:
        'Hayır. Vize sonucu ilgili resmi kurumların değerlendirmesine bağlıdır. Firmamız yalnızca ' +
        'danışmanlık, evrak kontrolü ve süreç planlama desteği sunar.',
    },
    {
      question: 'Hizmet bedeli resmi ücretlerden ayrı mı?',
      answer:
        'Evet. VİS Vize’nin danışmanlık hizmet bedeli, resmi kurum veya başvuru merkezi ' +
        'ücretlerinden ayrıdır.',
    },
  ];
}

function assemble(def: PageDef): RandevuLandingPage {
  const label = providerLabel(def);
  const centre = PROVIDER_CONTEXT[def.provider];
  const titleWord: TitleWord = def.titleWord ?? 'Desteği';

  const h1 = `${label} Randevu Süreci ${titleWord}`;
  // Brand suffix is added by the root layout's title template (`%s | VİS VİZE`),
  // so it must NOT be repeated here.
  const metaTitle = `${label} Randevu Süreci ${titleWord}`;
  const metaDescription =
    `${label} randevu süreci için bağımsız danışmanlık, evrak kontrolü ve form desteği alın. ` +
    'Resmi kurum değiliz; randevu veya onay garantisi verilmez.';

  const heroText =
    `VİS Vize, ${centre} üzerinden randevu arayan başvuru sahiplerine bağımsız danışmanlık ` +
    'sunar: randevu süreci hakkında bilgilendirme, evrak ve form kontrol desteği, başvuru ' +
    'türüne uygun belge planlaması ve süreç boyunca takip desteği. VİS Vize özel ve bağımsız ' +
    'bir danışmanlık firmasıdır; resmi bir başvuru merkezi değildir.';

  return {
    slug: def.slug,
    providerName: def.provider,
    pageIntent: `${label} randevu süreci danışmanlığı`,
    country: def.country ?? '',
    city: def.city ?? '',
    h1,
    eyebrow: HERO_EYEBROW,
    metaTitle,
    metaDescription,
    heroText,
    ctaPrimaryText: CTA_PRIMARY,
    ctaSecondaryText: CTA_SECONDARY,
    finalUrl: `${siteUrl}${RANDEVU_BASE_PATH}/${def.slug}`,
    faqItems: buildFaqItems(def),
  };
}

/* ---------------- Assembly + public API ---------------- */

const RANDEVU_PAGE_LIST: RandevuLandingPage[] = PAGE_DEFS.map(assemble);

const RANDEVU_PAGE_MAP: Record<string, RandevuLandingPage> = Object.fromEntries(
  RANDEVU_PAGE_LIST.map((p) => [p.slug, p]),
);

// Build-time integrity checks: unique slugs + expected count.
if (process.env.NODE_ENV !== 'production') {
  if (Object.keys(RANDEVU_PAGE_MAP).length !== RANDEVU_PAGE_LIST.length) {
    throw new Error('Duplicate slug in randevuLandingPages PAGE_DEFS');
  }
  if (RANDEVU_PAGE_LIST.length !== 41) {
    throw new Error(`Expected 41 randevu landing pages, got ${RANDEVU_PAGE_LIST.length}`);
  }
}

export function getRandevuPage(slug: string): RandevuLandingPage | undefined {
  return RANDEVU_PAGE_MAP[slug];
}

export function getAllRandevuPages(): RandevuLandingPage[] {
  return RANDEVU_PAGE_LIST;
}

export interface RandevuProviderGroup {
  provider: RandevuProvider;
  pages: RandevuLandingPage[];
}

/** Pages grouped by provider (parent-index ordering: AS Visa → BLS → iDATA → Kosmos). */
export function getRandevuPagesByProvider(): RandevuProviderGroup[] {
  const order: RandevuProvider[] = ['AS Visa', 'BLS', 'iDATA', 'Kosmos'];
  return order.map((provider) => ({
    provider,
    pages: RANDEVU_PAGE_LIST.filter((p) => p.providerName === provider),
  }));
}
