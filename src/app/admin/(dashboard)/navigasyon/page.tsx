import { NavFooterManager } from '@/components/admin/settings/NavFooterManager';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { requireAdmin } from '@/lib/auth/guard';
import { legalNav, primaryNav } from '@/config/site';

export default function NavigationPage() {
  requireAdmin('navigation');

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <CodeManagedNotice>
        Menü ve alt bilgi bağlantıları kod ile yönetilmektedir. Buradaki değişiklikler kaydedilmez.
      </CodeManagedNotice>
      <NavFooterManager
        canPublish={false}
        primaryNav={primaryNav.map((n) => ({ label: n.label, href: n.href }))}
        legalNav={legalNav.map((n) => ({ label: n.label, href: n.href }))}
      />
    </div>
  );
}
