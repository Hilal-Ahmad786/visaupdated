import { Check, Lock, Minus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RoleEditButton } from '@/components/admin/users/UsersTable';
import { RISK_META } from '@/lib/admin/role-meta';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { StatusAlert } from '@/components/ui/states';
import { requireAdmin } from '@/lib/auth/guard';
import { can, roleById } from '@/lib/auth/permissions';
import { adminUsers } from '@/lib/data/mock-users';
import type { AdminModule, PermissionAction } from '@/types/admin';

const MODULES: { id: AdminModule; label: string }[] = [
  { id: 'dashboard', label: 'Panel' },
  { id: 'leads', label: 'Başvurular' },
  { id: 'pipeline', label: 'İş Akışı' },
  { id: 'countries', label: 'Ülkeler' },
  { id: 'country_pages', label: 'Ülke Sayfaları' },
  { id: 'services', label: 'Hizmetler' },
  { id: 'blog', label: 'Blog' },
  { id: 'faq', label: 'SSS' },
  { id: 'forms', label: 'Formlar' },
  { id: 'homepage', label: 'Ana Sayfa' },
  { id: 'navigation', label: 'Navigasyon' },
  { id: 'tracking', label: 'Takip' },
  { id: 'settings', label: 'Ayarlar' },
  { id: 'users', label: 'Kullanıcılar' },
  { id: 'audit', label: 'Denetim' },
];

const ACTIONS: { id: PermissionAction; label: string }[] = [
  { id: 'view', label: 'Gör' },
  { id: 'create', label: 'Oluştur' },
  { id: 'edit', label: 'Düzenle' },
  { id: 'review', label: 'İncele' },
  { id: 'approve', label: 'Onayla' },
  { id: 'publish', label: 'Yayınla' },
  { id: 'unpublish', label: 'Geri Al' },
  { id: 'archive', label: 'Arşivle' },
  { id: 'delete', label: 'Sil' },
  { id: 'export', label: 'Dışa Aktar' },
  { id: 'manage_settings', label: 'Ayar' },
  { id: 'view_sensitive', label: 'Hassas' },
  { id: 'assign', label: 'Ata' },
];

const SCOPE_LABELS: Record<string, string> = {
  own: 'Yalnızca kendi',
  team: 'Ekip',
  all: 'Tümü',
  countries: 'Ülkeler',
  services: 'Hizmetler',
  pipelines: 'İş akışları',
  modules: 'Modüller',
};

/** Collect a role's permissions (incl. inherited). Returns null when wildcard. */
function collectPermissions(roleId: string, seen = new Set<string>()): Set<string> | null {
  if (seen.has(roleId)) return new Set();
  seen.add(roleId);
  const role = roleById(roleId);
  if (!role) return new Set();
  if ((role.permissions as string[]).includes('*')) return null;
  const set = new Set<string>(role.permissions as string[]);
  for (const inherited of role.inheritsRoleIds ?? []) {
    const sub = collectPermissions(inherited, seen);
    if (sub === null) return null;
    for (const p of sub) set.add(p);
  }
  return set;
}

export default function RoleDetailPage({ params }: { params: { roleId: string } }) {
  const user = requireAdmin('users');
  const role = roleById(params.roleId);
  if (!role) notFound();

  const canEdit = can(user, 'users:edit');
  const permSet = collectPermissions(role.id);
  const isWildcard = permSet === null;
  const has = (m: AdminModule, a: PermissionAction) => isWildcard || (permSet?.has(`${m}:${a}`) ?? false);

  const inheritedRoles = (role.inheritsRoleIds ?? []).map((id) => ({ id, name: roleById(id)?.name ?? id }));
  const assignedUsers = adminUsers.filter((u) => u.roleIds.includes(role.id));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title={role.name}
        description={role.description}
        badge={<StatusBadge label={RISK_META[role.risk].label} tone={RISK_META[role.risk].tone} />}
        actions={<RoleEditButton roleName={role.name} system={role.system} canEdit={canEdit} />}
      />

      <Link href="/admin/roller" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Rol listesine dön
      </Link>

      {role.system && (
        <StatusAlert tone="info" title="Sistem rolü — silinemez">
          Bu rol sistem tarafından tanımlanmıştır. Silinemez ve çekirdek izinleri değiştirilemez.
        </StatusAlert>
      )}

      <StatusAlert tone="warning" title="Ayrıcalık yükseltme koruması">
        Kullanıcılar sahip olmadıkları izinleri başka bir role atayamaz ve kendi rol/izin değişikliklerini onaylayamaz
        (görevler ayrılığı). Kritik rol değişiklikleri ikinci bir yöneticinin onayını gerektirir.
      </StatusAlert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Risk</p>
          <div className="mt-1.5">
            <StatusBadge label={RISK_META[role.risk].label} tone={RISK_META[role.risk].tone} />
          </div>
        </div>
        <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Kapsam</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{SCOPE_LABELS[role.scope.kind] ?? role.scope.kind}</p>
          {role.scope.values && role.scope.values.length > 0 && (
            <p className="mt-0.5 text-xs text-ink-soft">{role.scope.values.join(', ')}</p>
          )}
        </div>
        <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Kullanıcı Sayısı</p>
          <p className="mt-1.5 text-sm font-semibold text-ink">{role.userCount}</p>
        </div>
        <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Tür</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            {role.system ? <Lock className="h-4 w-4 text-ink-muted" aria-hidden="true" /> : null}
            {role.system ? 'Sistem rolü' : 'Özel rol'}
          </p>
        </div>
      </div>

      {inheritedRoles.length > 0 && (
        <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
          <h2 className="mb-2 font-heading text-base font-bold text-ink">Devralınan Roller</h2>
          <div className="flex flex-wrap gap-2">
            {inheritedRoles.map((r) => (
              <Link key={r.id} href={`/admin/roller/${r.id}`} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy hover:bg-line-light">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Permission matrix */}
      <div className="rounded-card border border-line-light bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-line-light p-5">
          <h2 className="font-heading text-base font-bold text-ink">İzin Matrisi</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Salt görünüm
          </span>
        </div>
        {isWildcard && (
          <div className="border-b border-line-light bg-gold-surface/40 px-5 py-3 text-sm text-ink">
            Bu rol <span className="font-semibold">tüm izinlere</span> sahiptir (Süper Yönetici).
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line-light">
                <th scope="col" className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Modül
                </th>
                {ACTIONS.map((a) => (
                  <th key={a.id} scope="col" className="whitespace-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {a.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-light">
              {MODULES.map((m) => (
                <tr key={m.id} className="hover:bg-admin">
                  <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-2.5 text-left text-sm font-semibold text-ink">
                    {m.label}
                  </th>
                  {ACTIONS.map((a) => {
                    const granted = has(m.id, a.id);
                    return (
                      <td key={a.id} className="px-3 py-2.5 text-center">
                        {granted ? (
                          <Check className="mx-auto h-4 w-4 text-success" aria-label="İzinli" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-ink-muted/50" aria-label="İzinsiz" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {assignedUsers.length > 0 && (
        <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
          <h2 className="mb-3 font-heading text-base font-bold text-ink">Bu Role Sahip Kullanıcılar</h2>
          <div className="flex flex-wrap gap-2">
            {assignedUsers.map((u) => (
              <Link key={u.id} href={`/admin/kullanicilar/${u.id}`} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy hover:bg-line-light">
                {u.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
