/**
 * Shared date-range logic for the admin dashboard and Başvurular filters.
 *
 * Presets (Bugün / Dün / Son 7 Gün / Bu Ay / Tümü) plus a custom from–to range.
 *
 * All day boundaries are computed in TURKEY TIME (UTC+3, fixed — Turkey has no
 * DST since 2016) rather than the runtime's local zone. This is critical: the
 * dashboard resolves ranges on the server (UTC on Vercel) while the leads filter
 * resolves them in the browser (Istanbul). Pinning both to UTC+3 makes "Bugün"
 * the exact same 24h window everywhere, so the two screens can no longer
 * disagree on the count.
 */

export type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all' | 'custom';

export const RANGE_LABELS: Record<RangeKey, string> = {
  today: 'Bugün',
  yesterday: 'Dün',
  '7d': 'Son 7 Gün',
  '30d': 'Son 30 Gün',
  month: 'Bu Ay',
  all: 'Tümü',
  custom: 'Özel',
};

/** Preset chips shown in the control, in order. */
export const RANGE_PRESETS: RangeKey[] = ['today', 'yesterday', '7d', 'month', 'all'];

export interface ResolvedRange {
  key: RangeKey;
  /** Inclusive lower bound, or null for open-ended (Tümü). */
  start: Date | null;
  /** Inclusive upper bound, or null for open-ended. */
  end: Date | null;
}

/** Turkey is UTC+3 year-round (no DST since 2016). */
const TR_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Istanbul wall-clock calendar parts for an absolute instant. */
function trParts(d: Date): { y: number; m: number; day: number; weekday: number } {
  const s = new Date(d.getTime() + TR_OFFSET_MS);
  return { y: s.getUTCFullYear(), m: s.getUTCMonth(), day: s.getUTCDate(), weekday: s.getUTCDay() };
}

/** Absolute instant of Istanbul 00:00:00.000 for a yyyy/m/d (m is 0-based). */
function trStartOfYMD(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m, day, 0, 0, 0, 0) - TR_OFFSET_MS);
}
function trEndOfYMD(y: number, m: number, day: number): Date {
  return new Date(Date.UTC(y, m, day, 23, 59, 59, 999) - TR_OFFSET_MS);
}

/** Start of the Istanbul day containing this instant. */
function startOfDay(d: Date): Date {
  const p = trParts(d);
  return trStartOfYMD(p.y, p.m, p.day);
}
function endOfDay(d: Date): Date {
  const p = trParts(d);
  return trEndOfYMD(p.y, p.m, p.day);
}
/** Shift by whole days (safe — no DST in Turkey). */
function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

/** Parse a yyyy-mm-dd date-input value as an Istanbul calendar day, or null. */
function parseDateInput(v: string | undefined | null): { y: number; m: number; day: number } | null {
  if (!v) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, day: Number(match[3]) };
}

/** Resolve a range key (+ optional custom bounds) to absolute Date bounds. */
export function resolveRange(
  key: RangeKey | string | undefined,
  from?: string,
  to?: string,
  now: Date = new Date(),
): ResolvedRange {
  const k = (RANGE_LABELS as Record<string, string>)[key as string] ? (key as RangeKey) : '7d';
  switch (k) {
    case 'today':
      return { key: k, start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday': {
      const y = addDays(now, -1);
      return { key: k, start: startOfDay(y), end: endOfDay(y) };
    }
    case '7d':
      return { key: k, start: startOfDay(addDays(now, -6)), end: endOfDay(now) };
    case '30d':
      return { key: k, start: startOfDay(addDays(now, -29)), end: endOfDay(now) };
    case 'month': {
      const p = trParts(now);
      return { key: k, start: trStartOfYMD(p.y, p.m, 1), end: endOfDay(now) };
    }
    case 'all':
      return { key: k, start: null, end: null };
    case 'custom': {
      const s = parseDateInput(from);
      const e = parseDateInput(to);
      return {
        key: k,
        start: s ? trStartOfYMD(s.y, s.m, s.day) : null,
        end: e ? trEndOfYMD(e.y, e.m, e.day) : null,
      };
    }
    default:
      return { key: '7d', start: startOfDay(addDays(now, -6)), end: endOfDay(now) };
  }
}

/** Whether an ISO timestamp falls within a resolved range. */
export function isInRange(iso: string | Date | undefined | null, range: ResolvedRange): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (range.start && t < range.start.getTime()) return false;
  if (range.end && t > range.end.getTime()) return false;
  return true;
}

const DAY_NAMES_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export interface DayBucket<T> {
  label: string;
  dateISO: string;
  items: T[];
}

/**
 * Group items into the last `days` daily buckets (oldest → newest) by a date
 * accessor. Used for the dashboard's activity chart.
 */
export function dailyBuckets<T>(
  items: T[],
  getDate: (item: T) => string | Date | undefined | null,
  days = 7,
  now: Date = new Date(),
): DayBucket<T>[] {
  const buckets: DayBucket<T>[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = startOfDay(addDays(now, -i));
    const start = day.getTime();
    const end = start + DAY_MS;
    const dayItems = items.filter((it) => {
      const raw = getDate(it);
      if (!raw) return false;
      const t = new Date(raw).getTime();
      return t >= start && t < end;
    });
    buckets.push({
      label: DAY_NAMES_TR[trParts(day).weekday]!,
      dateISO: day.toISOString(),
      items: dayItems,
    });
  }
  return buckets;
}
