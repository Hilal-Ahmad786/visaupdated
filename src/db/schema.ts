import { pgTable, uuid, text, timestamp, index, integer, jsonb } from 'drizzle-orm/pg-core';

/**
 * Leads — every public form submission (landing pages, contact, pre-application,
 * appointment, etc.). Queryable scalar columns for the admin list/filters, plus
 * JSONB for the flexible campaign / attribution / consent blobs.
 */
export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reference: text('reference').notNull(),
    leadType: text('lead_type').notNull(),
    status: text('status').notNull().default('new'),

    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    city: text('city'),
    country: text('country'),
    visaPurpose: text('visa_purpose'),
    applicantCount: integer('applicant_count'),
    message: text('message'),

    travelDate: text('travel_date'),
    preferredDateFrom: text('preferred_date_from'),
    preferredDateTo: text('preferred_date_to'),
    contactMethod: text('contact_method'),

    sourcePage: text('source_page'),
    sourceRoute: text('source_route'),
    campaign: jsonb('campaign'),
    attribution: jsonb('attribution'),
    consent: jsonb('consent').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('leads_status_idx').on(t.status),
    index('leads_created_idx').on(t.createdAt),
    index('leads_phone_idx').on(t.phone),
  ],
);

/**
 * Admin users — authenticated staff accounts. Passwords are scrypt-hashed
 * (`salt:hash` hex); never stored in plain text. The bootstrap admin is seeded
 * from ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD env vars (nothing hardcoded).
 */
export const adminUsers = pgTable(
  'admin_users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    roleIds: jsonb('role_ids').notNull(),
    status: text('status').notNull().default('active'),
    avatarInitials: text('avatar_initials'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('admin_users_email_idx').on(t.email)],
);

export const clickEvents = pgTable(
  'click_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(), // phone_click | whatsapp_click | quote_click | chat_open
    location: text('location'), // button placement (hero, header, floating, footer...)
    pageUrl: text('page_url'),
    sessionId: text('session_id'),
    ipHash: text('ip_hash'),
    userAgent: text('user_agent'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('click_events_name_idx').on(t.name),
    index('click_events_occurred_idx').on(t.occurredAt),
  ],
);
