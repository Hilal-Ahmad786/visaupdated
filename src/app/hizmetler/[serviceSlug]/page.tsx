import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { ServiceDetail } from '@/components/services/ServiceDetail';
import { getContentRepository } from '@/content/repository';
import { faqJsonLd, metadataFromSeo } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const repo = getContentRepository();
  const services = await repo.getServices();
  return services.map((s) => ({ serviceSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { serviceSlug: string };
}): Promise<Metadata> {
  const repo = getContentRepository();
  const service = await repo.getServiceBySlug(params.serviceSlug);
  if (!service) return { title: 'Hizmet bulunamadı', robots: { index: false, follow: false } };
  return metadataFromSeo(service.seo);
}

export default async function ServiceDetailPage({ params }: { params: { serviceSlug: string } }) {
  const repo = getContentRepository();
  const service = await repo.getServiceBySlug(params.serviceSlug);
  if (!service) notFound();

  const [allServices, allCountries, categories] = await Promise.all([
    repo.getServices(),
    repo.getCountries(),
    repo.getServiceCategories(),
  ]);

  const countryOptions = allCountries.map((c) => ({ value: c.slug, label: c.name }));

  const supportedCountries = service.supportedCountrySlugs
    .map((slug) => allCountries.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const relatedServices = service.relatedServiceSlugs
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const category = categories.find((c) => c.slug === service.category);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Hizmetler', href: '/hizmetler' },
          { name: service.name, href: `/hizmetler/${service.slug}` },
        ]}
      />
      <ServiceDetail
        service={service}
        countryOptions={countryOptions}
        supportedCountries={supportedCountries}
        relatedServices={relatedServices}
        category={category}
      />
      {service.faqs.length > 0 && <JsonLd data={faqJsonLd(service.faqs)} />}
    </>
  );
}
