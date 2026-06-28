'use client';

import { MessageCircle } from 'lucide-react';

import { contactSettings, whatsappLink } from '@/config/site';
import { trackEvent, trackWhatsAppConversion } from '@/lib/analytics';

/**
 * Non-intrusive WhatsApp button. Sits ABOVE the mobile conversion bar (bottom
 * offset) and never auto-opens. Tertiary CTA — does not visually compete with
 * phone/form per the design system.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ile yazın: ${contactSettings.whatsappDisplay}`}
      onClick={() => {
        trackEvent({ name: 'whatsapp_click', category: 'conversion', metadata: { CTA_location: 'floating' } });
        trackWhatsAppConversion();
      }}
      className="fixed bottom-24 right-4 z-40 grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-form transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
