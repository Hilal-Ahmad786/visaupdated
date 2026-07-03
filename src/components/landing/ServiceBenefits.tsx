import { Section, SectionHeading } from '@/components/ui/Section';
import type { BenefitItem } from '@/data/landing/types';

import { LandingIcon } from './LandingIcon';

/** Four-up benefit cards summarising why the visitor should proceed. */
export function ServiceBenefits({ heading, items }: { heading: string; items: BenefitItem[] }) {
  return (
    <Section bg="white" ariaLabel={heading}>
      <SectionHeading title={heading} align="center" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="card flex flex-col p-6">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-surface text-gold">
              <LandingIcon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-heading text-h4 text-navy">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
