import { TrackingSettings } from '@/components/admin/settings/TrackingSettings';
import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import { PROHIBITED_TRACKING_PARAMS, trackingEventMap, trackingProviders } from '@/lib/data/mock-settings';

export default function TrackingSettingsPage() {
  const user = requireAdmin('tracking');

  return (
    <TrackingSettings
      providers={trackingProviders}
      events={trackingEventMap}
      prohibited={PROHIBITED_TRACKING_PARAMS}
      canManage={can(user, 'tracking:manage_settings')}
    />
  );
}
