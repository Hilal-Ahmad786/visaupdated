// components/ContactForm.tsx (Updated to match application form style and structure)
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { conversions } from '@/lib/conversions'

interface ContactFormData {
  // Kişisel Bilgiler
  ulke: string
  basvuru_amaci: string
  ad: string
  soyad: string
  telefon: string
  email: string
  ikamet_sehri: string
  kisi_sayisi: string
  mesaj: string
  kvkk_onay: boolean
}

const countries = [
  'Almanya', 'Avustralya', 'Avusturya', 'Belçika', 
  'Bulgaristan', 'Çekya', 'Danimarka', 'Estonya', 'Finlandiya', 
  'Fransa', 'Hollanda', 'Hırvatistan', 'Hindistan', 'İrlanda', 
  'İspanya', 'İsrail', 'İsveç', 'İsviçre', 'İtalya', 'İzlanda', 
  'Letonya', 'Litvanya', 'Lüksemburg', 'Macaristan', 'Malta', 
  'Norveç', 'Polonya', 'Portekiz', 'Romanya', 'Slovakya', 
  'Slovenya', 'Yunanistan', 'İngiltere', 'Diğer'
]

const purposes = [
  'Aile/Arkadaş Ziyareti', 'Turistik', 'Ticari / İş Seyahati',
  'Fuar Katılımı', 'Kültürel/Sportif/Kongre/Etkinlik', 'Öğrenci Gezileri',
  'Tır Şoförü', 'Transit Geçiş', 'Aile Birleşimi', 'İş Arama',
  'Mavi Kart', 'Çalışma/İş Kurma', 'Erasmus/Staj/Öğrenim',
  'Üniversite/Yüksek Okul', 'Dil Kursu', 'Ülkeye Geri Dönüş',
  'Vatandaşlık Hakları', 'Diğer Konsolosluk İşlemleri'
]

const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

export default function ContactForm() {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    // Track conversion
    conversions.track('contact_form', {
      value: 20,
      customParams: {
        country: data.ulke,
        purpose: data.basvuru_amaci
      }
    })

    // FormSubmit'e gönder
    try {
      const response = await fetch('https://formsubmit.co/tvsvisaglobal@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _captcha: 'false',
          _next: window.location.origin + '/tesekkurler/'
        })
      })

      if (response.ok) {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
        // Optional: redirect to thank you page
        // window.location.href = '/tesekkurler'
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-secondary'}`}>
            Kişisel Bilgiler
          </span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-secondary'}`}>
            Vize Detayları
          </span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-secondary'}`}>
            Mesaj & Gönder
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        {/* Step 1: Kişisel Bilgiler */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Kişisel Bilgiler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad */}
              <div className="form-group">
                <label className="form-label">Ad *</label>
                <input
                  {...register('ad', { required: 'Ad zorunludur' })}
                  className="form-input"
                  placeholder="Adınızı girin"
                />
                {errors.ad && (
                  <p className="text-red-500 text-sm mt-1">{errors.ad.message}</p>
                )}
              </div>

              {/* Soyad */}
              <div className="form-group">
                <label className="form-label">Soyad *</label>
                <input
                  {...register('soyad', { required: 'Soyad zorunludur' })}
                  className="form-input"
                  placeholder="Soyadınızı girin"
                />
                {errors.soyad && (
                  <p className="text-red-500 text-sm mt-1">{errors.soyad.message}</p>
                )}
              </div>

              {/* Telefon */}
              <div className="form-group">
                <label className="form-label">Telefon *</label>
                <input
                  {...register('telefon', { required: 'Telefon zorunludur' })}
                  className="form-input"
                  placeholder="(5__) ___ __ __"
                />
                {errors.telefon && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefon.message}</p>
                )}
              </div>

              {/* E-posta */}
              <div className="form-group">
                <label className="form-label">E-posta *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'E-posta zorunludur',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçersiz e-posta adresi'
                    }
                  })}
                  className="form-input"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Sonraki Adım
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vize Detayları */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Vize Detayları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ülke */}
              <div className="form-group">
                <label className="form-label">Başvuru Yapılacak Ülke *</label>
                <select 
                  {...register('ulke', { required: 'Ülke seçimi zorunludur' })}
                  className="form-select"
                >
                  <option value="">Lütfen seçin</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.ulke && (
                  <p className="text-red-500 text-sm mt-1">{errors.ulke.message}</p>
                )}
              </div>

              {/* Başvuru Amacı */}
              <div className="form-group">
                <label className="form-label">Başvuru Amacı *</label>
                <select 
                  {...register('basvuru_amaci', { required: 'Başvuru amacı zorunludur' })}
                  className="form-select"
                >
                  <option value="">Lütfen seçin</option>
                  {purposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
                {errors.basvuru_amaci && (
                  <p className="text-red-500 text-sm mt-1">{errors.basvuru_amaci.message}</p>
                )}
              </div>

              {/* İkamet Şehri */}
              <div className="form-group">
                <label className="form-label">İkamet Şehri *</label>
                <select 
                  {...register('ikamet_sehri', { required: 'İkamet şehri zorunludur' })}
                  className="form-select"
                >
                  <option value="">Lütfen seçin</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.ikamet_sehri && (
                  <p className="text-red-500 text-sm mt-1">{errors.ikamet_sehri.message}</p>
                )}
              </div>

              {/* Kişi Sayısı */}
              <div className="form-group">
                <label className="form-label">Başvuru Yapacak Kişi Sayısı *</label>
                <select 
                  {...register('kisi_sayisi', { required: 'Kişi sayısı zorunludur' })}
                  className="form-select"
                >
                  <option value="">Lütfen seçin</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
                {errors.kisi_sayisi && (
                  <p className="text-red-500 text-sm mt-1">{errors.kisi_sayisi.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn btn-outline">
                Önceki
              </button>
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Sonraki Adım
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Mesaj & Gönder */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Mesajınız & Gönder</h2>
            
            {/* Mesaj */}
            <div className="form-group">
              <label className="form-label">Mesajınız (Opsiyonel)</label>
              <textarea
                {...register('mesaj')}
                className="form-input h-32 resize-none"
                placeholder="Vize başvurunuz hakkında detay vermek istediğiniz bilgiler..."
              />
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">İletişim Özeti</h3>
              <p className="text-sm text-secondary mb-4">
                Formunuzu gönderdikten sonra uzman danışmanlarımız 2 saat içinde size dönüş yapacaktır.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* KVKK Onay */}
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('kvkk_onay', { required: 'KVKK onayı zorunludur' })}
                  className="mt-1"
                />
                <span className="text-sm">
                  KVKK Aydınlatma ve Açık Rıza Metinlerini okudum, anladım ve onaylıyorum.
                  <a href="/kvkk" className="text-primary hover:underline mx-1">Aydınlatma Metni</a>
                  ve
                  <a href="/gizlilik" className="text-primary hover:underline mx-1">Gizlilik Politikası</a>
                </span>
              </label>
              {errors.kvkk_onay && (
                <p className="text-red-500 text-sm">{errors.kvkk_onay.message}</p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn btn-outline">
                Önceki
              </button>
              <button type="submit" className="btn btn-primary btn-lg">
                Mesajı Gönder
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}