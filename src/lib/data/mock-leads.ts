import type { AdminLead, LeadPriority } from '@/types/admin';

/** Deterministic demo leads (no Date.now/random — stable for SSR + tests). */

const baseTimeline = (ref: string) => [
  { id: `${ref}-t1`, at: '2026-06-25T10:00:00Z', actor: 'Sistem', text: 'Başvuru web formundan oluşturuldu.' },
  { id: `${ref}-t2`, at: '2026-06-25T11:30:00Z', actor: 'Ayşe Kaya', text: 'Başvuru incelendi, iletişime geçildi.' },
];

function makeLead(
  i: number,
  partial: Partial<AdminLead> & Pick<AdminLead, 'reference' | 'name' | 'phone' | 'email' | 'country' | 'stageId' | 'status'>,
): AdminLead {
  const priorities: LeadPriority[] = ['normal', 'high', 'urgent', 'low'];
  return {
    id: `lead-${i}`,
    city: 'İstanbul',
    service: 'vize-danismanligi',
    visaType: 'turizm',
    pipelineId: 'p-default',
    priority: priorities[i % priorities.length]!,
    source: i % 2 === 0 ? 'Google Ads' : 'Organik',
    campaign: i % 2 === 0 ? { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'schengen-2026' } : undefined,
    lastActivityAt: '2026-06-27T14:00:00Z',
    createdAt: '2026-06-25T10:00:00Z',
    ageInStageDays: (i % 6) + 1,
    consent: { kvkk: true, marketing: i % 3 === 0, consentedAt: '2026-06-25T10:00:00Z' },
    assigneeId: i % 3 === 0 ? 'u-agent' : i % 3 === 1 ? 'u-editor' : undefined,
    teamId: 't-schengen',
    followUpAt: i % 4 === 0 ? '2026-06-29T09:00:00Z' : undefined,
    notes: [
      { id: `${partial.reference}-n1`, authorId: 'u-agent', createdAt: '2026-06-25T12:00:00Z', body: 'Müşteri ilk başvuru, Schengen turistik vize ile ilgileniyor.', internal: true },
    ],
    files: [{ id: `${partial.reference}-f1`, name: 'pasaport.pdf', kind: 'PDF', sizeKb: 540, uploadedAt: '2026-06-26T09:00:00Z' }],
    followUps: [
      { id: `${partial.reference}-fu1`, dueAt: '2026-06-29T09:00:00Z', note: 'Evrak durumu kontrol edilecek.', done: false, assigneeId: 'u-agent' },
    ],
    communications: [
      { id: `${partial.reference}-c1`, channel: 'phone', direction: 'out', at: '2026-06-25T11:30:00Z', summary: 'İlk arama yapıldı, bilgi verildi.' },
    ],
    timeline: baseTimeline(partial.reference),
    ...partial,
  };
}

export const adminLeads: AdminLead[] = [
  makeLead(0, { reference: 'VV-2026-009214', name: 'Mehmet Aydın', phone: '0532 100 20 30', email: 'mehmet.aydin@example.com', country: 'almanya', stageId: 'new', status: 'new', visaType: 'turizm' }),
  makeLead(1, { reference: 'VV-2026-009210', name: 'Elif Yılmaz', phone: '0533 200 30 40', email: 'elif.yilmaz@example.com', country: 'fransa', stageId: 'contacted', status: 'contacted', visaType: 'ticari' }),
  makeLead(2, { reference: 'VV-2026-009208', name: 'Can Berk', phone: '0534 300 40 50', email: 'can.berk@example.com', country: 'italya', stageId: 'documents', status: 'documents', visaType: 'egitim' }),
  makeLead(3, { reference: 'VV-2026-009205', name: 'Zeynep Şahin', phone: '0535 400 50 60', email: 'zeynep.sahin@example.com', country: 'ispanya', stageId: 'qualified', status: 'qualified' }),
  makeLead(4, { reference: 'VV-2026-009201', name: 'Ahmet Çelik', phone: '0536 500 60 70', email: 'ahmet.celik@example.com', country: 'hollanda', stageId: 'appointment', status: 'appointment' }),
  makeLead(5, { reference: 'VV-2026-009198', name: 'Fatma Kara', phone: '0537 600 70 80', email: 'fatma.kara@example.com', country: 'almanya', stageId: 'new', status: 'new', priority: 'urgent' }),
  makeLead(6, { reference: 'VV-2026-009190', name: 'Murat Öz', phone: '0538 700 80 90', email: 'murat.oz@example.com', country: 'fransa', stageId: 'completed', status: 'completed' }),
  makeLead(7, { reference: 'VV-2026-009185', name: 'Deniz Acar', phone: '0539 800 90 00', email: 'deniz.acar@example.com', country: 'yunanistan', stageId: 'contacted', status: 'contacted', duplicateOf: 'VV-2026-009210' }),
];

export function leadById(id: string): AdminLead | undefined {
  return adminLeads.find((l) => l.id === id || l.reference === id);
}

/** Mask PII for default display. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '•••';
  return `${phone.slice(0, 4)} ••• •• ${digits.slice(-2)}`;
}
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return '•••';
  const head = user.slice(0, 2);
  return `${head}${'•'.repeat(Math.max(2, user.length - 2))}@${domain}`;
}
