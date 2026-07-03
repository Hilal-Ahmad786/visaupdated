import type { LandingPageSlug } from '@/config/landing-routes';

/** Page-type categories that drive differentiated content per ad group. */
export type LandingCategory =
  | 'genel'
  | 'randevu'
  | 'schengen'
  | 'turistik'
  | 'ogrenci'
  | 'erasmus'
  | 'isci'
  | 'aile'
  | 'ticari';

export interface BenefitItem {
  /** Lucide icon name (imported in the component's icon map). */
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface DocumentCategory {
  title: string;
  items: string[];
}

export interface ProfileDocumentGroup {
  title: string;
  description?: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface RelatedPageLink {
  slug: string;
  label: string;
}

export interface SectionHeadings {
  benefits: string;
  introduction: string;
  services: string;
  process: string;
  documents: string;
  profiles: string;
  whyChoose: string;
  faq: string;
  related: string;
}

/**
 * Fully-resolved configuration for a single Google Ads landing page. Every field
 * is page-specific and typed; the dynamic route renders purely from this object.
 */
export interface LandingPageConfig {
  slug: LandingPageSlug;

  // Campaign / ad-group attribution
  campaignNumber: string; // e.g. "01"
  campaignName: string;
  campaignId: string; // internal id (e.g. "camp-01"); real Google Ads ids live in Ads UI
  adGroupNumber: string; // e.g. "01.01"
  adGroupName: string;
  adGroupId: string;

  // Targeting
  country: string; // display name, e.g. "Almanya"
  countrySlug: string; // e.g. "almanya"
  visaType: string; // display, e.g. "Öğrenci / Eğitim Vizesi"
  category: LandingCategory;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;

  // SEO / metadata
  metadataTitle: string; // WITHOUT the "| VİS VİZE" suffix (added by the title template)
  metadataDescription: string;

  // Hero
  h1: string;
  heroEyebrow: string;
  heroDescription: string;
  trustPoints: string[];

  // Sections
  sectionHeadings: SectionHeadings;
  benefitItems: BenefitItem[];
  introduction: string[];
  serviceDescription: string;
  servicesIncluded: string[];
  processSteps: ProcessStep[];
  documentCategories: DocumentCategory[];
  profileDocuments?: ProfileDocumentGroup[];
  countrySpecificNotes: string[];
  whyChoose: WhyChooseItem[];
  faqItems: FaqItem[];
  relatedPages: RelatedPageLink[];

  // Form
  formTitle: string;
  formDescription: string;
  primaryCTA: string; // form submit label
  secondaryCTA: string; // e.g. phone / whatsapp label

  // Misc
  breadcrumbLabel: string;
  disclaimerText: string;
  presetVisaPurpose: string; // maps to visaPurposeOptions value ('', 'turizm', ...)
}

/** Per-country facts used to compose natural Turkish content (no name-swapping). */
export interface CountryProfile {
  slug: string;
  name: string;
  /** Dative — "…'ya / …'a" (to). */
  dative: string;
  /** Locative — "…'da / …'de" (in). */
  locative: string;
  /** Genitive — "…'nın / …'ın" (of). */
  genitive: string;
  /** Turkish cities where this country runs consulate/application services. */
  applicationCities: string[];
  /** 2–3 genuinely country-specific, cautious notes (no fees/times/legal rules). */
  notes: string[];
  /** One country-specific FAQ appended to every page for that country. */
  countryFaq: FaqItem;
}
