export interface ConversionEvent {
  eventName: string
  value?: number
  currency?: string
  transactionId?: string
  items?: any[]
  customParams?: Record<string, any>
}

export type ConversionType = 
  | 'form_submit'
  | 'application_start'
  | 'application_complete'
  | 'contact_form'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'service_view'
  | 'country_select'
  | 'blog_read'
  | 'faq_view'
  | 'document_download'
  | 'video_watch'
  | 'chat_start'
  | 'appointment_book'
  | 'page_scroll'
  | 'cta_click'
  | 'navigation_click'
  | 'social_share'
  | 'newsletter_signup'
  | 'price_check'

export interface ConversionConfig {
  name: string
  googleAdsId?: string
  value?: number
  sendTo?: string
  customParams?: Record<string, any>
}