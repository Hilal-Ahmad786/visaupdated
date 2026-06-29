import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const url = process.env.DATABASE_URL;

/** True only when a Neon connection string is configured. */
export const isDbConfigured = Boolean(url);

/**
 * Drizzle client, or null when DATABASE_URL is unset so dev/build works
 * without a database. Use requireDb() in code paths that must have it.
 */
export const db = url ? drizzle(neon(url), { schema }) : null;

export function requireDb() {
  if (!db) throw new Error('DATABASE_URL not configured');
  return db;
}
