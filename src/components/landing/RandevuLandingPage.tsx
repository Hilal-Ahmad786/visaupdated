import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';

import { ComplianceBar } from '@/components/compliance/ComplianceBar';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import {
  RANDEVU_BASE_PATH,
  RANDEVU_DISCLAIMER,
  RANDEVU_NOT_GUARANTEED,
  RANDEVU_PROCESS,
  RANDEVU_SERVICES,
  type RandevuLandingPage as RandevuLandingPageConfig,
} from '@/data/randevuLandingPages';
import { faqJsonLd, serviceJsonLd } from '@/lib/seo';

import { RandevuLeadForm } from './RandevuLeadForm';
import { RandevuWhatsAppButton } from './RandevuWhatsAppButton';

/**
 * Data-driven provider appointment-consultancy landing page. Renders entirely
 * from a single `RandevuLandingPage` config; there is no per-page component. It
 * is server-rendered — the only client islands are the lead form and the
 * WhatsApp CTA. The mandatory compliance disclaimer sits above the fold, inside
 * the hero, directly above the CTAs.
 */
export function RandevuLandingPage({ config }: { config: RandevuLandingPageConfig }) {
  const path = `${RANDEVU_BASE_PATH}/${config.slug}`;
  const locationLabel = config.city || config.country;
  const breadcrumbLabel = `${config.providerName}${locationLabel ? ` ${locationLabel}` : ''}`;

  const formName = `${breadcrumbLabel} Randevu Danışmanlığı Formu`;
  const whatsappMessage = `Merhaba, ${config.pageIntent} hakkında bilgi almak istiyorum.`;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Vize Randevu Süreci Danışmanlığı', href: RANDEVU_BASE_PATH },
          { name: breadcrumbLabel, href: path },
        ]}
      />

      {/* ---------- Hero ---------- */}
      <section className="bg-navy text-white" aria-label={config.h1}>
        <div className="container-content py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              {config.eyebrow}
            </p>
            <h1 className="text-h1 text-white text-balance">{config.h1}</h1>
            <p className="mt-4 text-body-lg text-white/85">{config.heroText}</p>
          </div>

          {/* Mandatory, strongly visible compliance disclaimer — above the CTAs. */}
          <div
            className="mt-8 flex max-w-3xl gap-3 rounded-card border border-gold/40 bg-white/95 p-4 text-sm text-ink shadow-card"
            role="note"
          >
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="leading-relaxed">{RANDEVU_DISCLAIMER}</p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#lead-form" className="btn-primary text-base">
              {config.ctaPrimaryText}
            </a>
            <RandevuWhatsAppButton message={whatsappMessage} label={config.ctaSecondaryText} />
          </div>
        </div>
      </section>

      {/* Shared A-class / not-affiliated compliance bar (same as homepage). */}
      <ComplianceBar />

      {/* ---------- What we provide ---------- */}
      <Section bg="white" ariaLabel={RANDEVU_SERVICES.title}>
        <SectionHeading title={RANDEVU_SERVICES.title} align="center" />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {RANDEVU_SERVICES.items.map((item) => (
            <li key={item} className="card flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              <span className="text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- What is NOT guaranteed ---------- */}
      <Section bg="page" ariaLabel={RANDEVU_NOT_GUARANTEED.title}>
        <SectionHeading
          title={RANDEVU_NOT_GUARANTEED.title}
          description="Şeffaflık gereği, hizmet kapsamımızın dışında kalan konuları açıkça belirtiyoruz."
          align="center"
        />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {RANDEVU_NOT_GUARANTEED.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-card border border-line bg-white p-5"
            >
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <span className="text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Process ---------- */}
      <Section bg="white" ariaLabel={RANDEVU_PROCESS.title}>
        <SectionHeading title={RANDEVU_PROCESS.title} align="center" />
        <ol className="mx-auto mt-10 grid max-w-4xl gap-4">
          {RANDEVU_PROCESS.steps.map((step, i) => (
            <li key={step} className="card flex items-start gap-4 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy font-heading text-base font-semibold text-white">
                {i + 1}
              </span>
              <span className="pt-1 text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------- Lead form ---------- */}
      <Section bg="surface" ariaLabel="Ön değerlendirme formu" id="lead-form">
        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Ön Değerlendirme"
              title="Randevu süreciniz için bize kısaca bilgi verin"
              description="Formu ilettikten sonra danışmanlarımız başvuru türünüzü ve evrak durumunuzu değerlendirerek size uygun yol haritasını paylaşır."
            />
            <div className="mt-6 flex gap-3 rounded-card border border-gold/40 bg-gold-surface p-4 text-sm text-ink-soft">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <p className="leading-relaxed">{RANDEVU_DISCLAIMER}</p>
            </div>
          </div>

          <RandevuLeadForm
            formName={formName}
            presetCountry={config.country}
            presetCenter={config.providerName}
            title="Ön Değerlendirme Formu"
            description="Bilgileriniz KVKK kapsamında yalnızca danışmanlık amacıyla kullanılır."
            submitLabel="Ön Değerlendirme Talebi Gönder"
          />
        </div>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section bg="page" ariaLabel="Sıkça sorulan sorular">
        <SectionHeading
          eyebrow="Sıkça Sorulan Sorular"
          title={`${breadcrumbLabel} Randevu Süreci — Sık Sorulanlar`}
          align="center"
        />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={config.faqItems} trackContext="randevu_faq" />
        </div>
      </Section>

      <JsonLd
        data={serviceJsonLd({
          name: `${config.pageIntent} — Bağımsız Danışmanlık Hizmeti`,
          description: config.metaDescription,
          path,
          serviceType: 'Vize randevu süreci danışmanlığı ve evrak kontrol desteği',
        })}
      />
      <JsonLd data={faqJsonLd(config.faqItems)} />
    </>
  );
}
