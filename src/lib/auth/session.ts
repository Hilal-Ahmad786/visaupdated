/**
 * Admin session (signed cookie).
 *
 * Credentials are validated against the `admin_users` table (see auth/users.ts);
 * on success we store a TAMPER-PROOF snapshot of the user (id/name/email/roles/
 * status) in an HMAC-signed cookie. `getCurrentUser()` reconstructs the user from
 * that snapshot with no per-request DB call, so route guards stay synchronous.
 */
import 'server-only';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

import type { AdminUser, UserStatus } from '@/types/admin';

const COOKIE = 'vv_admin_session';
export const SESSION_COOKIE = COOKIE;

const SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUBMISSION_TOKEN_SECRET ||
  'dev-only-insecure-secret';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/** Minimal, non-sensitive user snapshot carried in the session cookie. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  roleIds: string[];
  status: UserStatus;
}

function sign(user: SessionUser): string {
  const body = Buffer.from(JSON.stringify({ ...user, iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionUser & {
      iat?: number;
    };
    if (typeof data.iat === 'number' && Date.now() - data.iat > SESSION_TTL_MS) return null;
    if (!data.id || !Array.isArray(data.roleIds)) return null;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarInitials: data.avatarInitials,
      roleIds: data.roleIds,
      status: data.status,
    };
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser): { name: string; value: string } {
  return { name: COOKIE, value: sign(user) };
}

/** Server-only: read the current admin user from the session cookie. */
export function getCurrentUser(): AdminUser | null {
  const token = cookies().get(COOKIE)?.value;
  const snapshot = verify(token);
  if (!snapshot) return null;
  return {
    id: snapshot.id,
    name: snapshot.name,
    email: snapshot.email,
    avatarInitials: snapshot.avatarInitials,
    roleIds: snapshot.roleIds,
    status: snapshot.status,
    mfaEnabled: false,
    createdAt: '',
  };
}
