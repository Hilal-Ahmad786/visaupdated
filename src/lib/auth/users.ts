import 'server-only';

import crypto from 'node:crypto';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { adminUsers as adminUsersTable } from '@/db/schema';
import type { SessionUser } from '@/lib/auth/session';

/**
 * DB-backed admin authentication.
 *
 * Accounts live in the `admin_users` table with scrypt-hashed passwords. The
 * first/bootstrap admin is seeded from environment variables — no credentials
 * are hardcoded in source. When DATABASE_URL is unset (local build/preview
 * without a DB) authentication falls back to a direct env-credential check so
 * the login still works, still without any hardcoded secret.
 */

// --- Password hashing (Node scrypt — no external dependency) ---
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  let derived: Buffer;
  try {
    derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  } catch {
    return false;
  }
  const expected = Buffer.from(hashHex, 'hex');
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'VV';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase() || 'VV';
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

// --- Bootstrap admin from env (idempotent, runs once per process) ---
let seedPromise: Promise<void> | null = null;

async function seedAdminFromEnv(): Promise<void> {
  if (!db) return;
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) return;

  const existing = await db
    .select({ id: adminUsersTable.id })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email))
    .limit(1);
  if (existing.length > 0) return;

  const name = process.env.ADMIN_SEED_NAME?.trim() || 'VİS VİZE Yönetici';
  await db.insert(adminUsersTable).values({
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashPassword(password),
    roleIds: ['r-super'],
    status: 'active',
    avatarInitials: initials(name),
  });
}

function ensureSeed(): Promise<void> {
  if (!seedPromise) seedPromise = seedAdminFromEnv().catch(() => {});
  return seedPromise;
}

/**
 * List active admin users (id + name) for assignee pickers etc.
 * DB-backed when configured; falls back to the env bootstrap admin so the
 * picker is never populated with fabricated names.
 */
export async function listActiveAdminUsers(): Promise<{ id: string; name: string }[]> {
  if (db) {
    await ensureSeed();
    const rows = await db
      .select({ id: adminUsersTable.id, name: adminUsersTable.name, status: adminUsersTable.status })
      .from(adminUsersTable)
      .where(eq(adminUsersTable.status, 'active'));
    if (rows.length > 0) return rows.map((r) => ({ id: r.id, name: r.name }));
  }

  const envEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  if (!envEmail) return [];
  const name = process.env.ADMIN_SEED_NAME?.trim() || 'VİS VİZE Yönetici';
  return [{ id: 'env-admin', name }];
}

/**
 * Validate credentials and return a session-safe user snapshot, or null.
 * Never reveals whether the email or the password was the wrong part.
 */
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const normEmail = email.trim().toLowerCase();

  if (db) {
    await ensureSeed();
    const rows = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, normEmail))
      .limit(1);
    const row = rows[0];
    if (!row || row.status !== 'active') return null;
    if (!verifyPassword(password, row.passwordHash)) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      avatarInitials: row.avatarInitials ?? initials(row.name),
      roleIds: (row.roleIds as string[]) ?? ['r-super'],
      status: 'active',
    };
  }

  // No DB configured: env-credential fallback (still not hardcoded).
  const envEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!envEmail || !envPassword) return null;
  if (normEmail !== envEmail || !timingSafeEqualStr(password, envPassword)) return null;

  const name = process.env.ADMIN_SEED_NAME?.trim() || 'VİS VİZE Yönetici';
  return {
    id: 'env-admin',
    name,
    email: envEmail,
    avatarInitials: initials(name),
    roleIds: ['r-super'],
    status: 'active',
  };
}
