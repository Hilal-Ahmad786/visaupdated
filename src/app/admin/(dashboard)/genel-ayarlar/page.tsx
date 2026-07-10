import { GeneralSettingsForm } from '@/components/admin/settings/GeneralSettingsForm';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { requireAdmin } from '@/lib/auth/guard';
import { generalSettings } from '@/lib/data/mock-settings';
import { formDefinitions } from '@/lib/data/mock-forms';

export default function GeneralSettingsPage() {
  requireAdmin('settings');

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <CodeManagedNotice>
        İletişim/adres bilgileri ortam yapılandırması (env) ile, diğer ayarlar kod ile yönetilir.
        Buradaki değişiklikler kaydedilmez.
      </CodeManagedNotice>
      <GeneralSettingsForm
        settings={generalSettings}
        forms={formDefinitions.map((f) => ({ id: f.id, name: f.name }))}
        canManage={false}
      />
    </div>
  );
}
