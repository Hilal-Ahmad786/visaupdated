import { Section, SectionHeading } from '@/components/ui/Section';
import type { WhyChooseItem } from '@/data/landing/types';

import { LandingIcon } from './LandingIcon';

/** "Neden VİS VİZE?" trust section — company-level assurances (not country). */
export function TrustSection({ heading, items }: { heading: string; items: WhyChooseItem[] }) {
  return (
    <Section bg="white" ariaLabel={heading}>
      <SectionHeading
        eyebrow="Güven ve Şeffaflık"
        title={heading}
        description="Vize sürecinizi doğru, şeffaf ve gerçekçi beklentilerle yürütmeniz için yanınızdayız."
        align="center"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col rounded-card border border-line bg-page p-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy/5 text-navy">
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
