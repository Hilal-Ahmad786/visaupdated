import 'server-only';

import { _debugAllLeads } from '@/lib/leads';
import type { AdminLead, LeadPriority } from '@/types/admin';
import type { Lead } from '@/types/lead';

/**
 * Bridges public form submissions (the `Lead` shape persisted by /api/leads)
 * into the richer admin `AdminLead` CRM shape, so every submitted form — landing
 * pages, contact, pre-application, appointment, etc. — appears on the admin
 * "Başvurular" screen alongside the demo data.
 *
 * NOTE (Part 1): submissions are held in an in-memory store, so this reflects
 * leads received since the server last started. Swap `_debugAllLeads()` for a DB
 * query (Neon/Drizzle) to make them durable — the mapping below stays the same.
 */

const STATUS_TO_STAGE: Record<string, string> = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified',
  in_progress: 'qualified',
  documents_requested: 'documents',
  appointment_scheduled: 'appointment',
  completed: 'completed',
  lost: 'lost',
  spam: 'spam',
};

function sourceLabel(lead: Lead): string {
  const c = lead.campaign;
  const hasAds = Boolean(
    c?.gclid || c?.gbraid || c?.wbraid || c?.utm_medium === 'cpc' || c?.utm_source === 'google',
  );
  if (hasAds) return 'Google Ads';
  if (c?.utm_source) return c.utm_source;
  return 'Web Sitesi';
}

function attributionSummary(lead: Lead): string | null {
  const a = lead.attribution;
  const parts: string[] = [];
  if (a?.campaignName) parts.push(`Kampanya: ${a.campaignName}`);
  if (a?.adGroupName) parts.push(`Reklam grubu: ${a.adGroupName}`);
  if (a?.pageSlug) parts.push(`Sayfa: /${a.pageSlug}`);
  else if (lead.sourceRoute) parts.push(`Sayfa: ${lead.sourceRoute}`);
  if (lead.campaign?.gclid) parts.push(`gclid: ${lead.campaign.gclid}`);
  return parts.length ? parts.join(' · ') : null;
}

export function toAdminLead(lead: Lead): AdminLead {
  const summary = attributionSummary(lead);
  return {
    id: lead.id,
    reference: lead.reference,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? '',
    city: lead.city,
    country: lead.country ?? '—',
    service: lead.attribution?.landingCategory,
    visaType: lead.visaPurpose,
    status: lead.status,
    stageId: STATUS_TO_STAGE[lead.status] ?? 'new',
    pipelineId: 'p-default',
    priority: 'normal' as LeadPriority,
    source: sourceLabel(lead),
    campaign: lead.campaign
      ? {
          utm_source: lead.campaign.utm_source,
          utm_medium: lead.campaign.utm_medium,
          utm_campaign: lead.campaign.utm_campaign,
        }
      : undefined,
    lastActivityAt: lead.createdAt,
    createdAt: lead.createdAt,
    ageInStageDays: 0,
    consent: lead.consent,
    notes: [],
    files: [],
    followUps: [],
    communications: [],
    timeline: [
      {
        id: `${lead.id}-t1`,
        at: lead.createdAt,
        actor: 'Sistem',
        text: summary
          ? `Başvuru web formundan oluşturuldu. ${summary}`
          : 'Başvuru web formundan oluşturuldu.',
      },
    ],
  };
}

/** All real submissions received this session, newest first, as AdminLeads. */
export function getSubmittedAdminLeads(): AdminLead[] {
  return _debugAllLeads()
    .map(toAdminLead)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
