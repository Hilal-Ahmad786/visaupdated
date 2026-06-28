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
  const src = variant === 'light' ? '/logo-dark.png' : '/logo.png';
  return (
    <Link href="/" aria-label={`${brand.full} ana sayfa`} className={cn('inline-flex items-center', className)}>
      <Image
        src={src}
        alt={brand.full}
        width={176}
        height={44}
        priority={priority}
        className="h-10 w-auto lg:h-11"
      />
    </Link>
  );
}
