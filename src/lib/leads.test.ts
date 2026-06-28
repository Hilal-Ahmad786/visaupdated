import { describe, expect, it } from 'vitest';

import { generateReference, isDuplicate, signSubmission, tooFast, verifySubmission } from './leads';

describe('reference numbers', () => {
  it('match the VV-YYYY-NNNNNN format and never expose raw ids', () => {
    const ref = generateReference(new Date('2026-06-28'));
    expect(ref).toMatch(/^VV-2026-\d{6}$/);
  });
});

describe('submission token (thank-you verification)', () => {
  it('verifies a freshly signed token and returns reference + type', () => {
    const token = signSubmission('VV-2026-000001', 'pre_application');
    const result = verifySubmission(token);
    expect(result).not.toBeNull();
    expect(result?.reference).toBe('VV-2026-000001');
    expect(result?.leadType).toBe('pre_application');
  });

  it('rejects a missing token (direct thank-you access)', () => {
    expect(verifySubmission(undefined)).toBeNull();
    expect(verifySubmission('')).toBeNull();
  });

  it('rejects a tampered token', () => {
    const token = signSubmission('VV-2026-000002', 'contact');
    const tampered = token.slice(0, -3) + 'aaa';
    expect(verifySubmission(tampered)).toBeNull();
  });

  it('rejects a garbage token', () => {
    expect(verifySubmission('not.a.valid.token')).toBeNull();
  });
});

describe('anti-spam helpers', () => {
  it('flags suspiciously fast submissions', () => {
    expect(tooFast(Date.now())).toBe(true); // ~0ms elapsed
  });

  it('does not flag human-paced submissions', () => {
    expect(tooFast(Date.now() - 5000)).toBe(false);
  });

  it('tolerates a missing timestamp (does not block real users)', () => {
    expect(tooFast(undefined)).toBe(false);
  });

  it('detects a duplicate phone within the window', () => {
    expect(isDuplicate('05550001122', 'contact')).toBe(false); // first time
    expect(isDuplicate('05550001122', 'contact')).toBe(true); // immediate repeat
  });
});
