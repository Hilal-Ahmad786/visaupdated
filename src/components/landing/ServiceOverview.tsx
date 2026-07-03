import { Check, Info } from 'lucide-react';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { Section, SectionHeading } from '@/components/ui/Section';
import type { LandingPageConfig } from '@/data/landing/types';

/**
 * Country + visa-type introduction and the list of consultancy services
 * included. Also surfaces the cautious, country-specific notes so pages never
 * read as an identical template with the country name swapped.
 */
export function ServiceOverview({ config }: { config: LandingPageConfig }) {
  return (
    <Section bg="page" ariaLabel={config.sectionHeadings.introduction}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={config.visaType} title={config.sectionHeadings.introduction} />
          <div className="mt-5 space-y-4 text-body-lg leading-relaxed text-ink-soft">
            {config.introduction.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {config.countrySpecificNotes.length > 0 && (
            <div className="mt-6 space-y-3 rounded-card border border-line bg-white p-5 shadow-card">
              <p className="font-heading font-semibold text-navy">{config.country} İçin Notlar</p>
              <ul className="space-y-2.5">
                {config.countrySpecificNotes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:pt-2">
          <div className="rounded-card border border-line bg-white p-6 shadow-card">
            <h3 className="font-heading text-h4 text-navy">{config.sectionHeadings.services}</h3>
            <p className="mt-2 text-sm text-ink-soft">{config.serviceDescription}</p>
            <ul className="mt-4 space-y-3">
              {config.servicesIncluded.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-card bg-navy p-6 text-white shadow-card">
            <p className="font-heading text-h4 text-white">Sorularınız mı var?</p>
            <p className="mt-1 text-sm text-gold-soft">
              Danışmanlarımız başvuru türünüzü değerlendirip sizi yönlendirsin.
            </p>
            <PhoneLink
              location="overview_call"
              className="btn-primary mt-4 w-full"
              label="Hemen Ara"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
