import { Check } from 'lucide-react';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import type { CountryOption } from '@/config/form-options';
import type { LandingPageConfig } from '@/data/landing/types';
import type { LeadAttribution } from '@/types/lead';

import { LandingLeadForm, type LandingFormTracking } from './LandingLeadForm';

/**
 * Conversion hero. Desktop: two columns — messaging left, the lead-form card
 * right (the dominant element). Mobile: H1 + concise intro first, then the form
 * immediately underneath, then trust signals + disclaimer. No decorative image
 * precedes the form.
 */
export function LandingHero({
  config,
  countryOptions,
  attribution,
  tracking,
}: {
  config: LandingPageConfig;
  countryOptions: CountryOption[];
  attribution: LeadAttribution;
  tracking: LandingFormTracking;
}) {
  return (
    <section className="bg-gradient-to-b from-navy to-navy-deep text-white">
      <div className="container-content grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:py-16">
        {/* Headline */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <p className="font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
            {config.heroEyebrow}
          </p>
          <h1 className="mt-3 text-h1 text-white">{config.h1}</h1>
          <p className="mt-4 max-w-xl text-body-lg text-white/85">{config.heroDescription}</p>
        </div>

        {/* Lead form — dominant element, spans both rows on desktop */}
        <div
          id="lead-form"
          className="order-2 scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <LandingLeadForm
            countryOptions={countryOptions}
            presetCountry={config.countrySlug}
            presetVisaPurpose={config.presetVisaPurpose}
            title={config.formTitle}
            description={config.formDescription}
            submitLabel={config.primaryCTA}
            attribution={attribution}
            tracking={tracking}
          />
        </div>

        {/* Trust signals + disclaimer (under the headline on desktop) */}
        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {config.trustPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-white/90">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-soft">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PhoneLink location="landing_hero" className="btn-primary" label="Hemen Ara" />
            <span className="text-sm text-white/70">
              Formu doldurmak istemiyorsanız telefonla başlayalım.
            </span>
          </div>
          {/* Disclaimer moved out of the hero into the ComplianceBar rendered
              directly under the hero (see VisaLandingPage). */}
        </div>
      </div>
    </section>
  );
}
