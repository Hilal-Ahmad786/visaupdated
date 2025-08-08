'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AdPlaceholder from '@/components/AdPlaceholder'
import { conversions } from '@/lib/conversions'

interface ApplicationFormData {
  // Kişisel Bilgiler
  ulke: string
  basvuru_amaci: string
  ad: string
  soyad: string
  seyahat_baslangic: string
  seyahat_sigortasi: string
  telefon: string
  email: string
  ikamet_sehri: string
  kisi_sayisi: string
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

export default function ApplicationPage() {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ApplicationFormData>()
  
  const onSubmit = async (data: ApplicationFormData) => {
    // Track conversion
    conversions.track('application_complete', {
      value: 100,
      customParams: {
        country: data.ulke,
        purpose: data.basvuru_amaci
      }
    })

    // FormSubmit'e gönder
    try {
      const response = await fetch('https://formsubmit.co/hilalahmad.civilengineer@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _captcha: 'false',
          _next: window.location.origin + '/tesekkurler'
        })
      })

      if (response.ok) {
        alert('Başvurunuz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
        window.location.href = '/tesekkurler'
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
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vize Başvurusu</h1>
            <p className="text-xl text-secondary">
              Vize başvurunuzu birkaç dakika içinde tamamlayın. 
              Uzmanlarımız başvurunuzu inceleyip süreç boyunca size rehberlik edecek.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-secondary'}`}>
                  Temel Bilgiler
                </span>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-secondary'}`}>
                  Seyahat Detayları
                </span>
                <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-secondary'}`}>
                  Kontrol & Gönder
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
              {/* Step 1: Temel Bilgiler */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Temel Bilgiler</h2>
                  
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

              {/* Step 2: Seyahat Detayları */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Seyahat Detayları</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Seyahat Başlangıç Tarihi */}
                    <div className="form-group">
                      <label className="form-label">Seyahat Başlangıç Tarihi *</label>
                      <input
                        type="date"
                        {...register('seyahat_baslangic', { required: 'Seyahat tarihi zorunludur' })}
                        className="form-input"
                      />
                      {errors.seyahat_baslangic && (
                        <p className="text-red-500 text-sm mt-1">{errors.seyahat_baslangic.message}</p>
                      )}
                    </div>

                    {/* Seyahat Sigortası */}
                    <div className="form-group">
                      <label className="form-label">Seyahat Sigortası *</label>
                      <select 
                        {...register('seyahat_sigortasi', { required: 'Sigorta durumu zorunludur' })}
                        className="form-select"
                      >
                        <option value="">Lütfen seçin</option>
                        <option value="Var">Var</option>
                        <option value="Yok">Yok</option>
                      </select>
                      {errors.seyahat_sigortasi && (
                        <p className="text-red-500 text-sm mt-1">{errors.seyahat_sigortasi.message}</p>
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
                        <option value="5">5</option>
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

              {/* Step 3: Kontrol & Gönder */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6">Kontrol & Gönder</h2>
                  
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Başvuru Özeti</h3>
                    <p className="text-sm text-secondary mb-4">
                      Lütfen göndermeden önce bilgilerinizi kontrol edin. 
                      Değişiklik yapmak isterseniz geri dönebilirsiniz.
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
                      Başvuruyu Gönder
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />
    </>
  )
}