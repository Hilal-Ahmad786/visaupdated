import { describe, expect, it } from 'vitest';

import { appointmentSchema, contactSchema, preApplicationSchema } from './forms';

const validBase = {
  country: 'almanya',
  visaPurpose: 'turizm',
  name: 'Ayşe Yılmaz',
  phone: '0532 123 45 67',
  kvkkConsent: true,
};

describe('preApplicationSchema', () => {
  it('accepts a valid submission', () => {
    expect(preApplicationSchema.safeParse(validBase).success).toBe(true);
  });

  it('rejects an invalid phone number', () => {
    const r = preApplicationSchema.safeParse({ ...validBase, phone: '123' });
    expect(r.success).toBe(false);
  });

  it('requires KVKK consent (literal true)', () => {
    const r = preApplicationSchema.safeParse({ ...validBase, kvkkConsent: false });
    expect(r.success).toBe(false);
  });

  it('requires a country', () => {
    const r = preApplicationSchema.safeParse({ ...validBase, country: '' });
    expect(r.success).toBe(false);
  });

  it('coerces applicantCount and defaults to 1', () => {
    const r = preApplicationSchema.safeParse(validBase);
    expect(r.success && r.data.applicantCount).toBe(1);
  });
});

describe('appointmentSchema', () => {
  const appt = {
    country: 'fransa',
    visaType: 'turizm',
    preferredDateFrom: '2026-07-01',
    preferredDateTo: '2026-07-10',
    name: 'Mehmet Demir',
    phone: '05321234567',
    kvkkConsent: true,
  };

  it('accepts a valid appointment request', () => {
    expect(appointmentSchema.safeParse(appt).success).toBe(true);
  });

  it('rejects an end date before the start date', () => {
    const r = appointmentSchema.safeParse({ ...appt, preferredDateTo: '2026-06-01' });
    expect(r.success).toBe(false);
  });
});

describe('contactSchema', () => {
  it('requires a message of sufficient length', () => {
    const r = contactSchema.safeParse({ name: 'Ali Veli', phone: '05321234567', message: 'x', kvkkConsent: true });
    expect(r.success).toBe(false);
  });

  it('accepts a valid contact message', () => {
    const r = contactSchema.safeParse({
      name: 'Ali Veli',
      phone: '0532 123 45 67',
      message: 'Almanya vizesi hakkında bilgi almak istiyorum.',
      kvkkConsent: true,
    });
    expect(r.success).toBe(true);
  });
});
