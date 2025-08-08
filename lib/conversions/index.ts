import { ConversionEvent, ConversionType } from './types'
import { CONVERSION_CONFIGS } from './config'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

class ConversionTracker {
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.isInitialized = true
    }
  }

  // Main tracking function
  track(type: ConversionType, additionalData?: Partial<ConversionEvent>) {
    if (!this.isInitialized) return

    const config = CONVERSION_CONFIGS[type]
    if (!config) {
      console.warn(`No configuration found for conversion type: ${type}`)
      return
    }

    // Track in Google Analytics
    this.trackGoogleAnalytics(type, config, additionalData)
    
    // Track in Google Ads
    if (config.sendTo) {
      this.trackGoogleAds(config, additionalData)
    }

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Conversion tracked:', {
        type,
        config,
        additionalData
      })
    }
  }

  private trackGoogleAnalytics(
    type: ConversionType,
    config: any,
    additionalData?: Partial<ConversionEvent>
  ) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', type, {
        event_category: 'conversion',
        event_label: config.name,
        value: additionalData?.value || config.value,
        ...additionalData?.customParams
      })
    }
  }

  private trackGoogleAds(config: any, additionalData?: Partial<ConversionEvent>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: config.sendTo,
        value: additionalData?.value || config.value,
        currency: additionalData?.currency || 'USD',
        transaction_id: additionalData?.transactionId || Date.now().toString(),
        ...additionalData?.customParams
      })
    }
  }

  // Convenience methods for common conversions
  trackFormSubmit(formName: string, value?: number) {
    this.track('form_submit', {
      customParams: { form_name: formName },
      value
    })
  }

  trackApplicationStart(country?: string) {
    this.track('application_start', {
      customParams: { destination_country: country }
    })
  }

  trackApplicationComplete(country: string, value: number) {
    this.track('application_complete', {
      value,
      customParams: { destination_country: country }
    })
  }

  // Fixed trackPhoneClick to accept only phone number
  trackPhoneClick(phoneNumber: string) {
    this.track('phone_click', {
      customParams: { phone_number: phoneNumber }
    })
  }

  trackWhatsAppClick(phoneNumber: string) {
    this.track('whatsapp_click', {
      customParams: { phone_number: phoneNumber }
    })
  }

  trackServiceView(serviceName: string) {
    this.track('service_view', {
      customParams: { service_name: serviceName }
    })
  }

  trackCountrySelect(country: string) {
    this.track('country_select', {
      customParams: { country }
    })
  }

  trackCTAClick(ctaName: string, location: string) {
    this.track('cta_click', {
      customParams: { cta_name: ctaName, location }
    })
  }

  trackPageScroll(percentage: number) {
    this.track('page_scroll', {
      customParams: { scroll_percentage: percentage }
    })
  }

  trackVideoWatch(videoTitle: string, watchPercentage: number) {
    this.track('video_watch', {
      customParams: { 
        video_title: videoTitle,
        watch_percentage: watchPercentage 
      },
      value: Math.floor(watchPercentage / 20) // Value based on watch percentage
    })
  }

  trackBlogRead(articleTitle: string, readTime: number) {
    this.track('blog_read', {
      customParams: { 
        article_title: articleTitle,
        read_time_seconds: readTime 
      }
    })
  }

  trackDocumentDownload(documentName: string) {
    this.track('document_download', {
      customParams: { document_name: documentName }
    })
  }

  trackNewsletterSignup(email: string) {
    this.track('newsletter_signup', {
      customParams: { email_domain: email.split('@')[1] }
    })
  }

  trackPriceCheck(service: string, price: number) {
    this.track('price_check', {
      customParams: { service, price },
      value: price * 0.1 // 10% of price as conversion value
    })
  }
}

// Export singleton instance
export const conversions = new ConversionTracker()

// Export type for direct use
export type { ConversionType } from './types'