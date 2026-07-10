import { TrackingSettings } from '@/components/admin/settings/TrackingSettings';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { requireAdmin } from '@/lib/auth/guard';
import { PROHIBITED_TRACKING_PARAMS, trackingEventMap, trackingProviders } from '@/lib/data/mock-settings';

export default function TrackingSettingsPage() {
  requireAdmin('tracking');

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <CodeManagedNotice>
        Takip/GTM yapılandırması ortam değişkenleri ve GTM üzerinden yönetilir. Buradaki değişiklikler
        kaydedilmez.
      </CodeManagedNotice>
      <TrackingSettings
        providers={trackingProviders}
        events={trackingEventMap}
        prohibited={PROHIBITED_TRACKING_PARAMS}
        canManage={false}
      />
    </div>
  );
}
