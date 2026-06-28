import Link from 'next/link';

import { cn } from '@/lib/utils';

/** SEO-friendly link-based pagination (real hrefs, not JS-only). */
export function Pagination({
  current,
  total,
  hrefFor,
}: {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav aria-label="Sayfalama" className="flex items-center justify-center gap-1.5">
      {current > 1 && (
        <Link href={hrefFor(current - 1)} className="pill" rel="prev">
          Önceki
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === current ? 'page' : undefined}
          className={cn('pill min-w-[44px] justify-center', p === current && 'pill-active')}
        >
          {p}
        </Link>
      ))}
      {current < total && (
        <Link href={hrefFor(current + 1)} className="pill" rel="next">
          Sonraki
        </Link>
      )}
    </nav>
  );
}
