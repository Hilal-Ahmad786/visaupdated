import { ConversionConfig, ConversionType } from './types'

export const CONVERSION_CONFIGS: Record<ConversionType, ConversionConfig> = {
  // High-Value Conversions
  application_complete: {
    name: 'Application Completed',
    googleAdsId: 'AW-16630919138/abc123',
    value: 100,
    sendTo: 'AW-16630919138/CompleteApplication',
  },
  appointment_book: {
    name: 'Appointment Booked',
    googleAdsId: 'AW-16630919138/def456',
    value: 75,
    sendTo: 'AW-16630919138/BookAppointment',
  },
  
  // Medium-Value Conversions
  application_start: {
    name: 'Application Started',
    googleAdsId: 'AW-16630919138/ghi789',
    value: 25,
    sendTo: 'AW-16630919138/StartApplication',
  },
  contact_form: {
    name: 'Contact Form Submitted',
    googleAdsId: 'AW-16630919138/jkl012',
    value: 20,
    sendTo: 'AW-16630919138/ContactForm',
  },
  chat_start: {
    name: 'Live Chat Started',
    googleAdsId: 'AW-16630919138/mno345',
    value: 15,
    sendTo: 'AW-16630919138/ChatStart',
  },
  
  // Engagement Conversions
  phone_click: {
    name: 'Phone Number Clicked',
    value: 10,
    sendTo: 'AW-16630919138/PhoneClick',
  },
  whatsapp_click: {
    name: 'WhatsApp Clicked',
    value: 10,
    sendTo: 'AW-16630919138/WhatsAppClick',
  },
  email_click: {
    name: 'Email Clicked',
    value: 5,
    sendTo: 'AW-16630919138/EmailClick',
  },
  
  // Content Engagement
  service_view: {
    name: 'Service Page Viewed',
    value: 3,
  },
  country_select: {
    name: 'Country Selected',
    value: 5,
  },
  blog_read: {
    name: 'Blog Article Read',
    value: 2,
  },
  faq_view: {
    name: 'FAQ Viewed',
    value: 2,
  },
  document_download: {
    name: 'Document Downloaded',
    value: 8,
  },
  video_watch: {
    name: 'Video Watched',
    value: 5,
  },
  
  // Micro Conversions
  form_submit: {
    name: 'Form Submitted',
    value: 15,
  },
  cta_click: {
    name: 'CTA Button Clicked',
    value: 1,
  },
  navigation_click: {
    name: 'Navigation Clicked',
    value: 0.5,
  },
  page_scroll: {
    name: 'Page Scrolled',
    value: 0.5,
  },
  social_share: {
    name: 'Social Share',
    value: 3,
  },
  newsletter_signup: {
    name: 'Newsletter Signup',
    value: 5,
  },
  price_check: {
    name: 'Price Checked',
    value: 8,
  },
}