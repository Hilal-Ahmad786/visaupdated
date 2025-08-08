'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { conversions } from '@/lib/conversions'
import { useConversion } from '@/hooks/useConversion'
import { useEffect } from 'react'

export default function Hero() {
  const { trackClick } = useConversion()

  useEffect(() => {
    const timer = setTimeout(() => {
      conversions.track('page_scroll', {
        customParams: { section: 'hero_view_3s' }
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleStartApplication = () => {
    conversions.trackApplicationStart()
    conversions.trackCTAClick('start_application', 'hero')
  }

  const handleFreeConsultation = () => {
    conversions.trackCTAClick('free_consultation', 'hero')
  }

  const handleWhatsAppClick = () => {
    conversions.trackWhatsAppClick('+905551234567')
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Güvenilir Vize Ortağınız
          </motion.h1>
          
          <motion.p 
            className="text-xl text-secondary mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            %98 başarı oranı ile profesyonel vize danışmanlığı. 
            15+ yıllık deneyimle binlerce kişinin seyahat hayallerini gerçekleştirdik.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/application" 
              className="btn btn-primary text-lg px-8 py-3"
              onClick={handleStartApplication}
            >
              Başvuru Yap
            </Link>
            <Link 
              href="/contact" 
              className="btn btn-outline text-lg px-8 py-3"
              onClick={handleFreeConsultation}
            >
              Ücretsiz Danışmanlık
            </Link>
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp text-lg px-8 py-3"
              onClick={handleWhatsAppClick}
            >
              WhatsApp Sohbet
            </a>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div onClick={() => trackClick('stat_click', 'happy_clients')}>
              <div className="text-3xl font-bold text-primary">15.000+</div>
              <div className="text-secondary">Mutlu Müşteri</div>
            </div>
            <div onClick={() => trackClick('stat_click', 'success_rate')}>
              <div className="text-3xl font-bold text-primary">%98</div>
              <div className="text-secondary">Başarı Oranı</div>
            </div>
            <div onClick={() => trackClick('stat_click', 'experience')}>
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-secondary">Yıllık Deneyim</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}