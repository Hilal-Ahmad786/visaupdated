'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { captureAttribution } from '@/lib/tracking/utm';
import { trackEmailClick, trackPhoneClick, trackWhatsAppClick } from '@/lib/tracking/events';

/**
 * Global, delegated click tracking for tel:/WhatsApp/mailto links.
 *
 * Uses a single document-level listener (event delegation) so it works for
 * links rendered at any time, including client-side navigations and dynamic
 * content — no per-component wiring needed. Mount once in the root layout.
 *
 * It also captures UTM / ad-click ids on first load and on every route change,
 * so attribution is attached to conversions later in the session.
 */

const WHATSAPP_HOSTS = ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'];

function isWhatsApp(href: string): boolean {
  if (href.startsWith('whatsapp:')) return true;
  try {
    const url = new URL(href, window.location.href);
    return WHATSAPP_HOSTS.includes(url.hostname.replace(/^www\./, ''));
  } catch {
    return /wa\.me|whatsapp\.com/i.test(href);
  }
}

/** Extract the phone/whatsapp number from a tel:/wa href, best-effort. */
function numberFromHref(href: string): string | undefined {
  const m = href.match(/(?:tel:|wa\.me\/|phone=)\+?(\d[\d\s-]{5,})/i);
  const digits = m?.[1]?.replace(/\D/g, '');
  if (!digits) return undefined;
  return href.includes('+') || href.includes('wa.me') ? `+${digits}` : digits;
}

export function TrackingAutoEvents() {
  const pathname = usePathname();

  // Capture attribution on load and whenever the route changes.
  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href) return;

      const text = (anchor.textContent ?? '').trim().slice(0, 120) || undefined;
      const page_path = window.location.pathname;

      if (href.startsWith('tel:')) {
        trackPhoneClick({
          click_url: href,
          click_text: text,
          phone_number: numberFromHref(href),
          page_path,
        });
      } else if (isWhatsApp(href)) {
        trackWhatsAppClick({
          click_url: href,
          click_text: text,
          whatsapp_number: numberFromHref(href),
          page_path,
        });
      } else if (href.startsWith('mailto:')) {
        trackEmailClick({
          click_url: href,
          click_text: text,
          email: href.replace(/^mailto:/, '').split('?')[0] || undefined,
          page_path,
        });
      }
    }

    // Capture phase so we still record the click even if something calls
    // stopPropagation on the way up.
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
