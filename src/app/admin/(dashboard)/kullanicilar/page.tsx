import { ChevronRight, ShieldCheck, ShieldX, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

import { CreateUserButton, UsersTable } from '@/components/admin/users/UsersTable';
import { Tabs } from '@/components/admin/ui/Tabs';
import { MetricCard, PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { RISK_META } from '@/lib/admin/role-meta';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canViewSensitiveData } from '@/lib/auth/permissions';
import { listAdminUsers } from '@/lib/auth/users';
import { roles } from '@/lib/data/mock-users';

// Live: reads the real admin_users table on every request.
export const dynamic = 'force-dynamic';

const SCOPE_LABELS: Record<string, string> = {
  own: 'Yalnızca kendi',
  team: 'Ekip',
  all: 'Tümü',
  countries: 'Ülkeler',
  services: 'Hizmetler',
  pipelines: 'İş akışları',
  modules: 'Modüller',
};

export default async function UsersPage() {
  const user = requireAdmin('users');
  const canEdit = can(user, 'users:edit');
  const canRevealEmail = canViewSensitiveData(user, 'users');

  // Real admin users from the DB (or the env bootstrap admin without a DB).
  const users = await listAdminUsers();

  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;
  const deactivatedCount = users.filter((u) => u.status === 'deactivated').length;

  // ---- Kullanıcılar tab ----
  const usersTab = (
    <UsersTable
      users={users}
      roles={roles}
      teams={[]}
      canEdit={canEdit}
      canRevealEmail={canRevealEmail}
      viewerId={user.id}
    />
  );

  // ---- Roller tab (system-defined; drive the permission engine) ----
  const rolesTab = (
    <div className="space-y-4">
      <StatusAlert tone="info" title="Roller sistem tanımlıdır">
        Roller ve izinler uygulamanın güvenlik modelinde tanımlıdır. Kullanıcı oluştururken bu
        rollerden birini atayabilirsiniz. Özel rol tanımlama ayrı bir izin altyapısı gerektirir.
      </StatusAlert>
      <ul className="space-y-3">
        {roles.map((r) => (
          <li key={r.id} className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-base font-bold text-ink">{r.name}</span>
                  <StatusBadge label={RISK_META[r.risk].label} tone={RISK_META[r.risk].tone} />
                  {r.system && <StatusBadge label="Sistem" tone="info" />}
                </div>
                <p className="text-sm text-ink-soft">{r.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span>{r.userCount} kullanıcı</span>
                  <span>Kapsam: {SCOPE_LABELS[r.scope.kind] ?? r.scope.kind}</span>
                </div>
              </div>
              <Link
                href={`/admin/roller/${r.id}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
              >
                İncele
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Kullanıcılar ve Roller"
        description="Yönetici hesaplarını ve rol bazlı izinleri yönetin."
        actions={<CreateUserButton roles={roles} disabled={!canEdit} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Aktif Kullanıcı" value={activeCount} icon={UserCheck} />
        <MetricCard
          label="Askıya Alınan"
          value={suspendedCount}
          icon={ShieldX}
          tone={suspendedCount > 0 ? 'action' : 'default'}
        />
        <MetricCard label="Devre Dışı" value={deactivatedCount} icon={UserX} />
        <MetricCard label="Rol Sayısı" value={roles.length} icon={ShieldCheck} />
      </div>

      <Tabs
        ariaLabel="Kullanıcı yönetimi sekmeleri"
        tabs={[
          { id: 'users', label: 'Kullanıcılar', count: users.length, content: usersTab },
          { id: 'roles', label: 'Roller', count: roles.length, content: rolesTab },
        ]}
      />
    </div>
  );
}
