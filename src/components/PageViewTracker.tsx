'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { beaconClick } from '@/lib/analytics';

/**
 * Records a first-party page view (visit) on every page load and client-side
 * route change, so the admin report counts ALL visitors — not just the ones who
 * call or fill the form. Bots are filtered server-side.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    beaconClick('page_view');
  }, [pathname]);

  return null;
}
