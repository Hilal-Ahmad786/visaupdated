import type { FormDefinition } from '@/types/admin';

/** Demo form definitions backing the Form Builder. Mirrors the real public forms. */
export const formDefinitions: FormDefinition[] = [
  {
    id: 'form-preapp',
    name: 'Online Ön Başvuru Formu',
    state: 'published',
    steps: [
      { id: 'st-1', title: 'Seyahat', fieldIds: ['f-country', 'f-purpose'] },
      { id: 'st-2', title: 'Kişisel', fieldIds: ['f-name', 'f-phone', 'f-email'] },
      { id: 'st-3', title: 'Detay', fieldIds: ['f-city', 'f-count', 'f-date', 'f-message'] },
      { id: 'st-4', title: 'Onay', fieldIds: ['f-kvkk', 'f-marketing'] },
    ],
    fields: [
      { id: 'f-country', key: 'country', type: 'country', label: 'Hedef Ülke', required: true, privacy: 'public' },
      { id: 'f-purpose', key: 'visaPurpose', type: 'visa_type', label: 'Başvuru Amacı', required: true, privacy: 'public' },
      { id: 'f-name', key: 'name', type: 'text', label: 'Ad Soyad', required: true, privacy: 'personal' },
      { id: 'f-phone', key: 'phone', type: 'phone', label: 'Telefon', required: true, privacy: 'personal' },
      { id: 'f-email', key: 'email', type: 'email', label: 'E-posta', required: false, privacy: 'personal' },
      { id: 'f-city', key: 'city', type: 'text', label: 'İkamet Şehri', required: false, privacy: 'personal' },
      { id: 'f-count', key: 'applicantCount', type: 'number', label: 'Başvuran Sayısı', required: false, privacy: 'public' },
      { id: 'f-date', key: 'travelDate', type: 'date', label: 'Seyahat Tarihi', required: false, privacy: 'public' },
      { id: 'f-message', key: 'message', type: 'textarea', label: 'Mesaj', required: false, privacy: 'personal' },
      { id: 'f-kvkk', key: 'kvkkConsent', type: 'consent', label: 'KVKK Onayı', required: true, privacy: 'sensitive' },
      { id: 'f-marketing', key: 'marketingConsent', type: 'consent', label: 'Ticari İleti Onayı', required: false, privacy: 'sensitive' },
    ],
    logic: [
      { id: 'lr-1', whenFieldKey: 'visaPurpose', equals: 'egitim', action: 'show', targetFieldKey: 'message' },
    ],
    routing: { byCountry: true, team: 't-schengen' },
    notifications: { adminEmail: true, visitorEmail: true },
    successBehavior: 'thank_you',
    testMode: false,
    version: 4,
    submissions: 312,
    updatedAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 'form-appointment',
    name: 'Randevu Talep Formu',
    state: 'published',
    steps: [
      { id: 'st-1', title: 'Talep', fieldIds: ['f-country', 'f-vtype', 'f-count'] },
      { id: 'st-2', title: 'Tarih', fieldIds: ['f-from', 'f-to', 'f-method'] },
      { id: 'st-3', title: 'İletişim', fieldIds: ['f-name', 'f-phone', 'f-kvkk'] },
    ],
    fields: [
      { id: 'f-country', key: 'country', type: 'country', label: 'Ülke', required: true, privacy: 'public' },
      { id: 'f-vtype', key: 'visaType', type: 'visa_type', label: 'Vize Türü', required: true, privacy: 'public' },
      { id: 'f-count', key: 'applicantCount', type: 'number', label: 'Başvuran Sayısı', required: false, privacy: 'public' },
      { id: 'f-from', key: 'preferredDateFrom', type: 'date', label: 'Başlangıç', required: true, privacy: 'public' },
      { id: 'f-to', key: 'preferredDateTo', type: 'date', label: 'Bitiş', required: true, privacy: 'public' },
      { id: 'f-method', key: 'contactMethod', type: 'select', label: 'İletişim Yöntemi', required: false, privacy: 'public', options: [{ value: 'phone', label: 'Telefon' }, { value: 'whatsapp', label: 'WhatsApp' }] },
      { id: 'f-name', key: 'name', type: 'text', label: 'Ad Soyad', required: true, privacy: 'personal' },
      { id: 'f-phone', key: 'phone', type: 'phone', label: 'Telefon', required: true, privacy: 'personal' },
      { id: 'f-kvkk', key: 'kvkkConsent', type: 'consent', label: 'KVKK Onayı', required: true, privacy: 'sensitive' },
    ],
    logic: [],
    routing: { team: 't-ops' },
    notifications: { adminEmail: true, visitorEmail: false },
    successBehavior: 'thank_you',
    testMode: false,
    version: 2,
    submissions: 147,
    updatedAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'form-contact',
    name: 'İletişim Formu',
    state: 'draft',
    steps: [{ id: 'st-1', title: 'Mesaj', fieldIds: ['f-name', 'f-phone', 'f-message', 'f-kvkk'] }],
    fields: [
      { id: 'f-name', key: 'name', type: 'text', label: 'Ad Soyad', required: true, privacy: 'personal' },
      { id: 'f-phone', key: 'phone', type: 'phone', label: 'Telefon', required: true, privacy: 'personal' },
      { id: 'f-message', key: 'message', type: 'textarea', label: 'Mesaj', required: true, privacy: 'personal' },
      { id: 'f-kvkk', key: 'kvkkConsent', type: 'consent', label: 'KVKK Onayı', required: true, privacy: 'sensitive' },
    ],
    logic: [],
    routing: { team: 't-ops' },
    notifications: { adminEmail: true, visitorEmail: false },
    successBehavior: 'message',
    testMode: true,
    version: 1,
    submissions: 0,
    updatedAt: '2026-06-26T10:00:00Z',
  },
];

export function formById(id: string): FormDefinition | undefined {
  return formDefinitions.find((f) => f.id === id);
}
