/**
 * ContentRepository — the single abstraction the public UI uses to read content.
 *
 * Part 1 ships `SeedContentRepository` backed by typed local data. Part 2 will
 * add a `DbContentRepository` (Prisma/Drizzle) implementing the SAME interface,
 * and `getContentRepository()` will return it based on env — no page changes.
 *
 * Pages should call these methods (async, CMS-shaped) rather than importing seed
 * modules directly, so the data source can be swapped transparently.
 */
import type {
  Article,
  BlogCategory,
  Country,
  FaqCategory,
  FaqItem,
  Service,
  ServiceCategory,
  SiteSettings,
  Testimonial,
} from '@/types/content';

import { findArticle, listPublishedArticles } from '@/lib/admin/blog-store';

import { blogCategories } from './seed/articles';
import { countries } from './seed/countries';
import { faqCategories, faqs } from './seed/faqs';
import { serviceCategories, services } from './seed/services';
import { siteSettings } from './seed/settings';
import { testimonials } from './seed/testimonials';

export interface ContentRepository {
  getSiteSettings(): Promise<SiteSettings>;

  getCountries(): Promise<Country[]>;
  getCountryBySlug(slug: string): Promise<Country | null>;

  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | null>;
  getServiceCategories(): Promise<ServiceCategory[]>;

  getFaqs(): Promise<FaqItem[]>;
  getFaqBySlug(slug: string): Promise<FaqItem | null>;
  getFaqCategories(): Promise<FaqCategory[]>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getBlogCategories(): Promise<BlogCategory[]>;

  getTestimonials(): Promise<Testimonial[]>;
}

const onlyPublished = <T extends { status: string }>(items: T[]): T[] =>
  items.filter((i) => i.status === 'published');

class SeedContentRepository implements ContentRepository {
  async getSiteSettings() {
    return siteSettings;
  }

  async getCountries() {
    return onlyPublished(countries);
  }
  async getCountryBySlug(slug: string) {
    return countries.find((c) => c.slug === slug && c.status === 'published') ?? null;
  }

  async getServices() {
    return onlyPublished(services);
  }
  async getServiceBySlug(slug: string) {
    return services.find((s) => s.slug === slug && s.status === 'published') ?? null;
  }
  async getServiceCategories() {
    return serviceCategories;
  }

  async getFaqs() {
    return onlyPublished(faqs);
  }
  async getFaqBySlug(slug: string) {
    return faqs.find((f) => f.slug === slug && f.status === 'published') ?? null;
  }
  async getFaqCategories() {
    return faqCategories;
  }

  async getArticles() {
    // Seed posts overlaid by admin-edited DB posts (published only).
    return listPublishedArticles();
  }
  async getArticleBySlug(slug: string) {
    return findArticle(slug);
  }
  async getBlogCategories() {
    return blogCategories;
  }

  async getTestimonials() {
    // Only verified + published testimonials are ever exposed.
    return testimonials.filter((t) => t.status === 'published' && t.verified);
  }
}

let instance: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  if (!instance) {
    // Future: branch on process.env.DATABASE_URL to return DbContentRepository.
    instance = new SeedContentRepository();
  }
  return instance;
}
