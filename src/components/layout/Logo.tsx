import Link from 'next/link';

import { brand } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Brand logo. NOTE: no logo image file was present in the source repository, so
 * this is a styled SVG wordmark placeholder that follows the brand direction
 * (navy + gold, globe + aircraft + "V" motif). Replace with the official logo
 * asset when supplied — see docs/CONTENT_PLACEHOLDERS.md. Drop the file in
 * /public and swap this mark for a next/image.
 */
export function Logo({
  variant = 'dark',
  className,
}: {
  variant?: 'dark' | 'light';
  className?: string;
}) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy';
  const subColor = variant === 'light' ? 'text-gold-soft' : 'text-ink-soft';
  return (
    <Link
      href="/"
      aria-label={`${brand.full} ana sayfa`}
      className={cn('inline-flex items-center gap-2.5', className)}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#B88522" strokeWidth="1.5" />
          <path d="M3 16h26M16 3c4 4 4 22 0 26M16 3c-4 4-4 22 0 26" fill="none" stroke="#B88522" strokeWidth="1.2" opacity="0.7" />
          <path d="M9 19l14-7-5 9-3-3-6 1z" fill="#FFFFFF" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-heading text-lg font-extrabold tracking-tight', textColor)}>
          VİS VİZE
        </span>
        <span className={cn('font-heading text-[10px] font-semibold uppercase tracking-[0.18em]', subColor)}>
          Randevu Hizmetleri
        </span>
      </span>
    </Link>
  );
}
