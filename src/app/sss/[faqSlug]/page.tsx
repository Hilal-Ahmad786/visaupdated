import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { PageHero } from '@/components/layout/PageHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { buildMetadata, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

export async function generateStaticParams() {
  const repo = getContentRepository();
  const faqs = await repo.getFaqs();
  return faqs.map((f) => ({ faqSlug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { faqSlug: string };
}): Promise<Metadata> {
  const repo = getContentRepository();
  const faq = await repo.getFaqBySlug(params.faqSlug);
  if (!faq) {
    return { title: 'Soru bulunamadı', robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: faq.question,
    description: truncate(faq.answer, 155),
    path: `/sss/${faq.slug}`,
  });
}

export default async function FaqDetailPage({ params }: { params: { faqSlug: string } }) {
  const repo = getContentRepository();
  const faq = await repo.getFaqBySlug(params.faqSlug);
  if (!faq) notFound();

  const [allFaqs, countries, services] = await Promise.all([
    repo.getFaqs(),
    repo.getCountries(),
    repo.getServices(),
  ]);

  const relatedCountries = (faq.relatedCountrySlugs ?? [])
    .map((slug) => countries.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const relatedServices = (faq.relatedServiceSlugs ?? [])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const otherFaqs = allFaqs
    .filter((f) => f.category === faq.category && f.slug !== faq.slug)
    .slice(0, 5);

  const hasRelatedLinks = relatedCountries.length > 0 || relatedServices.length > 0;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'S.S.S.', href: '/sss' },
          { name: truncate(faq.question, 60), href: `/sss/${faq.slug}` },
        ]}
      />

      <PageHero eyebrow="Sıkça Sorulan Sorular" title={faq.question} />

      <Section bg="page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <article className="min-w-0">
            <div className="card p-6 md:p-8">
              <p className="text-body-lg leading-relaxed text-ink-soft">{faq.answer}</p>
            </div>

            {hasRelatedLinks && (
              <div className="mt-8">
                <h2 className="font-heading text-h4">İlgili sayfalar</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedCountries.map((c) => (
                    <Link
                      key={`country-${c.slug}`}
                      href={`/vize-ulkeleri/${c.slug}`}
                      className="pill hover:border-navy hover:text-navy"
                    >
                      {c.name} vizesi
                    </Link>
                  ))}
                  {relatedServices.map((s) => (
                    <Link
                      key={`service-${s.slug}`}
                      href={`/hizmetler/${s.slug}`}
                      className="pill hover:border-navy hover:text-navy"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 rounded-card border border-line bg-surface p-6">
              <p className="font-heading text-h4">Hâlâ sorunuz mu var?</p>
              <p className="mt-1 text-ink-soft">
                Uzman danışmanlarımız başvuru türünüze göre süreci açıklasın.
              </p>
              <PhoneLink location="faq_detail_inline" className="btn-primary mt-4" />
            </div>
          </article>

          {/* Other questions in same category */}
          {otherFaqs.length > 0 && (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-ink-muted">
                Diğer sorular
              </h2>
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
                {otherFaqs.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/sss/${f.slug}`}
                      className="block px-5 py-4 text-ink-soft hover:bg-surface hover:text-navy"
                    >
                      {f.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        <div className="mt-10">
          <LegalDisclaimer />
        </div>
      </Section>

      <ClickToCallBanner location="faq_detail_bottom" />

      <JsonLd data={faqJsonLd([{ question: faq.question, answer: faq.answer }])} />
    </>
  );
}
