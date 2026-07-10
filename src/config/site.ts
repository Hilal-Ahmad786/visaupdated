/**
 * Centralized site configuration.
 *
 * Contact details are sourced from environment variables so they can be managed
 * per-deploy today and migrated to the Part 2 admin panel later WITHOUT touching
 * components. Never hardcode raw phone/WhatsApp values inside components — import
 * `contactSettings` instead.
 *
 * All values fall back to clearly-identifiable placeholders. See
 * docs/CONTENT_PLACEHOLDERS.md for the list of items awaiting verified data.
 */

const env = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : fallback;
};

export const siteUrl = env('NEXT_PUBLIC_SITE_URL', 'https://www.visvize.com').replace(/\/$/, '');

export const brand = {
  short: 'VİS VİZE',
  full: 'VİS VİZE RANDEVU HİZMETLERİ',
  descriptor: 'Randevu Hizmetleri',
  legalName: 'VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ',
} as const;

/**
 * Verified corporate identity — extracted from official records:
 * Vergi Levhası, İstanbul Ticaret Odası Faaliyet Belgesi (Sicil 381632-5) and
 * the 30.06.2026 Türkiye Ticaret Sicili Gazetesi title-change notice.
 * These are shown in the footer / legal pages for Google Ads "Government
 * Documents and Official Services" compliance (transparent operator identity).
 *
 * TRAVEL-AGENCY LICENSE — RESOLVED via the corporate-identity chain. The
 * A-group Seyahat Acentası İşletme Belgesi No: 14559 (issued 11.10.2022) names
 * "AKSOY TRAVEL TURİZM SEYAHAT ACENTASI İÇ VE DIŞ TİC. LTD. ŞTİ." This is NOT a
 * different company: the Ticaret Sicili Gazetesi records prove it is the SAME
 * legal entity as VİS VİZE — one continuous MERSİS 0037095406700001 / Sicil
 * 381632-5 / VKN 0370954067, whose trade name evolved:
 *   AKSOY TRAVEL... LTD ŞTİ (kuruluş 24.05.2022)
 *     → MÜBAREK YOLCULUK HAC UMRE... LTD ŞTİ
 *     → VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ (unvan değişikliği 30.06.2026)
 * So VİS VİZE legitimately holds belge 14559. RECOMMENDED: have the Kültür ve
 * Turizm Bakanlığı reissue the İşletme Belgesi under the current name so the
 * public registry label matches the site (the MERSİS is the durable link).
 */
export const legalEntity = {
  name: 'VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ',
  formerName: 'MÜBAREK YOLCULUK HAC UMRE SEYAHAT VE DENİZCİLİK HİZMETLERİ LİMİTED ŞİRKETİ',
  taxOffice: 'Gaziosmanpaşa',
  taxNumber: '0370954067', // VKN
  mersisNo: '0037095406700001',
  tradeRegistryOffice: 'İstanbul Ticaret Sicil Müdürlüğü',
  tradeRegistryNo: '381632-5',
  chamber: 'İstanbul Ticaret Odası',
  naceCode: '79.11.01',
  director: 'Halil İbrahim Uçak',
  registeredAddress: 'Çırçır Mah. Saya Yolu Cad. No: 10-12A, Eyüpsultan / İstanbul',
  /** Former registered trade names of this same legal entity (same MERSİS). */
  formerTradeNames: [
    'AKSOY TRAVEL TURİZM SEYAHAT ACENTASI İÇ VE DIŞ TİCARET LİMİTED ŞİRKETİ',
    'MÜBAREK YOLCULUK HAC UMRE SEYAHAT VE DENİZCİLİK HİZMETLERİ LİMİTED ŞİRKETİ',
  ],
  /**
   * A-group Seyahat Acentası İşletme Belgesi (T.C. Kültür ve Turizm Bakanlığı).
   * Held by this legal entity (MERSİS 0037095406700001) since 11.10.2022 under
   * its then-name "AKSOY TRAVEL...". `verifiedDoc` gates public rendering; true
   * because the identity chain is documented (see block comment above).
   */
  travelAgency: {
    certNo: '14559',
    authority: 'T.C. Kültür ve Turizm Bakanlığı',
    group: 'A Grubu Seyahat Acentası',
    verifiedDoc: true,
  },
} as const;

