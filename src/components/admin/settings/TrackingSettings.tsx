'use client';

import {
  Activity,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Tag,
} from 'lucide-react';

import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { TrackingEventMap } from '@/types/admin';

/**
 * Tracking settings — a READ-ONLY status & reference panel.
 *
 * This site is GTM-first: the ONLY switch is the `NEXT_PUBLIC_GTM_ID` env var,
 * and GA4 + Google Ads tags/conversions are configured entirely inside the GTM
 * container. So this screen does not (and must not) hold GA4/Ads ids — it mirrors
 * the real state: the live GTM container id, the `vis_*` → GA4 → Ads mapping, the
 * consent model, and the PII policy. Nothing here is editable.
 */

/** Read-only consent categories, mirroring the cookie banner + Consent Mode v2. */
const CONSENT_CATEGORIES = [
  {
    id: 'necessary',
    label: 'Zorunlu Çerezler',
    description: 'Sitenin çalışması için gereklidir. Onaydan bağımsız her zaman aktiftir.',
    state: 'Her zaman aktif',
    tone: 'success' as const,
  },
  {
    id: 'analytics',
    label: 'Analitik Çerezleri',
    description: 'GA4 ve birinci taraf ziyaret/tıklama ölçümü (analytics_storage).',
    state: 'Kullanıcı onayına bağlı',
    tone: 'neutral' as const,
  },
  {
    id: 'advertising',
    label: 'Reklam ve Pazarlama Çerezleri',
    description: 'Google Ads dönüşüm ve yeniden pazarlama (ad_storage, ad_user_data, ad_personalization).',
    state: 'Kullanıcı onayına bağlı',
    tone: 'neutral' as const,
  },
] as const;

