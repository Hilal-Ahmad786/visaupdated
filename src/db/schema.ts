import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';

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
