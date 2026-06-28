import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CountryDetail } from '@/components/countries/CountryDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { schengenLanding } from '@/content/seed/countries';
import { getContentRepository } from '@/content/repository';
import { faqJsonLd, metadataFromSeo } from '@/lib/seo';

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return metadataFromSeo(schengenLanding.seo);
}

export default async function SchengenPage() {
  const repo = getContentRepository();
  const all = await repo.getCountries();
  const countryOptions = all.map((c) => ({ value: c.slug, label: c.name }));
  const relatedCountries = ['almanya', 'fransa', 'italya', 'ispanya']
    .map((slug) => all.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Schengen Vizesi', href: '/schengen-vizesi' }]} />
      <CountryDetail country={schengenLanding} countryOptions={countryOptions} relatedCountries={relatedCountries} />
      <JsonLd data={faqJsonLd(schengenLanding.faqs)} />
    </>
  );
}