export function TrackingSettings({
  gtmId,
  events,
  prohibited,
}: {
  gtmId?: string;
  events: TrackingEventMap[];
  prohibited: string[];
}) {
  const gtmConfigured = Boolean(gtmId);
  // Only the public container id is known here (not the numeric account/container
  // ids a deep link needs), so link to the GTM home — the user picks the container.
  const gtmUrl = 'https://tagmanager.google.com/';

  const eventColumns: Column<TrackingEventMap>[] = [
    {
      key: 'event',
      header: 'dataLayer olayı',
      render: (e) => <code className="text-sm font-semibold text-ink">{e.event}</code>,
    },
    {
      key: 'ga4',
      header: 'GA4 olayı',
      render: (e) =>
        e.ga4 ? <code className="text-xs text-ink-soft">{e.ga4}</code> : <span className="text-ink-muted">—</span>,
    },
    {
      key: 'ads',
      header: 'Google Ads dönüşümü',
      render: (e) =>
        e.adsConversion ? (
          <span className="text-xs font-medium text-ink-soft">{e.adsConversion}</span>
        ) : (
          <span className="text-ink-muted">—</span>
        ),
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

  const healthChecks = [
    {
      id: 'gtm',
      ok: gtmConfigured,
      label: gtmConfigured
        ? `GTM bağlı — konteyner ${gtmId} (NEXT_PUBLIC_GTM_ID).`
        : 'GTM yapılandırılmadı — NEXT_PUBLIC_GTM_ID ortam değişkeni tanımlı değil.',
    },
    {
      id: 'loader',
      ok: true,
      label: 'Tek yükleyici: gtag.js doğrudan yüklenmez; GA4 ve Ads etiketleri yalnızca GTM üzerinden çalışır.',
    },
    {
      id: 'consent',
      ok: true,
      label: 'Consent Mode v2 etkin: tüm reklam/analitik izinleri varsayılan olarak reddedilir, kullanıcı onayıyla güncellenir.',
    },
    {
      id: 'pii',
      ok: true,
      label: 'PII parametreleri engelli — isim/telefon/e-posta hiçbir GA4 olayına gönderilmez.',
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Takip Ayarları"
        description="GTM tabanlı ölçüm durumu ve olay sözlüğü. GA4 ve Google Ads yapılandırması GTM içinde yönetilir."
        actions={
          <a
            href={gtmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            GTM&apos;de Aç
          </a>
        }
      />

      {/* GTM — the single source of truth */}
      <section aria-labelledby="gtm-h" className="space-y-3">
        <h2 id="gtm-h" className="font-heading text-lg font-semibold text-ink">
          Google Tag Manager
        </h2>
        <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
                <Tag className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading font-semibold text-ink">Konteyner Kimliği</p>
                <code className="mt-0.5 block text-lg font-bold tracking-wide text-navy">
                  {gtmId ?? 'Tanımlı değil'}
                </code>
                <p className="mt-1 text-xs text-ink-muted">
                  Yalnızca <code>NEXT_PUBLIC_GTM_ID</code> ortam değişkeninden okunur (Vercel).
                </p>
              </div>
            </div>
            <StatusBadge
              label={gtmConfigured ? 'Bağlı' : 'Yapılandırılmadı'}
              tone={gtmConfigured ? 'success' : 'warning'}
            />
          </div>
        </div>

        <StatusAlert tone="info" title="GA4 ve Google Ads nerede yönetilir?">
          <p>
            Site yalnızca yapılandırılmış <code>vis_*</code> dataLayer olaylarını gönderir. GA4 Ölçüm Kimliği,
            Google Ads Dönüşüm Kimliği/Etiketleri ve tüm tetikleyiciler <strong>GTM konteyneri içinde</strong>{' '}
            tanımlıdır — bu panelde tutulmaz. Değişiklik için yukarıdaki <strong>GTM&apos;de Aç</strong> bağlantısını
            kullanın.
          </p>
        </StatusAlert>
      </section>

      {/* Event dictionary — vis_* → GA4 → Ads */}
      <section aria-labelledby="events-h" className="space-y-3">
        <h2 id="events-h" className="font-heading text-lg font-semibold text-ink">
          Olay Sözlüğü
        </h2>
        <p className="text-sm text-ink-soft">
          Sitenin dataLayer&apos;a gönderdiği PII içermeyen olaylar ve GTM içindeki GA4 / Google Ads eşlemeleri.
        </p>
        <DataTable columns={eventColumns} rows={events} getRowKey={(e) => e.event} emptyTitle="Olay tanımı yok" />
        <StatusAlert tone="info">
          <code>vis_lead_submit</code> ayrıca Google Ads Gelişmiş Dönüşümler (Enhanced Conversions) için normalize
          edilmiş <code>user_data</code> (e-posta, telefon E.164, ad/soyad) taşır. Bu veri yalnızca GTM&apos;deki Ads
          User-Provided Data etiketine gider, <strong>GA4&apos;e asla gönderilmez</strong>.
        </StatusAlert>
      </section>

      {/* Consent model (read-only) */}
      <section aria-labelledby="consent-h" className="space-y-3">
        <h2 id="consent-h" className="font-heading text-lg font-semibold text-ink">
          Onay Modeli (Consent Mode v2)
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {CONSENT_CATEGORIES.map((c) => (
            <div key={c.id} className="rounded-card border border-line-light bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-sm font-semibold text-ink">{c.label}</p>
                <StatusBadge label={c.state} tone={c.tone} />
              </div>
              <p className="mt-1.5 text-xs text-ink-soft">{c.description}</p>
            </div>
          ))}
        </div>
        <StatusAlert tone="info">
          Kullanıcı seçimini çerez bannerından yapar (Tümünü Kabul Et / Reddet / Tercihleri Yönet). Varsayılan tüm
          izinler <strong>reddedilir</strong>; onay verilene kadar ne Google etiketleri ne de birinci taraf ölçümü
          çalışır. Kullanıcı, alt bilgideki <strong>Çerez Tercihleri</strong> bağlantısından onayını değiştirebilir.
        </StatusAlert>
      </section>

      {/* PII policy */}
      <section aria-labelledby="pii-h" className="space-y-3">
        <h2 id="pii-h" className="font-heading text-lg font-semibold text-ink">
          Güvenlik ve Gizlilik Politikası
        </h2>
        <StatusAlert tone="info">
          <p>
            Bu kurulumda <strong>keyfi JavaScript veya özel betik eklenemez</strong>; ölçüm yalnızca önceden tanımlı
            <code> vis_*</code> olayları üzerinden yapılır. Aşağıdaki kişisel veri (PII) parametreleri hiçbir GA4
            olayına <strong>asla gönderilmez</strong> ve sunucu tarafında engellenir:
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
      </section>

      {/* Debug */}
      <section aria-labelledby="debug-h" className="space-y-3">
        <h2 id="debug-h" className="font-heading text-lg font-semibold text-ink">
          Test & Hata Ayıklama
        </h2>
        <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
          <p className="font-heading text-sm font-semibold text-ink">dataLayer izleme (geliştirici)</p>
          <p className="mt-1 text-xs text-ink-soft">
            Tarayıcı konsolunda her dataLayer gönderimini okunur bir tabloda görmek için:
          </p>
          <code className="mt-2 block rounded-md bg-navy/5 px-3 py-2 text-xs text-navy">
            window.visTrackingDebug = true
          </code>
          <p className="mt-2 text-xs text-ink-muted">
            Geliştirme ortamında (NODE_ENV=development) günlükler zaten açıktır. Canlı doğrulama için GTM Önizleme
            (Tag Assistant) ve GA4 DebugView kullanın.
          </p>
        </div>
      </section>

      {/* Health checks (real, derived from env) */}
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
            <span className="text-sm text-ink">
              Keyfi betik enjeksiyonu devre dışı — yalnızca GTM konteyneri üzerinden onaylı etiketler.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
