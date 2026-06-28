'use client';

import {
  Activity,
  CheckCircle2,
  PowerOff,
  Save,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { TrackingEventMap, TrackingProvider } from '@/types/admin';

type Environment = 'live' | 'test';

const providerHints: Record<TrackingProvider['id'], { placeholder: string; help: string }> = {
  gtm: { placeholder: 'GTM-XXXXXXX', help: 'Container ID (GTM- ile başlar).' },
  ga4: { placeholder: 'G-XXXXXXXXXX', help: 'Measurement ID (G- ile başlar).' },
  google_ads: { placeholder: 'AW-XXXXXXXXX', help: 'Conversion ID (AW- ile başlar).' },
  meta_pixel: { placeholder: '15 haneli Pixel ID', help: 'Yalnızca sayısal Pixel ID.' },
};

const statusTone: Record<TrackingProvider['status'], { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  connected: { label: 'Bağlı', tone: 'success' },
  paused: { label: 'Duraklatıldı', tone: 'warning' },
  not_configured: { label: 'Yapılandırılmadı', tone: 'neutral' },
};

interface ConsentCategory {
  id: 'necessary' | 'analytics' | 'advertising' | 'functional';
  label: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
}

type ProviderState = TrackingProvider;

export function TrackingSettings({
  providers,
  events,
  prohibited,
  canManage,
}: {
  providers: TrackingProvider[];
  events: TrackingEventMap[];
  prohibited: string[];
  canManage: boolean;
}) {
  const { notify } = useToast();

  const [env, setEnv] = useState<Environment>('live');
  const [rows, setRows] = useState<ProviderState[]>(providers.map((p) => ({ ...p })));
  const [consent, setConsent] = useState<ConsentCategory[]>([
    {
      id: 'necessary',
      label: 'Zorunlu',
      description: 'Sitenin çalışması için gereklidir. Her zaman aktiftir, devre dışı bırakılamaz.',
      enabled: true,
      locked: true,
    },
    { id: 'analytics', label: 'Analitik', description: 'Ziyaretçi davranışını ölçmek için (GA4).', enabled: false },
    { id: 'advertising', label: 'Reklam', description: 'Dönüşüm ve yeniden pazarlama (Google Ads, Meta).', enabled: false },
    { id: 'functional', label: 'Fonksiyonel', description: 'Tercih ve kişiselleştirme çerezleri.', enabled: false },
  ]);
  const [domain, setDomain] = useState('visvize.com');
  const [crossDomain, setCrossDomain] = useState(false);
  const [utmPassthrough, setUtmPassthrough] = useState(true);
  const [debugStream, setDebugStream] = useState(false);

  const requireManage = (action: () => void) => {
    if (!canManage) {
      notify('Takip ayarlarını değiştirme yetkiniz yok.', 'warning');
      return;
    }
    action();
  };

  const toggleProvider = (id: TrackingProvider['id']) =>
    requireManage(() =>
      setRows((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                enabled: !p.enabled,
                status: !p.enabled
                  ? p.measurementId.trim()
                    ? 'connected'
                    : 'not_configured'
                  : 'paused',
              }
            : p,
        ),
      ),
    );

  const setMeasurementId = (id: TrackingProvider['id'], value: string) =>
    requireManage(() =>
      setRows((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                measurementId: value,
                status: p.enabled ? (value.trim() ? 'connected' : 'not_configured') : p.status,
              }
            : p,
        ),
      ),
    );

  const toggleConsent = (id: ConsentCategory['id']) =>
    requireManage(() =>
      setConsent((prev) => prev.map((c) => (c.id === id || c.locked ? (c.id === id && !c.locked ? { ...c, enabled: !c.enabled } : c) : c))),
    );

  // Health checks (deterministic, derived from current state).
  const healthChecks = useMemo(() => {
    const enabledRows = rows.filter((r) => r.enabled);
    const missingId = enabledRows.filter((r) => !r.measurementId.trim());
    const analyticsOn = consent.find((c) => c.id === 'analytics')?.enabled ?? false;
    const ga4 = rows.find((r) => r.id === 'ga4');
    return [
      {
        id: 'ids',
        ok: missingId.length === 0,
        label:
          missingId.length === 0
            ? 'Etkin tüm sağlayıcılarda kimlik tanımlı.'
            : `${missingId.length} etkin sağlayıcıda kimlik eksik.`,
      },
      {
        id: 'consent',
        ok: !(ga4?.enabled && !analyticsOn),
        label:
          ga4?.enabled && !analyticsOn
            ? 'GA4 etkin ancak Analitik onayı kapalı — etiketler rıza moduna takılı.'
            : 'Onay modu (Consent Mode) yapılandırması tutarlı.',
      },
      {
        id: 'pii',
        ok: true,
        label: 'PII parametreleri sunucu tarafında engelli — hiçbir olayda gönderilmiyor.',
      },
    ];
  }, [rows, consent]);

  const eventColumns: Column<TrackingEventMap>[] = [
    {
      key: 'event',
      header: 'Olay',
      render: (e) => <code className="text-sm font-semibold text-ink">{e.event}</code>,
    },
    {
      key: 'conversion',
      header: 'Dönüşüm',
      render: (e) =>
        e.conversion ? <StatusBadge label="Dönüşüm" tone="gold" /> : <span className="text-ink-muted">—</span>,
    },
    {
      key: 'params',
      header: 'Parametreler',
      render: (e) => (
        <div className="flex flex-wrap gap-1.5">
          {e.params.map((p) => (
            <span key={p} className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft">
              {p}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const onSave = () => requireManage(() => notify(`Takip ayarları (${env === 'live' ? 'Canlı' : 'Test'}) kaydedildi. (Demo)`, 'success'));
  const onPublish = () => requireManage(() => notify('Takip yapılandırması yayınlandı. (Demo)', 'success'));
  const onEmergency = () =>
    requireManage(() => {
      setRows((prev) => prev.map((p) => ({ ...p, enabled: false, status: p.status === 'connected' ? 'paused' : p.status })));
      notify('Acil kapatma uygulandı — tüm takip sağlayıcıları devre dışı bırakıldı.', 'warning');
    });

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Takip Ayarları"
        description="Analitik ve dönüşüm sağlayıcılarını, olay sözlüğünü ve onay (consent) ayarlarını yönetin."
        actions={
          <>
            <button
              type="button"
              onClick={onSave}
              disabled={!canManage}
              title={canManage ? undefined : 'Yetkiniz yok'}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Kaydet
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={!canManage}
              title={canManage ? undefined : 'Yetkiniz yok'}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
              Yayınla
            </button>
            <button
              type="button"
              onClick={onEmergency}
              disabled={!canManage}
              title={canManage ? 'Tüm takibi anında durdurur' : 'Yetkiniz yok'}
              className="inline-flex items-center gap-2 rounded-lg border border-danger px-3.5 py-2 text-sm font-semibold text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PowerOff className="h-4 w-4" aria-hidden="true" />
              Acil Kapatma
            </button>
          </>
        }
      />

      {!canManage && (
        <StatusAlert tone="info">
          Takip ayarlarını yalnızca görüntüleyebilirsiniz. Değişiklik yapmak için <strong>tracking:manage_settings</strong>{' '}
          yetkisi gerekir.
        </StatusAlert>
      )}

      {/* Security / PII policy */}
      <StatusAlert tone="info" title="Güvenlik ve gizlilik politikası">
        <p>
          Bu panelde <strong>yalnızca sağlayıcı kimlikleri</strong> (GTM/GA4/Ads/Pixel ID) girilebilir.{' '}
          <strong>Keyfi JavaScript veya özel betik eklenemez.</strong> Aşağıdaki kişisel veri (PII) parametreleri hiçbir
          olayda <strong>asla gönderilmez</strong> ve sunucu tarafında engellenir:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {prohibited.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger line-through"
            >
              <ShieldAlert className="h-3 w-3 no-underline" aria-hidden="true" />
              {p}
            </span>
          ))}
        </div>
      </StatusAlert>

      {/* Environment selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-ink">Ortam:</span>
        <div className="inline-flex rounded-lg border border-line p-0.5" role="group" aria-label="Ortam seçimi">
          {([
            { id: 'live', label: 'Canlı' },
            { id: 'test', label: 'Test' },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setEnv(id)}
              aria-pressed={env === id}
              className={cn(
                'rounded-md px-3.5 py-1.5 text-sm font-semibold',
                env === id ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {env === 'test' && <StatusBadge label="Test modu — olaylar canlı sayılmaz" tone="warning" />}
      </div>

      {/* Provider cards */}
      <section aria-labelledby="providers-h" className="space-y-3">
        <h2 id="providers-h" className="font-heading text-lg font-semibold text-ink">
          Sağlayıcılar
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((p) => {
            const st = statusTone[p.status];
            const hint = providerHints[p.id];
            return (
              <div key={p.id} className="rounded-card border border-line-light bg-white p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading font-semibold text-ink">{p.name}</p>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{p.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={st.label} tone={st.tone} />
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.enabled}
                      aria-label={`${p.name} etkinleştir`}
                      onClick={() => toggleProvider(p.id)}
                      disabled={!canManage}
                      className={cn(
                        'relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                        p.enabled ? 'bg-success' : 'bg-line',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                          p.enabled ? 'translate-x-[22px]' : 'translate-x-0.5',
                        )}
                      />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="field-label" htmlFor={`mid-${p.id}`}>
                    Sağlayıcı Kimliği
                  </label>
                  <input
                    id={`mid-${p.id}`}
                    type="text"
                    value={p.measurementId}
                    onChange={(e) => setMeasurementId(p.id, e.target.value)}
                    disabled={!canManage}
                    placeholder={hint.placeholder}
                    className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
                  />
                  <p className="mt-1 text-xs text-ink-muted">{hint.help}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Event dictionary */}
      <section aria-labelledby="events-h" className="space-y-3">
        <h2 id="events-h" className="font-heading text-lg font-semibold text-ink">
          Olay Sözlüğü
        </h2>
        <p className="text-sm text-ink-soft">
          Yalnızca bu önceden tanımlı, PII içermeyen olaylar ve parametreler gönderilir.
        </p>
        <DataTable
          columns={eventColumns}
          rows={events}
          getRowKey={(e) => e.event}
          emptyTitle="Olay tanımı yok"
        />
      </section>

      {/* Consent categories */}
      <section aria-labelledby="consent-h" className="space-y-3">
        <h2 id="consent-h" className="font-heading text-lg font-semibold text-ink">
          Onay Kategorileri (Consent Mode)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {consent.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-card border border-line-light bg-white p-4 shadow-card"
            >
              <div>
                <p className="font-heading text-sm font-semibold text-ink">{c.label}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{c.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={c.enabled}
                aria-label={`${c.label} onayı`}
                onClick={() => !c.locked && toggleConsent(c.id)}
                disabled={c.locked || !canManage}
                className={cn(
                  'relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed',
                  c.enabled ? 'bg-success' : 'bg-line',
                  c.locked && 'opacity-60',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                    c.enabled ? 'translate-x-[22px]' : 'translate-x-0.5',
                  )}
                />
              </button>
            </div>
          ))}
        </div>
        <StatusAlert tone="info">
          Google Consent Mode v2 etkindir: etiketler yalnızca ilgili kategori onayı verildiğinde tetiklenir. Reddedilen
          kategoriler için yalnızca çerezsiz, anonim sinyaller iletilir.
        </StatusAlert>
      </section>

      {/* UTM / attribution + domain */}
      <section aria-labelledby="attr-h" className="space-y-3">
        <h2 id="attr-h" className="font-heading text-lg font-semibold text-ink">
          UTM, İlişkilendirme & Alan Adı
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <label className="field-label" htmlFor="domain">
              Birincil Alan Adı
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => requireManage(() => setDomain(e.target.value))}
              disabled={!canManage}
              className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
            />
            <label className="mt-3 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={crossDomain}
                onChange={() => requireManage(() => setCrossDomain((v) => !v))}
                disabled={!canManage}
                className="h-4 w-4 rounded border-line"
              />
              Alan adları arası ölçümü etkinleştir
            </label>
          </div>
          <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <p className="field-label">İlişkilendirme</p>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={utmPassthrough}
                onChange={() => requireManage(() => setUtmPassthrough((v) => !v))}
                disabled={!canManage}
                className="h-4 w-4 rounded border-line"
              />
              UTM parametrelerini formlara taşı (lead kaynağı)
            </label>
            <p className="mt-2 text-xs text-ink-muted">
              UTM kaynak/araç/kampanya değerleri lead kaydına eklenir; kişisel veri içermez.
            </p>
          </div>
        </div>
      </section>

      {/* Test mode + debug stream */}
      <section aria-labelledby="debug-h" className="space-y-3">
        <h2 id="debug-h" className="font-heading text-lg font-semibold text-ink">
          Test & Hata Ayıklama
        </h2>
        <div className="flex items-start justify-between gap-3 rounded-card border border-line-light bg-white p-4 shadow-card">
          <div>
            <p className="font-heading text-sm font-semibold text-ink">Hata Ayıklama Akışı (Debug Stream)</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              Açıkken, olaylar GA4 DebugView&apos;a etiketlenir. Yalnızca test ortamında kullanın. (Demo)
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={debugStream}
            aria-label="Hata ayıklama akışı"
            onClick={() => requireManage(() => setDebugStream((v) => !v))}
            disabled={!canManage}
            className={cn(
              'relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              debugStream ? 'bg-success' : 'bg-line',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                debugStream ? 'translate-x-[22px]' : 'translate-x-0.5',
              )}
            />
          </button>
        </div>
      </section>

      {/* Health checks */}
      <section aria-labelledby="health-h" className="space-y-3">
        <h2 id="health-h" className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
          <Activity className="h-5 w-5 text-gold" aria-hidden="true" />
          Sağlık Kontrolleri
        </h2>
        <ul className="space-y-2">
          {healthChecks.map((h) => (
            <li
              key={h.id}
              className="flex items-center gap-3 rounded-card border border-line-light bg-white px-4 py-3 shadow-card"
            >
              {h.ok ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
              ) : (
                <ShieldAlert className="h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
              )}
              <span className="text-sm text-ink">{h.label}</span>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-card border border-line-light bg-white px-4 py-3 shadow-card">
            <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <span className="text-sm text-ink">Keyfi betik enjeksiyonu devre dışı — yalnızca onaylı sağlayıcı kimlikleri.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
