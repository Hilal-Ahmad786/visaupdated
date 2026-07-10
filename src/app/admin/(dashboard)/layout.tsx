import type { Metadata } from 'next';

import { AdminShell } from '@/components/admin/shell/AdminShell';
import { adminNav } from '@/config/admin-nav';
import { getSubmittedAdminLeads } from '@/lib/admin/lead-bridge';
import { requireAdmin } from '@/lib/auth/guard';
import { canAccessModule, roleById } from '@/lib/auth/permissions';

// Admin must never be indexed.
export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false },
};

// Live: the sidebar badge reflects the real "new" lead count on every load.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = requireAdmin();

  // Permission-filter the navigation: only modules the user can access appear.
  const groups = adminNav
    .map((g) => ({ ...g, items: g.items.filter((i) => canAccessModule(user, i.module)) }))
    .filter((g) => g.items.length > 0);

  const primaryRole = user.roleIds[0] ? roleById(user.roleIds[0])?.name ?? 'Kullanıcı' : 'Kullanıcı';
  // Real, persisted submissions awaiting first contact — drives the "Başvurular" badge.
  const leads = await getSubmittedAdminLeads();
  const newLeads = leads.filter((l) => l.status === 'new').length;

  return (
    <AdminShell
      groups={groups}
      user={{ name: user.name, role: primaryRole, initials: user.avatarInitials }}
      badges={{ newLeads }}
    >
      {children}
    </AdminShell>
  );
}