export const contactSettings = {
  phoneDisplay: env('NEXT_PUBLIC_PHONE_DISPLAY', '444 84 72'),
  phoneHref: `tel:${env('NEXT_PUBLIC_PHONE_E164', '4448472')}`,
  // WhatsApp number is intentionally unchanged (stays 0552 128 84 72).
  whatsappDisplay: env('NEXT_PUBLIC_WHATSAPP_DISPLAY', '0552 128 84 72'),
  whatsappHref: `https://wa.me/${env('NEXT_PUBLIC_WHATSAPP_E164', '905521288472')}`,
  whatsappMessage: 'Merhaba, vize süreci hakkında bilgi almak istiyorum.',
  email: env('NEXT_PUBLIC_CONTACT_EMAIL', 'info@visvizerandevu.com'),
  // PHYSICAL OFFICE / visiting + contact address (Ankara). This is where the
  // business physically operates and customers visit. It is DISTINCT from the
  // registered legal address (İstanbul Eyüpsultan — see legalEntity.registered-
  // Address), which must match the official records for compliance.
  address: {
    line: 'Ehlibeyt Mah. Ceyhun Atıf Kansu Cad. Ata Plaza No: 100/11 Kat: 5, Balgat',
    city: 'Çankaya / Ankara',
    country: 'Türkiye',
  },
  workingHours: [
    { label: 'Pazartesi – Cuma', value: '09:00 – 18:00' },
    { label: 'Cumartesi', value: '10:00 – 15:00' },
    { label: 'Pazar', value: 'Kapalı' },
  ],
  serviceArea: 'Türkiye geneli online vize danışmanlığı — Ankara ofis',
} as const;

/**
 * Department mailboxes (visvizerandevu.com). `contactSettings.email` remains the
 * primary/general address; these can be surfaced on the contact page and footer.
 */
export const departmentEmails = [
  { label: 'Genel / Bilgi', value: 'info@visvizerandevu.com' },
  { label: 'Bilgi', value: 'bilgi@visvizerandevu.com' },
  { label: 'Evrak', value: 'evrak@visvizerandevu.com' },
  { label: 'Talep', value: 'talep@visvizerandevu.com' },
  { label: 'Hukuk', value: 'hukuk@visvizerandevu.com' },
] as const;

export function whatsappLink(message: string = contactSettings.whatsappMessage): string {
  return `${contactSettings.whatsappHref}?text=${encodeURIComponent(message)}`;
}

/** Primary navigation used by the desktop header and mobile drawer. */
export const primaryNav = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Vize Ülkeleri', href: '/vize-ulkeleri' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Vize Süreci', href: '/vize-sureci' },
  { label: 'Blog', href: '/blog' },
  { label: 'S.S.S.', href: '/sss' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
] as const;

export const legalNav = [
  { label: 'KVKK Aydınlatma Metni', href: '/yasal/kvkk' },
  { label: 'Açık Rıza Metni', href: '/yasal/acik-riza' },
  { label: 'Gizlilik Politikası', href: '/yasal/gizlilik' },
  { label: 'Çerez Politikası', href: '/yasal/cerez' },
  { label: 'Kullanım Şartları', href: '/yasal/kullanim-sartlari' },
  { label: 'Yasal Bilgilendirme', href: '/yasal/bilgilendirme' },
] as const;

/**
 * Standard legal disclaimer reused across the site. Wording is aligned with the
 * company's official Ticaret Sicili purpose text and Google Ads' "Government
 * Documents and Official Services" policy: it makes the private, independent,
 * fee-charging nature explicit and disclaims any government affiliation.
 */
export const LEGAL_DISCLAIMER =
  'VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ; resmi bir devlet kurumu, konsolosluk, büyükelçilik ya da vize başvuru merkezi (VFS Global, iDATA, TLScontact vb.) DEĞİLDİR ve bu kurumlarla resmi bir bağlantısı yoktur. ' +
  'Şirketimiz; vize başvurularına yönelik randevu, evrak hazırlığı, bilgilendirme ve süreç takibi konularında bağımsız, özel bir danışmanlık hizmeti sunar ve verdiği bu danışmanlık hizmeti karşılığında, resmi konsolosluk/başvuru merkezi ücretlerinden AYRI olarak kendi hizmet bedelini tahsil eder. ' +
  'Vize başvurularının kabulü veya reddi tamamen ilgili konsolosluk ve yetkili makamların yetkisindedir; şirketimiz vize verileceğine dair hiçbir garanti vermez.';

/**
 * Consumer-protection notice shown once per session in a pop-up when a visitor
 * first lands on the site (6502 sayılı Tüketicinin Korunması Hakkında Kanun).
 */
export const CONSUMER_NOTICE = {
  title: 'Sayın kullanıcı;',
  body:
    'Firmamız, 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında sizleri bilgilendirir: ' +
    'Kendini yetkili kurum gibi gösterip sizden ödeme talep eden dolandırıcılara itibar etmeyiniz. ' +
    'Paylaştığınız bilgiler üçüncü kişilerle paylaşılmaz; başvuru merkezlerindeki randevu yoğunluğu ve slot sorunlarından doğabilecek aksaklıklardan firmamız sorumlu değildir.',
} as const;
