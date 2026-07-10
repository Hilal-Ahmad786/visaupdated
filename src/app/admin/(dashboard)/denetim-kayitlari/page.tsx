import { ShieldAlert } from 'lucide-react';

import { AuditTable } from '@/components/admin/audit/AuditTable';
import { Tabs } from '@/components/admin/ui/Tabs';
import { PageHeader } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { StatusAlert } from '@/components/ui/states';
import { requireAdmin } from '@/lib/auth/guard';
import { canViewSensitiveData } from '@/lib/auth/permissions';
import { auditEvents } from '@/lib/data/mock-audit';
import type { AuditEvent } from '@/types/admin';

const CONTENT_MODULES = new Set(['countries', 'country_pages', 'services', 'blog', 'faq', 'homepage', 'navigation']);

function isSecurity(e: AuditEvent): boolean {
  return (
    e.event.startsWith('auth') ||
    /login|session|mfa|password|permission/.test(e.event) ||
    e.result === 'denied'
  );
}

function isExportOrSensitive(e: AuditEvent): boolean {
  return e.sensitive || /export|reveal/.test(e.event);
}

const CATEGORIES: { id: string; label: string; match: (e: AuditEvent) => boolean }[] = [
  { id: 'all', label: 'Tümü', match: () => true },
  { id: 'security', label: 'Güvenlik', match: isSecurity },
  { id: 'users', label: 'Kullanıcılar', match: (e) => e.module === 'users' && !isSecurity(e) },
  { id: 'leads', label: 'Başvurular', match: (e) => e.module === 'leads' || e.module === 'pipeline' },
  { id: 'content', label: 'İçerik', match: (e) => CONTENT_MODULES.has(e.module) },
  { id: 'forms', label: 'Formlar', match: (e) => e.module === 'forms' },
  { id: 'export', label: 'Export & Hassas Erişim', match: isExportOrSensitive },
  { id: 'system', label: 'Sistem', match: (e) => e.module === 'settings' || e.module === 'tracking' || e.module === 'dashboard' || e.module === 'audit' },
];

export default function AuditLogPage() {
  const user = requireAdmin('audit');
  const canRevealSensitive = canViewSensitiveData(user, 'audit');

  // Newest first, deterministic.
  const sorted = [...auditEvents].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title="Denetim Kayıtları"
        description="Sistemdeki tüm güvenlik ve yönetim olaylarının değiştirilemez kaydı."
      />

      <StatusAlert tone="info" title="Değiştirilemez kayıtlar">
        Denetim kayıtları değiştirilemez veya silinemez. İnceleme notları ve soruşturmalar ayrı kayıtlar olarak tutulur ve
        orijinal olayı değiştirmez.
      </StatusAlert>

      <Tabs
        ariaLabel="Denetim kaydı kategorileri"
        tabs={CATEGORIES.map((c) => {
          const rows = sorted.filter(c.match);
          return {
            id: c.id,
            label: c.label,
            count: rows.length,
            content: <AuditTable events={rows} canRevealSensitive={canRevealSensitive} />,
          };
        })}
      />

      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
        Kayıtlar yalnızca okunabilir. Düzenleme veya silme işlemi mümkün değildir.
      </p>
    </div>
  );
}
