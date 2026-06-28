/**
 * Centralized analytics abstraction.
 *
 * Components NEVER call gtag directly — they call trackEvent(). This keeps event
 * naming consistent, makes consent-gating possible in one place (Part 2), and
 * prevents PII (names/phones/emails/messages) from ever reaching analytics.
 *
 * Adapted from the legacy `lib/conversions` concept but decoupled from UI and
 * hardcoded Google Ads IDs (those now come from env / future admin settings).
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'form_view'
  | 'form_start'
  | 'form_step_complete'
  | 'form_validation_error'
  | 'form_submit'
  | 'application_complete'
  | 'appointment_request'
  | 'contact_request'
  | 'country_select'
  | 'service_select'
  | 'document_tab_view'
  | 'faq_open'
  | 'blog_read'
  | 'blog_cta_click'
  | 'article_progress'
  | 'search'
  | 'cta_click'
  | 'thank_you_view'
  | 'not_found_recovery';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  category?: 'conversion' | 'engagement' | 'navigation' | 'content';
  page?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

/** Keys that must never be forwarded to analytics. */
const PII_KEYS = new Set([
  'name',
  'phone',
  'email',
  'message',
  'firstName',
  'lastName',
  'city',
  'reference',
  'q', // raw search query is logged separately & truncated, never as free text PII
]);

function sanitize(
  metadata: Record<string, unknown> = {},
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (PII_KEYS.has(key)) continue;
    if (value === undefined || value === null) continue;
    if (typeof value === 'object') continue;
    out[key] = value as string | number | boolean;
  }
  return out;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event_category: event.category ?? 'engagement',
    page_path: event.page ?? window.location?.pathname,
    ...sanitize(event.metadata),
  };

  // Push to dataLayer for GTM-based setups regardless of gtag presence.
  window.dataLayer?.push({ event: event.name, ...payload });

  if (typeof window.gtag === 'function') {
    window.gtag('event', event.name, payload);
  } else if (process.env.NODE_ENV === 'development') {
    // Visible in dev so events can be verified without a live GA property.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event.name, payload);
  }

  // Primary Google Ads conversions for this business: calls + WhatsApp.
  // (Form submissions fire trackLeadConversion on the verified thank-you page.)
  if (event.name === 'phone_click') trackCallConversion();
  else if (event.name === 'whatsapp_click') trackWhatsAppConversion();
}

/**
 * Google Ads conversion — fired ONLY from the verified thank-you page.
 * Returns false (and fires nothing) when not configured or unverified.
 */
export function trackLeadConversion(reference: string): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_ADS_LEAD_CONVERSION_LABEL;
  if (!adsId || !label) return false;

  window.gtag('event', 'conversion', {
    send_to: `${adsId}/${label}`,
    transaction_id: reference, // dedupes accidental double-fires
  });
  return true;
}

/**
 * Fire a Google Ads conversion for a primary action (call / WhatsApp). Forms
 * use trackLeadConversion above; for this business calls are a primary
 * conversion too. No-ops unless the Ads id + the matching label env are set.
 */
function fireAdsConversion(label: string | undefined): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!adsId || !label) return false;
  window.gtag('event', 'conversion', { send_to: `${adsId}/${label}` });
  return true;
}

/** Google Ads conversion on a phone-call click. */
export function trackCallConversion(): boolean {
  return fireAdsConversion(process.env.NEXT_PUBLIC_ADS_CALL_CONVERSION_LABEL);
}

/** Google Ads conversion on a WhatsApp click. */
export function trackWhatsAppConversion(): boolean {
  return fireAdsConversion(process.env.NEXT_PUBLIC_ADS_WHATSAPP_CONVERSION_LABEL);
}
