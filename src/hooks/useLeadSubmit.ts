'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';
import { readCampaignParams } from '@/lib/attribution';
import { trackLeadSubmit } from '@/lib/tracking/events';
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
  /** GTM form identity for the `vis_lead_submit` conversion event. */
  formId?: string;
  formName?: string;
  /** Stable lead_type label (e.g. online_on_basvuru, contact_form). */
  leadTypeLabel?: string;
}

/** Read a trimmed string field from arbitrary form data, or undefined. */
function str(data: Record<string, unknown>, key: string): string | undefined {
  const v = data[key];
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

export function useLeadSubmit({
  leadType,
  successEvent,
  redirectTo = '/tesekkurler',
  attribution,
  formId,
  formName,
  leadTypeLabel,
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

        // PRIMARY CONVERSION: fire `vis_lead_submit` exactly once, ONLY here on
        // confirmed, non-duplicate API success — never on click/validation/error.
        // Fires before redirect so the in-memory user_data is available for
        // Google Ads Enhanced Conversions (routed via GTM, not GA4). A refresh
        // of /tesekkurler cannot re-fire it. See docs/tracking-setup.md.
        trackLeadSubmit({
          form_id: formId ?? leadType,
          form_name: formName ?? leadType,
          lead_type: leadTypeLabel ?? leadType,
          country: str(data, 'country'),
          visa_type: str(data, 'visaPurpose') ?? str(data, 'visaType'),
          name: str(data, 'name'),
          email: str(data, 'email'),
          phone: str(data, 'phone'),
        });

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
    [
      submitting,
      leadType,
      successEvent,
      redirectTo,
      router,
      attribution,
      formId,
      formName,
      leadTypeLabel,
    ],
  );

  return { submit, submitting, serverError, duplicate };
}
