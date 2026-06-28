'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { ConsentCheckbox, Honeypot, TextAreaField, TextField } from '@/components/forms/fields';
import { KvkkLabel } from '@/components/forms/ConsentLabels';
import { StatusAlert } from '@/components/ui/states';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { faqQuestionSchema, type FaqQuestionInput } from '@/schemas/forms';

export function FaqQuestionForm() {
  const { submit, submitting, serverError, duplicate } = useLeadSubmit({ leadType: 'faq_question' });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FaqQuestionInput>({
    resolver: zodResolver(faqQuestionSchema),
    defaultValues: { renderedAt: Date.now() },
  });

  if (duplicate) {
    return <StatusAlert tone="success" title="Sorunuz alındı">Teşekkürler! Sorunuzu inceleyip yanıtlayacağız.</StatusAlert>;
  }

  return (
    <form onSubmit={handleSubmit((d) => submit(d))} className="relative space-y-4" noValidate aria-label="Soru gönderme formu">
      <Honeypot register={register('website')} />
      <input type="hidden" {...register('renderedAt')} />
      <TextAreaField label="Sorunuz" required {...register('question')} error={errors.question?.message} />
      <TextField label="E-posta (yanıt için, opsiyonel)" type="email" {...register('email')} error={errors.email?.message} />
      <ConsentCheckbox required {...register('kvkkConsent')} label={<KvkkLabel />} error={errors.kvkkConsent?.message} />
      {serverError && <StatusAlert tone="error">{serverError}</StatusAlert>}
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
        {submitting ? 'Gönderiliyor…' : 'Soruyu Gönder'}
      </button>
    </form>
  );
}
