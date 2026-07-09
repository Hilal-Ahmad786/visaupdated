import type { Metadata } from 'next';
import { CheckCircle2, ClipboardCheck, Globe, MapPin, Zap } from 'lucide-react';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { CountriesExplorer } from '@/components/countries/CountriesExplorer';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { HeroShell } from '@/components/layout/HeroShell';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const PAGE_DESCRIPTION =
  'Vize başvurusu yapabileceğiniz ülkeleri keşfedin. Ülke seçin, gerekli evrakları ve süreci inceleyin, danışmanlarımızdan destek alın.';

export const metadata: Metadata = buildMetadata({
  title: 'Vize Ülkeleri',
  description: PAGE_DESCRIPTION,
  path: '/vize-ulkeleri',
});

export default async function CountriesPage() {
  const repo = getContentRepository();
  const countries = await repo.getCountries();
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Vize Ülkeleri', href: '/vize-ulkeleri' }]} />

      {/* Intro hero — standard shell + compliance bar (value-prop card aside) */}
      <HeroShell
        ariaLabel="Vize ülkeleri tanıtımı"
        innerClassName="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
      >
          <div className="lg:pt-1.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-heading text-label uppercase tracking-[0.1em] text-gold-soft">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              Dünyayı Keşfedin
            </span>

            <h1 className="mt-5 text-balance text-h1 text-white lg:text-[3.25rem] lg:leading-[1.1]">
              Gitmek İstediğiniz <span className="text-gold-soft">Ülkeyi Seçin</span>
            </h1>

            <p className="mt-5 max-w-xl text-body-lg text-white/80">{PAGE_DESCRIPTION}</p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {['Resmi Konsolosluk Bilgileri', 'Hızlı Randevu Kaydı', 'Ücretsiz Ön Değerlendirme'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2 text-sm font-medium text-white/90">
                    <CheckCircle2 className="h-[18px] w-[18px] text-gold-soft" aria-hidden="true" /> {t}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-8">
              <PhoneLink
                location="countries_hero"
                className="btn-primary"
                label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
              />
            </div>
          </div>

          {/* Value-prop card */}
          <div className="rounded-form border-t-4 border-gold bg-white p-6 text-ink shadow-form sm:p-7">
            <h2 className="font-heading text-h3 text-navy">
              Hangi ülkeye gideceğinizden emin değil misiniz?
            </h2>
            <p className="mt-2 text-ink-soft">
              Uzman danışmanlarımız seyahat amacınıza en uygun vize tipini ve ülkeyi belirlemenize
              yardımcı olsun.
            </p>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-surface text-navy">
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading font-semibold text-ink">Ücretsiz Ön Değerlendirme</p>
                  <p className="text-sm text-ink-soft">
                    Profilinize göre en kolay vize alabileceğiniz rotalar.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-surface text-navy">
                  <Zap className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading font-semibold text-ink">Hızlı İşlem Süreçleri</p>
                  <p className="text-sm text-ink-soft">
                    Bürokratik adımlarda yanınızda oluyoruz.
                  </p>
                </div>
              </li>
            </ul>
            <PhoneLink
              location="countries_hero_card"
              className="btn-primary mt-6 w-full justify-center"
              label="Ücretsiz Danışmanlık Al"
            />
          </div>
      </HeroShell>

      {/* Explorer */}
      <Section bg="white" ariaLabel="Ülke listesi">
        {countries.length === 0 ? (
          <EmptyState
            title="Şu anda listelenen ülke bulunmuyor"
            description="Hedeflediğiniz ülke için bizimle iletişime geçebilirsiniz."
            action={<PhoneLink location="countries_empty" className="btn-primary" />}
          />
        ) : (
          <CountriesExplorer countries={countries} />
        )}
      </Section>

      {/* Unsupported country handling */}
      <Section bg="surface" ariaLabel="Listede olmayan ülkeler">
        <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-surface text-navy">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-h4">Aradığınız ülke listede yok mu?</h2>
              <p className="mt-1.5 max-w-xl text-ink-soft">
                Listemiz sürekli güncellenmektedir. Gitmek istediğiniz ülke burada yer almıyorsa
                bile bizimle iletişime geçin; uygun bir destek sunabilir miyiz birlikte
                değerlendirelim.
              </p>
            </div>
          </div>
          <PhoneLink location="countries_unsupported" className="btn-navy shrink-0" />
        </div>
      </Section>

      {/* Lead form */}
      <Section bg="page" ariaLabel="Danışmanlık talep formu">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Ücretsiz Ön Değerlendirme"
              title="Doğru Ülke ve Vize Türünü Birlikte Belirleyelim"
              description="Kısa formu doldurun, profilinizi değerlendirip size en uygun yol haritasını sunalım."
            />
            <div className="mt-6">
              <PhoneLink
                location="countries_form"
                className="btn-navy"
                label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
              />
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm leadType="country" countryOptions={countryOptions} />
          </div>
        </div>
      </Section>

      <ClickToCallBanner location="countries_bottom" />
    </>
  );
}
