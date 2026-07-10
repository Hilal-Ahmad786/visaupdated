import Image from 'next/image';
import Link from 'next/link';

import { brand } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Brand logo. Uses the official VİS VİZE wordmark assets:
 * - `variant="dark"` (default, for LIGHT backgrounds e.g. header) → navy/gold logo
 * - `variant="light"` (for DARK backgrounds e.g. footer) → white/gold logo
 */
export function Logo({
  variant = 'dark',
  className,
  priority = false,
}: {
  variant?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
}) {
  // logo.png is 720×180 (4:1); logo-dark.png is 720×240 (3:1). Use the real
  // aspect ratio per variant so the wordmark is never stretched.
  const src = variant === 'light' ? '/logo-dark.png' : '/logo.png';
  const height = variant === 'light' ? 240 : 180;
  return (
    <Link href="/" aria-label={`${brand.full} ana sayfa`} className={cn('inline-flex items-center', className)}>
      <Image
        src={src}
        alt={brand.full}
        width={720}
        height={height}
        priority={priority}
        className="h-[52px] w-auto lg:h-14"
      />
    </Link>
  );
}
