import { NavFooterManager } from '@/components/admin/settings/NavFooterManager';
import { requireAdmin } from '@/lib/auth/guard';
import { canPublish } from '@/lib/auth/permissions';
import { legalNav, primaryNav } from '@/config/site';

export default function NavigationPage() {
  const user = requireAdmin('navigation');

  return (
    <NavFooterManager
      canPublish={canPublish(user, 'navigation')}
      primaryNav={primaryNav.map((n) => ({ label: n.label, href: n.href }))}
      legalNav={legalNav.map((n) => ({ label: n.label, href: n.href }))}
    />
  );
}
