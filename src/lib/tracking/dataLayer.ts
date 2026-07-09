/**
 * Low-level dataLayer plumbing.
 *
 * Everything the site tracks goes through `pushToDataLayer`. Google Tag Manager
 * listens to these pushes and forwards them to GA4 and Google Ads — the website
 * NEVER calls gtag directly and NEVER hardcodes GA4 measurement ids or Google
 * Ads conversion labels (those live in GTM). See docs/tracking-setup.md.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    /** Dev-only flag: when true, every push is logged as a console table. */
    visTrackingDebug?: boolean;
  }
}

/** Base fields present on every tracking event. */
export interface BaseEvent {
  event: string;
  event_id: string;
  event_time: string;
  page_location: string;
  page_path: string;
  page_title: string;
}

const isBrowser = () => typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

/** RFC4122 id where available, otherwise a timestamp+random fallback. */
export function generateEventId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Build the base event envelope shared by all tracking events. */
export function buildBaseEvent(eventName: string): BaseEvent {
  const loc = isBrowser() ? window.location : undefined;
  return {
    event: eventName,
    event_id: generateEventId(),
    event_time: new Date().toISOString(),
    page_location: loc?.href ?? '',
    page_path: loc?.pathname ?? '',
    page_title: (isBrowser() && document?.title) || '',
  };
}

/**
 * Push an event to window.dataLayer. No-ops on the server. In development (or
 * when window.visTrackingDebug is true) it logs the event for debugging.
 */
export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (!isBrowser()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (isDev || window.visTrackingDebug) {
    const { event, ...rest } = payload;
    // eslint-disable-next-line no-console
    console.groupCollapsed(`%c[vis-tracking] ${String(event)}`, 'color:#0C2448;font-weight:600');
    // eslint-disable-next-line no-console
    console.table(rest);
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
}
