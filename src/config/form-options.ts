/** Static form option lists. Country options are passed in from content (repo). */

export const visaPurposeOptions = [
  { value: 'turizm', label: 'Turizm / Ziyaret' },
  { value: 'ticari', label: 'Ticari / İş' },
  { value: 'egitim', label: 'Eğitim / Öğrenci' },
  { value: 'aile', label: 'Aile Birleşimi / Ziyaret' },
  { value: 'calisma', label: 'Çalışma' },
  { value: 'transit', label: 'Transit' },
  { value: 'diger', label: 'Diğer' },
];

export const visaTypeOptions = visaPurposeOptions;

export const contactMethodOptions = [
  { value: 'phone', label: 'Telefon' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-posta' },
];

export const applicantCountOptions = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: i === 9 ? '10+' : String(i + 1),
}));

export interface CountryOption {
  value: string;
  label: string;
}
