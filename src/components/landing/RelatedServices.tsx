import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Section, SectionHeading } from '@/components/ui/Section';
import type { RelatedPageLink } from '@/data/landing/types';

/** Internal links to related visa services (mostly same-country siblings). */
export function RelatedServices({ heading, links }: { heading: string; links: RelatedPageLink[] }) {
  if (links.length === 0) return null;
  return (
    <Section bg="white" ariaLabel={heading}>
      <SectionHeading title={heading} align="center" />
      <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.slug}>
            <Link
              href={`/${link.slug}`}
              className="group flex items-center justify-between gap-3 rounded-card border border-line bg-page px-5 py-4 font-heading font-semibold text-navy transition-colors hover:border-gold hover:bg-gold-surface"
            >
              {link.label}
              <ArrowRight
                className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
