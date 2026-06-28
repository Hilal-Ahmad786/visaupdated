import Link from 'next/link';

import { contactSettings } from '@/config/site';
import { PhoneLink } from './PhoneLink';

/**
 * High-contrast click-to-call section for the bottom of landing pages.
 * Navy band with the phone number prominent + form alternative.
 */
export function ClickToCallBanner({
  location,
  title = 'Vize Sürecinizle İlgili Hemen Bilgi Alın',
  subtitle = 'Uzman danışmanlarımız başvuru türünüzü değerlendirerek size uygun süreci açıklasın.',
}: {
  location: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy text-white" aria-label="Hemen ara">
      <div className="container-content py-14 text-center md:py-20">
        <h2 className="text-h2 text-white">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-body-lg text-gold-soft">{subtitle}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PhoneLink
            location={location}
            className="btn-primary text-lg"
            label={`Tıkla ve Ara: ${contactSettings.phoneDisplay}`}
          />
          <Link href="/online-on-basvuru" className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">
            Ön Başvuru Formunu Doldur
          </Link>
        </div>
      </div>
    </section>
  );
}
