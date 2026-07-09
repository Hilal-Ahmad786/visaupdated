import type { ReactNode } from 'react';

import { ComplianceBar } from '@/components/compliance/ComplianceBar';
import { cn } from '@/lib/utils';

/**
 * The single source of truth for the site-wide hero band: the navy gradient,
 * the two decorative glows, the content container, and the persistent
 * `ComplianceBar` rendered directly underneath. Every hero on the site — the
 * homepage, the standard `PageHero`, and the bespoke form heroes
 * (Country/Service/Landing/Randevu) — wraps its content in this so the shell
 * and the compliance bar are guaranteed identical everywhere.
 *
 * `innerClassName` controls the inner content layout (e.g. the two-column grid).
 * Set `complianceBar={false}` only when the caller renders the bar itself.
 */
export function HeroShell({
  children,
  innerClassName,
  ariaLabel,
  complianceBar = true,
}: {
  children: ReactNode;
  innerClassName?: string;
  ariaLabel?: string;
  complianceBar?: boolean;
}) {
  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-deep text-white"
        aria-label={ariaLabel}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-[24rem] w-[24rem] rounded-full bg-gold/5 blur-3xl"
        />
        <div className={cn('container-content relative py-12 lg:py-16', innerClassName)}>
          {children}
        </div>
      </section>
      {complianceBar && <ComplianceBar />}
    </>
  );
}
