'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';

import { ConsentCheckbox, Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/fields';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { StatusAlert } from '@/components/ui/states';
import { applicantCountOptions, visaPurposeOptions, type CountryOption } from '@/config/form-options';
import { useFormStart } from '@/hooks/useFormStart';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackEvent } from '@/lib/analytics';
import { preApplicationSchema, type PreApplicationInput } from '@/schemas/forms';

const STEPS = ['Seyahat', 'Kişisel', 'Detay', 'Onay'] as const;

const stepFields: Path<PreApplicationInput>[][] = [
  ['country', 'visaPurpose'],
  ['name', 'phone', 'email'],
  ['city', 'applicantCount', 'travelDate', 'message'],
  ['kvkkConsent'],
];

export function PreApplicationForm({
  countryOptions,
  presetCountry,
}: {
  countryOptions: CountryOption[];
  presetCountry?: string;
}) {
  const [step, setStep] = useState(0);
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({
    leadType: 'pre_application',
    successEvent: 'application_complete',
    formId: 'pre_application_form',
    formName: 'Online Ön Başvuru',
    leadTypeLabel: 'online_on_basvuru',
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PreApplicationInput>({
    resolver: zodResolver(preApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      country: presetCountry ?? '',
      applicantCount: 1,
      renderedAt: Date.now(),
      marketingConsent: false,
    },
  });

  const formStart = useFormStart(
    { form_id: 'pre_application_form', form_name: 'Online Ön Başvuru', lead_type: 'online_on_basvuru' },
    () => ({ country: getValues('country') || undefined, visa_type: getValues('visaPurpose') || undefined }),
  );

  useEffect(() => {
    trackEvent({ name: 'form_view', category: 'conversion', metadata: { form_name: 'pre_application' } });
  }, []);

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (!valid) {
      trackEvent({ name: 'form_validation_error', metadata: { form_name: 'pre_application', form_step: step + 1 } });
      return;
    }
    if (step === 0) trackEvent({ name: 'form_start', category: 'conversion', metadata: { form_name: 'pre_application' } });
    trackEvent({ name: 'form_step_complete', metadata: { form_name: 'pre_application', form_step: step + 1 } });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form
      onSubmit={handleSubmit((d) => submit(d))}
      {...formStart.handlers}
      className="relative rounded-form border border-line bg-white p-6 shadow-form sm:p-7"
      noValidate
      aria-label="Online ön başvuru formu"
    >
      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-heading font-semibold text-navy">
            Adım {step + 1} / {STEPS.length}: {STEPS[step]}
          </span>
          <span className="text-ink-muted">%{Math.round(((step + 1) / STEPS.length) * 100)}</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-surface"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label="Form ilerlemesi"
        >
          <div className="h-full bg-gold transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-4">
          <SelectField label="Hangi ülkeye başvurmak istiyorsunuz?" required placeholder="Ülke seçin" options={countryOptions} {...register('country')} error={errors.country?.message} />
          <SelectField label="Başvuru amacınız nedir?" required placeholder="Amaç seçin" options={visaPurposeOptions} {...register('visaPurpose')} error={errors.visaPurpose?.message} />
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="space-y-4">
          <TextField label="Ad Soyad" required autoComplete="name" {...register('name')} error={errors.name?.message} />
          <TextField label="Telefon" required inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" {...register('phone')} error={errors.phone?.message} />
          <TextField label="E-posta (opsiyonel)" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-4">
          <TextField label="İkamet Şehri (opsiyonel)" {...register('city')} error={errors.city?.message} />
          <SelectField label="Başvuran Sayısı" options={applicantCountOptions} {...register('applicantCount')} error={errors.applicantCount?.message} />
          <TextField label="Planlanan Seyahat Tarihi (opsiyonel)" type="date" {...register('travelDate')} error={errors.travelDate?.message} />
          <TextAreaField label="Eklemek istedikleriniz (opsiyonel)" {...register('message')} error={errors.message?.message} />
        </div>
      )}

      {/* Step 4 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-card bg-surface p-4 text-sm">
            <p className="font-heading font-semibold text-navy">Başvuru Özeti</p>
            <dl className="mt-2 grid grid-cols-2 gap-y-1 text-ink-soft">
              <dt>Ülke</dt>
              <dd className="text-ink">{getValues('country') || '—'}</dd>
              <dt>Amaç</dt>
              <dd className="text-ink">{getValues('visaPurpose') || '—'}</dd>
              <dt>Ad Soyad</dt>
              <dd className="text-ink">{getValues('name') || '—'}</dd>
              <dt>Telefon</dt>
              <dd className="text-ink">{getValues('phone') || '—'}</dd>
            </dl>
          </div>
          <ConsentCheckbox required {...register('kvkkConsent')} label={<KvkkLabel />} error={errors.kvkkConsent?.message} />
          <ConsentCheckbox {...register('marketingConsent')} label={<MarketingLabel />} />
        </div>
      )}

      {serverError && <div className="mt-4"><StatusAlert tone="error">{serverError}</StatusAlert></div>}
      {duplicate && (
        <div className="mt-4">
          <StatusAlert tone="info" title="Talebiniz zaten alındı">
            Bu numarayla kısa süre önce bir başvuru aldık; ekibimiz sizinle iletişime geçecek.
          </StatusAlert>
        </div>
      )}

      {/* Navigation */}
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
            {submitting ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" /> Güvenli bilgi aktarımı
        </span>
        <span className="inline-flex items-center gap-1.5">
          Telefonla başvurmak için <PhoneLink location="pre_app_form" className="font-semibold text-navy" showIcon={false} />
        </span>
      </div>
    </form>
  );
}
