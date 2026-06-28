import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { faqJsonLd } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';
import type { ProcessStep } from '@/types/content';

const PAGE_DESCRIPTION =
  'Vize danışmanlığı, evrak kontrolü, randevu organizasyonu ve daha fazlası: başvuru sürecinizin her adımında profesyonel destek.';

export const metadata: Metadata = buildMetadata({
  title: 'Hizmetler',
  description: PAGE_DESCRIPTION,
  path: '/hizmetler',
});

const heroHighlights = [
  'Uzman vize danışmanlığı',
  'Hızlı randevu organizasyonu',
  'Evrak takibi ve kontrolü',
  'Şeffaf süreç ve ücretlendirme',
];

const genericProcess: ProcessStep[] = [
  {
    title: 'Ön Değerlendirme',
    description: 'Profilinizi ve hedefinizi kısa bir görüşmeyle değerlendirip ihtiyacınızı netleştiririz.',
  },
  {
    title: 'Planlama',
    description: 'Size özel yol haritasını, evrak listesini ve zaman planını hazırlarız.',
  },
  {
    title: 'Hazırlık ve Kontrol',
    description: 'Evrak, form ve randevu adımlarında yönlendirme yapar, eksikleri birlikte tamamlarız.',
  },
  {
    title: 'Takip',
    description: 'Başvurunuz sonuçlanana kadar süreci izler, gelişmeleri sizinle paylaşırız.',
  },
];

const genericFaqs = [
  {
    question: 'Hizmet ücretlerine resmi vize harçları dahil mi?',
    answer:
      'Hayır. Resmi vize harçları, başvuru merkezi ücretleri ve sigorta gibi resmi bedeller danışmanlık ücretinden ayrıdır ve doğrudan ilgili kuruma ödenir.',
  },
  {
    question: 'Vize onayı garanti ediyor musunuz?',
    answer:
      'Hayır. Nihai karar ilgili konsolosluk veya resmi makamlara aittir. Biz başvurunuzu eksiksiz ve doğru hazırlamanız için danışmanlık ve destek sağlarız.',
  },
  {
    question: 'Hangi hizmeti almam gerektiğine nasıl karar veririm?',
    answer:
      'Emin değilseniz ön değerlendirme formunu doldurmanız yeterli. Profilinizi inceleyip size en uygun destek kapsamını öneririz.',
  },
];

export default async function ServicesPage() {
  const repo = getContentRepository();
  const [services, categories, countries] = await Promise.all([
    repo.getServices(),
    repo.getServiceCategories(),
    repo.getCountries(),
  ]);

  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));

  const grouped = categories
    .map((category) => ({
      category,
      items: services.filter((s) => s.category === category.slug),
    }))
    .filter((g) => g.items.length > 0);

  // Representative services for the "who is this for" comparison.
  const comparison = services.slice(0, 3);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Hizmetler', href: '/hizmetler' }]} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy to-navy-deep text-white">
        <div className="container-content grid items-start gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-heading text-label uppercase tracking-[0.14em] text-gold-soft">Hizmetlerimiz</p>
            <h1 className="mt-3 text-h1 text-white">Vize Sürecinin Her Adımında Yanınızdayız</h1>
            <p className="mt-4 max-w-xl text-body-lg text-white/80">{PAGE_DESCRIPTION}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-white/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PhoneLink
                location="services_hero"
                className="btn-primary text-lg"
                label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
              />
            </div>
          </div>
          <div className="rounded-form bg-white p-6 text-ink shadow-form sm:p-7">
            <SimpleLeadForm
              leadType="service"
              countryOptions={countryOptions}
              compact
              title="Hangi Konuda Desteğe İhtiyacınız Var?"
              description="Kısa formu doldurun, profilinizi değerlendirip size en uygun hizmeti önerelim."
            />
          </div>
        </div>
      </section>

      {/* Services grouped by category */}
      {grouped.length === 0 ? (
        <Section bg="page">
          <EmptyState
            title="Hizmet bulunamadı"
            description="Şu anda görüntülenecek hizmet bulunmuyor. Lütfen daha sonra tekrar deneyin."
          />
        </Section>
      ) : (
        grouped.map(({ category, items }, idx) => (
          <Section key={category.slug} bg={idx % 2 === 0 ? 'page' : 'white'} ariaLabel={category.title}>
            <SectionHeading eyebrow={category.title} title={category.title} description={category.description} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </Section>
        ))
      )}

      {/* Process */}
      <Section bg="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Nasıl Çalışıyoruz" title="Süreç Nasıl İşler?" />
            <p className="mt-4 text-ink-soft">
              Hangi hizmeti alırsanız alın, süreci sizin adınıza planlar ve her adımda yanınızda oluruz.
            </p>
          </div>
          <ProcessTimeline steps={genericProcess} />
        </div>
      </Section>

      {/* Comparison: scope vs exclusions */}
      {comparison.length > 0 && (
        <Section bg="surface">
          <SectionHeading
            eyebrow="Kapsam Şeffaflığı"
            title="Neyi Yapıyoruz, Neyi Yapmıyoruz?"
            description="Hizmetlerimizin sınırlarını baştan net olarak paylaşırız."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {comparison.map((service) => (
              <div key={service.slug} className="card flex flex-col p-6">
                <h3 className="font-heading text-h4">{service.name}</h3>
                <div className="mt-4">
                  <p className="text-label font-semibold uppercase tracking-wide text-success">Dahil</p>
                  <ul className="mt-2 space-y-2">
                    {service.scope.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-label font-semibold uppercase tracking-wide text-danger">Dahil Değil</p>
                  <ul className="mt-2 space-y-2">
                    {service.exclusions.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Assessment form */}
      <Section bg="page" ariaLabel="Ön değerlendirme formu">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Ücretsiz Ön Değerlendirme"
              title="Size En Uygun Hizmeti Birlikte Belirleyelim"
              description="Hangi desteğe ihtiyacınız olduğundan emin değil misiniz? Kısa formu doldurun, profilinizi değerlendirip yönlendirelim."
            />
            <div className="mt-6">
              <PhoneLink location="services_assessment" className="btn-navy" label="Telefonla Görüşmek İsterim" />
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm
              leadType="service"
              countryOptions={countryOptions}
              title="Ön Değerlendirme Talebi"
              description="Bilgilerinizi paylaşın, uzman danışmanlarımız sizi arasın."
            />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="white">
        <SectionHeading eyebrow="Sıkça Sorulan Sorular" title="Hizmetlerimiz Hakkında" align="center" />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={genericFaqs} trackContext="services:list" />
        </div>
      </Section>

      {/* Bottom form */}
      <Section bg="page" ariaLabel="Hizmet talep formu">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm
              leadType="service"
              countryOptions={countryOptions}
              title="Hizmet Talebi Oluşturun"
            />
          </div>
          <LegalDisclaimer className="mt-6" />
        </div>
      </Section>

      <ClickToCallBanner location="services_bottom" />
      <JsonLd data={faqJsonLd(genericFaqs)} />
    </>
  );
}
