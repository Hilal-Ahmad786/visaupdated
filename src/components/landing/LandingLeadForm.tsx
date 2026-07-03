'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import {
  ConsentCheckbox,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/fields';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import { StatusAlert } from '@/components/ui/states';
import { visaPurposeOptions, type CountryOption } from '@/config/form-options';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackEvent } from '@/lib/analytics';
import { simpleLeadSchema, type SimpleLeadInput } from '@/schemas/forms';
import type { LeadAttribution } from '@/types/lead';

export interface LandingFormTracking {
  campaign_name: string;
  ad_group_name: string;
  country: string;
  visa_type: string;
  page_slug: string;
}

/**
 * The prominent landing-page lead form. Reuses the site's shared form fields,
 * validation schema and submission workflow (`useLeadSubmit` → `/api/leads`) —
 * there is no separate backend. Country and visa type are preselected from the
 * page but remain user-editable. Non-PII campaign attribution rides along with
 * the lead; analytics events describe the funnel without any PII.
 */
export function LandingLeadForm({
  countryOptions,
  presetCountry,
  presetVisaPurpose,
  title,
  description,
  submitLabel,
  attribution,
  tracking,
}: {
  countryOptions: CountryOption[];
  presetCountry: string;
  presetVisaPurpose: string;
  title: string;
  description: string;
  submitLabel: string;
  attribution: LeadAttribution;
  tracking: LandingFormTracking;
}) {
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({
    leadType: 'country',
    attribution,
  });
  const startedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleLeadInput>({
    resolver: zodResolver(simpleLeadSchema),
    defaultValues: {
      country: presetCountry,
      visaPurpose: presetVisaPurpose,
      renderedAt: Date.now(),
      marketingConsent: false,
    },
  });

  useEffect(() => {
    trackEvent({ name: 'lead_form_view', category: 'conversion', metadata: { ...tracking } });
  }, [tracking]);

  const handleFirstInteraction = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent({ name: 'lead_form_start', category: 'conversion', metadata: { ...tracking } });
  };

  const onSubmit = async (data: SimpleLeadInput) => {
    const result = await submit(data);
    if (result.ok && !result.duplicate) {
      trackEvent({
        name: 'lead_form_submit_success',
        category: 'conversion',
        metadata: { ...tracking },
      });
    } else if (!result.ok) {
      trackEvent({
        name: 'lead_form_submit_error',
        category: 'conversion',
        metadata: { ...tracking, reason: result.error ?? 'unknown' },
      });
    }
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
          <SelectField
            label="Hedef Ülke"
            placeholder="Ülke seçin"
            options={countryOptions}
            defaultValue={presetCountry}
            {...register('country')}
            error={errors.country?.message}
          />
          <SelectField
            label="Vize / Başvuru Türü"
            placeholder="Tür seçin"
            options={visaPurposeOptions}
            defaultValue={presetVisaPurpose}
            {...register('visaPurpose')}
            error={errors.visaPurpose?.message}
          />
        </div>
        <TextAreaField
          label="Mesajınız (opsiyonel)"
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
            Telefonla başvurun:{' '}
            <PhoneLink
              location="landing_form"
              className="font-semibold text-navy"
              showIcon={false}
            />
          </span>
        </div>
      </div>
    </form>
  );
}
