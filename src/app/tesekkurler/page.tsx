import { CheckCircle2, FileText, Home, Info } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ThankYouConversion } from '@/components/conversion/ThankYouConversion';
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

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <PhoneLink location="thankyou" className="btn-primary" label="Hemen Bizi Arayın" />
        <Link href="/" className="btn-outline">
          <Home className="h-5 w-5" aria-hidden="true" /> Ana Sayfaya Dön
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
