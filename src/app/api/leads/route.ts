import { NextResponse } from 'next/server';

import {
  generateReference,
  isDuplicate,
  notify,
  persistLead,
  rateLimit,
  signSubmission,
  tooFast,
} from '@/lib/leads';
import { leadSchemas, type LeadSchemaKey } from '@/schemas/forms';
import type { CampaignParams, Lead, LeadType } from '@/types/lead';

export const runtime = 'nodejs';

const LEAD_TYPE_MAP: Record<LeadSchemaKey, LeadType> = {
  pre_application: 'pre_application',
  appointment: 'appointment',
  contact: 'contact',
  country: 'country',
  service: 'service',
  blog: 'blog',
  broken_link: 'broken_link',
  faq_question: 'faq_question',
};

function clientKey(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] ?? 'unknown').trim();
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { leadType, data, campaign, sourcePage, sourceRoute } = (body ?? {}) as {
    leadType?: string;
    data?: unknown;
    campaign?: CampaignParams;
    sourcePage?: string;
    sourceRoute?: string;
  };

  if (!leadType || !(leadType in leadSchemas)) {
    return NextResponse.json({ ok: false, error: 'unknown_lead_type' }, { status: 400 });
  }

  // Rate limit per IP.
  if (!rateLimit(clientKey(req))) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429 },
    );
  }

  const schema = leadSchemas[leadType as LeadSchemaKey];
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    // Never echo back internals; return field-level messages only.
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const values = parsed.data as Record<string, unknown>;

  // Silent anti-spam: honeypot + timing.
  if (typeof values.website === 'string' && values.website.length > 0) {
    // Pretend success to the bot; do not persist.
    return NextResponse.json({ ok: true, reference: 'VV-0000-000000' });
  }
  if (tooFast(values.renderedAt as number | undefined)) {
    return NextResponse.json({ ok: false, error: 'too_fast' }, { status: 422 });
  }

  const phone = String(values.phone ?? '');
  const mappedType = LEAD_TYPE_MAP[leadType as LeadSchemaKey];

  if (phone && isDuplicate(phone, mappedType)) {
    return NextResponse.json({ ok: true, duplicate: true, reference: 'DUP' });
  }

  const reference = generateReference();
  const now = new Date().toISOString();

  const lead: Lead = {
    id: crypto.randomUUID(),
    reference,
    leadType: mappedType,
    status: 'new',
    sourcePage,
    sourceRoute,
    campaign,
    country: values.country as string | undefined,
    visaPurpose: (values.visaPurpose ?? values.visaType) as string | undefined,
    applicantCount: values.applicantCount as number | undefined,
    travelDate: values.travelDate as string | undefined,
    preferredDateFrom: values.preferredDateFrom as string | undefined,
    preferredDateTo: values.preferredDateTo as string | undefined,
    name: String(values.name ?? values.question ?? 'Bilinmiyor'),
    phone,
    email: values.email as string | undefined,
    city: values.city as string | undefined,
    contactMethod: values.contactMethod as Lead['contactMethod'],
    message: (values.message ?? values.question) as string | undefined,
    consent: {
      kvkk: Boolean(values.kvkkConsent),
      marketing: Boolean(values.marketingConsent),
      consentedAt: now,
    },
    createdAt: now,
    updatedAt: now,
    assignedUserId: null,
    notes: null,
  };

  try {
    await persistLead(lead);
    await notify(lead);
  } catch {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }

  const token = signSubmission(reference, mappedType);
  return NextResponse.json({ ok: true, reference, token });
}
