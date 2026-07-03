import type { Metadata } from 'next';

import { brand, contactSettings, siteUrl } from '@/config/site';
import type { SeoMeta } from '@/types/content';

const DEFAULT_OG = '/og-default.png';

interface BuildMetaArgs {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
}: BuildMetaArgs): Metadata {
  const canonical = path ? `${siteUrl}${path}` : undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      siteName: brand.full,
      title,
      description,
      url: canonical,
      locale: 'tr_TR',
      images: [{ url: ogImage ?? DEFAULT_OG, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage ?? DEFAULT_OG],
    },
  };
}

export function metadataFromSeo(seo: SeoMeta): Metadata {
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.canonical,
    ogImage: seo.ogImage,
    noindex: seo.noindex,
  });
}

// --- JSON-LD builders ---

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.full,
    url: siteUrl,
    email: contactSettings.email,
    telephone: contactSettings.phoneHref.replace('tel:', ''),
    areaServed: 'TR',
    description:
      'Vize başvurularına yönelik danışmanlık, evrak hazırlığı, randevu organizasyonu ve süreç takibi hizmeti.',
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

/**
 * Service schema for a landing page. Describes PRIVATE consultancy & support —
 * never an official visa authority. No prices, ratings or awards are asserted.
 */
export function serviceJsonLd(args: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    serviceType: args.serviceType,
    description: args.description,
    url: `${siteUrl}${args.path}`,
    areaServed: args.areaServed ?? 'TR',
    provider: {
      '@type': 'Organization',
      name: brand.full,
      url: siteUrl,
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    author: { '@type': 'Organization', name: a.authorName },
    publisher: { '@type': 'Organization', name: brand.full },
    mainEntityOfPage: `${siteUrl}${a.path}`,
    image: a.image ? `${siteUrl}${a.image}` : undefined,
  };
}
