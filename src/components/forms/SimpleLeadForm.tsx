'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ConsentCheckbox, Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/fields';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { StatusAlert } from '@/components/ui/states';
import { visaPurposeOptions, type CountryOption } from '@/config/form-options';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { simpleLeadSchema, type SimpleLeadInput } from '@/schemas/forms';
import type { LeadSchemaKey } from '@/schemas/forms';

/**
 * Compact single-step lead form. Reused on homepage bottom, country/service
 * pages, blog and 404. `leadType` differentiates the source for the CRM.
 */
export function SimpleLeadForm({
  leadType = 'country',
  countryOptions,
  presetCountry,
  compact = false,
  title = 'Uzman Danışmanlarımız Sizi Arasın',
  description = 'Kısa formu doldurun, başvuru türünüzü değerlendirip size en kısa sürede ulaşalım.',
}: {
  leadType?: LeadSchemaKey;
  countryOptions: CountryOption[];
  presetCountry?: string;
  compact?: boolean;
  title?: string;
  description?: string;
}) {
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({ leadType });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleLeadInput>({
    resolver: zodResolver(simpleLeadSchema),
    defaultValues: { country: presetCountry ?? '', renderedAt: Date.now(), marketingConsent: false },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => submit(d))}
      className="relative space-y-4"
      noValidate
      aria-label={title}
    >
      <div>
        <h3 className="font-heading text-h4">{title}</h3>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      </div>

      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <TextField label="Ad Soyad" required {...register('name')} error={errors.name?.message} autoComplete="name" />
        <TextField label="Telefon" required inputMode="tel" {...register('phone')} error={errors.phone?.message} autoComplete="tel" placeholder="05XX XXX XX XX" />
        <SelectField
          label="Hedef Ülke"
          placeholder="Ülke seçin (opsiyonel)"
          options={countryOptions}
          {...register('country')}
          error={errors.country?.message}
        />
        <SelectField
          label="Başvuru Amacı"
          placeholder="Amaç seçin (opsiyonel)"
          options={visaPurposeOptions}
          {...register('visaPurpose')}
          error={errors.visaPurpose?.message}
        />
      </div>
      {!compact && (
        <TextAreaField label="Mesajınız (opsiyonel)" {...register('message')} error={errors.message?.message} />
      )}

      <ConsentCheckbox required {...register('kvkkConsent')} label={<KvkkLabel />} error={errors.kvkkConsent?.message} />
      <ConsentCheckbox {...register('marketingConsent')} label={<MarketingLabel />} />

      {serverError && <StatusAlert tone="error">{serverError}</StatusAlert>}
      {duplicate && (
        <StatusAlert tone="info" title="Talebiniz zaten alındı">
          Bu numarayla kısa süre önce bir talep aldık. Ekibimiz en kısa sürede sizinle iletişime geçecek.
        </StatusAlert>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
        {submitting ? 'Gönderiliyor…' : 'Beni Arayın'}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-ink-soft">
        <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
        Hemen konuşmak ister misiniz? <PhoneLink location="simple_form" className="font-semibold text-navy" showIcon={false} />
      </div>
    </form>
  );
}
