import { Info } from 'lucide-react';

import { LEGAL_DISCLAIMER } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Consistent legal disclaimer reused across the site. `footer` is muted inline
 * text; `card` is a bordered notice used on landing/country/service pages.
 */
export function LegalDisclaimer({
  variant = 'card',
  text = LEGAL_DISCLAIMER,
  className,
}: {
  variant?: 'card' | 'footer';
  text?: string;
  className?: string;
}) {
  if (variant === 'footer') {
    return <p className={cn('text-xs leading-relaxed text-white/55', className)}>{text}</p>;
  }
  return (
    <div
      className={cn('flex gap-3 rounded-card border border-line bg-surface p-4 text-sm text-ink-soft', className)}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
