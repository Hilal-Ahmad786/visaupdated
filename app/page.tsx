// app/page.tsx (Fixed - Add PhoneIcon import)
'use client'

import { useEffect } from 'react'
import { PhoneIcon } from '@heroicons/react/24/solid' // Add this import
import Hero from '@/components/Hero'
import ServiceCard from '@/components/ServiceCard'
import CountryCard from '@/components/CountryCard'
import ContactForm from '@/components/ContactForm'
import AdPlaceholder from '@/components/AdPlaceholder'
import ConversionButton from '@/components/ConversionButton'
import PhoneLink from '@/components/PhoneLink'
import { conversions } from '@/lib/conversions'
import { useConversion } from '@/hooks/useConversion'

const services = [
  {
    title: 'Turistik Vize',
    description: 'Tatil ve gezi amaçlı vize başvurularınızda profesyonel destek.',
    features: ['Evrak hazırlama', 'Randevu alma', 'Başvuru takibi'],
    link: '/services#turistik',
    value: 50
  },
  {
    title: 'Ticari Vize',
    description: 'İş seyahatleri, toplantı ve konferanslar için hızlı vize çözümleri.',
    features: ['Hızlı işlem', 'Öncelikli randevu', 'Davet mektubu'],
    link: '/services#ticari',
    value: 75
  },
  {
    title: 'Öğrenci Vizesi',
    description: 'Yurtdışı eğitim hayalleriniz için kapsamlı vize desteği.',
    features: ['Okul seçimi', 'Burs imkanları', 'Konaklama desteği'],
    link: '/services#ogrenci',
    value: 60
  },
]

const countries = [
  { name: 'Almanya', flag: '🇩🇪', type: 'Schengen', successRate: 95 },
  { name: 'Fransa', flag: '🇫🇷', type: 'Schengen', successRate: 93 },
  { name: 'İngiltere', flag: '🇬🇧', type: 'Ziyaretçi', successRate: 92 },
  { name: 'İtalya', flag: '🇮🇹', type: 'Schengen', successRate: 96 },
  { name: 'İspanya', flag: '🇪🇸', type: 'Schengen', successRate: 94 },
  { name: 'Hollanda', flag: '🇳🇱', type: 'Schengen', successRate: 91 },
]

export default function Home() {
  const { trackClick } = useConversion()

  useEffect(() => {
    if (typeof window !== 'undefined' && conversions) {
      conversions.track('page_scroll', {
        customParams: { page: 'anasayfa', scroll_percentage: 0 }
      })

      let maxScroll = 0
      const handleScroll = () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        
        if (scrollPercentage >= 25 && maxScroll < 25) {
          maxScroll = 25
          conversions.trackPageScroll(25)
        } else if (scrollPercentage >= 50 && maxScroll < 50) {
          maxScroll = 50
          conversions.trackPageScroll(50)
        } else if (scrollPercentage >= 75 && maxScroll < 75) {
          maxScroll = 75
          conversions.trackPageScroll(75)
        } else if (scrollPercentage >= 90 && maxScroll < 90) {
          maxScroll = 90
          conversions.trackPageScroll(90)
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleServiceClick = (serviceName: string, value: number) => {
    if (conversions) {
      conversions.trackServiceView(serviceName)
      conversions.track('service_view', {
        value,
        customParams: { service_name: serviceName }
      })
    }
  }

  const handleCountryClick = (country: string) => {
    if (conversions) {
      conversions.trackCountrySelect(country)
    }
  }

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    if (conversions) {
      conversions.trackNewsletterSignup(email)
    }
    alert('Bülten aboneliğiniz başarıyla alındı!')
  }

  return (
    <>
      <Hero />
      
      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />

      {/* Quick Contact Bar */}
      <section className="py-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <span className="font-semibold text-lg">Hemen yardım mı gerekiyor?</span>
            <PhoneLink 
              phone="08502411527" 
              displayText="📞 Hemen Arayın"
              className="text-white hover:text-blue-100 font-medium"
            />
            <ConversionButton
              href="/appointment"
              conversionName="book_appointment"
              conversionValue={50}
              location="quick_contact_bar"
              className="btn bg-white/20 text-white border-2 border-white hover:bg-white hover:text-blue-600"
            >
              📅 Randevu Alın
            </ConversionButton>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Hizmetlerimiz</h2>
            <p className="section-subtitle">İhtiyacınıza özel profesyonel vize çözümleri</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} onClick={() => handleServiceClick(service.title, service.value)}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <ConversionButton
              href="/services"
              conversionName="view_all_services"
              conversionValue={10}
              location="services_section"
              className="btn btn-primary btn-lg"
            >
              Tüm Hizmetleri Görüntüle
            </ConversionButton>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Popüler Destinasyonlar</h2>
            <p className="section-subtitle">Tüm büyük ülkeler için yüksek başarı oranları</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {countries.map((country, index) => (
              <div key={index} onClick={() => handleCountryClick(country.name)}>
                <CountryCard {...country} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <ConversionButton
              href="/countries"
              conversionName="explore_countries"
              conversionValue={8}
              location="countries_section"
              className="btn btn-secondary btn-lg"
            >
              Tüm Ülkeleri Keşfedin
            </ConversionButton>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Neden Vize Global?</h2>
            <p className="section-subtitle">Vize sürecinizde yanınızda olmamız için 4 neden</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">%98 Başarı Oranı</h3>
              <p className="text-gray-600">Profesyonel ekibimizle yüksek başarı garantisi</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Hızlı İşlem</h3>
              <p className="text-gray-600">Express başvuru ve öncelikli randevu imkanı</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">50+ Ülke</h3>
              <p className="text-gray-600">Dünya genelinde geniş hizmet ağı</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2">7/24 Destek</h3>
              <p className="text-gray-600">Telefon ile sürekli iletişim</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Vize Güncellemeleri ve İpuçları</h3>
            <p className="text-blue-100 mb-6">En güncel vize haberleri ve başvuru ipuçları için bültenimize abone olun</p>
            <form onSubmit={handleNewsletterSignup} className="flex gap-4">
              <input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                className="form-input flex-1 text-gray-900"
                required
              />
              <ConversionButton
                type="submit"
                conversionName="newsletter_signup"
                conversionValue={5}
                location="newsletter_section"
                className="btn bg-white text-blue-600 hover:bg-gray-100"
              >
                Abone Ol
              </ConversionButton>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Hemen Başlayın</h2>
            <p className="section-subtitle">Vize ihtiyaçlarınız için ücretsiz danışmanlık</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Floating Call Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="tel:08502411527"
          onClick={() => conversions.trackPhoneClick('08502411527', 'floating_call')}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg animate-float"
        >
          <PhoneIcon className="w-6 h-6" />
        </a>
      </div>
    </>
  )
}