/**
 * Normalized lead model. Public forms all funnel into this shape so the Part 2
 * admin lead-management screens have a single record type to build on.
 */

export type LeadType =
  | 'pre_application'
  | 'appointment'
  | 'contact'
  | 'country'
  | 'service'
  | 'faq_question'
  | 'blog'
  | 'broken_link'
  | 'newsletter';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'appointment_scheduled'
  | 'documents_requested'
  | 'in_progress'
  | 'completed'
  | 'lost'
  | 'spam';

export type ContactMethod = 'phone' | 'whatsapp' | 'email';

export interface CampaignParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
}

/**
 * Google Ads landing-page attribution captured with a lead. These identify the
 * exact campaign / ad group / page a lead came from without carrying any PII.
 */
export interface LeadAttribution {
  pageSlug?: string;
  pageTitle?: string;
  campaignName?: string;
  campaignId?: string;
  adGroupName?: string;
  adGroupId?: string;
  landingCategory?: string;
  country?: string;
  visaType?: string;
}

export interface Lead {
  id: string;
  reference: string; // e.g. VV-2026-000123 (never exposes the raw id)
  leadType: LeadType;
  status: LeadStatus;

  sourcePage?: string;
  sourceRoute?: string;
  campaign?: CampaignParams;
  attribution?: LeadAttribution;

  country?: string;
  visaPurpose?: string;
  applicantStatus?: string;
  applicantCount?: number;
  travelDate?: string;
  preferredDateFrom?: string;
  preferredDateTo?: string;

  name: string;
  phone: string;
  email?: string;
  city?: string;
  contactMethod?: ContactMethod;
  contactTime?: string;
  message?: string;
  previousRejection?: boolean;
  previousAppointmentAttempt?: boolean;

  consent: {
    kvkk: boolean;
    marketing: boolean;
    consentedAt: string;
  };

  createdAt: string;
  updatedAt: string;

  // Admin workflow (set from the panel).
  assignedUserId?: string | null;
  notes?: LeadNoteData[] | null;
  archivedAt?: string | null;
  metadata?: Record<string, unknown>;
}

/** A single internal note attached to a lead (stored as JSONB). */
export interface LeadNoteData {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

/** Result returned to the client after a submission attempt. */
export interface SubmissionResult {
  ok: boolean;
  reference?: string;
  /** Signed token proving a verified submission, consumed by /tesekkurler. */
  token?: string;
  duplicate?: boolean;
  error?: string;
}
