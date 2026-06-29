import { createHmac } from 'node:crypto';

import type { NextRequest } from 'next/server';

import { isDbConfigured, requireDb } from '@/db';
import { clickEvents } from '@/db/schema';

export const runtime = 'nodejs';

const NO_CONTENT = new Response(null, { status: 204 });
const ALLOWED = new Set(['phone_click', 'whatsapp_click', 'quote_click', 'chat_open', 'page_view']);

/** Skip obvious bots/crawlers so visit counts reflect real people. */
const BOT_RE = /bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebook|embedly|headless|lighthouse|ahrefs|semrush|pingdom|uptime|monitor|preview/i;

function hashIp(ip: string): string {
  const pepper = process.env.CLICK_PEPPER || 'click-pepper';
  return createHmac('sha256', pepper).update(ip).digest('hex').slice(0, 16);
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return (xff.split(',')[0] ?? '').trim();
  return req.headers.get('x-real-ip') || '';
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured) return NO_CONTENT;

  let body: Record<string, unknown> = {};
  try {
    const t = await req.text();
    body = t ? JSON.parse(t) : {};
  } catch {
    return NO_CONTENT;
  }

  const event = String(body.event ?? '').trim();
  if (!ALLOWED.has(event)) return NO_CONTENT;

  const userAgent = req.headers.get('user-agent') || '';
  if (event === 'page_view' && BOT_RE.test(userAgent)) return NO_CONTENT;

  const ip = clientIp(req);
  const ipHash = ip && ip !== '0.0.0.0' ? hashIp(ip) : null;

  try {
    await requireDb()
      .insert(clickEvents)
      .values({
        name: event,
        location: typeof body.location === 'string' ? body.location.slice(0, 100) : null,
        pageUrl: typeof body.path === 'string' ? body.path.slice(0, 500) : null,
        sessionId: typeof body.sessionId === 'string' ? body.sessionId.slice(0, 100) : null,
        ipHash,
        userAgent: userAgent.slice(0, 300) || null,
      });
  } catch (e) {
    console.error('[track/click]', e instanceof Error ? e.message : e);
  }

  return NO_CONTENT;
}
