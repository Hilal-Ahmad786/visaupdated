import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
import { ApplicantStatusTabs } from '@/components/countries/ApplicantStatusTabs';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Flag } from '@/components/ui/Flag';
import { Section, SectionHeading } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import type { Country } from '@/types/content';

/**
 * Shared country/landing renderer. Used by BOTH /vize-ulkeleri/[countrySlug]
 * and /schengen-vizesi so there is a single source of truth for the most
 * important Google Ads landing template (design §17.6 / §17.7).
 */
export function CountryDetail({
  country,
  countryOptions,
  relatedCountries,
}: {
  country: Country;
  countryOptions: { value: string; label: string }[];
  relatedCountries: Country[];
}) {
  return (
    <>
      {/* Form-first hero */}
      <section className="bg-gradient-to-b from-navy to-navy-deep text-white">
        <div className="container-content py-10 sm:py-12 lg:py-16">
          <div className="grid items-start gap-x-10 gap-y-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-y-4">
            {/* 1. Heading — always shown first */}
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              <p className="font-heading text-label uppercase tracking-[0.14em] text-gold-soft">{country.heroEyebrow}</p>
              <h1 className="mt-3 flex items-center gap-3 text-h1 text-white">
                <Flag code={country.code} size={40} className="shrink-0" />
                {country.heroTitle}
              </h1>
            </div>
            {/* 2. Form — right after the heading on mobile (prominent), right column on desktop */}
            <div className="order-2 rounded-form bg-white p-6 text-ink shadow-form sm:p-7 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <SimpleLeadForm
                leadType="country"
                countryOptions={countryOptions}
                presetCountry={country.slug === 'schengen' ? '' : country.slug}
                compact
                title={`${country.name} Vizesi Ön Değerlendirme`}
                description="Kısa formu doldurun, başvuru türünüzü değerlendirip size en kısa sürede ulaşalım."
              />
            </div>
            {/* 3. Description + call CTA — after the form on mobile, under the heading on desktop */}
            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <p className="max-w-xl text-body-lg text-white/80">{country.heroDescription}</p>
              <div className="mt-7">
                <PhoneLink location="country_hero" className="btn-primary w-full text-lg sm:w-auto" label={`Hemen Ara: ${contactSettings.phoneDisplay}`} />
              </div>
            </div>
          </div>

          {/* Quick facts strip */}
          {country.quickFacts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 lg:grid-cols-4">
              {country.quickFacts.map((f) => (
                <div key={f.label} className="rounded-card border border-white/10 bg-white/5 px-4 py-3.5">
                  <dt className="text-xs uppercase tracking-wide text-white/55">{f.label}</dt>
                  <dd className="mt-1 font-heading text-h4 text-white">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Visa categories */}
      <Section bg="page">
        <SectionHeading eyebrow="Vize Kategorileri" title={`${country.name} İçin Vize Türleri`} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {country.visaTypes.map((vt) => (
            <div key={vt.slug} className="card p-5">
              <h3 className="font-heading text-h4">{vt.name}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{vt.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who can apply + CTA */}
      <Section bg="white">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Kimler Başvurabilir" title="Bu Vize Kimler İçin Uygun?" />
            <ul className="mt-6 space-y-3">
              {country.whoCanApply.map((w) => (
                <li key={w} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span className="text-ink-soft">{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-center rounded-panel bg-gold-surface p-7">
            <h3 className="font-heading text-h3 text-navy">Başvuru türünüzden emin değil misiniz?</h3>
            <p className="mt-2 text-ink-soft">Profilinizi değerlendirip size en uygun vize türünü belirleyelim.</p>
            <PhoneLink location="country_mid" className="btn-navy mt-5" label="Uzmanlarımıza Sorun" />
          </div>
        </div>
      </Section>

      {/* Required documents */}
      <Section bg="page">
        <SectionHeading eyebrow="Gerekli Belgeler" title="Temel Başvuru Belgeleri" description="Belgeler ülkeye ve başvuru türüne göre değişebilir; güncel listeyi başvuru öncesi doğrulayın." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {country.documentGroups.map((g) => (
            <div key={g.title} className="card p-5">
              <h3 className="font-heading text-h4">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Applicant-status tabs */}
        <div className="mt-10">
          <h3 className="font-heading text-h3">Başvuran Durumunuza Göre Ek Belgeler</h3>
          <p className="mt-1.5 text-ink-soft">Çalışma ve gelir durumunuza göre değişen belgeler.</p>
          <div className="mt-5">
            <ApplicantStatusTabs statuses={country.applicantStatuses} />
          </div>
        </div>
      </Section>

      {/* Process + timeline */}
      <Section bg="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Başvuru Süreci" title="Adım Adım Süreç" />
            <StatusAlert tone="info" className="mt-6">{country.timelineNote}</StatusAlert>
          </div>
          <ProcessTimeline steps={country.processSteps} />
        </div>
      </Section>

      {/* Common mistakes + rejection */}
      <Section bg="page">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-heading text-h4">
              <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" /> Sık Yapılan Hatalar
            </h3>
            <ul className="mt-4 space-y-2.5">
              {country.commonMistakes.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-heading text-h4">Ret Durumunda Ne Yapmalı?</h3>
            <ul className="mt-4 space-y-2.5">
              {country.rejectionGuidance.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {country.faqs.length > 0 && (
        <Section bg="white">
          <SectionHeading eyebrow="Sıkça Sorulan Sorular" title={`${country.name} Vizesi Hakkında`} align="center" />
          <div className="mx-auto mt-8 max-w-3xl">
            <FAQAccordion items={country.faqs} trackContext={`country:${country.slug}`} />
          </div>
        </Section>
      )}

      {/* Related countries */}
      {relatedCountries.length > 0 && (
        <Section bg="page">
          <SectionHeading title="İlgili Ülkeler" />
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedCountries.map((rc) => (
              <Link key={rc.slug} href={`/vize-ulkeleri/${rc.slug}`} className="pill">
                <Flag code={rc.code} size={18} /> {rc.name} Vizesi
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Bottom form */}
      <Section bg="white" ariaLabel="Ön başvuru formu">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm
              leadType="country"
              countryOptions={countryOptions}
              presetCountry={country.slug === 'schengen' ? '' : country.slug}
              title={`${country.name} Vizesi İçin Ön Başvuru`}
            />
          </div>
          <LegalDisclaimer className="mt-6" />
        </div>
      </Section>

      <ClickToCallBanner location="country_bottom" />
    </>
  );
}
