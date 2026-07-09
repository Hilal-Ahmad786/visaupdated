import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';

import { PhoneLink } from '@/components/conversion/PhoneLink';
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
 * WhatsApp CTA. The hero mirrors the homepage (heading + phone-card/WhatsApp CTA
 * on the left, lead form on the right); the mandatory disclaimer runs as a slim
 * strip directly beneath the hero for Google Ads compliance.
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
          {/* Left: heading + CTA (phone card + WhatsApp) — same pattern as the homepage hero */}
          <div>
            <p className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              {config.eyebrow}
            </p>
            <h1 className="text-h1 text-white text-balance">{config.h1}</h1>
            <p className="mt-4 text-body-lg text-white/85">{config.heroText}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-card border border-white/10 bg-white p-2 pl-4 shadow-card">
                <div className="pr-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                    Hemen Arayın
                  </p>
                  <PhoneLink
                    location="randevu_hero_phone_card"
                    showIcon={false}
                    className="font-heading text-lg font-bold text-navy"
                  />
                </div>
                <PhoneLink
                  location="randevu_hero_phone_btn"
                  showIcon
                  label=""
                  className="h-12 w-12 shrink-0 rounded-xl bg-gold text-white hover:bg-gold-hover"
                />
              </div>
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

      {/* Mandatory disclosure — kept near the top for Google Ads compliance
          (moved out of the hero visual per the standard hero layout). */}
      <div className="border-b border-line bg-surface">
        <div className="container-content py-3">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            {RANDEVU_DISCLAIMER}
          </p>
        </div>
      </div>

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
