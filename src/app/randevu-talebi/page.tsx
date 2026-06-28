import { CalendarClock, Phone } from 'lucide-react';
import Link from 'next/link';

import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Randevu Talebi',
  description:
    'Vize randevu sürecinizi sizin adımıza takip edelim. Ülke, vize türü ve tercih ettiğiniz tarih aralığını paylaşın; uygun seçenekleri size iletelim.',
  path: '/randevu-talebi',
});

export default async function AppointmentPage() {
  const repo = getContentRepository();
  const countries = await repo.getCountries();
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Randevu Talebi', href: '/randevu-talebi' }]} />
      <div className="container-content grid items-start gap-10 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:py-14">
        <div>
          <p className="font-heading text-label uppercase tracking-[0.14em] text-gold">Randevu Talebi</p>
          <h1 className="mt-2 text-h1">Randevu Sürecinizi Sizin Adınıza Takip Edelim</h1>
          <p className="mt-3 text-body-lg text-ink-soft">
            Tercih ettiğiniz tarih aralığını paylaşın; randevu uygunluğunu takip edip uygun seçenekleri size iletelim.
          </p>
          <div className="mt-6 rounded-card bg-white p-5 shadow-card">
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" /> Hemen görüşmek ister misiniz?
            </p>
            <PhoneLink location="appointment_sidebar" className="mt-1 font-heading text-h4 text-navy" showIcon={false} />
          </div>
          <div className="mt-6 rounded-card border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-heading text-h4">
              <CalendarClock className="h-5 w-5 text-gold" aria-hidden="true" /> Randevu Süreci
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Randevu uygunluğu resmi başvuru merkezine bağlıdır. Süreci nasıl yürüttüğümüzü{' '}
              <Link href="/vize-sureci" className="text-navy underline">
                Vize Süreci
              </Link>{' '}
              sayfasından inceleyebilirsiniz.
            </p>
          </div>
          <LegalDisclaimer className="mt-6" />
        </div>
        <AppointmentForm countryOptions={countryOptions} />
      </div>
    </>
  );
}
