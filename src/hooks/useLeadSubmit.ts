'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';
import { readCampaignParams } from '@/lib/attribution';
import type { LeadSchemaKey } from '@/schemas/forms';
import type { LeadAttribution, SubmissionResult } from '@/types/lead';

interface UseLeadSubmitOptions {
  leadType: LeadSchemaKey;
  /** Analytics event fired on confirmed success (e.g. application_complete). */
  successEvent?: AnalyticsEventName;
  /** Where to redirect after success. The verified token is appended. */
  redirectTo?: string;
  /** Non-PII landing-page attribution persisted with the lead. */
  attribution?: LeadAttribution;
}

export function useLeadSubmit({
  leadType,
  successEvent,
  redirectTo = '/tesekkurler',
  attribution,
}: UseLeadSubmitOptions) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const submit = useCallback(
    async (data: Record<string, unknown>): Promise<SubmissionResult> => {
      if (submitting) return { ok: false, error: 'in_progress' }; // duplicate-click guard
      setSubmitting(true);
      setServerError(null);
      setDuplicate(false);

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadType,
            data,
            campaign: readCampaignParams(),
            attribution,
            sourcePage: typeof document !== 'undefined' ? document.title : undefined,
            sourceRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
          }),
        });

        const result = (await res.json()) as SubmissionResult & { error?: string };

        if (res.status === 429) {
          setServerError('Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.');
          return { ok: false, error: 'rate_limited' };
        }
        if (!res.ok || !result.ok) {
          setServerError(
            'Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin veya bizi arayın.',
          );
          return { ok: false, error: result.error ?? 'server_error' };
        }

        if (result.duplicate) {
          setDuplicate(true);
          trackEvent({
            name: 'form_submit',
            category: 'conversion',
            metadata: { form_name: leadType, duplicate: true },
          });
          return result;
        }

        trackEvent({
          name: 'form_submit',
          category: 'conversion',
          metadata: { form_name: leadType },
        });
        if (successEvent) {
          trackEvent({
            name: successEvent,
            category: 'conversion',
            metadata: { form_name: leadType },
          });
        }

        // Redirect to verified thank-you page with the signed token + reference.
        const params = new URLSearchParams({
          ref: result.reference ?? '',
          t: result.token ?? '',
          type: leadType,
        });
        router.push(`${redirectTo}?${params.toString()}`);
        return result;
      } catch {
        setServerError('Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.');
        return { ok: false, error: 'network' };
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, leadType, successEvent, redirectTo, router, attribution],
  );

  return { submit, submitting, serverError, duplicate };
}
