import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { VisaLandingPage } from '@/components/landing/VisaLandingPage';
import { getAllLandingPages, getLandingPage } from '@/data/googleAdsLandingPages';
import { buildMetadata } from '@/lib/seo';

/**
 * Single data-driven route for all 36 Google Ads landing pages. Each canonical
 * slug is statically generated; every unknown top-level path falls through to
 * `notFound()`. Alias slugs are handled by permanent redirects in next.config.mjs
 * and never reach this component.
 */

export const dynamicParams = false; // only pre-generated slugs are valid
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllLandingPages().map((p) => ({ landingSlug: p.slug }));
}

export function generateMetadata({ params }: { params: { landingSlug: string } }): Metadata {
  const config = getLandingPage(params.landingSlug);
  if (!config) return { title: 'Sayfa bulunamadı', robots: { index: false, follow: false } };
  return buildMetadata({
    title: config.metadataTitle,
    description: config.metadataDescription,
    path: `/${config.slug}`,
  });
}

export default function LandingSlugPage({ params }: { params: { landingSlug: string } }) {
  const config = getLandingPage(params.landingSlug);
  if (!config) notFound();
  return <VisaLandingPage config={config} />;
}
