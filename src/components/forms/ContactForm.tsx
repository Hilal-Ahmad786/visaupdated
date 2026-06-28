'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ConsentCheckbox, Honeypot, SelectField, TextAreaField, TextField } from '@/components/forms/fields';
import { KvkkLabel, MarketingLabel } from '@/components/forms/ConsentLabels';
import { StatusAlert } from '@/components/ui/states';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { contactSchema, type ContactInput } from '@/schemas/forms';

const serviceInterestOptions = [
  { value: 'vize-danismanligi', label: 'Vize Danışmanlığı' },
  { value: 'evrak-kontrolu', label: 'Evrak Kontrolü' },
  { value: 'randevu-destegi', label: 'Randevu Desteği' },
  { value: 'diger', label: 'Diğer' },
];

export function ContactForm() {
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({
    leadType: 'contact',
    successEvent: 'contact_request',
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { renderedAt: Date.now(), marketingConsent: false },
  });

  const showReference = watch('serviceInterest') === 'randevu-destegi';

  return (
    <form onSubmit={handleSubmit((d) => submit(d))} className="relative space-y-4" noValidate aria-label="İletişim formu">
      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Ad Soyad" required autoComplete="name" {...register('name')} error={errors.name?.message} />
        <TextField label="Telefon" required inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX" {...register('phone')} error={errors.phone?.message} />
        <TextField label="E-posta (opsiyonel)" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <SelectField label="İlgilendiğiniz Hizmet" placeholder="Seçin (opsiyonel)" options={serviceInterestOptions} {...register('serviceInterest')} error={errors.serviceInterest?.message} />
      </div>
      {showReference && (
        <TextField label="Referans / Takip Numarası (opsiyonel)" {...register('referenceNumber')} error={errors.referenceNumber?.message} />
      )}
      <TextAreaField label="Mesajınız" required rows={5} {...register('message')} error={errors.message?.message} />
      <ConsentCheckbox required {...register('kvkkConsent')} label={<KvkkLabel />} error={errors.kvkkConsent?.message} />
      <ConsentCheckbox {...register('marketingConsent')} label={<MarketingLabel />} />
      {serverError && <StatusAlert tone="error">{serverError}</StatusAlert>}
      {duplicate && <StatusAlert tone="info" title="Mesajınız alındı">Kısa süre önce sizden bir mesaj aldık; en kısa sürede dönüş yapacağız.</StatusAlert>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
        {submitting ? 'Gönderiliyor…' : 'Mesajı Gönder'}
      </button>
    </form>
  );
}
