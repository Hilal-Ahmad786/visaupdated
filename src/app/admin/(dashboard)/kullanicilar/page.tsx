import { ChevronRight, ShieldCheck, ShieldX, UserCheck, UsersRound } from 'lucide-react';
import Link from 'next/link';

import {
  InvitationActions,
  InviteUserButton,
  NewRoleButton,
  UsersTable,
} from '@/components/admin/users/UsersTable';
import { RISK_META } from '@/lib/admin/role-meta';
import { Tabs } from '@/components/admin/ui/Tabs';
import { MetricCard, PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { EmptyState } from '@/components/ui/states';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canViewSensitiveData } from '@/lib/auth/permissions';
import { adminUsers, invitations, roles, teams, userById } from '@/lib/data/mock-users';
import { formatDateTr } from '@/lib/utils';

const SCOPE_LABELS: Record<string, string> = {
  own: 'Yalnızca kendi',
  team: 'Ekip',
  all: 'Tümü',
  countries: 'Ülkeler',
  services: 'Hizmetler',
  pipelines: 'İş akışları',
  modules: 'Modüller',
};

export default function UsersPage() {
  const user = requireAdmin('users');
  const canEdit = can(user, 'users:edit');
  const canManage = can(user, 'users:manage_settings');
  const canRevealEmail = canViewSensitiveData(user, 'users');

  const activeCount = adminUsers.filter((u) => u.status === 'active').length;
  const pendingInvites = invitations.filter((i) => i.status === 'pending').length;
  const suspendedCount = adminUsers.filter((u) => u.status === 'suspended').length;

  const roleNameById = (id: string) => roles.find((r) => r.id === id)?.name ?? id;

  // ---- Kullanıcılar tab ----
  const usersTab = (
    <UsersTable users={adminUsers} roles={roles} teams={teams} canEdit={canEdit} canRevealEmail={canRevealEmail} />
  );

  // ---- Davetler tab ----
  const invitesTab =
    invitations.length === 0 ? (
      <EmptyState title="Davet yok" description="Bekleyen bir kullanıcı daveti bulunmuyor." />
    ) : (
      <ul className="space-y-3">
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-col gap-3 rounded-card border border-line-light bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1.5">
              <p className="font-semibold text-ink">{inv.email}</p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
                {inv.roleIds.map((id) => (
                  <StatusBadge key={id} label={roleNameById(id)} tone="neutral" />
                ))}
                <span>Davet eden: {userById(inv.invitedBy)?.name ?? inv.invitedBy}</span>
                <span aria-hidden="true">·</span>
                <span>Geçerlilik: {formatDateTr(inv.expiresAt)}</span>
              </div>
            </div>
            <InvitationActions email={inv.email} status={inv.status} disabled={!canEdit} />
          </li>
        ))}
      </ul>
    );

  // ---- Roller tab ----
  const rolesTab = (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewRoleButton disabled={!canManage} />
      </div>
      {roles.length === 0 ? (
        <EmptyState title="Rol yok" description="Tanımlı bir rol bulunmuyor." />
      ) : (
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
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Kullanıcılar ve Roller"
        description="Yönetici hesaplarını, davetleri ve rol bazlı izinleri yönetin."
        actions={<InviteUserButton roles={roles} disabled={!canEdit} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Aktif Kullanıcı" value={activeCount} icon={UserCheck} />
        <MetricCard label="Bekleyen Davet" value={pendingInvites} icon={UsersRound} tone={pendingInvites > 0 ? 'action' : 'default'} />
        <MetricCard label="Askıya Alınan" value={suspendedCount} icon={ShieldX} />
        <MetricCard label="Rol Sayısı" value={roles.length} icon={ShieldCheck} />
      </div>

      <Tabs
        ariaLabel="Kullanıcı yönetimi sekmeleri"
        tabs={[
          { id: 'users', label: 'Kullanıcılar', count: adminUsers.length, content: usersTab },
          { id: 'invites', label: 'Davetler', count: invitations.length, content: invitesTab },
          { id: 'roles', label: 'Roller', count: roles.length, content: rolesTab },
        ]}
      />
    </div>
  );
}
