'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { RangeKey } from '@/lib/admin/date-range';

import { DateRangeChips } from './DateRangeChips';

/**
 * URL-synced date-range control for server components (the dashboard). Writes
 * `range` (+ `from`/`to` for custom) into the query string; the server page
 * reads them from `searchParams` and filters accordingly. Uses `replace` so the
 * filter doesn't stack browser history.
 */
export function UrlDateRange({ defaultRange = '7d' }: { defaultRange?: RangeKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const value = (params.get('range') as RangeKey) || defaultRange;
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;

  const onChange = (key: RangeKey, f?: string, t?: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set('range', key);
    if (key === 'custom') {
      if (f) sp.set('from', f);
      else sp.delete('from');
      if (t) sp.set('to', t);
      else sp.delete('to');
    } else {
      sp.delete('from');
      sp.delete('to');
    }
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  return <DateRangeChips value={value} from={from} to={to} onChange={onChange} />;
}
