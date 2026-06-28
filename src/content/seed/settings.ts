import type { SiteSettings } from '@/types/content';

/**
 * Trust metrics are marked `verified: false` until the business confirms real
 * figures. Unverified metrics are NOT rendered (see About page), so the site
 * never shows fabricated statistics. See docs/CONTENT_PLACEHOLDERS.md.
 */
export const siteSettings: SiteSettings = {
  brandShort: 'VİS VİZE',
  brandFull: 'VİS VİZE RANDEVU HİZMETLERİ',
  serviceArea: 'Türkiye Geneli Online Hizmet',
  trustMetrics: [
    { label: 'Desteklenen Ülke', value: '40+', verified: false },
    { label: 'Vize Kategorisi', value: '10+', verified: false },
    { label: 'Ortalama Yanıt Süresi', value: '24 saat', verified: false },
  ],
};
