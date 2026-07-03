/**
 * Central, typed configuration for the 36 Google Ads landing pages.
 *
 * The dynamic route `src/app/(landing)/[landingSlug]/page.tsx` renders purely
 * from these objects — there is no per-page component. Content is composed from
 * per-visa-type builders (`data/landing/content.ts`) and per-country facts
 * (`data/landing/countries.ts`) so every page is genuinely differentiated by
 * both its visa type and country, without duplicated page components.
 *
 * This module is imported by SERVER code only (the route + sitemap). Client
 * components receive just their own page's serialisable data as props, so the
 * full 36-page config never enters the browser bundle.
 */

import { LANDING_PAGE_SLUGS, type LandingPageSlug } from '@/config/landing-routes';

import { buildLandingContent, whyChooseItems } from './landing/content';
import { getCountryProfile } from './landing/countries';
import type { LandingCategory, LandingPageConfig, RelatedPageLink } from './landing/types';

const HERO_EYEBROW = 'Türkiye Geneli Online Vize Danışmanlığı';

interface CampaignMeta {
  number: string;
  name: string;
  id: string;
}

const CAMPAIGNS: Record<string, CampaignMeta> = {
  '01': { number: '01', name: 'Genel Vize Danışmanlığı', id: 'camp-01' },
  '02': { number: '02', name: 'Vize Randevu Hizmeti', id: 'camp-02' },
  '03': { number: '03', name: 'Schengen ve Turistik Vize', id: 'camp-03' },
  '04': { number: '04', name: 'Öğrenci ve Erasmus Vizesi', id: 'camp-04' },
  '05': { number: '05', name: 'Çalışma, Aile ve Ticari Vize', id: 'camp-05' },
};

/** Raw ad-group definition. Everything else is derived from these + builders. */
interface PageDefinition {
  slug: LandingPageSlug;
  category: LandingCategory;
  countrySlug: string;
  adGroupNumber: string; // "01.01"
  adGroupName: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  landingCategoryLabel: string; // analytics/attribution grouping label
}

