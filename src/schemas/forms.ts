import { z } from 'zod';

/**
 * Shared form schemas. Used by react-hook-form on the client for UX and by the
 * API route on the server for trust. Never rely on client validation alone.
 */

// Turkish phone: accepts 05XX XXX XX XX / +90... / 0850... with spaces/dashes.
const phoneRegex = /^(\+?90|0)?\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Geçerli bir telefon numarası girin.')
  .regex(phoneRegex, 'Telefon numarası formatı geçersiz.');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Lütfen adınızı girin.')
  .max(80, 'Ad çok uzun.');

export const emailSchema = z
  .string()
  .trim()
  .email('Geçerli bir e-posta adresi girin.');

export const consentSchema = z.literal(true, {
  errorMap: () => ({ message: 'Devam etmek için onay vermeniz gerekir.' }),
});

/** Honeypot + timing fields shared by every public form (anti-spam). */
const antiSpam = {
  // Must stay empty; bots fill it.
  website: z.string().max(0).optional().default(''),
  // Client stamps form-render time; server enforces a minimum fill duration.
  renderedAt: z.coerce.number().optional(),
};

// --- Pre-application (multi-step) ---
export const preApplicationSchema = z.object({
  country: z.string().min(1, 'Lütfen bir ülke seçin.'),
  visaPurpose: z.string().min(1, 'Lütfen başvuru amacını seçin.'),
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  city: z.string().trim().max(60).optional().or(z.literal('')),
  applicantCount: z.coerce.number().int().min(1).max(20).default(1),
  travelDate: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  kvkkConsent: consentSchema,
  marketingConsent: z.boolean().optional().default(false),
  ...antiSpam,
});
export type PreApplicationInput = z.infer<typeof preApplicationSchema>;

// --- Appointment request ---
export const appointmentSchema = z.object({
  country: z.string().min(1, 'Lütfen bir ülke seçin.'),
  visaType: z.string().min(1, 'Lütfen vize türünü seçin.'),
  applicantCount: z.coerce.number().int().min(1).max(20).default(1),
  contactMethod: z.enum(['phone', 'whatsapp', 'email']).default('phone'),
  preferredDateFrom: z.string().trim().min(1, 'Başlangıç tarihi seçin.'),
  preferredDateTo: z.string().trim().min(1, 'Bitiş tarihi seçin.'),
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  kvkkConsent: consentSchema,
  marketingConsent: z.boolean().optional().default(false),
  ...antiSpam,
}).refine(
  (d) => !d.preferredDateTo || !d.preferredDateFrom || d.preferredDateTo >= d.preferredDateFrom,
  { message: 'Bitiş tarihi başlangıçtan önce olamaz.', path: ['preferredDateTo'] },
);
export type AppointmentInput = z.infer<typeof appointmentSchema>;

// --- Contact ---
export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  serviceInterest: z.string().trim().optional().or(z.literal('')),
  referenceNumber: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Lütfen mesajınızı yazın.').max(2000),
  kvkkConsent: consentSchema,
  marketingConsent: z.boolean().optional().default(false),
  ...antiSpam,
});
export type ContactInput = z.infer<typeof contactSchema>;

// --- Simple lead (homepage / country / service / blog / 404) ---
export const simpleLeadSchema = z.object({
  country: z.string().trim().optional().or(z.literal('')),
  visaPurpose: z.string().trim().optional().or(z.literal('')),
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  kvkkConsent: consentSchema,
  marketingConsent: z.boolean().optional().default(false),
  ...antiSpam,
});
export type SimpleLeadInput = z.infer<typeof simpleLeadSchema>;

// --- FAQ question ---
export const faqQuestionSchema = z.object({
  question: z.string().trim().min(5, 'Lütfen sorunuzu yazın.').max(500),
  email: emailSchema.optional().or(z.literal('')),
  kvkkConsent: consentSchema,
  ...antiSpam,
});
export type FaqQuestionInput = z.infer<typeof faqQuestionSchema>;

/** Map a lead type to its schema for the unified API route. */
export const leadSchemas = {
  pre_application: preApplicationSchema,
  appointment: appointmentSchema,
  contact: contactSchema,
  country: simpleLeadSchema,
  service: simpleLeadSchema,
  blog: simpleLeadSchema,
  broken_link: simpleLeadSchema,
  faq_question: faqQuestionSchema,
} as const;

export type LeadSchemaKey = keyof typeof leadSchemas;
