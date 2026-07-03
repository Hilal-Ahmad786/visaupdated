'use client';

import { useEffect } from 'react';

import { captureCampaignParams } from '@/lib/attribution';
import { trackEvent } from '@/lib/analytics';

/**
 * Captures Google Ads / UTM parameters into session storage on first paint (so
 * they survive later navigation) and fires a single `landing_page_view` event
 * with non-PII campaign context. Renders nothing.
 */
export function LandingTracker({
  context,
}: {
  context: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    captureCampaignParams();
    trackEvent({ name: 'landing_page_view', category: 'conversion', metadata: context });
    // Fire once per mount; context is stable per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
