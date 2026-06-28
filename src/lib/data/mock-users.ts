/**
 * Mock users, roles and teams. Demo data only — clearly not real staff.
 * Centralized here so the UI never hardcodes user/role arrays. Swap for an API
 * by replacing these exports with fetchers of the same shape.
 */
import type { AdminUser, Invitation, Permission, Role, Session, Team } from '@/types/admin';

export const roles: Role[] = [
  {
    id: 'r-super',
    name: 'Süper Yönetici',
    description: 'Tüm modüllere ve ayarlara tam erişim.',
    permissions: ['*'],
    scope: { kind: 'all' },
    risk: 'critical',
    system: true,
    userCount: 1,
  },
  {
    id: 'r-manager',
    name: 'Operasyon Yöneticisi',
    description: 'Başvuru, içerik ve yayınlama yönetimi. Ayar ve kullanıcı yönetimi sınırlı.',
    permissions: [
      'dashboard:view',
      'leads:view', 'leads:edit', 'leads:assign', 'leads:export', 'leads:view_sensitive',
      'pipeline:view', 'pipeline:edit',
      'countries:view', 'countries:edit', 'countries:publish',
      'country_pages:view', 'country_pages:edit', 'country_pages:publish',
      'services:view', 'services:edit', 'services:publish',
      'blog:view', 'blog:edit', 'blog:review', 'blog:publish',
      'faq:view', 'faq:edit', 'faq:publish',
      'forms:view', 'forms:edit',
      'homepage:view', 'homepage:edit', 'homepage:publish',
      'audit:view',
    ] as Permission[],
    scope: { kind: 'all' },
    risk: 'high',
    system: false,
    userCount: 1,
  },
  {
    id: 'r-editor',
    name: 'İçerik Editörü',
    description: 'İçerik oluşturma ve düzenleme. Yayınlama için inceleme gerekir.',
    permissions: [
      'dashboard:view',
      'countries:view', 'countries:edit',
      'country_pages:view', 'country_pages:edit',
      'services:view', 'services:edit',
      'blog:view', 'blog:create', 'blog:edit',
      'faq:view', 'faq:edit',
      'homepage:view',
    ] as Permission[],
    scope: { kind: 'own' },
    risk: 'medium',
    system: false,
    userCount: 1,
  },
  {
    id: 'r-agent',
    name: 'Müşteri Temsilcisi',
    description: 'Atanmış başvuruları görüntüleme ve takip. Hassas veri erişimi yok.',
    permissions: [
      'dashboard:view',
      'leads:view', 'leads:edit',
      'pipeline:view', 'pipeline:edit',
    ] as Permission[],
    scope: { kind: 'team' },
    risk: 'low',
    system: false,
    userCount: 1,
  },
];

export const teams: Team[] = [
  { id: 't-schengen', name: 'Schengen Ekibi', memberIds: ['u-agent', 'u-editor'] },
  { id: 't-ops', name: 'Operasyon', memberIds: ['u-admin', 'u-manager'] },
];

export const adminUsers: AdminUser[] = [
  {
    id: 'u-admin',
    name: 'Kerem Yılmaz',
    email: 'yonetici@visvize.com',
    avatarInitials: 'KY',
    roleIds: ['r-super'],
    teamId: 't-ops',
    status: 'active',
    mfaEnabled: true,
    lastActiveAt: '2026-06-28T08:30:00Z',
    createdAt: '2026-01-02T09:00:00Z',
  },
  {
    id: 'u-manager',
    name: 'Selin Aydın',
    email: 'mudur@visvize.com',
    avatarInitials: 'SA',
    roleIds: ['r-manager'],
    teamId: 't-ops',
    status: 'active',
    mfaEnabled: true,
    lastActiveAt: '2026-06-28T07:10:00Z',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'u-editor',
    name: 'Burak Demir',
    email: 'editor@visvize.com',
    avatarInitials: 'BD',
    roleIds: ['r-editor'],
    teamId: 't-schengen',
    status: 'active',
    mfaEnabled: false,
    lastActiveAt: '2026-06-27T16:45:00Z',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'u-agent',
    name: 'Ayşe Kaya',
    email: 'temsilci@visvize.com',
    avatarInitials: 'AK',
    roleIds: ['r-agent'],
    teamId: 't-schengen',
    status: 'active',
    mfaEnabled: false,
    lastActiveAt: '2026-06-28T06:05:00Z',
    createdAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'u-suspended',
    name: 'Eski Kullanıcı',
    email: 'pasif@visvize.com',
    avatarInitials: 'EK',
    roleIds: ['r-agent'],
    status: 'suspended',
    mfaEnabled: false,
    createdAt: '2026-02-20T09:00:00Z',
  },
];

export const invitations: Invitation[] = [
  {
    id: 'inv-1',
    email: 'yeni.editor@visvize.com',
    roleIds: ['r-editor'],
    invitedBy: 'u-admin',
    status: 'pending',
    expiresAt: '2026-07-05T00:00:00Z',
  },
  {
    id: 'inv-2',
    email: 'eski.davet@visvize.com',
    roleIds: ['r-agent'],
    invitedBy: 'u-manager',
    status: 'expired',
    expiresAt: '2026-06-01T00:00:00Z',
  },
];

export const sessions: Session[] = [
  { id: 's-1', userId: 'u-admin', device: 'MacBook Pro · Chrome', ip: '88.***.***.12', current: true, startedAt: '2026-06-28T08:00:00Z', lastSeenAt: '2026-06-28T08:30:00Z' },
  { id: 's-2', userId: 'u-admin', device: 'iPhone · Safari', ip: '88.***.***.40', current: false, startedAt: '2026-06-27T19:00:00Z', lastSeenAt: '2026-06-27T21:10:00Z' },
];

export function userById(id: string): AdminUser | undefined {
  return adminUsers.find((u) => u.id === id);
}
