'use client';

import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { StatusBadge } from '@/components/admin/ui/primitives';
import type { AuditEvent, AuditResult, AuditSeverity } from '@/types/admin';
import { formatDateTr } from '@/lib/utils';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'critical';

const SEVERITY_META: Record<AuditSeverity, { label: string; tone: Tone }> = {
  critical: { label: 'Kritik', tone: 'critical' },
  warning: { label: 'Uyarı', tone: 'warning' },
  notice: { label: 'Bildirim', tone: 'info' },
  info: { label: 'Bilgi', tone: 'neutral' },
};

const RESULT_META: Record<AuditResult, { label: string; tone: Tone }> = {
  success: { label: 'Başarılı', tone: 'success' },
  denied: { label: 'Reddedildi', tone: 'warning' },
  failure: { label: 'Hata', tone: 'danger' },
};

const REVIEW_META: Record<AuditEvent['reviewStatus'], { label: string; tone: Tone }> = {
  none: { label: 'İncelenmedi', tone: 'neutral' },
  reviewed: { label: 'İncelendi', tone: 'success' },
  investigating: { label: 'Soruşturuluyor', tone: 'warning' },
  legal_hold: { label: 'Yasal Saklama', tone: 'critical' },
};

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Panel',
  leads: 'Başvurular',
  pipeline: 'İş Akışı',
  countries: 'Ülkeler',
  country_pages: 'Ülke Sayfaları',
  services: 'Hizmetler',
  blog: 'Blog',
  faq: 'SSS',
  forms: 'Formlar',
  homepage: 'Ana Sayfa',
  navigation: 'Navigasyon',
  tracking: 'Takip',
  settings: 'Ayarlar',
  users: 'Kullanıcılar',
  audit: 'Denetim',
};

function dateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const time = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(d);
  return `${formatDateTr(iso)} ${time}`;
}

const PAGE_SIZE = 10;

/**
 * Read-only audit log table. Events are immutable: there are no edit/delete
 * controls — only a "Detay" link. "Daha Fazla Yükle" demonstrates cursor
 * pagination over the in-memory list.
 */
export function AuditTable({ events, canRevealSensitive }: { events: AuditEvent[]; canRevealSensitive: boolean }) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const visible = events.slice(0, limit);
  const hasMore = limit < events.length;

  const columns: Column<AuditEvent>[] = [
    { key: 'at', header: 'Zaman', render: (e) => <span className="whitespace-nowrap text-ink-soft">{dateTime(e.at)}</span> },
    { key: 'severity', header: 'Önem', render: (e) => <StatusBadge label={SEVERITY_META[e.severity].label} tone={SEVERITY_META[e.severity].tone} /> },
    {
      key: 'event',
      header: 'Olay',
      render: (e) => (
        <span className="font-mono text-xs font-semibold text-ink">
          {e.event}
          {e.sensitive && <span className="ml-1.5 align-middle text-[10px] font-bold uppercase text-critical">hassas</span>}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Aktör',
      hideOnMobile: true,
      render: (e) => (
        <div>
          <p className="font-semibold text-ink">{e.actorName}</p>
          <p className="text-xs text-ink-muted">{e.actorRole}</p>
        </div>
      ),
    },
    { key: 'target', header: 'Hedef', hideOnMobile: true, render: (e) => <span className="text-ink-soft">{e.target}</span> },
    { key: 'module', header: 'Modül', hideOnMobile: true, render: (e) => <span className="text-ink-soft">{MODULE_LABELS[e.module] ?? e.module}</span> },
    { key: 'result', header: 'Sonuç', render: (e) => <StatusBadge label={RESULT_META[e.result].label} tone={RESULT_META[e.result].tone} /> },
    { key: 'review', header: 'İnceleme', hideOnMobile: true, render: (e) => <StatusBadge label={REVIEW_META[e.reviewStatus].label} tone={REVIEW_META[e.reviewStatus].tone} /> },
    {
      key: 'actions',
      header: 'İşlemler',
      className: 'text-right',
      render: (e) => (
        <Link
          href={`/admin/denetim-kayitlari/${e.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Detay
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {!canRevealSensitive && events.some((e) => e.sensitive) && (
        <p className="text-xs text-ink-muted">Hassas olarak işaretli kayıtların değer detayları görüntüleme yetkisi gerektirir.</p>
      )}
      <DataTable
        columns={columns}
        rows={visible}
        getRowKey={(e) => e.id}
        emptyTitle="Kayıt bulunamadı"
        emptyDescription="Bu kategoride denetim kaydı yok."
      />
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
          >
            Daha Fazla Yükle ({events.length - visible.length})
          </button>
        </div>
      )}
    </div>
  );
}
