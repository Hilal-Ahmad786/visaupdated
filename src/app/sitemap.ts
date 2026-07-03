import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { getAllLandingPages } from '@/data/googleAdsLandingPages';

const STATIC_PATHS = [
  '/',
  '/vize-ulkeleri',
  '/hizmetler',
  '/vize-sureci',
  '/schengen-vizesi',
  '/online-on-basvuru',
  '/randevu-talebi',
  '/iletisim',
  '/sss',
  '/blog',
  '/hakkimizda',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getContentRepository();
  const [countries, services, faqs, articles] = await Promise.all([
    repo.getCountries(),
    repo.getServices(),
    repo.getFaqs(),
    repo.getArticles(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const countryEntries: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${siteUrl}/vize-ulkeleri/${c.slug}`,
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${siteUrl}/hizmetler/${s.slug}`,
    lastModified: now,
  }));

  const faqEntries: MetadataRoute.Sitemap = faqs.map((f) => ({
    url: `${siteUrl}/sss/${f.slug}`,
    lastModified: now,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/blog/${a.slug}`,
    lastModified: new Date(a.updatedAt),
  }));

  // Google Ads landing pages (canonical slugs only — alias redirects excluded).
  const landingEntries: MetadataRoute.Sitemap = getAllLandingPages().map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    ...staticEntries,
    ...countryEntries,
    ...serviceEntries,
    ...faqEntries,
    ...articleEntries,
    ...landingEntries,
  ];
}
