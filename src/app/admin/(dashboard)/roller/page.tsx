import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { NewRoleButton } from '@/components/admin/users/UsersTable';
import { RISK_META } from '@/lib/admin/role-meta';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import { roles } from '@/lib/data/mock-users';
import type { Role } from '@/types/admin';

const SCOPE_LABELS: Record<string, string> = {
  own: 'Yalnızca kendi',
  team: 'Ekip',
  all: 'Tümü',
  countries: 'Ülkeler',
  services: 'Hizmetler',
  pipelines: 'İş akışları',
  modules: 'Modüller',
};

export default function RolesPage() {
  const user = requireAdmin('users');
  const canManage = can(user, 'users:manage_settings');

  const columns: Column<Role>[] = [
    {
      key: 'name',
      header: 'Rol',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink">{r.name}</span>
          {r.system && <StatusBadge label="Sistem" tone="info" />}
        </div>
      ),
    },
    { key: 'description', header: 'Açıklama', hideOnMobile: true, render: (r) => <span className="text-ink-soft">{r.description}</span> },
    { key: 'risk', header: 'Risk', render: (r) => <StatusBadge label={RISK_META[r.risk].label} tone={RISK_META[r.risk].tone} /> },
    { key: 'users', header: 'Kullanıcı', render: (r) => <span className="text-ink">{r.userCount}</span> },
    { key: 'scope', header: 'Kapsam', hideOnMobile: true, render: (r) => <span className="text-ink-soft">{SCOPE_LABELS[r.scope.kind] ?? r.scope.kind}</span> },
    {
      key: 'actions',
      header: 'İşlemler',
      className: 'text-right',
      render: (r) => (
        <Link
          href={`/admin/roller/${r.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          İncele
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Roller"
        description="Rol bazlı erişim denetimi (RBAC). Her rolün risk seviyesi ve kapsamı tanımlıdır."
        actions={<NewRoleButton disabled={!canManage} />}
      />

      <DataTable
        columns={columns}
        rows={roles}
        getRowKey={(r) => r.id}
        emptyTitle="Rol bulunamadı"
        emptyDescription="Henüz tanımlı bir rol yok."
      />
    </div>
  );
}
