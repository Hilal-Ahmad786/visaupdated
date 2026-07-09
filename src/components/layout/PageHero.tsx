import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { HeroShell } from './HeroShell';

/**
 * The site-wide standard hero. Renders the shared `HeroShell` (navy gradient +
 * glows + ComplianceBar) with the homepage's copy layout: gold eyebrow, white
 * H1 + description, optional check-marked highlights, CTA row, and an optional
 * right-column `aside` (a lead form on conversion pages).
 *
 * Layout adapts automatically:
 *  - With `aside` → two-column band (copy left, aside right), like the homepage.
 *  - Without `aside` → single left/centered column, for content & legal pages.
 *
 * Renders the page's single <h1>; callers must not render another.
 */
export function PageHero({
  eyebrow,
  title,
  titleAccent,
  description,
  highlights,
  actions,
  aside,
  align = 'left',
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Optional trailing fragment of the H1 rendered in champagne gold. */
  titleAccent?: string;
  description?: string;
  /** Small check-marked feature list under the description. */
  highlights?: string[];
  /** CTA buttons/links row. */
  actions?: ReactNode;
  /** Right-column content (a form card on conversion pages). Enables 2-col. */
  aside?: ReactNode;
  /** Alignment when there is no `aside`. */
  align?: 'left' | 'center';
  /** Extra content rendered under the actions (rare). */
  children?: ReactNode;
}) {
  const hasAside = Boolean(aside);
  const centered = !hasAside && align === 'center';

  return (
    <HeroShell
      ariaLabel={title}
      innerClassName={cn(
        hasAside ? 'grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14' : 'flex flex-col',
        centered && 'items-center text-center',
      )}
    >
      <div className={cn(!hasAside && 'max-w-3xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
            {eyebrow}
          </p>
        )}

        <h1 className="text-h1 text-balance text-white">
          {title}
          {titleAccent && <span className="text-gold-soft"> {titleAccent}</span>}
        </h1>

        {description && (
          <p
            className={cn(
              'mt-5 text-body-lg text-white/80',
              !centered && 'max-w-xl',
              centered && 'mx-auto max-w-2xl',
            )}
          >
            {description}
          </p>
        )}

        {highlights && highlights.length > 0 && (
          <ul className={cn('mt-6 flex flex-wrap gap-x-6 gap-y-3', centered && 'justify-center')}>
            {highlights.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-white/90">
                <CheckCircle2 className="h-[18px] w-[18px] text-gold-soft" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        )}

        {actions && (
          <div className={cn('mt-8 flex flex-col gap-3 sm:flex-row', centered && 'justify-center')}>
            {actions}
          </div>
        )}

        {children}
      </div>

      {hasAside && <div className="relative">{aside}</div>}
    </HeroShell>
  );
}
