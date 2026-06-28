import { GeneralSettingsForm } from '@/components/admin/settings/GeneralSettingsForm';
import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import { generalSettings } from '@/lib/data/mock-settings';
import { formDefinitions } from '@/lib/data/mock-forms';

export default function GeneralSettingsPage() {
  const user = requireAdmin('settings');

  return (
    <GeneralSettingsForm
      settings={generalSettings}
      forms={formDefinitions.map((f) => ({ id: f.id, name: f.name }))}
      canManage={can(user, 'settings:manage_settings')}
    />
  );
}
