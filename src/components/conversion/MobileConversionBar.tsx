'use client';

import { Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { contactSettings } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

/** Hidden on the thank-you page per the design system. */
const HIDDEN_PREFIXES = ['/tesekkurler'];

/**
 * Fixed bottom conversion bar (mobile only). A single, prominent "Hemen Ara"
 * call-to-action. Respects safe-area inset and does not cover the footer (body
 * has bottom padding on mobile via the layout).
 */
export function MobileConversionBar() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_-8px_rgba(12,36,72,0.18)] backdrop-blur md:hidden"
      role="region"
      aria-label="Hızlı iletişim"
    >
      <a
        href={contactSettings.phoneHref}
        onClick={() => trackEvent({ name: 'phone_click', category: 'conversion', metadata: { CTA_location: 'mobile_bar' } })}
        className="btn-navy min-h-[54px] w-full text-lg"
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
        Hemen Ara
      </a>
    </div>
  );
}
