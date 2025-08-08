// app/contact/page.tsx (Updated - Remove WhatsApp, Update Form)
'use client'

import ContactForm from '@/components/ContactForm'
import AdPlaceholder from '@/components/AdPlaceholder'
import VisaBanner728x90 from '@/components/ads/VisaBanner728x90'
import PhoneLink from '@/components/PhoneLink'
import EmailLink from '@/components/EmailLink'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">İletişim</h1>
            <p className="text-xl text-secondary">
              Vize başvuru ihtiyaçlarınız için kişiselleştirilmiş yardım almak üzere 
              uzman vize danışmanlarımızla iletişime geçin.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı">
  <VisaBanner728x90 href="/appointment" />
</AdPlaceholder>
      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold mb-6">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Ofis Adresi</h3>
                    <p className="text-secondary">
                      BEŞTEPE MAH. 32 CAD. NO: 1 İÇ KAPI NO: 102<br />
                      Yenimahalle / Ankara
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneIcon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <PhoneLink 
                      phone="08502411527" 
                      displayText="0850 241 15 27"
                      className="text-secondary hover:text-primary block"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <EnvelopeIcon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">E-posta</h3>
                    <EmailLink 
                      email="tvsvisaglobal@gmail.com"
                      className="text-secondary hover:text-primary"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ClockIcon className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                    <p className="text-secondary">
                      Pazartesi - Cuma: 08:30 - 18:30<br />
                      Cumartesi: 10:00 - 14:00<br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                <h3 className="font-semibold mb-4">Hızlı İletişim</h3>
                <div className="space-y-3">
                  <PhoneLink
                    phone="08502411527"
                    displayText="Hemen Arayın"
                    className="btn btn-primary w-full text-center"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Neden Vize Global'i Seçmelisiniz?</h2>
            <p className="section-subtitle">Vize yolculuğunuzu sorunsuz ve başarılı hale getirmek için buradayız</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Hızlı Yanıt</h3>
              <p className="text-sm text-secondary">Mesai saatleri içinde tüm sorulara 2 saat içinde yanıt veriyoruz</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold mb-2">Çok Dilli Destek</h3>
              <p className="text-sm text-secondary">Ekibimiz Türkçe, İngilizce, Arapça ve Fransızca konuşmaktadır</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold mb-2">7/24 Acil Hat</h3>
              <p className="text-sm text-secondary">Acil vize yardımı günün her saati mevcut</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">Ücretsiz Danışmanlık</h3>
              <p className="text-sm text-secondary">Vize uygunluğunuzun zorunluluksuz değerlendirmesi</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}