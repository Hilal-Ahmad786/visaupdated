import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Phone,
  ShieldCheck,
  Tag,
  UserRound,
} from 'lucide-react';

import { ReadingProgress, TableOfContents } from '@/components/blog/ArticleReader';
import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, metadataFromSeo } from '@/lib/seo';
import { formatDateTr } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const repo = getContentRepository();
  const articles = await repo.getArticles();
  return articles.map((a) => ({ articleSlug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { articleSlug: string };
}): Promise<Metadata> {
  const repo = getContentRepository();
  const article = await repo.getArticleBySlug(params.articleSlug);
  if (!article) {
    return { title: 'Yazı bulunamadı', robots: { index: false, follow: false } };
  }
  return metadataFromSeo(article.seo);
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { articleSlug: string };
}) {
  const repo = getContentRepository();
  const article = await repo.getArticleBySlug(params.articleSlug);
  if (!article) notFound();

  const [allArticles, categories, countries, services] = await Promise.all([
    repo.getArticles(),
    repo.getBlogCategories(),
    repo.getCountries(),
    repo.getServices(),
  ]);

  const path = `/blog/${article.slug}`;
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const categoryTitle = categories.find((c) => c.slug === article.category)?.title ?? article.category;
  const updatedDiffers = article.updatedAt !== article.publishedAt;

  // Stable, collision-free section ids shared between body headings and the TOC.
  const tocItems = article.sections.map((section, i) => ({
    id: `bolum-${i}`,
    heading: section.heading,
  }));

  // Previous / next from the repository's newest-first ordering.
  const currentIndex = allArticles.findIndex((a) => a.slug === article.slug);
  const newer = currentIndex > 0 ? allArticles[currentIndex - 1] : undefined;
  const older =
    currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : undefined;

  const relatedServices = (article.relatedServiceSlugs ?? [])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedCountries = (article.relatedCountrySlugs ?? [])
    .map((slug) => countries.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <ReadingProgress />

      <Breadcrumbs
        items={[
          { name: 'Blog', href: '/blog' },
          { name: article.title, href: path },
        ]}
      />

      {/* Article hero */}
      <Section bg="page" ariaLabel="Yazı başlığı">
        <article>
          <div className="mx-auto max-w-3xl">
            <span className="font-heading text-label uppercase tracking-[0.14em] text-gold">
              {categoryTitle}
            </span>
            <h1 className="mt-3 text-h1 text-balance">{article.title}</h1>
            <p className="mt-4 text-body-lg text-ink-soft">{article.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {article.author.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatDateTr(article.publishedAt)}
              </span>
              {updatedDiffers && <span>Güncelleme: {formatDateTr(article.updatedAt)}</span>}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {article.readingMinutes} dk okuma
              </span>
              {article.reviewer && (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  İnceleyen: {article.reviewer.name}
                </span>
              )}
            </div>
          </div>

          {/* Cover */}
          <div className="mt-8 overflow-hidden rounded-card">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                priority
              />
            ) : (
              <div
                className="aspect-[16/9] w-full bg-gradient-to-br from-navy via-navy to-navy-deep"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Body + TOC */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="no-print">
              <TableOfContents items={tocItems} />
            </aside>

            <div className="min-w-0">
              <div className="mx-auto max-w-[70ch] text-ink">
                {/* Update note (safe, not fabricated) */}
                <StatusAlert tone="info" className="mb-8">
                  Bu içerik en son {formatDateTr(article.updatedAt)} tarihinde güncellenmiştir. Resmi
                  gereklilikler değişebilir; başvuru öncesi ilgili konsolosluğun güncel duyurularını
                  teyit edin.
                </StatusAlert>

                <p className="text-body-lg leading-relaxed text-ink-soft">{article.intro}</p>

                {article.sections.map((section, i) => {
                  const id = tocItems[i]?.id ?? `bolum-${i}`;
                  return (
                    <section key={id} className="mt-10">
                      <h2 id={id} className="scroll-mt-24 font-heading text-h3">
                        {section.heading}
                      </h2>
                      {section.paragraphs.map((para, p) => (
                        <p key={p} className="mt-4 leading-relaxed">
                          {para}
                        </p>
                      ))}
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2 pl-1">
                          {section.bullets.map((bullet, b) => (
                            <li key={b} className="flex gap-2 leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.callout && (
                        <StatusAlert tone={section.callout.tone} className="mt-5">
                          {section.callout.text}
                        </StatusAlert>
                      )}
                    </section>
                  );
                })}

                {/* Inline CTA */}
                <div className="no-print mt-12 rounded-card border border-line bg-surface p-6 text-center">
                  <h2 className="font-heading text-h4">Sorularınız mı var?</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                    Vize sürecinizi danışmanlarımızla netleştirin; size en uygun adımları birlikte
                    planlayalım.
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <PhoneLink
                      location="article_inline_cta"
                      className="btn-primary"
                      label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
                    />
                    <Link href="/online-on-basvuru" className="btn-outline">
                      Ön Başvuru Formu
                    </Link>
                  </div>
                </div>

                {/* FAQ */}
                {article.faqs && article.faqs.length > 0 && (
                  <div className="mt-12">
                    <h2 className="font-heading text-h3">Sıkça Sorulan Sorular</h2>
                    <div className="mt-5">
                      <FAQAccordion items={article.faqs} trackContext="article" />
                    </div>
                    <JsonLd data={faqJsonLd(article.faqs)} />
                  </div>
                )}

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="mt-10 flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    {article.tags.map((tag) => (
                      <span key={tag} className="pill cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author card */}
                <div className="mt-10 flex items-start gap-4 rounded-card border border-line bg-white p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy text-white">
                    <UserRound className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-ink">{article.author.name}</p>
                    <p className="text-sm text-ink-soft">{article.author.role}</p>
                    {article.reviewer && (
                      <p className="mt-2 text-sm text-ink-muted">
                        İçerik incelemesi: {article.reviewer.name} — {article.reviewer.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Related guides (services / countries) */}
                {(relatedServices.length > 0 || relatedCountries.length > 0) && (
                  <div className="mt-10">
                    <h2 className="font-heading text-h4">İlgili Rehberler</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {relatedServices.map((s) => (
                        <Link
                          key={`s-${s.slug}`}
                          href={`/hizmetler/${s.slug}`}
                          className="pill hover:border-navy hover:text-navy"
                        >
                          {s.name}
                        </Link>
                      ))}
                      {relatedCountries.map((c) => (
                        <Link
                          key={`c-${c.slug}`}
                          href={`/vize-ulkeleri/${c.slug}`}
                          className="pill hover:border-navy hover:text-navy"
                        >
                          {c.name} Vizesi
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous / next */}
                {(newer || older) && (
                  <nav aria-label="Diğer yazılar" className="mt-12 grid gap-4 sm:grid-cols-2">
                    {older ? (
                      <Link
                        href={`/blog/${older.slug}`}
                        className="card flex flex-col gap-1 p-5 transition-shadow hover:shadow-form"
                      >
                        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Önceki Yazı
                        </span>
                        <span className="font-heading font-semibold text-ink">{older.title}</span>
                      </Link>
                    ) : (
                      <span />
                    )}
                    {newer && (
                      <Link
                        href={`/blog/${newer.slug}`}
                        className="card flex flex-col items-end gap-1 p-5 text-right transition-shadow hover:shadow-form sm:col-start-2"
                      >
                        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                          Sonraki Yazı <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="font-heading font-semibold text-ink">{newer.title}</span>
                      </Link>
                    )}
                  </nav>
                )}
              </div>
            </div>
          </div>
        </article>
      </Section>

      {/* Lead form */}
      <Section bg="surface" ariaLabel="Danışmanlık talep formu" className="no-print">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="font-heading text-label uppercase tracking-[0.14em] text-gold">
              Ücretsiz Ön Değerlendirme
            </span>
            <h2 className="mt-3 text-h2 text-balance">Başvurunuzu Birlikte Planlayalım</h2>
            <p className="mt-3 text-body-lg text-ink-soft">
              Kısa formu doldurun; durumunuzu değerlendirip size en uygun yol haritasını sunalım.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
              <PhoneLink location="article_form" className="font-semibold text-navy" showIcon={false} />
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm leadType="blog" countryOptions={countryOptions} />
          </div>
        </div>
      </Section>

      <div className="no-print">
        <ClickToCallBanner location="article_bottom" />
      </div>

      <Section bg="page" ariaLabel="Yasal bilgilendirme">
        <LegalDisclaimer />
      </Section>

      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.seo.description,
          path,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          authorName: article.author.name,
          image: article.coverImage,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Ana Sayfa', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: article.title, path },
        ])}
      />
    </>
  );
}