const PAGE_DEFINITIONS: PageDefinition[] = [
  // ---------- Campaign 01 — Genel Vize Danışmanlığı ----------
  {
    slug: 'almanya-vizesi',
    category: 'genel',
    countrySlug: 'almanya',
    adGroupNumber: '01.01',
    adGroupName: 'Almanya Genel Vize',
    primaryKeyword: 'Almanya vizesi',
    secondaryKeywords: [
      'Almanya vize danışmanlığı',
      'Almanya vize başvurusu',
      'Almanya vize işlemleri',
      'Almanya vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'fransa-vizesi',
    category: 'genel',
    countrySlug: 'fransa',
    adGroupNumber: '01.02',
    adGroupName: 'Fransa Genel Vize',
    primaryKeyword: 'Fransa vizesi',
    secondaryKeywords: [
      'Fransa vize danışmanlığı',
      'Fransa vize başvurusu',
      'Fransa vize işlemleri',
      'Fransa vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'hollanda-vizesi',
    category: 'genel',
    countrySlug: 'hollanda',
    adGroupNumber: '01.03',
    adGroupName: 'Hollanda Genel Vize',
    primaryKeyword: 'Hollanda vizesi',
    secondaryKeywords: [
      'Hollanda vize danışmanlığı',
      'Hollanda vize başvurusu',
      'Hollanda vize işlemleri',
      'Hollanda vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'yunanistan-vizesi',
    category: 'genel',
    countrySlug: 'yunanistan',
    adGroupNumber: '01.04',
    adGroupName: 'Yunanistan Genel Vize',
    primaryKeyword: 'Yunanistan vizesi',
    secondaryKeywords: [
      'Yunanistan vize danışmanlığı',
      'Yunanistan vize başvurusu',
      'Yunanistan vize işlemleri',
      'Yunanistan vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'macaristan-vizesi',
    category: 'genel',
    countrySlug: 'macaristan',
    adGroupNumber: '01.05',
    adGroupName: 'Macaristan Genel Vize',
    primaryKeyword: 'Macaristan vizesi',
    secondaryKeywords: [
      'Macaristan vize danışmanlığı',
      'Macaristan vize başvurusu',
      'Macaristan vize işlemleri',
      'Macaristan vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'danimarka-vizesi',
    category: 'genel',
    countrySlug: 'danimarka',
    adGroupNumber: '01.06',
    adGroupName: 'Danimarka Genel Vize',
    primaryKeyword: 'Danimarka vizesi',
    secondaryKeywords: [
      'Danimarka vize danışmanlığı',
      'Danimarka vize başvurusu',
      'Danimarka vize işlemleri',
      'Danimarka vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'avusturya-vizesi',
    category: 'genel',
    countrySlug: 'avusturya',
    adGroupNumber: '01.07',
    adGroupName: 'Avusturya Genel Vize',
    primaryKeyword: 'Avusturya vizesi',
    secondaryKeywords: [
      'Avusturya vize danışmanlığı',
      'Avusturya vize başvurusu',
      'Avusturya vize işlemleri',
      'Avusturya vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },
  {
    slug: 'polonya-vizesi',
    category: 'genel',
    countrySlug: 'polonya',
    adGroupNumber: '01.08',
    adGroupName: 'Polonya Genel Vize',
    primaryKeyword: 'Polonya vizesi',
    secondaryKeywords: [
      'Polonya vize danışmanlığı',
      'Polonya vize başvurusu',
      'Polonya vize işlemleri',
      'Polonya vizesi için gerekli evraklar',
    ],
    landingCategoryLabel: 'Genel Vize',
  },

  // ---------- Campaign 02 — Vize Randevu Hizmeti ----------
  {
    slug: 'almanya-vize-randevu',
    category: 'randevu',
    countrySlug: 'almanya',
    adGroupNumber: '02.01',
    adGroupName: 'Almanya Vize Randevu',
    primaryKeyword: 'Almanya vizesi randevu',
    secondaryKeywords: [
      'Almanya vize randevusu',
      'Almanya vize randevu desteği',
      'Almanya vize randevu danışmanlığı',
      'Almanya vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'fransa-vize-randevu',
    category: 'randevu',
    countrySlug: 'fransa',
    adGroupNumber: '02.02',
    adGroupName: 'Fransa Vize Randevu',
    primaryKeyword: 'Fransa vizesi randevu',
    secondaryKeywords: [
      'Fransa vize randevusu',
      'Fransa vize randevu desteği',
      'Fransa vize randevu danışmanlığı',
      'Fransa vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'hollanda-vize-randevu',
    category: 'randevu',
    countrySlug: 'hollanda',
    adGroupNumber: '02.03',
    adGroupName: 'Hollanda Vize Randevu',
    primaryKeyword: 'Hollanda vizesi randevu',
    secondaryKeywords: [
      'Hollanda vize randevusu',
      'Hollanda vize randevu desteği',
      'Hollanda vize randevu danışmanlığı',
      'Hollanda vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'yunanistan-vize-randevu',
    category: 'randevu',
    countrySlug: 'yunanistan',
    adGroupNumber: '02.04',
    adGroupName: 'Yunanistan Vize Randevu',
    primaryKeyword: 'Yunanistan vizesi randevu',
    secondaryKeywords: [
      'Yunanistan vize randevusu',
      'Yunanistan vize randevu desteği',
      'Yunanistan vize randevu danışmanlığı',
      'Yunanistan vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'macaristan-vize-randevu',
    category: 'randevu',
    countrySlug: 'macaristan',
    adGroupNumber: '02.05',
    adGroupName: 'Macaristan Vize Randevu',
    primaryKeyword: 'Macaristan vizesi randevu',
    secondaryKeywords: [
      'Macaristan vize randevusu',
      'Macaristan vize randevu desteği',
      'Macaristan vize randevu danışmanlığı',
      'Macaristan vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'danimarka-vize-randevu',
    category: 'randevu',
    countrySlug: 'danimarka',
    adGroupNumber: '02.06',
    adGroupName: 'Danimarka Vize Randevu',
    primaryKeyword: 'Danimarka vizesi randevu',
    secondaryKeywords: [
      'Danimarka vize randevusu',
      'Danimarka vize randevu desteği',
      'Danimarka vize randevu danışmanlığı',
      'Danimarka vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'avusturya-vize-randevu',
    category: 'randevu',
    countrySlug: 'avusturya',
    adGroupNumber: '02.07',
    adGroupName: 'Avusturya Vize Randevu',
    primaryKeyword: 'Avusturya vizesi randevu',
    secondaryKeywords: [
      'Avusturya vize randevusu',
      'Avusturya vize randevu desteği',
      'Avusturya vize randevu danışmanlığı',
      'Avusturya vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },
  {
    slug: 'polonya-vize-randevu',
    category: 'randevu',
    countrySlug: 'polonya',
    adGroupNumber: '02.08',
    adGroupName: 'Polonya Vize Randevu',
    primaryKeyword: 'Polonya vizesi randevu',
    secondaryKeywords: [
      'Polonya vize randevusu',
      'Polonya vize randevu desteği',
      'Polonya vize randevu danışmanlığı',
      'Polonya vize randevu takibi',
    ],
    landingCategoryLabel: 'Vize Randevu',
  },

  // ---------- Campaign 03 — Schengen ve Turistik Vize ----------
  {
    slug: 'almanya-schengen-vizesi',
    category: 'schengen',
    countrySlug: 'almanya',
    adGroupNumber: '03.01',
    adGroupName: 'Almanya Schengen Vizesi',
    primaryKeyword: 'Almanya Schengen vizesi',
    secondaryKeywords: [
      'Almanya Schengen vize danışmanlığı',
      'Almanya Schengen vize başvurusu',
      'Almanya kısa süreli vize',
      'Almanya Schengen evrakları',
    ],
    landingCategoryLabel: 'Schengen Vize',
  },
  {
    slug: 'yunanistan-schengen-vizesi',
    category: 'schengen',
    countrySlug: 'yunanistan',
    adGroupNumber: '03.02',
    adGroupName: 'Yunanistan Schengen Vizesi',
    primaryKeyword: 'Yunanistan Schengen vizesi',
    secondaryKeywords: [
      'Yunanistan Schengen vize danışmanlığı',
      'Yunanistan Schengen vize başvurusu',
      'Yunanistan kısa süreli vize',
      'Yunanistan Schengen evrakları',
    ],
    landingCategoryLabel: 'Schengen Vize',
  },
  {
    slug: 'fransa-schengen-vizesi',
    category: 'schengen',
    countrySlug: 'fransa',
    adGroupNumber: '03.03',
    adGroupName: 'Fransa Schengen Vizesi',
    primaryKeyword: 'Fransa Schengen vizesi',
    secondaryKeywords: [
      'Fransa Schengen vize danışmanlığı',
      'Fransa Schengen vize başvurusu',
      'Fransa kısa süreli vize',
      'Fransa Schengen evrakları',
    ],
    landingCategoryLabel: 'Schengen Vize',
  },
  {
    slug: 'hollanda-schengen-vizesi',
    category: 'schengen',
    countrySlug: 'hollanda',
    adGroupNumber: '03.04',
    adGroupName: 'Hollanda Schengen Vizesi',
    primaryKeyword: 'Hollanda Schengen vizesi',
    secondaryKeywords: [
      'Hollanda Schengen vize danışmanlığı',
      'Hollanda Schengen vize başvurusu',
      'Hollanda kısa süreli vize',
      'Hollanda Schengen evrakları',
    ],
    landingCategoryLabel: 'Schengen Vize',
  },
  {
    slug: 'macaristan-schengen-vizesi',
    category: 'schengen',
    countrySlug: 'macaristan',
    adGroupNumber: '03.05',
    adGroupName: 'Macaristan Schengen Vizesi',
    primaryKeyword: 'Macaristan Schengen vizesi',
    secondaryKeywords: [
      'Macaristan Schengen vize danışmanlığı',
      'Macaristan Schengen vize başvurusu',
      'Macaristan kısa süreli vize',
      'Macaristan Schengen evrakları',
    ],
    landingCategoryLabel: 'Schengen Vize',
  },
  {
    slug: 'almanya-turistik-vize',
    category: 'turistik',
    countrySlug: 'almanya',
    adGroupNumber: '03.06',
    adGroupName: 'Almanya Turistik Vize',
    primaryKeyword: 'Almanya turistik vizesi',
    secondaryKeywords: [
      'Almanya turist vizesi',
      'Almanya turistik vize başvurusu',
      'Almanya turistik vize danışmanlığı',
      'Almanya turistik vize evrakları',
    ],
    landingCategoryLabel: 'Turistik Vize',
  },
  {
    slug: 'hollanda-turistik-vize',
    category: 'turistik',
    countrySlug: 'hollanda',
    adGroupNumber: '03.07',
    adGroupName: 'Hollanda Turistik Vize',
    primaryKeyword: 'Hollanda turistik vizesi',
    secondaryKeywords: [
      'Hollanda turist vizesi',
      'Hollanda turistik vize başvurusu',
      'Hollanda turistik vize danışmanlığı',
      'Hollanda turistik vize evrakları',
    ],
    landingCategoryLabel: 'Turistik Vize',
  },
  {
    slug: 'fransa-turistik-vize',
    category: 'turistik',
    countrySlug: 'fransa',
    adGroupNumber: '03.08',
    adGroupName: 'Fransa Turistik Vize',
    primaryKeyword: 'Fransa turistik vizesi',
    secondaryKeywords: [
      'Fransa turist vizesi',
      'Fransa turistik vize başvurusu',
      'Fransa turistik vize danışmanlığı',
      'Fransa turistik vize evrakları',
    ],
    landingCategoryLabel: 'Turistik Vize',
  },

  // ---------- Campaign 04 — Öğrenci ve Erasmus Vizesi ----------
  {
    slug: 'almanya-ogrenci-vizesi',
    category: 'ogrenci',
    countrySlug: 'almanya',
    adGroupNumber: '04.01',
    adGroupName: 'Almanya Öğrenci Vizesi',
    primaryKeyword: 'Almanya öğrenci vizesi',
    secondaryKeywords: [
      'Almanya eğitim vizesi',
      'Almanya öğrenci vize başvurusu',
      'Almanya öğrenci vize danışmanlığı',
      'Almanya öğrenci vizesi evrakları',
    ],
    landingCategoryLabel: 'Öğrenci Vize',
  },
  {
    slug: 'polonya-ogrenci-vizesi',
    category: 'ogrenci',
    countrySlug: 'polonya',
    adGroupNumber: '04.02',
    adGroupName: 'Polonya Öğrenci Vizesi',
    primaryKeyword: 'Polonya öğrenci vizesi',
    secondaryKeywords: [
      'Polonya eğitim vizesi',
      'Polonya öğrenci vize başvurusu',
      'Polonya öğrenci vize danışmanlığı',
      'Polonya öğrenci vizesi evrakları',
    ],
    landingCategoryLabel: 'Öğrenci Vize',
  },
  {
    slug: 'fransa-ogrenci-vizesi',
    category: 'ogrenci',
    countrySlug: 'fransa',
    adGroupNumber: '04.03',
    adGroupName: 'Fransa Öğrenci Vizesi',
    primaryKeyword: 'Fransa öğrenci vizesi',
    secondaryKeywords: [
      'Fransa eğitim vizesi',
      'Fransa öğrenci vize başvurusu',
      'Fransa öğrenci vize danışmanlığı',
      'Fransa öğrenci vizesi evrakları',
    ],
    landingCategoryLabel: 'Öğrenci Vize',
  },
  {
    slug: 'hollanda-ogrenci-vizesi',
    category: 'ogrenci',
    countrySlug: 'hollanda',
    adGroupNumber: '04.04',
    adGroupName: 'Hollanda Öğrenci Vizesi',
    primaryKeyword: 'Hollanda öğrenci vizesi',
    secondaryKeywords: [
      'Hollanda eğitim vizesi',
      'Hollanda öğrenci vize başvurusu',
      'Hollanda öğrenci vize danışmanlığı',
      'Hollanda öğrenci vizesi evrakları',
    ],
    landingCategoryLabel: 'Öğrenci Vize',
  },
  {
    slug: 'almanya-erasmus-vizesi',
    category: 'erasmus',
    countrySlug: 'almanya',
    adGroupNumber: '04.05',
    adGroupName: 'Almanya Erasmus Vizesi',
    primaryKeyword: 'Almanya Erasmus vizesi',
    secondaryKeywords: [
      'Almanya Erasmus vize başvurusu',
      'Almanya Erasmus vize danışmanlığı',
      'Almanya Erasmus vizesi evrakları',
      'Almanya değişim öğrencisi vizesi',
    ],
    landingCategoryLabel: 'Erasmus Vize',
  },
  {
    slug: 'polonya-erasmus-vizesi',
    category: 'erasmus',
    countrySlug: 'polonya',
    adGroupNumber: '04.06',
    adGroupName: 'Polonya Erasmus Vizesi',
    primaryKeyword: 'Polonya Erasmus vizesi',
    secondaryKeywords: [
      'Polonya Erasmus vize başvurusu',
      'Polonya Erasmus vize danışmanlığı',
      'Polonya Erasmus vizesi evrakları',
      'Polonya değişim öğrencisi vizesi',
    ],
    landingCategoryLabel: 'Erasmus Vize',
  },

  // ---------- Campaign 05 — Çalışma, Aile ve Ticari Vize ----------
  {
    slug: 'almanya-isci-vizesi',
    category: 'isci',
    countrySlug: 'almanya',
    adGroupNumber: '05.01',
    adGroupName: 'Almanya İşçi Vizesi',
    primaryKeyword: 'Almanya işçi vizesi',
    secondaryKeywords: [
      'Almanya çalışma vizesi',
      'Almanya iş vizesi',
      'Almanya çalışma vize başvurusu',
      'Almanya çalışma vizesi danışmanlığı',
    ],
    landingCategoryLabel: 'Çalışma Vize',
  },
  {
    slug: 'hollanda-isci-vizesi',
    category: 'isci',
    countrySlug: 'hollanda',
    adGroupNumber: '05.02',
    adGroupName: 'Hollanda İşçi Vizesi',
    primaryKeyword: 'Hollanda işçi vizesi',
    secondaryKeywords: [
      'Hollanda çalışma vizesi',
      'Hollanda iş vizesi',
      'Hollanda çalışma vize başvurusu',
      'Hollanda çalışma vizesi danışmanlığı',
    ],
    landingCategoryLabel: 'Çalışma Vize',
  },
  {
    slug: 'polonya-isci-vizesi',
    category: 'isci',
    countrySlug: 'polonya',
    adGroupNumber: '05.03',
    adGroupName: 'Polonya İşçi Vizesi',
    primaryKeyword: 'Polonya işçi vizesi',
    secondaryKeywords: [
      'Polonya çalışma vizesi',
      'Polonya iş vizesi',
      'Polonya çalışma vize başvurusu',
      'Polonya çalışma vizesi danışmanlığı',
    ],
    landingCategoryLabel: 'Çalışma Vize',
  },
  {
    slug: 'almanya-aile-birlesimi-vizesi',
    category: 'aile',
    countrySlug: 'almanya',
    adGroupNumber: '05.04',
    adGroupName: 'Almanya Aile Birleşimi',
    primaryKeyword: 'Almanya aile birleşimi vizesi',
    secondaryKeywords: [
      'Almanya aile birleşimi',
      'Almanya eş vizesi',
      'Almanya aile birleşimi başvurusu',
      'Almanya aile birleşimi danışmanlığı',
    ],
    landingCategoryLabel: 'Aile Birleşimi',
  },
  {
    slug: 'fransa-aile-birlesimi-vizesi',
    category: 'aile',
    countrySlug: 'fransa',
    adGroupNumber: '05.05',
    adGroupName: 'Fransa Aile Birleşimi',
    primaryKeyword: 'Fransa aile birleşimi vizesi',
    secondaryKeywords: [
      'Fransa aile birleşimi',
      'Fransa eş vizesi',
      'Fransa aile birleşimi başvurusu',
      'Fransa aile birleşimi danışmanlığı',
    ],
    landingCategoryLabel: 'Aile Birleşimi',
  },
  {
    slug: 'almanya-ticari-vize',
    category: 'ticari',
    countrySlug: 'almanya',
    adGroupNumber: '05.06',
    adGroupName: 'Almanya Ticari Vize',
    primaryKeyword: 'Almanya ticari vizesi',
    secondaryKeywords: [
      'Almanya iş seyahati vizesi',
      'Almanya ticari vize başvurusu',
      'Almanya ticari vize danışmanlığı',
      'Almanya fuar vizesi',
    ],
    landingCategoryLabel: 'Ticari Vize',
  },
];

/* ---------------- Derived text builders (H1 + metadata) ---------------- */

const h1Templates: Record<LandingCategory, (country: string) => string> = {
  genel: (c) => `${c} Vizesi Başvurunuz İçin Profesyonel Danışmanlık`,
  randevu: (c) => `${c} Vize Randevu Süreci İçin Danışmanlık ve Takip Desteği`,
  schengen: (c) => `${c} Schengen Vizesi Başvuru Danışmanlığı`,
  turistik: (c) => `${c} Turistik Vize Başvurusu İçin Danışmanlık`,
  ogrenci: (c) => `${c} Öğrenci Vizesi Başvuru Desteği`,
  erasmus: (c) => `${c} Erasmus Vizesi Başvuru Desteği`,
  isci: (c) => `${c} İşçi (Çalışma) Vizesi Başvuru Danışmanlığı`,
  aile: (c) => `${c} Aile Birleşimi Vizesi Danışmanlığı`,
  ticari: (c) => `${c} Ticari Vize Başvurusu İçin Danışmanlık`,
};

const metaTitleTemplates: Record<LandingCategory, (country: string) => string> = {
  genel: (c) => `${c} Vizesi Danışmanlığı ve Başvuru Desteği`,
  randevu: (c) => `${c} Vize Randevu Desteği ve Evrak Danışmanlığı`,
  schengen: (c) => `${c} Schengen Vizesi Başvuru Danışmanlığı`,
  turistik: (c) => `${c} Turistik Vize Başvuru Desteği`,
  ogrenci: (c) => `${c} Öğrenci Vizesi Başvuru Desteği`,
  erasmus: (c) => `${c} Erasmus Vizesi Başvuru Desteği`,
  isci: (c) => `${c} İşçi (Çalışma) Vizesi Danışmanlığı`,
  aile: (c) => `${c} Aile Birleşimi Vizesi Danışmanlığı`,
  ticari: (c) => `${c} Ticari Vize Başvuru Danışmanlığı`,
};

const metaDescTemplates: Record<LandingCategory, (country: string) => string> = {
  genel: (c) =>
    `${c} vizesi başvurusu için doğru vize türü, evrak kontrolü, form hazırlığı ve randevu takibi. VİS VİZE ile Türkiye geneli online danışmanlık ve destek.`,
  randevu: (c) =>
    `${c} vize randevu sürecinde randevu takibi ve başvuru öncesi evrak hazırlığı. VİS VİZE özel danışmanlık sunar; randevu resmi sistemlerce belirlenir.`,
  schengen: (c) =>
    `${c} Schengen vizesi başvurusu için seyahat planı, evrak ve sigorta desteği. VİS VİZE ile kısa süreli vize dosyanızı doğru ve tutarlı hazırlayın.`,
  turistik: (c) =>
    `${c} turistik vizesi için konaklama, ulaşım ve finansal belge desteği. VİS VİZE ile tatil başvurunuzu doğru planlayın; Türkiye geneli online danışmanlık.`,
  ogrenci: (c) =>
    `${c} öğrenci vizesi başvurusu için kabul, finansal destek ve evrak danışmanlığı. VİS VİZE ile eğitim başvurunuzu doğru yönde planlayın.`,
  erasmus: (c) =>
    `${c} Erasmus vizesi için program belgeleri, hibe ve konaklama desteği. VİS VİZE ile değişim öğrencisi başvurunuzu doğru ve zamanında hazırlayın.`,
  isci: (c) =>
    `${c} işçi (çalışma) vizesi için iş teklifi, işveren ve nitelik belgelerinde danışmanlık. VİS VİZE destek sunar; çalışma izni kararı resmi makamlara aittir.`,
  aile: (c) =>
    `${c} aile birleşimi vizesi için akrabalık, nüfus ve sponsor belgelerinde danışmanlık. VİS VİZE ile bu hassas süreci özenle planlayın.`,
  ticari: (c) =>
    `${c} ticari vizesi için iş daveti, şirket belgeleri ve seyahat planı danışmanlığı. VİS VİZE ile iş seyahati başvurunuzu doğru hazırlayın.`,
};

/* ---------------- Assembly ---------------- */

function relatedFor(current: PageDefinition, all: PageDefinition[]): RelatedPageLink[] {
  return all
    .filter((d) => d.countrySlug === current.countrySlug && d.slug !== current.slug)
    .map((d) => ({
      slug: d.slug,
      label: buildLandingContent(d.category, getCountryProfile(d.countrySlug)).breadcrumbLabel,
    }));
}

function assemble(def: PageDefinition): LandingPageConfig {
  const country = getCountryProfile(def.countrySlug);
  const content = buildLandingContent(def.category, country);
  const campaign = CAMPAIGNS[def.adGroupNumber.slice(0, 2)];
  if (!campaign) throw new Error(`Unknown campaign for ad group: ${def.adGroupNumber}`);

  // Append the country-specific FAQ so no two countries share an identical FAQ set.
  const faqItems = [...content.faqItems, country.countryFaq];

  return {
    slug: def.slug,
    campaignNumber: campaign.number,
    campaignName: campaign.name,
    campaignId: campaign.id,
    adGroupNumber: def.adGroupNumber,
    adGroupName: def.adGroupName,
    adGroupId: `ag-${def.adGroupNumber.replace('.', '-')}`,

    country: country.name,
    countrySlug: country.slug,
    visaType: content.visaType,
    category: def.category,
    primaryKeyword: def.primaryKeyword,
    secondaryKeywords: def.secondaryKeywords,
    searchIntent: content.searchIntent,

    metadataTitle: metaTitleTemplates[def.category](country.name),
    metadataDescription: metaDescTemplates[def.category](country.name),

    h1: h1Templates[def.category](country.name),
    heroEyebrow: HERO_EYEBROW,
    heroDescription: content.heroDescription,
    trustPoints: content.trustPoints,

    sectionHeadings: content.sectionHeadings,
    benefitItems: content.benefitItems,
    introduction: content.introduction,
    serviceDescription: content.serviceDescription,
    servicesIncluded: content.servicesIncluded,
    processSteps: content.processSteps,
    documentCategories: content.documentCategories,
    profileDocuments: content.profileDocuments,
    countrySpecificNotes: country.notes,
    whyChoose: whyChooseItems(),
    faqItems,
    relatedPages: relatedFor(def, PAGE_DEFINITIONS),

    formTitle: content.formTitle,
    formDescription: content.formDescription,
    primaryCTA: content.primaryCTA,
    secondaryCTA: content.secondaryCTA,

    breadcrumbLabel: content.breadcrumbLabel,
    disclaimerText: content.disclaimerText,
    presetVisaPurpose: content.presetVisaPurpose,
  };
}

/** All 36 resolved landing-page configurations (order = campaign/ad-group order). */
const LANDING_PAGE_LIST: LandingPageConfig[] = PAGE_DEFINITIONS.map(assemble);

const LANDING_PAGE_MAP: Record<string, LandingPageConfig> = Object.fromEntries(
  LANDING_PAGE_LIST.map((config) => [config.slug, config]),
);

// Build-time integrity check: every canonical slug must resolve to exactly one config.
if (process.env.NODE_ENV !== 'production') {
  const configured = new Set(Object.keys(LANDING_PAGE_MAP));
  for (const slug of LANDING_PAGE_SLUGS) {
    if (!configured.has(slug)) {
      throw new Error(`Landing config missing for slug: ${slug}`);
    }
  }
  if (configured.size !== LANDING_PAGE_SLUGS.length) {
    throw new Error(
      `Landing config count mismatch: ${configured.size} configs vs ${LANDING_PAGE_SLUGS.length} slugs`,
    );
  }
}

export function getLandingPage(slug: string): LandingPageConfig | undefined {
  return LANDING_PAGE_MAP[slug];
}

export function getAllLandingPages(): LandingPageConfig[] {
  return LANDING_PAGE_LIST;
}

export type { LandingPageConfig } from './landing/types';
