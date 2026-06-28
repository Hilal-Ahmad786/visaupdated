'use client';

import { FileText, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { contactSettings } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

/** Hidden on the thank-you page per the design system. */
const HIDDEN_PREFIXES = ['/tesekkurler'];

/**
 * Fixed bottom conversion bar (mobile only). Left = Hemen Ara, Right = Ön Başvuru.
 * Respects safe-area inset and does not cover the footer (body has bottom padding
 * on mobile via the layout).
 */
export function MobileConversionBar() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_-8px_rgba(12,36,72,0.18)] backdrop-blur md:hidden"
      role="region"
      aria-label="Hızlı iletişim"
    >
      <a
        href={contactSettings.phoneHref}
        onClick={() => trackEvent({ name: 'phone_click', category: 'conversion', metadata: { CTA_location: 'mobile_bar' } })}
        className="btn-navy"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Hemen Ara
      </a>
      <Link
        href="/online-on-basvuru"
        onClick={() => trackEvent({ name: 'cta_click', category: 'conversion', metadata: { CTA_location: 'mobile_bar', target: 'pre_application' } })}
        className="btn-primary"
      >
        <FileText className="h-5 w-5" aria-hidden="true" />
        Ön Başvuru
      </Link>
    </div>
  );
}
