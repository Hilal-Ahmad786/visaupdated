import { TrackingSettings } from '@/components/admin/settings/TrackingSettings';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { requireAdmin } from '@/lib/auth/guard';
import { PROHIBITED_TRACKING_PARAMS, trackingEventMap } from '@/lib/data/mock-settings';

export default function TrackingSettingsPage() {
  requireAdmin('tracking');

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <CodeManagedNotice>
        Ölçüm GTM tabanlıdır: tek anahtar <code>NEXT_PUBLIC_GTM_ID</code> ortam değişkenidir (Vercel). GA4 ve Google
        Ads etiketleri/dönüşümleri GTM konteyneri içinde yönetilir. Bu ekran salt görüntülemedir.
      </CodeManagedNotice>
      <TrackingSettings
        gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        events={trackingEventMap}
        prohibited={PROHIBITED_TRACKING_PARAMS}
      />
    </div>
  );
}
