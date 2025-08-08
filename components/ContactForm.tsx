// components/ContactForm.tsx (Updated to match application form style)
'use client'

import { useForm } from 'react-hook-form'
import { conversions } from '@/lib/conversions'
import { useConversion } from '@/hooks/useConversion'

interface FormData {
  name: string
  surname: string
  email: string
  phone: string
  country: string
  purpose: string
  message: string
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

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { trackClick } = useConversion()

  const onSubmit = async (data: FormData) => {
    conversions.trackFormSubmit('contact_form', 20)
    conversions.track('contact_form', {
      customParams: {
        country: data.country,
        purpose: data.purpose
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
          _next: window.location.origin + '/tesekkurler'
        })
      })

      if (response.ok) {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
      <h2 className="text-2xl font-semibold mb-6">İletişim Formu</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ad */}
        <div className="form-group">
          <label className="form-label">Ad *</label>
          <input
            {...register('name', { required: 'Ad zorunludur' })}
            className="form-input"
            placeholder="Adınızı girin"
            onFocus={() => trackClick('form_field_focus', 'contact_form_name')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Soyad */}
        <div className="form-group">
          <label className="form-label">Soyad *</label>
          <input
            {...register('surname', { required: 'Soyad zorunludur' })}
            className="form-input"
            placeholder="Soyadınızı girin"
            onFocus={() => trackClick('form_field_focus', 'contact_form_surname')}
          />
          {errors.surname && (
            <p className="text-red-500 text-sm mt-1">{errors.surname.message}</p>
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
            onFocus={() => trackClick('form_field_focus', 'contact_form_email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Telefon */}
        <div className="form-group">
          <label className="form-label">Telefon *</label>
          <input
            {...register('phone', { required: 'Telefon zorunludur' })}
            className="form-input"
            placeholder="(5__) ___ __ __"
            onFocus={() => trackClick('form_field_focus', 'contact_form_phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Ülke */}
        <div className="form-group">
          <label className="form-label">Başvuru Yapılacak Ülke *</label>
          <select 
            {...register('country', { required: 'Ülke seçimi zorunludur' })}
            className="form-select"
            onChange={(e) => conversions.trackCountrySelect(e.target.value)}
          >
            <option value="">Lütfen seçin</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* Başvuru Amacı */}
        <div className="form-group">
          <label className="form-label">Başvuru Amacı *</label>
          <select 
            {...register('purpose', { required: 'Başvuru amacı zorunludur' })}
            className="form-select"
          >
            <option value="">Lütfen seçin</option>
            {purposes.map(purpose => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
          )}
        </div>
      </div>

      {/* Mesaj */}
      <div className="form-group">
        <label className="form-label">Mesajınız</label>
        <textarea
          {...register('message')}
          className="form-input h-32 resize-none"
          placeholder="Vize ihtiyaçlarınız hakkında detay verin..."
          onFocus={() => trackClick('form_field_focus', 'contact_form_message')}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full"
        onClick={() => trackClick('submit_button', 'contact_form')}
      >
        Mesajı Gönder
      </button>
    </form>
  )
}