import type { ReactNode } from 'react';

import { EmptyState } from '@/components/ui/states';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

/**
 * Responsive data table: a real <table> on desktop, stacked cards on mobile
 * (via `mobileCard`, falling back to label/value rows). Presentational and
 * server-renderable; wrap in a client component for selection/sorting.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  mobileCard,
  emptyTitle = 'Kayıt bulunamadı',
  emptyDescription,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  mobileCard?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-card border border-line-light bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line-light">
              {columns.map((c) => (
                <th key={c.key} scope="col" className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-admin">
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3 align-middle text-ink', c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={getRowKey(row)} className="rounded-card border border-line-light bg-white p-4 shadow-card">
            {mobileCard ? (
              mobileCard(row)
            ) : (
              <dl className="space-y-1.5">
                {columns.filter((c) => !c.hideOnMobile).map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{c.header}</dt>
                    <dd className="text-right text-ink">{c.render(row)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
