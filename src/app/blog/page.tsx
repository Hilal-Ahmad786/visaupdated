import type { Metadata } from 'next';
import { BookOpen, RefreshCw, ShieldCheck } from 'lucide-react';

import { BlogFilters } from '@/components/blog/BlogFilters';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const PAGE_DESCRIPTION =
  'Vize süreci, belgeler ve ülke rehberleri hakkında güncel yazılar.';

export const metadata: Metadata = buildMetadata({
  title: 'Blog ve Vize Rehberleri',
  description: PAGE_DESCRIPTION,
  path: '/blog',
});

const TRUST_POINTS = [
  {
    icon: BookOpen,
    title: 'Bilgilendirme amaçlı içerik',
    text: 'Yazılarımız vize süreçlerini anlamanıza yardımcı olmak için hazırlanan rehber niteliğindedir.',
  },
  {
    icon: RefreshCw,
    title: 'Resmi güncellemelere açık',
    text: 'Konsoloslukların gereklilikleri değişebilir; içeriklerimiz güncel tutulmaya çalışılsa da resmi kaynaklar esastır.',
  },
  {
    icon: ShieldCheck,
    title: 'Garanti vaadi yok',
    text: 'İçeriklerimiz vize onayı garantisi vermez; her başvuru ilgili makamın değerlendirmesine tabidir.',
  },
];

export default async function BlogPage() {
  const repo = getContentRepository();
  const [articles, categories, countries] = await Promise.all([
    repo.getArticles(),
    repo.getBlogCategories(),
    repo.getCountries(),
  ]);

  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const featured = articles.find((a) => a.featured);
  const rest = featured ? articles.filter((a) => a.slug !== featured.slug) : articles;

  return (
    <>
      <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} />

      {/* Intro hero */}
      <Section bg="page" ariaLabel="Blog tanıtımı">
        <SectionHeading
          as="h1"
          eyebrow="Blog ve Rehberler"
          title="Vize Sürecini Adım Adım Anlatan Güncel Yazılar"
          description={PAGE_DESCRIPTION}
        />
      </Section>

      {articles.length === 0 ? (
        <Section bg="white" ariaLabel="Blog içeriği">
          <EmptyState
            title="Şu anda yayında yazı bulunmuyor"
            description="Yeni rehberler yakında eklenecek. Bu sırada danışmanlarımızdan destek alabilirsiniz."
            action={<PhoneLink location="blog_empty" className="btn-primary" />}
          />
        </Section>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <Section bg="white" ariaLabel="Öne çıkan yazı">
              <h2 className="mb-5 font-heading text-label uppercase tracking-[0.14em] text-gold">
                Öne Çıkan Yazı
              </h2>
              <ArticleCard article={featured} featured />
            </Section>
          )}

          {/* Searchable / filterable grid */}
          <Section bg={featured ? 'page' : 'white'} ariaLabel="Tüm yazılar">
            <h2 className="mb-6 font-heading text-h3">Tüm Yazılar</h2>
            <BlogFilters articles={rest} categories={categories} />
          </Section>
        </>
      )}

      {/* Editorial standards / trust */}
      <Section bg="surface" ariaLabel="Editöryel standartlarımız">
        <SectionHeading
          eyebrow="Şeffaflık"
          title="Editöryel Standartlarımız"
          description="İçeriklerimizi nasıl hazırladığımızı ve sınırlarını açıkça paylaşıyoruz."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-surface text-navy">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-h4">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Consultation CTA (no newsletter infrastructure) */}
      <Section bg="page" ariaLabel="Danışmanlık talep formu">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Ücretsiz Ön Değerlendirme"
              title="Yazıları Okudunuz, Sıra Sizin Başvurunuzda"
              description="Kısa formu doldurun; durumunuzu değerlendirip size en uygun yol haritasını sunalım."
            />
            <div className="mt-6">
              <PhoneLink
                location="blog_form"
                className="btn-navy"
                label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
              />
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm leadType="blog" countryOptions={countryOptions} />
          </div>
        </div>
      </Section>

      <ClickToCallBanner location="blog_bottom" />
    </>
  );
}
