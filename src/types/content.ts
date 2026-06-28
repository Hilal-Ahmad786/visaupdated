/**
 * Content domain model.
 *
 * These interfaces are the contract between the public UI and the content
 * source. In Part 1 they are satisfied by typed seed data; in Part 2 the same
 * shapes will be served from the database/CMS via the ContentRepository. UI
 * components must depend ONLY on these types, never on the seed module directly.
 */

export type PublishStatus = 'published' | 'draft' | 'archived';

export interface SeoMeta {
  title: string;
  description: string;
  /** Path-relative canonical (e.g. "/vize-ulkeleri/almanya"); absolute is derived. */
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface FaqItem {
  slug: string;
  question: string;
  answer: string;
  category: string;
  status: PublishStatus;
  /** Optional relations for internal linking. */
  relatedCountrySlugs?: string[];
  relatedServiceSlugs?: string[];
}

export interface FaqCategory {
  slug: string;
  title: string;
  description?: string;
}

export interface VisaType {
  slug: string;
  name: string;
  summary: string;
}

export interface ApplicantStatus {
  key: string;
  label: string;
  documents: string[];
}

export interface DocumentGroup {
  title: string;
  items: string[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export type Region =
  | 'Schengen'
  | 'Avrupa'
  | 'Amerika'
  | 'Birleşik Krallık'
  | 'Asya Pasifik'
  | 'Orta Doğu';

export interface Country {
  slug: string;
  name: string;
  region: Region;
  /** ISO 3166-1 alpha-2, used for flag rendering. */
  code: string;
  status: PublishStatus;
  popular: boolean;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  quickFacts: { label: string; value: string }[];
  visaTypes: VisaType[];
  whoCanApply: string[];
  documentGroups: DocumentGroup[];
  applicantStatuses: ApplicantStatus[];
  processSteps: ProcessStep[];
  timelineNote: string;
  commonMistakes: string[];
  rejectionGuidance: string[];
  faqs: { question: string; answer: string }[];
  relatedCountrySlugs: string[];
  relatedServiceSlugs: string[];
  seo: SeoMeta;
}

export interface Service {
  slug: string;
  name: string;
  category: string;
  status: PublishStatus;
  popular: boolean;
  icon: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  scope: string[];
  exclusions: string[];
  processSteps: ProcessStep[];
  requiredInfo: string[];
  pricingNote: string;
  supportedCountrySlugs: string[];
  faqs: { question: string; answer: string }[];
  relatedServiceSlugs: string[];
  seo: SeoMeta;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  description: string;
}

export interface ArticleSection {
  heading: string;
  /** Plain paragraphs; richer block model can be added in Part 2. */
  paragraphs: string[];
  bullets?: string[];
  callout?: { tone: 'info' | 'warning' | 'success'; text: string };
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: PublishStatus;
  featured: boolean;
  coverImage?: string;
  author: { name: string; role: string };
  reviewer?: { name: string; role: string };
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  readingMinutes: number;
  tags: string[];
  relatedCountrySlugs?: string[];
  relatedServiceSlugs?: string[];
  intro: string;
  sections: ArticleSection[];
  faqs?: { question: string; answer: string }[];
  seo: SeoMeta;
}

export interface BlogCategory {
  slug: string;
  title: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  country: string;
  text: string;
  status: PublishStatus;
  /** Only render when explicitly verified — avoids fake reviews. */
  verified: boolean;
}

export interface TrustMetric {
  label: string;
  value: string;
  verified: boolean;
}

export interface SiteSettings {
  brandShort: string;
  brandFull: string;
  serviceArea: string;
  /** Optional sections on About page disappear cleanly when empty. */
  trustMetrics: TrustMetric[];
}
