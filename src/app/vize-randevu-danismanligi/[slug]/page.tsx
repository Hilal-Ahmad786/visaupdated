import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RandevuLandingPage } from '@/components/landing/RandevuLandingPage';
import { RANDEVU_BASE_PATH, getAllRandevuPages, getRandevuPage } from '@/data/randevuLandingPages';
import { buildMetadata } from '@/lib/seo';

/**
 * Single data-driven route for all 41 provider appointment-consultancy landing
 * pages. Each canonical slug is statically generated; unknown slugs 404.
 */

export const dynamicParams = false; // only pre-generated slugs are valid
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllRandevuPages().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const config = getRandevuPage(params.slug);
  if (!config) return { title: 'Sayfa bulunamadı', robots: { index: false, follow: false } };
  return buildMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    path: `${RANDEVU_BASE_PATH}/${config.slug}`,
  });
}

export default function RandevuSlugPage({ params }: { params: { slug: string } }) {
  const config = getRandevuPage(params.slug);
  if (!config) notFound();
  return <RandevuLandingPage config={config} />;
}
