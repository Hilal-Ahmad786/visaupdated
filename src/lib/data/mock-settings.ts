import { contactSettings, LEGAL_DISCLAIMER } from '@/config/site';
import type { GeneralSettings, TrackingEventMap } from '@/types/admin';

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

/** Event dictionary — params are intentionally PII-free (stable IDs only). */
export const trackingEventMap: TrackingEventMap[] = [
  {
    event: 'vis_lead_submit',
    ga4: 'generate_lead',
    adsConversion: 'VIS | Website Form Submit',
    conversion: true,
    params: ['form_id', 'form_name', 'country', 'visa_type', 'lead_type', 'event_id'],
  },
  {
    event: 'vis_form_start',
    ga4: 'form_start',
    adsConversion: 'VIS | Form Start',
    conversion: false,
    params: ['form_id', 'form_name', 'country', 'visa_type'],
  },
  {
    event: 'vis_phone_click',
    ga4: 'phone_click',
    adsConversion: 'VIS | Website Phone Click',
    conversion: true,
    params: ['click_url', 'click_text', 'page_path'],
  },
  {
    event: 'vis_whatsapp_click',
    ga4: 'whatsapp_click',
    adsConversion: 'VIS | WhatsApp Click',
    conversion: true,
    params: ['click_url', 'click_text', 'page_path'],
  },
  {
    event: 'vis_email_click',
    ga4: 'email_click',
    conversion: false,
    params: ['click_url', 'click_text', 'page_path'],
  },
  {
    event: 'vis_contact_page_view',
    ga4: 'contact_page_view',
    conversion: false,
    params: ['page_path'],
  },
];

/** Parameters that must NEVER be sent to tracking. Enforced by the UI + tests. */
export const PROHIBITED_TRACKING_PARAMS = [
  'name', 'phone', 'email', 'message', 'passport', 'address', 'dob', 'date_of_birth', 'raw_value', 'file',
];
