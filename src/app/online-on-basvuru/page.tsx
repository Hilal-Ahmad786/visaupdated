import { Clock, ShieldCheck } from 'lucide-react';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { PreApplicationForm } from '@/components/forms/PreApplicationForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Online Ön Başvuru',
  description:
    'Ücretsiz vize ön değerlendirmenizi başlatın. Kısa çok adımlı formu doldurun, uzman ekibimiz başvuru türünüzü değerlendirip size ulaşsın.',
  path: '/online-on-basvuru',
});

export default async function PreApplicationPage({
  searchParams,
}: {
  searchParams: { country?: string };
}) {
  const repo = getContentRepository();
  const countries = await repo.getCountries();
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const preset = countries.find((c) => c.slug === searchParams.country)?.slug;

  return (
    <div className="bg-page">
      <div className="container-content grid items-start gap-10 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        {/* Benefit copy (short — above the form on mobile via order) */}
        <div className="order-2 lg:order-1">
          <p className="font-heading text-label uppercase tracking-[0.14em] text-gold">Online Ön Başvuru</p>
          <h1 className="mt-2 text-h1">Ücretsiz Vize Ön Değerlendirmenizi Başlatın</h1>
          <p className="mt-3 text-body-lg text-ink-soft">
            Kısa formu doldurun. Uzman ekibimiz başvuru türünüzü değerlendirerek size en kısa sürede ulaşsın.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-gold" aria-hidden="true" /> 2–3 dakikada tamamlanır
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-success" aria-hidden="true" /> Güvenli ve KVKK uyumlu bilgi aktarımı
            </li>
          </ul>
          <div className="mt-7 rounded-card bg-white p-5 shadow-card">
            <p className="text-sm text-ink-soft">Telefonla başvurmayı tercih eder misiniz?</p>
            <PhoneLink location="pre_app_sidebar" className="mt-1 font-heading text-h4 text-navy" showIcon={false} />
          </div>
          <LegalDisclaimer className="mt-6" />
        </div>

        {/* Form */}
        <div className="order-1 lg:order-2">
          <PreApplicationForm countryOptions={countryOptions} presetCountry={preset} />
        </div>
      </div>
    </div>
  );
}
