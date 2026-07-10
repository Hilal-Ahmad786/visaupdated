import { describe, expect, it } from 'vitest';

import { isInRange, resolveRange } from './date-range';

describe('resolveRange — Turkey time (UTC+3) boundaries', () => {
  // "Now" = 2026-07-11 10:00 Istanbul (07:00Z).
  const now = new Date('2026-07-11T07:00:00Z');

  it('today spans the Istanbul calendar day, not the UTC one', () => {
    const today = resolveRange('today', undefined, undefined, now);
    // Istanbul Jul 11 00:00 == 2026-07-10T21:00:00Z
    expect(today.start?.toISOString()).toBe('2026-07-10T21:00:00.000Z');
    expect(today.end?.toISOString()).toBe('2026-07-11T20:59:59.999Z');
  });

  it('counts an after-midnight-Istanbul lead as today (the reported bug)', () => {
    const today = resolveRange('today', undefined, undefined, now);
    // 21:30Z == Istanbul Jul 11 00:30 → belongs to today.
    expect(isInRange('2026-07-10T21:30:00Z', today)).toBe(true);
    // 20:30Z == Istanbul Jul 10 23:30 → belongs to yesterday, not today.
    expect(isInRange('2026-07-10T20:30:00Z', today)).toBe(false);
  });

  it('yesterday is the previous Istanbul day', () => {
    const y = resolveRange('yesterday', undefined, undefined, now);
    expect(y.start?.toISOString()).toBe('2026-07-09T21:00:00.000Z');
    expect(y.end?.toISOString()).toBe('2026-07-10T20:59:59.999Z');
  });

  it('custom from/to are Istanbul days', () => {
    const r = resolveRange('custom', '2026-07-01', '2026-07-01', now);
    expect(r.start?.toISOString()).toBe('2026-06-30T21:00:00.000Z');
    expect(r.end?.toISOString()).toBe('2026-07-01T20:59:59.999Z');
  });

  it('all is open-ended', () => {
    const r = resolveRange('all', undefined, undefined, now);
    expect(r.start).toBeNull();
    expect(r.end).toBeNull();
  });
});
