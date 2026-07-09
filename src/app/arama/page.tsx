import { Suspense } from 'react';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SearchExperience } from '@/components/search/SearchExperience';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

// Search result pages are noindexed so unlimited query combinations are not crawled.
export const metadata = buildMetadata({
  title: 'Arama',
  description: 'VİS VİZE içinde ülke, hizmet, rehber ve S.S.S. araması.',
  path: '/arama',
  noindex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const repo = getContentRepository();
  const [countries, services, faqs, articles] = await Promise.all([
    repo.getCountries(),
    repo.getServices(),
    repo.getFaqs(),
    repo.getArticles(),
  ]);

  const initialQuery = searchParams.q ?? '';

  return (
    <>
      <Breadcrumbs items={[{ name: 'Arama', href: '/arama' }]} />

      <PageHero
        eyebrow="Site İçi Arama"
        title="Aradığınızı bulun"
        description="Ülkeler, hizmetler, rehberler ve sıkça sorulan sorular arasında tek bir yerden arayın."
      />

      <Section bg="page">
        <div>
          <Suspense fallback={null}>
            <SearchExperience
              countries={countries}
              services={services}
              faqs={faqs}
              articles={articles}
              initialQuery={initialQuery}
            />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
