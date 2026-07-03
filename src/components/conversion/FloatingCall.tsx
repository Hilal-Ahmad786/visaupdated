'use client';

import { Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { isLandingRoute } from '@/config/landing-routes';
import { contactSettings } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

/** Hidden on the thank-you page, mirroring the mobile conversion bar. */
const HIDDEN_PREFIXES = ['/tesekkurler'];

/**
 * Floating "Hemen Ara" call-to-action for DESKTOP only. On mobile the same CTA
 * already lives in the fixed bottom conversion bar, so this is `hidden md:…`.
 * Sits above the floating WhatsApp button on the bottom-right.
 */
export function FloatingCall() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p)) || isLandingRoute(pathname)) return null;

  return (
    <a
      href={contactSettings.phoneHref}
      onClick={() =>
        trackEvent({
          name: 'phone_click',
          category: 'conversion',
          metadata: { CTA_location: 'floating_desktop' },
        })
      }
      aria-label={`Hemen arayın: ${contactSettings.phoneDisplay}`}
      className="btn-primary fixed bottom-24 right-4 z-40 hidden shadow-form transition-transform hover:scale-105 md:inline-flex"
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
      Hemen Ara
    </a>
  );
}
