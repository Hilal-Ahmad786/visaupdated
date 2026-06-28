import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { CountryDetail } from '@/components/countries/CountryDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContentRepository } from '@/content/repository';
import { faqJsonLd, metadataFromSeo } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const repo = getContentRepository();
  const countries = await repo.getCountries();
  return countries.map((c) => ({ countrySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { countrySlug: string };
}): Promise<Metadata> {
  const repo = getContentRepository();
  const country = await repo.getCountryBySlug(params.countrySlug);
  if (!country) return { title: 'Ülke bulunamadı', robots: { index: false, follow: false } };
  return metadataFromSeo(country.seo);
}

export default async function CountryDetailPage({ params }: { params: { countrySlug: string } }) {
  const repo = getContentRepository();
  const country = await repo.getCountryBySlug(params.countrySlug);
  if (!country) notFound();

  const all = await repo.getCountries();
  const countryOptions = all.map((c) => ({ value: c.slug, label: c.name }));
  const relatedCountries = country.relatedCountrySlugs
    .map((slug) => all.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Vize Ülkeleri', href: '/vize-ulkeleri' },
          { name: country.name, href: `/vize-ulkeleri/${country.slug}` },
        ]}
      />
      <CountryDetail country={country} countryOptions={countryOptions} relatedCountries={relatedCountries} />
      {country.faqs.length > 0 && <JsonLd data={faqJsonLd(country.faqs)} />}
    </>
  );
}
