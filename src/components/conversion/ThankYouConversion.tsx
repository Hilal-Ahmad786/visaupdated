'use client';

import { useEffect, useRef } from 'react';

import { trackEvent, trackLeadConversion } from '@/lib/analytics';

/**
 * Fires the lead conversion EXACTLY once, and ONLY when the server has verified
 * the submission token. Direct/refreshed access without a valid token never
 * renders this component, so conversions cannot be faked or double-counted.
 */
export function ThankYouConversion({ reference, leadType }: { reference: string; leadType: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent({ name: 'thank_you_view', category: 'conversion', metadata: { lead_type: leadType } });
    trackLeadConversion(reference);
  }, [reference, leadType]);
  return null;
}
