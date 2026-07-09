/**
 * Typed tracking helpers — the ONLY API the app uses to record conversions and
 * engagement. Each helper builds a base event, attaches session attribution
 * (UTM + ad click ids) and pushes a `vis_*` event to the dataLayer. GTM maps
 * each `vis_*` event to the matching GA4 event and Google Ads conversion.
 *
 * Exact event-name → GA4 → Ads mapping lives in docs/tracking-setup.md.
 *
 * PII rules:
 *  - Never send email/phone/name as GA4 custom parameters.
 *  - `user_data` (for Google Ads Enhanced Conversions) may be pushed to the
 *    dataLayer for the lead-submit event ONLY; GTM routes it to the Ads
 *    User-Provided Data tag, not to GA4.
 *  - Email is lowercased+trimmed; Turkish phones normalized to E.164.
 *  - No PII is ever written to localStorage/sessionStorage.
 */
import { buildBaseEvent, pushToDataLayer } from './dataLayer';
import { getAttribution } from './utm';

/** dataLayer event names — kept in one place so GTM triggers match exactly. */
export const TrackingEvent = {
  LeadSubmit: 'vis_lead_submit',
  FormStart: 'vis_form_start',
  PhoneClick: 'vis_phone_click',
  WhatsAppClick: 'vis_whatsapp_click',
  EmailClick: 'vis_email_click',
  ContactPageView: 'vis_contact_page_view',
} as const;

// ---------------------------------------------------------------------------
// Normalization (Enhanced Conversions require normalized user data)
// ---------------------------------------------------------------------------

export function normalizeEmail(email?: string | null): string | undefined {
  const v = email?.trim().toLowerCase();
  return v ? v : undefined;
}

/**
 * Normalize a (mostly Turkish) phone number to E.164, e.g. +905XXXXXXXXX.
 * Returns undefined if it can't be confidently normalized.
 */
export function normalizePhoneE164(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return undefined;

  // Already international (kept as-is if it looks valid).
  if (hasPlus) return digits.length >= 8 ? `+${digits}` : undefined;

  // 0090XXXXXXXXXX
  if (digits.startsWith('0090')) return `+${digits.slice(2)}`;
  // 90XXXXXXXXXX (12 digits)
  if (digits.startsWith('90') && digits.length === 12) return `+${digits}`;
  // 0XXXXXXXXXX (national, 11 digits)
  if (digits.startsWith('0') && digits.length === 11) return `+90${digits.slice(1)}`;
  // 5XXXXXXXXX (mobile without leading 0, 10 digits)
  if (digits.length === 10 && digits.startsWith('5')) return `+90${digits}`;

  return undefined;
}

function firstLastName(fullName?: string | null): { first?: string; last?: string } {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return {};
  if (parts.length === 1) return { first: parts[0] };
  return { first: parts[0], last: parts[parts.length - 1] };
}

// ---------------------------------------------------------------------------
// Shared payload types
// ---------------------------------------------------------------------------

interface CommonFormData {
  form_id?: string;
  form_name?: string;
  country?: string;
  visa_type?: string;
  lead_type?: string;
}

interface ClickData {
  click_url?: string;
  click_text?: string;
  page_path?: string;
}

/** Push helper: base + attribution + provided fields (dropping undefined). */
function track(eventName: string, fields: Record<string, unknown>): string {
  const base = buildBaseEvent(eventName);
  const payload: Record<string, unknown> = { ...base, ...getAttribution() };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== null && v !== '') payload[k] = v;
  }
  pushToDataLayer(payload);
  return base.event_id;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Fire once when the user first interacts with a lead form (secondary conv). */
export function trackFormStart(data: CommonFormData): string {
  return track(TrackingEvent.FormStart, {
    form_id: data.form_id,
    form_name: data.form_name,
    country: data.country,
    visa_type: data.visa_type,
    lead_type: data.lead_type,
  });
}

export interface LeadSubmitData extends CommonFormData {
  /** Raw user inputs — normalized here for Enhanced Conversions. */
  email?: string;
  phone?: string;
  name?: string;
}

/**
 * Fire ONLY after a confirmed successful form submission (never on click, never
 * on validation/API error). Maps to GA4 `generate_lead` + Ads Website Form
 * Submit in GTM. `user_data` is included for Enhanced Conversions.
 */
export function trackLeadSubmit(data: LeadSubmitData): string {
  const email = normalizeEmail(data.email);
  const phone = normalizePhoneE164(data.phone);
  const { first, last } = firstLastName(data.name);

  const userData: Record<string, string> = {};
  if (email) userData.email = email;
  if (phone) userData.phone_number = phone;
  if (first) userData.first_name = first;
  if (last) userData.last_name = last;

  return track(TrackingEvent.LeadSubmit, {
    form_id: data.form_id,
    form_name: data.form_name,
    country: data.country,
    visa_type: data.visa_type,
    lead_type: data.lead_type,
    // For Google Ads Enhanced Conversions via GTM's User-Provided Data tag.
    // NOT to be mapped to GA4 event parameters.
    user_data: Object.keys(userData).length ? userData : undefined,
  });
}

export function trackPhoneClick(data: ClickData & { phone_number?: string }): string {
  return track(TrackingEvent.PhoneClick, {
    click_url: data.click_url,
    click_text: data.click_text,
    phone_number: data.phone_number,
    page_path: data.page_path,
  });
}

export function trackWhatsAppClick(data: ClickData & { whatsapp_number?: string }): string {
  return track(TrackingEvent.WhatsAppClick, {
    click_url: data.click_url,
    click_text: data.click_text,
    whatsapp_number: data.whatsapp_number,
    page_path: data.page_path,
  });
}

export function trackEmailClick(data: ClickData & { email?: string }): string {
  return track(TrackingEvent.EmailClick, {
    click_url: data.click_url,
    click_text: data.click_text,
    // Email of the mailbox being contacted (business address) — not user PII.
    email: data.email,
    page_path: data.page_path,
  });
}

export function trackContactPageView(data: { page_path?: string } = {}): string {
  return track(TrackingEvent.ContactPageView, { page_path: data.page_path });
}
