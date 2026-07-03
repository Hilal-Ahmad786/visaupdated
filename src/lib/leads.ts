import crypto from 'node:crypto';

import { desc } from 'drizzle-orm';

import { db } from '@/db';
import { leads as leadsTable } from '@/db/schema';
import type {
  CampaignParams,
  Lead,
  LeadAttribution,
  LeadType,
  SubmissionResult,
} from '@/types/lead';

/**
 * Server-side lead handling primitives.
 *
 * Part 1 persists leads to an in-memory store and logs them; Part 2 will swap
 * `persistLead` for a database write and `notify` for the real email provider.
 * The signed submission token is what makes /tesekkurler trustworthy — the
 * thank-you page only shows success (and fires conversions) for a valid token.
 */

const SECRET = process.env.SUBMISSION_TOKEN_SECRET || 'dev-only-insecure-secret';

// --- Reference numbers: VV-YYYY-NNNNNN (never exposes the raw id) ---
let counter = 0;
export function generateReference(date = new Date()): string {
  counter += 1;
  const year = date.getFullYear();
  const seq = String(counter).padStart(6, '0');
  return `VV-${year}-${seq}`;
}

// --- Signed submission token (HMAC) ---
export function signSubmission(reference: string, leadType: LeadType): string {
  const payload = `${reference}.${leadType}.${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${Buffer.from(payload).toString('base64url')}.${sig}`;
}

export function verifySubmission(
  token: string | undefined | null,
): { reference: string; leadType: string } | null {
  if (!token) return null;
  const [encodedPayload, sig] = token.split('.');
  if (!encodedPayload || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  // Constant-time comparison.
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  const [reference, leadType, ts] = payload.split('.');
  if (!reference || !leadType || !ts) return null;
  // Token valid for 1 hour.
  if (Date.now() - Number(ts) > 60 * 60 * 1000) return null;
  return { reference, leadType };
}

// --- Naive in-memory rate limiter (per IP). Replace with Redis/Upstash in prod. ---
const hits = new Map<string, { count: number; resetAt: number }>();
const MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count += 1;
  return true;
}

// --- Duplicate detection (same phone + leadType within a short window) ---
const recent = new Map<string, number>();
const DUP_WINDOW = 2 * 60 * 1000;
export function isDuplicate(phone: string, leadType: LeadType): boolean {
  const key = `${leadType}:${phone}`;
  const last = recent.get(key);
  const now = Date.now();
  if (last && now - last < DUP_WINDOW) return true;
  recent.set(key, now);
  return false;
}

// --- Persistence ---
// Writes to Neon Postgres when DATABASE_URL is configured; otherwise falls back
// to an in-memory store (local dev / preview without a DB). The admin panel reads
// through getAllLeads() so submitted forms appear regardless of backend.
const store: Lead[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function persistLead(lead: Lead): Promise<void> {
  if (db) {
    const row = {
      id: lead.id,
      reference: lead.reference,
      leadType: lead.leadType,
      status: lead.status,
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? null,
      city: lead.city ?? null,
      country: lead.country ?? null,
      visaPurpose: lead.visaPurpose ?? null,
      applicantCount: lead.applicantCount ?? null,
      message: lead.message ?? null,
      travelDate: lead.travelDate ?? null,
      preferredDateFrom: lead.preferredDateFrom ?? null,
      preferredDateTo: lead.preferredDateTo ?? null,
      contactMethod: lead.contactMethod ?? null,
      sourcePage: lead.sourcePage ?? null,
      sourceRoute: lead.sourceRoute ?? null,
      campaign: lead.campaign ?? null,
      attribution: lead.attribution ?? null,
      consent: lead.consent,
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt),
    };
    // Retry a couple of times: a suspended Neon compute can fail the first
    // query while it cold-starts. Never drop a lead over a transient wake-up.
    let lastErr: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await db.insert(leadsTable).values(row);
        return;
      } catch (err) {
        lastErr = err;
        await sleep(400 * (attempt + 1));
      }
    }
    throw lastErr;
  }
  store.push(lead);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[lead] ${lead.reference} (${lead.leadType}) stored (in-memory)`);
  }
}

interface LeadRow {
  id: string;
  reference: string;
  leadType: string;
  status: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  country: string | null;
  visaPurpose: string | null;
  applicantCount: number | null;
  message: string | null;
  travelDate: string | null;
  preferredDateFrom: string | null;
  preferredDateTo: string | null;
  contactMethod: string | null;
  sourcePage: string | null;
  sourceRoute: string | null;
  campaign: unknown;
  attribution: unknown;
  consent: unknown;
  createdAt: Date;
  updatedAt: Date;
}

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    reference: row.reference,
    leadType: row.leadType as LeadType,
    status: row.status as Lead['status'],
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    city: row.city ?? undefined,
    country: row.country ?? undefined,
    visaPurpose: row.visaPurpose ?? undefined,
    applicantCount: row.applicantCount ?? undefined,
    message: row.message ?? undefined,
    travelDate: row.travelDate ?? undefined,
    preferredDateFrom: row.preferredDateFrom ?? undefined,
    preferredDateTo: row.preferredDateTo ?? undefined,
    contactMethod: (row.contactMethod ?? undefined) as Lead['contactMethod'],
    sourcePage: row.sourcePage ?? undefined,
    sourceRoute: row.sourceRoute ?? undefined,
    campaign: (row.campaign ?? undefined) as CampaignParams | undefined,
    attribution: (row.attribution ?? undefined) as LeadAttribution | undefined,
    consent: row.consent as Lead['consent'],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    assignedUserId: null,
    notes: null,
  };
}

/** All persisted leads, newest first. Reads the DB when configured. */
export async function getAllLeads(): Promise<Lead[]> {
  if (db) {
    const rows = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
    return (rows as LeadRow[]).map(rowToLead);
  }
  return [...store].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function _debugAllLeads(): Lead[] {
  return store;
}

// --- Notification stub ---
export async function notify(lead: Lead): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER;
  if (!provider) return; // Email disabled until configured.
  // TODO(Part 2): integrate transactional provider. Do not include full message PII.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[notify] would email lead ${lead.reference} via ${provider}`);
  }
}

/** Anti-spam timing check: reject submissions faster than a human could fill. */
export function tooFast(renderedAt: number | undefined): boolean {
  if (!renderedAt) return false; // missing timestamp is tolerated (don't block real users)
  const elapsed = Date.now() - renderedAt;
  return elapsed >= 0 && elapsed < 2500; // < 2.5s is almost certainly a bot
}

export type { SubmissionResult };
