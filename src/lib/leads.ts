import crypto from 'node:crypto';

import type { Lead, LeadType, SubmissionResult } from '@/types/lead';

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

// --- Persistence (in-memory for Part 1) ---
const store: Lead[] = [];
export async function persistLead(lead: Lead): Promise<void> {
  store.push(lead);
  // Never log full PII in production; redact for safety.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[lead] ${lead.reference} (${lead.leadType}) stored`);
  }
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
