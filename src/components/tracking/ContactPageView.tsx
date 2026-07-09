'use client';

import { useEffect, useRef } from 'react';

import { trackContactPageView } from '@/lib/tracking/events';

/**
 * Fires `vis_contact_page_view` once when the contact page mounts. Drop this
 * client component into the (server-rendered) contact page. Secondary Ads
 * conversion — see docs/tracking-setup.md.
 */
export function ContactPageView() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackContactPageView({ page_path: window.location.pathname });
  }, []);
  return null;
}
