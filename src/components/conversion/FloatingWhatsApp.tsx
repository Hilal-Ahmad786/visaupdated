'use client';

import { usePathname } from 'next/navigation';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { isLandingRoute } from '@/config/landing-routes';
import { contactSettings, whatsappLink } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

/**
 * Non-intrusive WhatsApp button. Sits ABOVE the mobile conversion bar (bottom
 * offset) and never auto-opens. Brand-green pill with the real WhatsApp glyph
 * and label.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  // Landing pages surface WhatsApp inside their own sticky CTA.
  if (pathname.startsWith('/tesekkurler') || isLandingRoute(pathname)) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ile yazın: ${contactSettings.whatsappDisplay}`}
      onClick={() =>
        trackEvent({
          name: 'whatsapp_click',
          category: 'conversion',
          metadata: { CTA_location: 'floating' },
        })
      }
      className="fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-heading text-base font-semibold text-white shadow-form transition-transform hover:scale-105 md:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      WhatsApp
    </a>
  );
}
