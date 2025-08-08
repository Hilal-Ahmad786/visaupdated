import { useForm } from 'react-hook-form'
import { conversions } from '@/lib/conversions'
import { useConversion } from '@/hooks/useConversion'

interface FormData {
  name: string
  email: string
  phone: string
  country: string
  message: string
}

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { trackClick } = useConversion()

  const onSubmit = (data: FormData) => {
    conversions.trackFormSubmit('contact_form', 20)
    conversions.track('contact_form', {
      customParams: {
        country: data.country,
        has_message: !!data.message
      }
    })
    
    console.log(data)
    alert('Formunuz başarıyla gönderildi!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Ad Soyad *</label>
          <input
            {...register('name', { required: 'Ad soyad gereklidir' })}
            className="form-input"
            placeholder="Adınız ve soyadınız"
            onFocus={() => trackClick('form_field_focus', 'contact_form_name')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">E-posta *</label>
          <input
            {...register('email', { 
              required: 'E-posta gereklidir',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Geçersiz e-posta adresi'
              }
            })}
            className="form-input"
            placeholder="ornek@email.com"
            onFocus={() => trackClick('form_field_focus', 'contact_form_email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Telefon *</label>
          <input
            {...register('phone', { required: 'Telefon gereklidir' })}
            className="form-input"
            placeholder="5XX XXX XX XX"
            onFocus={() => trackClick('form_field_focus', 'contact_form_phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Hedef Ülke *</label>
          <select
            {...register('country', { required: 'Lütfen bir ülke seçin' })}
            className="form-select"
            onChange={(e) => conversions.trackCountrySelect(e.target.value)}
          >
            <option value="">Ülke seçin</option>
            <option value="almanya">Almanya</option>
            <option value="fransa">Fransa</option>
            <option value="ingiltere">İngiltere</option>
            <option value="italya">İtalya</option>
            <option value="ispanya">İspanya</option>
            <option value="hollanda">Hollanda</option>
            <option value="diger">Diğer</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Mesajınız</label>
        <textarea
          {...register('message')}
          className="form-input h-32 resize-none"
          placeholder="Vize ihtiyaçlarınız hakkında bilgi verin..."
          onFocus={() => trackClick('form_field_focus', 'contact_form_message')}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full"
        onClick={() => trackClick('submit_button', 'contact_form')}
      >
        Başvuruyu Gönder
      </button>
    </form>
  )
}