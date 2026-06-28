import { AlertTriangle, CalendarClock, Phone } from 'lucide-react';
import Link from 'next/link';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SectionHeading } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Randevu Talebi',
  description:
    'Vize randevu sürecinizi sizin adımıza takip edelim. Ülke, vize türü ve tercih ettiğiniz tarih aralığını paylaşın; uygun seçenekleri size iletelim.',
  path: '/randevu-talebi',
});

const FAQ_CATEGORIES = ['randevu', 'genel'];

export default async function AppointmentPage() {
  const repo = getContentRepository();
  const [countries, faqs] = await Promise.all([repo.getCountries(), repo.getFaqs()]);
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const popular = countries.filter((c) => c.popular).slice(0, 6);
  const pageFaqs = faqs.filter((f) => FAQ_CATEGORIES.includes(f.category)).slice(0, 5);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Randevu Talebi', href: '/randevu-talebi' }]} />
      <div className="container-content grid items-start gap-10 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:py-14">
        <div className="order-2 lg:order-1">
          <p className="font-heading text-label uppercase tracking-[0.14em] text-gold">Vize Randevu Desteği</p>
          <h1 className="mt-2 text-h1">Vize Randevu Talebinizi Oluşturun</h1>
          <p className="mt-3 text-body-lg text-ink-soft">
            Tercih ettiğiniz tarih aralığını paylaşın; randevu uygunluğunu takip edip uygun seçenekleri size iletelim.
          </p>

          {/* Official-availability disclaimer (required) */}
          <div className="mt-6 flex gap-3 rounded-card border-l-4 border-gold bg-gold-surface p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="leading-relaxed text-ink-soft">
              <span className="font-heading font-semibold text-ink">Önemli Bilgilendirme:</span> Bu form resmi bir
              konsolosluk veya başvuru merkezi randevusu oluşturmaz. Randevu uygunluğu ilgili resmi başvuru merkezine
              bağlıdır; talebinizi takip edip uygun seçenekleri sizinle paylaşırız.
            </p>
          </div>

          <div className="mt-6 rounded-card bg-navy p-5 text-white shadow-card">
            <p className="flex items-center gap-2 text-sm text-gold-soft">
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" /> Müşteri temsilcisine bağlanın
            </p>
            <PhoneLink location="appointment_sidebar" className="mt-1 font-heading text-h4 text-white" showIcon={false} />
          </div>

          <div className="mt-6 rounded-card border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-heading text-h4">
              <CalendarClock className="h-5 w-5 text-gold" aria-hidden="true" /> Randevu Süreci
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Süreci nasıl yürüttüğümüzü{' '}
              <Link href="/vize-sureci" className="text-navy underline">
                Vize Süreci
              </Link>{' '}
              sayfasından inceleyebilirsiniz.
            </p>
          </div>

          <LegalDisclaimer className="mt-6" />
        </div>

        <div className="order-1 lg:order-2">
          <AppointmentForm countryOptions={countryOptions} />
        </div>
      </div>

      {/* Popular countries */}
      {popular.length > 0 && (
        <section className="bg-surface py-14 md:py-20" aria-label="Sık başvuru yapılan ülkeler">
          <div className="container-content">
            <SectionHeading eyebrow="Ülkeler" title="Sık Başvuru Yapılan Ülkeler" />
            <ul className="mt-6 flex flex-wrap gap-3">
              {popular.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/vize-ulkeleri/${c.slug}`}
                    className="card inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      {pageFaqs.length > 0 && (
        <section className="bg-page py-14 md:py-20" aria-label="Sıkça sorulan sorular">
          <div className="container-content">
            <SectionHeading
              eyebrow="Sıkça Sorulan Sorular"
              title="Vize Randevuları Hakkında Merak Edilenler"
              align="center"
            />
            <div className="mx-auto mt-8 max-w-3xl">
              <FAQAccordion items={pageFaqs} trackContext="appointment" />
            </div>
          </div>
        </section>
      )}

      <ClickToCallBanner
        location="appointment_bottom"
        title="Vize Randevu Sürecinizle İlgili Hemen Bilgi Alın"
      />
    </>
  );
}
