'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';

import { ConsentCheckbox, Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/fields';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import { StatusAlert } from '@/components/ui/states';
import { applicantCountOptions, contactMethodOptions, visaTypeOptions, type CountryOption } from '@/config/form-options';
import { useFormStart } from '@/hooks/useFormStart';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackEvent } from '@/lib/analytics';
import { appointmentSchema, type AppointmentInput } from '@/schemas/forms';

const STEPS = ['Talep', 'Tarih', 'İletişim'] as const;
const stepFields: Path<AppointmentInput>[][] = [
  ['country', 'visaType', 'applicantCount'],
  ['preferredDateFrom', 'preferredDateTo', 'contactMethod'],
  ['name', 'phone', 'email', 'kvkkConsent'],
];

export function AppointmentForm({ countryOptions }: { countryOptions: CountryOption[] }) {
  const [step, setStep] = useState(0);
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({
    leadType: 'appointment',
    successEvent: 'appointment_request',
    formId: 'appointment_form',
    formName: 'Randevu Talebi',
    leadTypeLabel: 'appointment',
  });
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onTouched',
    defaultValues: { applicantCount: 1, contactMethod: 'phone', renderedAt: Date.now(), marketingConsent: false },
  });

  const formStart = useFormStart(
    { form_id: 'appointment_form', form_name: 'Randevu Talebi', lead_type: 'appointment' },
    () => ({ country: getValues('country') || undefined, visa_type: getValues('visaType') || undefined }),
  );

  const next = async () => {
    const ok = await trigger(stepFields[step]);
    if (!ok) {
      trackEvent({ name: 'form_validation_error', metadata: { form_name: 'appointment', form_step: step + 1 } });
      return;
    }
    trackEvent({ name: 'form_step_complete', metadata: { form_name: 'appointment', form_step: step + 1 } });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form onSubmit={handleSubmit((d) => submit(d))} {...formStart.handlers} className="relative rounded-form border border-line bg-white p-6 shadow-form sm:p-7" noValidate aria-label="Randevu talep formu">
      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-heading font-semibold text-navy">Adım {step + 1} / {STEPS.length}: {STEPS[step]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Form ilerlemesi">
          <div className="h-full bg-gold transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <SelectField label="Ülke" required placeholder="Ülke seçin" options={countryOptions} {...register('country')} error={errors.country?.message} />
          <SelectField label="Vize Türü" required placeholder="Tür seçin" options={visaTypeOptions} {...register('visaType')} error={errors.visaType?.message} />
          <SelectField label="Başvuran Sayısı" options={applicantCountOptions} {...register('applicantCount')} error={errors.applicantCount?.message} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Tercih Edilen Başlangıç" required type="date" {...register('preferredDateFrom')} error={errors.preferredDateFrom?.message} />
            <TextField label="Tercih Edilen Bitiş" required type="date" {...register('preferredDateTo')} error={errors.preferredDateTo?.message} />
          </div>
          <SelectField label="Tercih Edilen İletişim" options={contactMethodOptions} {...register('contactMethod')} error={errors.contactMethod?.message} />
          <StatusAlert tone="warning" title="Önemli">
            Bu form resmi bir konsolosluk randevusu oluşturmaz. Randevu uygunluğu resmi başvuru merkezine bağlıdır; talebinizi değerlendirip uygun seçenekleri size iletiriz.
          </StatusAlert>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <TextField label="Ad Soyad" required autoComplete="name" {...register('name')} error={errors.name?.message} />
          <TextField label="Telefon" required inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" {...register('phone')} error={errors.phone?.message} />
          <TextField label="E-posta (opsiyonel)" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
          <TextAreaField label="Mesajınız (opsiyonel)" {...register('message')} error={errors.message?.message} />
          <ConsentCheckbox required {...register('kvkkConsent')} label={<KvkkLabel />} error={errors.kvkkConsent?.message} />
          <ConsentCheckbox {...register('marketingConsent')} label={<MarketingLabel />} />
        </div>
      )}

      {serverError && <div className="mt-4"><StatusAlert tone="error">{serverError}</StatusAlert></div>}
      {duplicate && <div className="mt-4"><StatusAlert tone="info" title="Talebiniz alındı">Kısa süre önce bir randevu talebi aldık; ekibimiz sizinle iletişime geçecek.</StatusAlert></div>}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={back} className="btn-outline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Geri
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary ml-auto">
            Devam Et <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" disabled={submitting} className="btn-primary ml-auto">
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
            {submitting ? 'Gönderiliyor…' : 'Randevu Talebini Gönder'}
          </button>
        )}
      </div>
    </form>
  );
}
