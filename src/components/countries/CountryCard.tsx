import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { codeToFlag } from '@/lib/utils';
import type { Country } from '@/types/content';

export function CountryCard({ country }: { country: Country }) {
  return (
    <article className="card flex flex-col p-5 transition-shadow hover:shadow-form">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {codeToFlag(country.code)}
        </span>
        <div>
          <h3 className="font-heading text-h4">{country.name}</h3>
          <p className="text-sm text-ink-soft">{country.region}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {country.visaTypes.slice(0, 3).map((vt) => (
          <span key={vt.slug} className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-soft">
            {vt.name}
          </span>
        ))}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{country.heroDescription}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
        <Link href={`/vize-ulkeleri/${country.slug}`} className="btn-outline flex-1 text-sm">
          Detayları Gör
        </Link>
        <Link
          href={`/online-on-basvuru?country=${country.slug}`}
          className="btn-primary flex-1 text-sm"
        >
          Ön Başvuru
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
