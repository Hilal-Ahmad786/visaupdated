import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Section({
  children,
  className,
  bg = 'page',
  width = 'content',
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  bg?: 'page' | 'white' | 'surface' | 'navy' | 'gold-surface';
  width?: 'content' | 'wide';
  id?: string;
  ariaLabel?: string;
}) {
  const bgClass = {
    page: 'bg-page',
    white: 'bg-white',
    surface: 'bg-surface',
    navy: 'bg-navy text-white',
    'gold-surface': 'bg-gold-surface',
  }[bg];
  return (
    <section id={id} aria-label={ariaLabel} className={cn(bgClass, 'py-14 md:py-20', className)}>
      <div className={width === 'wide' ? 'container-wide' : 'container-content'}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: As = 'h2',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-2 font-heading text-label uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
      )}
      <As className={cn(As === 'h1' ? 'text-h1' : 'text-h2', 'text-balance')}>{title}</As>
      {description && <p className="mt-3 text-body-lg text-ink-soft">{description}</p>}
    </div>
  );
}
