import { Lock } from 'lucide-react';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { PreApplicationForm } from '@/components/forms/PreApplicationForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Online Ön Başvuru',
  description:
    'Ücretsiz vize ön değerlendirmenizi başlatın. Kısa çok adımlı formu doldurun, uzman ekibimiz başvuru türünüzü değerlendirip size ulaşsın.',
  path: '/online-on-basvuru',
});

const PROCESS_STEPS = [
  { title: 'Formu Doldurun', description: 'Seyahat planınızı ve bilgilerinizi iletin.' },
  { title: 'Ücretsiz Analiz', description: 'Dosyanızı vize şartlarına göre değerlendirelim.' },
  { title: 'Geri Dönüş', description: 'Size en uygun yol haritası için arayalım.' },
];

const FAQ_CATEGORIES = ['genel', 'ucretler', 'randevu'];

export default async function PreApplicationPage({
  searchParams,
}: {
  searchParams: { country?: string };
}) {
  const repo = getContentRepository();
  const [countries, faqs] = await Promise.all([repo.getCountries(), repo.getFaqs()]);
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const preset = countries.find((c) => c.slug === searchParams.country)?.slug;
  const pageFaqs = faqs.filter((f) => FAQ_CATEGORIES.includes(f.category)).slice(0, 5);

  return (
    <>
      {/* Form-first hero — matches the homepage/landing conversion heroes. */}
      <PageHero
        eyebrow="Online Ön Başvuru"
        title="Vize randevunuzu almak için formu doldurun"
        description="Uzman ekibimiz başvuru türünüzü değerlendirip size ulaşsın; kısa formu doldurmanız yeterli."
        highlights={[
          '2–3 dakikada tamamlanır',
          'Güvenli, KVKK uyumlu bilgi aktarımı',
          'Ücretsiz ilk değerlendirme',
        ]}
        actions={
          <>
            <PhoneLink location="pre_app_hero" className="btn-primary" label="Hemen Ara" />
            <span className="flex items-center text-sm text-white/70">
              Form doldurmak istemiyorsanız telefonla başlayalım.
            </span>
          </>
        }
        aside={
          <div className="relative">
            <span className="absolute -top-3 right-5 z-10 rounded-full bg-gold px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-white shadow-card">
              Ücretsiz Ön Değerlendirme
            </span>
            <PreApplicationForm countryOptions={countryOptions} presetCountry={preset} />
          </div>
        }
      />

      <div className="bg-page">
      <div className="container-content grid items-start gap-6 py-10 md:grid-cols-2 lg:py-16">
        {/* How the process works */}
        <div className="rounded-card border border-line bg-white p-5 shadow-card">
          <p className="font-heading font-semibold text-navy">Süreç Nasıl İlerler?</p>
          <ol className="mt-3 space-y-3">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-surface font-heading text-sm font-bold text-gold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-sm">
                  <span className="font-heading font-semibold text-ink">{step.title}</span>
                  <span className="block text-ink-soft">{step.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          {/* Security note */}
          <div className="flex gap-3 rounded-card border border-line bg-gold-surface p-4 text-sm">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            <p className="leading-relaxed text-ink-soft">
              <span className="font-heading font-semibold text-ink">Bilgileriniz Güvende.</span> 256-bit SSL şifreleme ve
              KVKK uyumlu altyapı ile korunur.
            </p>
          </div>

          <LegalDisclaimer className="mt-6" />
        </div>
      </div>

      {/* FAQ */}
      {pageFaqs.length > 0 && (
        <section className="bg-surface py-14 md:py-20" aria-label="Sıkça sorulan sorular">
          <div className="container-content">
            <SectionHeading
              eyebrow="Sıkça Sorulan Sorular"
              title="Vize Süreci Hakkında Merak Edilenler"
              align="center"
            />
            <div className="mx-auto mt-8 max-w-3xl">
              <FAQAccordion items={pageFaqs} trackContext="pre_application" />
            </div>
          </div>
        </section>
      )}

      <ClickToCallBanner location="pre_application_bottom" />
      </div>
    </>
  );
}
