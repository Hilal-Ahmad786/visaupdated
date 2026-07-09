import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';

import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { HeroShell } from '@/components/layout/HeroShell';
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

      {/* ---------- Hero (form is the primary above-the-fold conversion) ---------- */}
      <HeroShell
        ariaLabel={config.h1}
        innerClassName="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]"
      >
          {/* Left: copy + mandatory disclaimer + secondary CTAs */}
          <div>
            <p className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              {config.eyebrow}
            </p>
            <h1 className="text-h1 text-white text-balance">{config.h1}</h1>
            <p className="mt-4 text-body-lg text-white/85">{config.heroText}</p>

            {/* Mandatory, strongly visible compliance disclaimer — above the fold. */}
            <div
              className="mt-8 flex gap-3 rounded-card border border-gold/40 bg-white/95 p-4 text-sm text-ink shadow-card"
              role="note"
            >
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <p className="leading-relaxed">{RANDEVU_DISCLAIMER}</p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <RandevuWhatsAppButton message={whatsappMessage} label={config.ctaSecondaryText} />
            </div>
          </div>

          {/* Right: lead form (main conversion, in every hero) */}
          <div id="lead-form" className="scroll-mt-24 text-ink">
            <RandevuLeadForm
              formName={formName}
              presetCountry={config.country}
              presetCenter={config.providerName}
              title={config.ctaPrimaryText}
              description="Bilgileriniz KVKK kapsamında yalnızca danışmanlık amacıyla kullanılır."
              submitLabel="Ön Değerlendirme Talebi Gönder"
            />
          </div>
      </HeroShell>

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

      {/* ---------- Repeated CTA back to the hero form ---------- */}
      <Section bg="navy" ariaLabel="Ön değerlendirme">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <h2 className="text-h2 text-white">Randevu süreciniz için bize kısaca bilgi verin</h2>
          <p className="max-w-2xl text-body-lg text-white/80">
            Ön değerlendirme formunu ilettikten sonra danışmanlarımız başvuru türünüzü ve evrak
            durumunuzu değerlendirerek size uygun yol haritasını paylaşır.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#lead-form" className="btn-primary text-base">
              {config.ctaPrimaryText}
            </a>
            <RandevuWhatsAppButton message={whatsappMessage} label={config.ctaSecondaryText} />
          </div>
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
