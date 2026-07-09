import { CalendarDays, CheckCircle2, FileText, Home, Info, MapPin, Plane, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ThankYouConversion } from '@/components/conversion/ThankYouConversion';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { whatsappLink } from '@/config/site';
import { verifySubmission } from '@/lib/leads';

// Thank-you pages must never be indexed.
export const metadata: Metadata = {
  title: 'Teşekkürler',
  robots: { index: false, follow: false },
};

const COPY: Record<string, { title: string; body: string }> = {
  pre_application: {
    title: 'Ön Başvurunuz Alındı',
    body: 'Başvuru türünüzü değerlendirip en kısa sürede sizinle iletişime geçeceğiz.',
  },
  appointment: {
    title: 'Randevu Talebiniz Alındı',
    body: 'Talebinizi değerlendirip uygun seçenekleri sizinle paylaşacağız. Bu talep resmi bir konsolosluk randevusu oluşturmaz.',
  },
  contact: {
    title: 'Mesajınız Alındı',
    body: 'En kısa sürede size dönüş yapacağız.',
  },
  default: {
    title: 'Başvurunuz Alındı',
    body: 'Talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.',
  },
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { ref?: string; t?: string; type?: string };
}) {
  const verified = verifySubmission(searchParams.t);
  const isDuplicate = searchParams.ref === 'DUP';

  // Unverified direct access — do NOT show success, do NOT fire conversion.
  if (!verified && !isDuplicate) {
    return (
      <div className="container-content flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-muted">
          <Info className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-h2">Görüntülenecek bir başvuru bulunamadı</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          Bu sayfa yalnızca tamamlanan bir başvurudan sonra görüntülenir. Başvuru yapmak için aşağıdaki adımları kullanabilirsiniz.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/online-on-basvuru" className="btn-primary">
            <FileText className="h-5 w-5" aria-hidden="true" /> Ön Başvuru Yap
          </Link>
          <PhoneLink location="thankyou_unverified" className="btn-outline" />
        </div>
      </div>
    );
  }

  const type = verified?.leadType ?? searchParams.type ?? 'default';
  const copy = COPY[type] ?? COPY.default!;
  const reference = verified?.reference;

  return (
    <div className="container-content flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {/* Fires conversion only for a verified (non-duplicate) submission. */}
      {verified && !isDuplicate && reference && (
        <ThankYouConversion reference={reference} leadType={type} />
      )}

      <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-11 w-11" aria-hidden="true" />
      </div>

      {isDuplicate ? (
        <>
          <h1 className="text-h2">Talebiniz Zaten Alınmıştı</h1>
          <p className="mt-3 max-w-md text-ink-soft">
            Kısa süre önce sizden bir talep aldık. Ekibimiz en kısa sürede sizinle iletişime geçecek.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-h2">{copy.title}</h1>
          <p className="mt-3 max-w-md text-ink-soft">{copy.body}</p>
          {reference && (
            <p className="mt-4 rounded-input bg-surface px-4 py-2 font-heading text-sm">
              Başvuru Referans No: <span className="font-bold text-navy">{reference}</span>
            </p>
          )}
        </>
      )}

      <div className="mt-6 rounded-card border border-line bg-white p-5 text-left text-sm shadow-card">
        <p className="font-heading font-semibold text-navy">Sırada ne var?</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-ink-soft">
          <li>Ekibimiz başvurunuzu inceler.</li>
          <li>Başvuru türünüze uygun yol haritasını hazırlar.</li>
          <li>Genellikle 1 iş günü içinde sizinle iletişime geçer.</li>
        </ol>
      </div>

      {/* Pre-call preparation checklist */}
      <div className="mt-6 w-full max-w-md rounded-card border border-line bg-gold-surface p-5 text-left">
        <p className="font-heading font-semibold text-navy">Görüşme Öncesi Hazırlık</p>
        <p className="mt-1 text-sm text-ink-soft">
          Danışmanımız sizi aradığında süreci hızlandırmak için şu bilgileri hazır bulundurun:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" /> Gidilecek ülke ve şehir bilgisi
          </li>
          <li className="flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" /> Tahmini seyahat başlangıç tarihi
          </li>
          <li className="flex items-center gap-2.5">
            <Plane className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" /> Seyahat amacı (turistik, ticari, aile ziyareti)
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" /> Pasaportunuzun son kullanma tarihi
          </li>
        </ul>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp ile İletişime Geç
        </a>
        <PhoneLink location="thankyou" className="btn-outline" label="Hemen Bizi Arayın" />
        <Link href="/" className="btn-outline">
          <Home className="h-5 w-5" aria-hidden="true" /> Ana Sayfa
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        <Link href="/vize-sureci" className="text-navy hover:text-gold">Vize Süreci Rehberi</Link>
        <Link href="/sss" className="text-navy hover:text-gold">Sıkça Sorulan Sorular</Link>
        <Link href="/blog" className="text-navy hover:text-gold">Vize Rehberleri</Link>
      </div>
    </div>
  );
}
