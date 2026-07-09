import { ArrowRight, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ComplianceBar } from '@/components/compliance/ComplianceBar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui/Section';
import {
  RANDEVU_BASE_PATH,
  RANDEVU_DISCLAIMER,
  getRandevuPagesByProvider,
} from '@/data/randevuLandingPages';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Vize Randevu Süreci Danışmanlığı',
    description:
      'AS Visa, BLS, iDATA ve Kosmos randevu süreçleri için bağımsız danışmanlık, evrak kontrolü ve form desteği. VİS Vize resmi bir başvuru merkezi değildir.',
    path: RANDEVU_BASE_PATH,
  });
}

export default function RandevuIndexPage() {
  const groups = getRandevuPagesByProvider();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Vize Randevu Süreci Danışmanlığı', href: RANDEVU_BASE_PATH }]} />

      <section className="bg-navy text-white" aria-label="Vize Randevu Süreci Danışmanlığı">
        <div className="container-content py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              Bağımsız Vize Randevu Süreci Danışmanlığı
            </p>
            <h1 className="text-h1 text-white text-balance">Vize Randevu Süreci Danışmanlığı</h1>
            <p className="mt-4 text-body-lg text-white/85">
              AS Visa, BLS, iDATA ve Kosmos başvuru merkezleri üzerinden randevu arayan başvuru
              sahiplerine; randevu süreci hakkında bilgilendirme, evrak ve form kontrolü ile başvuru
              öncesi dosya hazırlığı konularında bağımsız danışmanlık desteği sunuyoruz.
            </p>
          </div>

          <div
            className="mt-8 flex max-w-3xl gap-3 rounded-card border border-gold/40 bg-white/95 p-4 text-sm text-ink shadow-card"
            role="note"
          >
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="leading-relaxed">{RANDEVU_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      <ComplianceBar />

      {groups.map((group) => (
        <Section key={group.provider} bg="white" ariaLabel={`${group.provider} randevu sayfaları`}>
          <SectionHeading
            eyebrow="Randevu Süreci Desteği"
            title={`${group.provider} Randevu Süreci Sayfaları`}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.pages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`${RANDEVU_BASE_PATH}/${page.slug}`}
                  className="card group flex h-full items-start justify-between gap-3 p-5 transition-colors hover:border-gold"
                >
                  <span className="font-heading font-semibold text-navy">{page.h1}</span>
                  <ArrowRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
