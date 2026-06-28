'use client';

import { cn } from '@/lib/utils';

export interface PillOption {
  value: string;
  label: string;
}

/**
 * Horizontal-scroll filter chips. Accessible radio-like group; on mobile the row
 * scrolls horizontally (no-scrollbar) rather than wrapping awkwardly.
 */
export function FilterPills({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn('pill shrink-0', active && 'pill-active')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
