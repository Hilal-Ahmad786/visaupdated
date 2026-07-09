'use client';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { contactSettings, whatsappLink } from '@/config/site';
import { trackWhatsAppClick } from '@/lib/tracking/events';
import { cn } from '@/lib/utils';

/**
 * Secondary CTA for the provider landing pages — opens WhatsApp with a
 * page-specific prefilled message and fires the central `vis_whatsapp_click`
 * event. Kept as a tiny client island so the surrounding page stays server-only.
 */
export function RandevuWhatsAppButton({
  message,
  label,
  className,
}: {
  message: string;
  label: string;
  className?: string;
}) {
  const href = whatsappLink(message);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackWhatsAppClick({
          click_url: href,
          click_text: label,
          whatsapp_number: contactSettings.whatsappDisplay,
        })
      }
      className={cn(
        'btn inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#1FB457]',
        className,
      )}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
