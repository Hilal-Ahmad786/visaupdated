import type { AuditEvent } from '@/types/admin';

/** Immutable demo audit events (UI treats them as read-only). */
export const auditEvents: AuditEvent[] = [
  {
    id: 'evt-1001', correlationId: 'cor-88a1', at: '2026-06-28T08:31:12Z', severity: 'critical',
    event: 'leads.sensitive.reveal', actorId: 'u-manager', actorName: 'Selin Aydın', actorRole: 'Operasyon Yöneticisi',
    target: 'Lead VV-2026-009214', module: 'leads', result: 'success', source: '88.***.***.12',
    reviewStatus: 'none', sensitive: true, previousValue: '•••', newValue: '0532 ••• •• 30 (görüntülendi)',
  },
  {
    id: 'evt-1000', correlationId: 'cor-88a0', at: '2026-06-28T08:05:40Z', severity: 'warning',
    event: 'auth.login.failed', actorId: 'u-suspended', actorName: 'Eski Kullanıcı', actorRole: 'Müşteri Temsilcisi',
    target: 'Admin Login', module: 'users', result: 'denied', source: '195.***.***.7',
    reviewStatus: 'investigating', sensitive: false,
  },
  {
    id: 'evt-0999', correlationId: 'cor-87f2', at: '2026-06-27T16:50:00Z', severity: 'notice',
    event: 'blog.publish', actorId: 'u-manager', actorName: 'Selin Aydın', actorRole: 'Operasyon Yöneticisi',
    target: 'Makale: almanya-vizesi-belgeleri', module: 'blog', result: 'success', source: '88.***.***.12',
    reviewStatus: 'reviewed', sensitive: false, previousValue: 'draft', newValue: 'published',
  },
  {
    id: 'evt-0998', correlationId: 'cor-87e1', at: '2026-06-27T15:20:00Z', severity: 'info',
    event: 'country.update', actorId: 'u-editor', actorName: 'Burak Demir', actorRole: 'İçerik Editörü',
    target: 'Ülke: almanya', module: 'countries', result: 'success', source: '88.***.***.31',
    reviewStatus: 'none', sensitive: false, previousValue: 'Hero başlığı (eski)', newValue: 'Hero başlığı (yeni)',
  },
  {
    id: 'evt-0997', correlationId: 'cor-87d0', at: '2026-06-27T11:00:00Z', severity: 'critical',
    event: 'users.role.change', actorId: 'u-admin', actorName: 'Kerem Yılmaz', actorRole: 'Süper Yönetici',
    target: 'Kullanıcı: Burak Demir', module: 'users', result: 'success', source: '88.***.***.12',
    reviewStatus: 'legal_hold', sensitive: true, previousValue: 'Müşteri Temsilcisi', newValue: 'İçerik Editörü',
  },
  {
    id: 'evt-0996', correlationId: 'cor-87c0', at: '2026-06-26T09:15:00Z', severity: 'notice',
    event: 'leads.export', actorId: 'u-manager', actorName: 'Selin Aydın', actorRole: 'Operasyon Yöneticisi',
    target: '24 başvuru (CSV)', module: 'leads', result: 'success', source: '88.***.***.12',
    reviewStatus: 'reviewed', sensitive: true,
  },
  {
    id: 'evt-0995', correlationId: 'cor-87b0', at: '2026-06-26T08:00:00Z', severity: 'info',
    event: 'tracking.update', actorId: 'u-admin', actorName: 'Kerem Yılmaz', actorRole: 'Süper Yönetici',
    target: 'GA4 Measurement ID', module: 'tracking', result: 'success', source: '88.***.***.12',
    reviewStatus: 'none', sensitive: false, previousValue: '(boş)', newValue: 'G-XXXX••••',
  },
];

export function auditEventById(id: string): AuditEvent | undefined {
  return auditEvents.find((e) => e.id === id);
}
