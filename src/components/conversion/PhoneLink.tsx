'use client';

import { Phone } from 'lucide-react';

import { contactSettings } from '@/config/site';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Click-to-call link. All phone CTAs go through this component so the number is
 * centralized (config/site) and every click emits a single `phone_click` event.
 */
export function PhoneLink({
  location,
  className,
  showIcon = true,
  label,
}: {
  location: string;
  className?: string;
  showIcon?: boolean;
  label?: string;
}) {
  return (
    <a
      href={contactSettings.phoneHref}
      onClick={() => {
        trackEvent({ name: 'phone_click', category: 'conversion', metadata: { CTA_location: location } });
        trackCallConversion(); // calls are a primary Google Ads conversion
      }}
      className={cn('inline-flex min-h-[44px] items-center justify-center gap-2', className)}
      data-cta="phone"
      aria-label={label === '' ? `Telefon: ${contactSettings.phoneDisplay}` : undefined}
    >
      {showIcon && <Phone className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />}
      {label !== '' && <span>{label ?? contactSettings.phoneDisplay}</span>}
    </a>
  );
}
