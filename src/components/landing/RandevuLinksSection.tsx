import { ArrowUpRight, CalendarClock } from 'lucide-react';
import Link from 'next/link';

import { Section, SectionHeading } from '@/components/ui/Section';
import {
  RANDEVU_BASE_PATH,
  getRandevuPagesByProvider,
  type RandevuLandingPage,
} from '@/data/randevuLandingPages';
import { cn } from '@/lib/utils';

/** Short label for a page inside its provider group (city, country, or "Genel"). */
function pageLabel(page: RandevuLandingPage): string {
  return page.city || page.country || 'Genel Randevu Desteği';
}

/**
 * Provider-categorized directory of the appointment-consultancy landing pages
 * (AS Visa / BLS / iDATA / Kosmos). Rendered on the Services page and reusable
 * elsewhere so every landing page gets a crawlable internal link instead of
 * being an ads-only orphan. Server component — pure links, no client JS.
 */
export function RandevuLinksSection({
  bg = 'surface',
  showHeading = true,
}: {
  bg?: 'page' | 'white' | 'surface' | 'gold-surface';
  showHeading?: boolean;
}) {
  const groups = getRandevuPagesByProvider();

  return (
    <Section bg={bg} ariaLabel="Vize randevu süreci danışmanlığı sayfaları">
      {showHeading && (
        <SectionHeading
          eyebrow="Randevu Süreci Danışmanlığı"
          title="Başvuru Merkezine Göre Randevu Süreci Desteği"
          description="AS Visa, BLS, iDATA ve Kosmos başvuru merkezleri üzerinden randevu arayanlara yönelik bağımsız danışmanlık sayfalarımız. VİS Vize özel ve bağımsız bir danışmanlık firmasıdır; resmi bir başvuru merkezi değildir."
        />
      )}

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <div key={group.provider}>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-surface text-gold">
                <CalendarClock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-h4 text-navy">{group.provider} Randevu Süreci</h3>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`${RANDEVU_BASE_PATH}/${page.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm transition-colors hover:border-gold"
                  >
                    <span className="font-medium text-ink">{pageLabel(page)}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={cn('mt-8')}>
        <Link
          href={RANDEVU_BASE_PATH}
          className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-navy hover:text-gold"
        >
          Tüm randevu süreci danışmanlığı sayfalarını görün
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
