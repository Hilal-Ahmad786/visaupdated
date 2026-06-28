import { contactSettings, LEGAL_DISCLAIMER } from '@/config/site';
import type { GeneralSettings, TrackingEventMap, TrackingProvider } from '@/types/admin';

export const generalSettings: GeneralSettings = {
  brandShort: 'VİS VİZE',
  brandFull: 'VİS VİZE RANDEVU HİZMETLERİ',
  phoneDisplay: contactSettings.phoneDisplay,
  phoneE164: contactSettings.phoneHref.replace('tel:', ''),
  whatsapp: contactSettings.whatsappDisplay,
  email: contactSettings.email,
  address: `${contactSettings.address.line}, ${contactSettings.address.city}`,
  workingHours: [...contactSettings.workingHours],
  defaultFormId: 'form-preapp',
  seoTitleTemplate: '%s | VİS VİZE',
  legalDisclaimer: LEGAL_DISCLAIMER,
  social: [
    { label: 'Instagram', url: '' },
    { label: 'LinkedIn', url: '' },
  ],
};

export const trackingProviders: TrackingProvider[] = [
  { id: 'gtm', name: 'Google Tag Manager', enabled: false, measurementId: '', status: 'not_configured' },
  { id: 'ga4', name: 'Google Analytics 4', enabled: false, measurementId: '', status: 'not_configured' },
  { id: 'google_ads', name: 'Google Ads', enabled: false, measurementId: '', status: 'not_configured' },
  { id: 'meta_pixel', name: 'Meta Pixel', enabled: false, measurementId: '', status: 'not_configured' },
];

/** Event dictionary — params are intentionally PII-free (stable IDs only). */
export const trackingEventMap: TrackingEventMap[] = [
  { event: 'page_view', conversion: false, params: ['page_path', 'page_type'] },
  { event: 'phone_click', conversion: false, params: ['CTA_location'] },
  { event: 'whatsapp_click', conversion: false, params: ['CTA_location'] },
  { event: 'form_start', conversion: false, params: ['form_name'] },
  { event: 'form_step_complete', conversion: false, params: ['form_name', 'form_step'] },
  { event: 'application_complete', conversion: true, params: ['form_name'] },
  { event: 'appointment_request', conversion: true, params: ['form_name'] },
  { event: 'thank_you_view', conversion: false, params: ['lead_type'] },
];

/** Parameters that must NEVER be sent to tracking. Enforced by the UI + tests. */
export const PROHIBITED_TRACKING_PARAMS = [
  'name', 'phone', 'email', 'message', 'passport', 'address', 'dob', 'date_of_birth', 'raw_value', 'file',
];
