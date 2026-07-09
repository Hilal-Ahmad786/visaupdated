'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import {
  ConsentCheckbox,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/fields';
import { StatusAlert } from '@/components/ui/states';
import { visaPurposeOptions } from '@/config/form-options';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackFormStart } from '@/lib/tracking/events';
import { simpleLeadSchema, type SimpleLeadInput } from '@/schemas/forms';

/** Appointment-centre preference options offered on the provider landing pages. */
const CENTER_OPTIONS = [
  { value: 'AS Visa', label: 'AS Visa' },
  { value: 'BLS', label: 'BLS International' },
  { value: 'iDATA', label: 'iDATA' },
  { value: 'Kosmos', label: 'Kosmos Vize' },
  { value: 'VFS Global', label: 'VFS Global' },
  { value: 'Bilmiyorum / Diğer', label: 'Bilmiyorum / Diğer' },
];

/**
 * Provider appointment-consultancy lead form. Reuses the site's shared form
 * fields, validation schema and submission workflow (`useLeadSubmit` →
 * `/api/leads`). It fires the central GTM conversion events:
 *   - `vis_form_start` once, on first interaction (via `trackFormStart`)
 *   - `vis_lead_submit` once, on confirmed API success (inside `useLeadSubmit`)
 * both carrying form_id / form_name / country / visa_type / lead_type; page_path
 * is attached automatically by the dataLayer base event.
 *
 * lead_type is fixed to `provider_randevu_danismanligi`.
 */
export function RandevuLeadForm({
  formName,
  presetCountry,
  presetCenter,
  title,
  description,
  submitLabel,
}: {
  formName: string;
  presetCountry: string;
  presetCenter: string;
  title: string;
  description: string;
  submitLabel: string;
}) {
  const formId = 'randevu_danismanligi_form';
  const leadTypeLabel = 'provider_randevu_danismanligi';

  const { submit, submitting, serverError, duplicate } = useLeadSubmit({
    leadType: 'country',
    formId,
    formName,
    leadTypeLabel,
  });

  const startedRef = useRef(false);
  const [center, setCenter] = useState(presetCenter);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleLeadInput>({
    resolver: zodResolver(simpleLeadSchema),
    defaultValues: {
      country: presetCountry,
      visaPurpose: '',
      renderedAt: Date.now(),
      marketingConsent: false,
    },
  });

  const handleFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    // PRIMARY funnel start → GTM `vis_form_start` (fires once per pageview).
    trackFormStart({
      form_id: formId,
      form_name: formName,
      lead_type: leadTypeLabel,
      country: presetCountry || undefined,
    });
  };

  const onSubmit = async (data: SimpleLeadInput) => {
    // Fold the appointment-centre preference into the message so it is captured
    // server-side without altering the shared schema.
    const centerLine = center ? `Randevu/başvuru merkezi tercihi: ${center}` : '';
    const message = [centerLine, data.message?.trim()].filter(Boolean).join('\n');
    await submit({ ...data, message });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={handleFirstInteraction}
      className="rounded-form border border-line bg-white p-6 shadow-form sm:p-7"
      noValidate
      aria-label={title}
    >
      <div>
        <h2 className="font-heading text-h4 text-navy">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      </div>

      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Ad Soyad"
            required
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />
          <TextField
            label="Telefon"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <TextField
          label="E-posta (opsiyonel)"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Başvurulacak Ülke"
            autoComplete="off"
            placeholder="Örn. Almanya"
            {...register('country')}
            error={errors.country?.message}
          />
          <div>
            <label htmlFor="randevu-merkezi" className="field-label">
              Randevu / Başvuru Merkezi Tercihi
            </label>
            <select
              id="randevu-merkezi"
              className="field-input"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
            >
              {CENTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <SelectField
          label="Başvuru Türü"
          placeholder="Tür seçin"
          options={visaPurposeOptions}
          {...register('visaPurpose')}
          error={errors.visaPurpose?.message}
        />

        <TextAreaField
          label="Mesajınız (opsiyonel)"
          placeholder="Randevu süreciniz hakkında kısa bir not bırakabilirsiniz."
          {...register('message')}
          error={errors.message?.message}
        />

        <ConsentCheckbox
          required
          {...register('kvkkConsent')}
          label={<KvkkLabel />}
          error={errors.kvkkConsent?.message}
        />
        <ConsentCheckbox {...register('marketingConsent')} label={<MarketingLabel />} />

        {serverError && <StatusAlert tone="error">{serverError}</StatusAlert>}
        {duplicate && (
          <StatusAlert tone="info" title="Talebiniz zaten alındı">
            Bu numarayla kısa süre önce bir talep aldık. Ekibimiz en kısa sürede sizinle iletişime
            geçecek.
          </StatusAlert>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
          {submitting ? 'Gönderiliyor…' : submitLabel}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" /> KVKK uyumlu bilgi
            aktarımı
          </span>
          <span className="inline-flex items-center gap-1.5">
            Telefonla ulaşın:{' '}
            <PhoneLink location="randevu_form" className="font-semibold text-navy" showIcon={false} />
          </span>
        </div>
      </div>
    </form>
  );
}
