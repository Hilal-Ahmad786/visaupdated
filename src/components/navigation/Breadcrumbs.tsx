import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: 'Ana Sayfa', href: '/' }, ...items];
  return (
    <nav aria-label="Sayfa konumu" className="container-content pt-5">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        {full.map((item, i) => {
          const last = i === full.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />}
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-navy">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(full.map((c) => ({ name: c.name, path: c.href })))} />
    </nav>
  );
}
