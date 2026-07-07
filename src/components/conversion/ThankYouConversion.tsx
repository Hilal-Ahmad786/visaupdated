'use client';

import { useEffect, useRef } from 'react';

import { trackEvent } from '@/lib/analytics';

/**
 * Thank-you page marker.
 *
 * The Google Ads / GA4 lead conversion is NO LONGER fired here — it now fires
 * exactly once from `useLeadSubmit` as the `vis_lead_submit` dataLayer event on
 * confirmed API success (so it carries form data + user_data for Enhanced
 * Conversions, and a refresh of this page can't re-fire it). This only records
 * a first-party `thank_you_view` for internal analytics.
 */
export function ThankYouConversion({ reference, leadType }: { reference: string; leadType: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent({
      name: 'thank_you_view',
      category: 'conversion',
      metadata: { lead_type: leadType, ref_present: Boolean(reference) },
    });
  }, [reference, leadType]);
  return null;
}
