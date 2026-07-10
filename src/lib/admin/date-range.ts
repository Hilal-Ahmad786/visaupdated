/**
 * Shared date-range logic for the admin dashboard and Başvurular filters.
 *
 * Presets (Bugün / Dün / Son 7 Gün / Bu Ay / Tümü) plus a custom from–to range.
 * Day boundaries use the server's local time; on Vercel that is UTC, which is
 * close enough for lead analytics. Values are resolved to absolute Date bounds
 * so both the server pages and the client filters agree.
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

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Parse a yyyy-mm-dd value from a date input, or null. */
function parseDateInput(v: string | undefined | null): Date | null {
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
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
    case 'month':
      return { key: k, start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: endOfDay(now) };
    case 'all':
      return { key: k, start: null, end: null };
    case 'custom': {
      const s = parseDateInput(from);
      const e = parseDateInput(to);
      return { key: k, start: s ? startOfDay(s) : null, end: e ? endOfDay(e) : null };
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
    const end = start + 24 * 60 * 60 * 1000;
    const dayItems = items.filter((it) => {
      const raw = getDate(it);
      if (!raw) return false;
      const t = new Date(raw).getTime();
      return t >= start && t < end;
    });
    buckets.push({ label: DAY_NAMES_TR[day.getDay()]!, dateISO: day.toISOString(), items: dayItems });
  }
  return buckets;
}
