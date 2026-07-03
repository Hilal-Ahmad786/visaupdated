'use client';

import { ClipboardEdit, Phone } from 'lucide-react';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { contactSettings, whatsappLink } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

/**
 * Landing-page mobile sticky bar with three conversion actions: call, WhatsApp
 * and jump-to-form. Mobile only (`md:hidden`); the global single-CTA bar is
 * suppressed on landing routes so these do not stack. Uses the same centralized
 * phone/WhatsApp config and the same phone_click / whatsapp_click events wired to
 * Google Ads conversions elsewhere.
 */
export function StickyMobileCTA({ whatsappMessage }: { whatsappMessage: string }) {
  const scrollToForm = () => {
    trackEvent({
      name: 'click_primary_cta',
      category: 'conversion',
      metadata: { CTA_location: 'sticky_form' },
    });
    const el = document.getElementById('lead-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_-8px_rgba(12,36,72,0.18)] backdrop-blur md:hidden"
      role="region"
      aria-label="Hızlı iletişim"
    >
      <a
        href={contactSettings.phoneHref}
        onClick={() =>
          trackEvent({
            name: 'phone_click',
            category: 'conversion',
            metadata: { CTA_location: 'sticky_bar' },
          })
        }
        className="btn-navy min-h-[48px] flex-col gap-0.5 px-2 text-sm"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Hemen Ara
      </a>
      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent({
            name: 'whatsapp_click',
            category: 'conversion',
            metadata: { CTA_location: 'sticky_bar' },
          })
        }
        className="btn min-h-[48px] flex-col gap-0.5 bg-[#25D366] px-2 text-sm text-white hover:bg-[#1ebe5b]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={scrollToForm}
        className="btn-primary min-h-[48px] flex-col gap-0.5 px-2 text-sm"
      >
        <ClipboardEdit className="h-5 w-5" aria-hidden="true" />
        Formu Doldur
      </button>
    </div>
  );
}
