import type { Testimonial } from '@/types/content';

/**
 * Reviews are intentionally `verified: false` until real, consented customer
 * testimonials are provided. The repository filters out unverified reviews, so
 * the public site shows NONE rather than fabricated ones. Replace with verified
 * content (see docs/CONTENT_PLACEHOLDERS.md) and set verified/status accordingly.
 */
export const testimonials: Testimonial[] = [];
