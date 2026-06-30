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
  legalName: 'VİS VİZE RANDEVU HİZMETLERİ', // TODO: confirm registered legal name
} as const;

export const contactSettings = {
  phoneDisplay: env('NEXT_PUBLIC_PHONE_DISPLAY', '0850 000 00 00'),
  phoneHref: `tel:${env('NEXT_PUBLIC_PHONE_E164', '+908500000000')}`,
  whatsappDisplay: env('NEXT_PUBLIC_WHATSAPP_DISPLAY', '0500 000 00 00'),
  whatsappHref: `https://wa.me/${env('NEXT_PUBLIC_WHATSAPP_E164', '905000000000')}`,
  whatsappMessage:
    'Merhaba, vize süreci hakkında bilgi almak istiyorum.',
  email: env('NEXT_PUBLIC_CONTACT_EMAIL', 'info@visvize.com'),
  // Placeholder address — do NOT present as verified until confirmed.
  address: {
    line: 'Adres bilgisi yakında eklenecektir',
    city: 'İstanbul',
    country: 'Türkiye',
  },
  workingHours: [
    { label: 'Pazartesi – Cuma', value: '09:00 – 18:00' },
    { label: 'Cumartesi', value: '10:00 – 15:00' },
    { label: 'Pazar', value: 'Kapalı' },
  ],
  serviceArea: 'Türkiye geneli online randevu merkezi',
} as const;

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

/** Standard legal disclaimer reused across the site. */
export const LEGAL_DISCLAIMER =
  'VİS VİZE resmi bir konsolosluk, büyükelçilik, vize başvuru merkezi veya devlet kurumu değildir; TÜRSAB belgeli yetkili bir acentadır. ' +
  'Vize başvurularına yönelik danışmanlık ve destek hizmeti sunar. Nihai kararlar ilgili resmi makamlar tarafından verilir.';

/**
 * Consumer-protection notice shown once per session in a pop-up when a visitor
 * first lands on the site (6502 sayılı Tüketicinin Korunması Hakkında Kanun).
 */
export const CONSUMER_NOTICE = {
  title: 'Sayın kullanıcı;',
  body:
    'Firmamız 6502 sayılı tüketici haklarını koruma kanuna istinaden bu bildirgeyi sizlere sunmaktadır. ' +
    'Kendini yetkili firma gibi gösteren ve sizden ödeme talep eden dolandırıcı firmalara itibar etmeyiniz. ' +
    'Başvuru merkezleri sizden vize işlemlerinde randevu ücreti hariç (ülkesine göre değişkenlik göstermektedir) ekstra bir ücret talep etmez. ' +
    'Doldurmuş olduğunuz formların ve bilgilerinizin işlemleriniz sonucunda 3. kişilerle paylaşılmayacağını taahhüt etmekle beraber, ' +
    'başvuru merkezlerinde oluşan olası randevu yoğunluğu ve slot sorunları sebebiyle yaşanabilecek aksiliklerden firmamızın sorumlu olmadığını beyan ederiz. ' +
    'Firmamız başvurunuz da zorunlu olan seyahat sağlık sigortanızı temin etmenizi sağlayarak işlemlerinizi ücretsiz olarak tarafınıza sunmaktadır.',
} as const;
