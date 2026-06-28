import type { Metadata } from 'next';

import { AdminShell } from '@/components/admin/shell/AdminShell';
import { adminNav } from '@/config/admin-nav';
import { requireAdmin } from '@/lib/auth/guard';
import { canAccessModule, roleById } from '@/lib/auth/permissions';
import { adminLeads } from '@/lib/data/mock-leads';

// Admin must never be indexed.
export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = requireAdmin();

  // Permission-filter the navigation: only modules the user can access appear.
  const groups = adminNav
    .map((g) => ({ ...g, items: g.items.filter((i) => canAccessModule(user, i.module)) }))
    .filter((g) => g.items.length > 0);

  const primaryRole = user.roleIds[0] ? roleById(user.roleIds[0])?.name ?? 'Kullanıcı' : 'Kullanıcı';
  const newLeads = adminLeads.filter((l) => l.status === 'new').length;

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
