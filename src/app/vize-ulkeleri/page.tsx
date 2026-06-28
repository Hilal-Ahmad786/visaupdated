import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { CountriesExplorer } from '@/components/countries/CountriesExplorer';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
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

      {/* Intro hero */}
      <Section bg="page" ariaLabel="Vize ülkeleri tanıtımı">
        <SectionHeading
          as="h1"
          eyebrow="Vize Ülkeleri"
          title="Hangi Ülkeye Gitmek İstiyorsunuz?"
          description={PAGE_DESCRIPTION}
        />
      </Section>

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
