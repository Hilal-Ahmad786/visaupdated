import { cn } from '@/lib/utils';

/**
 * High-quality SVG country flag (via `flag-icons`, self-hosted — no network).
 * `code` is an ISO 3166-1 alpha-2 code (e.g. "DE"); "EU" renders the EU flag
 * (used for the Schengen landing). Sized with `size` (px) so callers don't fight
 * the library's em-based width; rounded with a subtle border for a premium look.
 */
export function Flag({
  code,
  size = 22,
  square = false,
  className,
}: {
  code: string;
  size?: number;
  square?: boolean;
  className?: string;
}) {
  const c = (code ?? '').toLowerCase();
  const valid = /^[a-z]{2}$/.test(c);

  if (!valid) {
    // Unknown/placeholder code → neutral chip, never a broken glyph.
    return (
      <span
        aria-hidden="true"
        className={cn('inline-block rounded-[3px] bg-line', className)}
        style={{ width: size * (square ? 1 : 1.333), height: size }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={`${code.toUpperCase()} bayrağı`}
      className={cn('fi', `fi-${c}`, square && 'fis', 'inline-block rounded-[3px] align-middle ring-1 ring-black/5 shadow-sm', className)}
      style={{ fontSize: `${size}px` }}
    />
  );
}
