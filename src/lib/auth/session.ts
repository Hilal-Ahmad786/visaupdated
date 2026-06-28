/**
 * Mock authentication & session (Part 2).
 *
 * A signed cookie holds the demo user id. This is a CLEAN SEAM: replace
 * `getCurrentUser`, `signIn`, and `signOut` with a real auth provider
 * (NextAuth/Clerk/custom) without touching the screens or permission API.
 *
 * Demo credentials are documented in the README, NOT shown in the UI.
 */
import 'server-only';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

import type { AdminUser } from '@/types/admin';
import { adminUsers } from '@/lib/data/mock-users';

const COOKIE = 'vv_admin_session';
const SECRET = process.env.SUBMISSION_TOKEN_SECRET || 'dev-only-insecure-secret';

// Demo accounts: email -> userId. Password is the same demo value for all (see README).
export const DEMO_PASSWORD = 'visvize-demo';
const DEMO_ACCOUNTS: Record<string, string> = {
  'yonetici@visvize.com': 'u-admin',
  'editor@visvize.com': 'u-editor',
  'temsilci@visvize.com': 'u-agent',
};

function sign(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${Buffer.from(payload).toString('base64url')}.${sig}`;
}

function verify(token: string | undefined): string | null {
  if (!token) return null;
  const [enc, sig] = token.split('.');
  if (!enc || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(enc, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  return payload.split('.')[0] ?? null;
}

/** Validate demo credentials. Returns the user id or null. Never logs the password. */
export function checkCredentials(email: string, password: string): string | null {
  const id = DEMO_ACCOUNTS[email.trim().toLowerCase()];
  if (!id) return null;
  if (password !== DEMO_PASSWORD) return null;
  return id;
}

export function createSessionToken(userId: string): { name: string; value: string } {
  return { name: COOKIE, value: sign(userId) };
}

export const SESSION_COOKIE = COOKIE;

/** Server-only: read the current admin user from the session cookie. */
export function getCurrentUser(): AdminUser | null {
  const token = cookies().get(COOKIE)?.value;
  const userId = verify(token);
  if (!userId) return null;
  return adminUsers.find((u) => u.id === userId) ?? null;
}
