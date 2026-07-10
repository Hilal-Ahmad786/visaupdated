'use client';

import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

import { RANGE_LABELS, RANGE_PRESETS, type RangeKey } from '@/lib/admin/date-range';
import { cn } from '@/lib/utils';

/**
 * Presentational date-range control: preset chips (Bugün / Dün / Son 7 Gün /
 * Bu Ay / Tümü) plus an "Özel" toggle that reveals a from–to custom picker.
 * Controlled — the parent owns the value and decides how to persist it (URL on
 * the dashboard, local state in the leads explorer).
 */
export function DateRangeChips({
  value,
  from,
  to,
  onChange,
  className,
}: {
  value: RangeKey;
  from?: string;
  to?: string;
  onChange: (key: RangeKey, from?: string, to?: string) => void;
  className?: string;
}) {
  const [showCustom, setShowCustom] = useState(value === 'custom');

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line-light bg-white p-1">
        {RANGE_PRESETS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setShowCustom(false);
              onChange(k);
            }}
            aria-pressed={value === k}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              value === k ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface',
            )}
          >
            {RANGE_LABELS[k]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom((s) => !s)}
          aria-pressed={value === 'custom'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === 'custom' ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface',
          )}
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Özel
        </button>
      </div>

      {showCustom && (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={from ?? ''}
            max={to || undefined}
            onChange={(e) => onChange('custom', e.target.value || undefined, to)}
            aria-label="Başlangıç tarihi"
            className="h-9 rounded-lg border border-line bg-white px-2 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
          <span className="text-ink-muted">–</span>
          <input
            type="date"
            value={to ?? ''}
            min={from || undefined}
            onChange={(e) => onChange('custom', from, e.target.value || undefined)}
            aria-label="Bitiş tarihi"
            className="h-9 rounded-lg border border-line bg-white px-2 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
      )}
    </div>
  );
}
