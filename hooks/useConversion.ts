import { useCallback, useEffect } from 'react'
import { conversions } from '@/lib/conversions'
import type { ConversionType } from '@/lib/conversions/types'

interface UseConversionOptions {
  trackOnMount?: boolean
  trackOnScroll?: boolean
  scrollThreshold?: number
}

export function useConversion(
  type?: ConversionType,
  options: UseConversionOptions = {}
) {
  const { trackOnMount = false, trackOnScroll = false, scrollThreshold = 50 } = options

  // Track on component mount
  useEffect(() => {
    if (trackOnMount && type) {
      conversions.track(type)
    }
  }, [trackOnMount, type])

  // Track on scroll
  useEffect(() => {
    if (!trackOnScroll) return

    let hasTracked = false
    const handleScroll = () => {
      const scrollPercentage = 
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercentage >= scrollThreshold && !hasTracked) {
        conversions.trackPageScroll(scrollPercentage)
        hasTracked = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackOnScroll, scrollThreshold])

  // Return tracking functions
  const trackConversion = useCallback((conversionType: ConversionType, data?: any) => {
    conversions.track(conversionType, data)
  }, [])

  const trackClick = useCallback((name: string, location: string) => {
    conversions.trackCTAClick(name, location)
  }, [])

  return {
    trackConversion,
    trackClick,
    conversions
  }
}