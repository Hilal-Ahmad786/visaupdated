import { MessageCircle, MessagesSquare, MousePointerClick, Phone, Network, Repeat, Fingerprint, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { and, desc, eq, gte, lt, inArray, isNotNull, sql } from 'drizzle-orm';

import { Column, DataTable } from '@/components/admin/ui/DataTable';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { EmptyState } from '@/components/ui/states';
import { isDbConfigured, requireDb } from '@/db';
import { clickEvents } from '@/db/schema';
import { requireAdmin } from '@/lib/auth/guard';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TRACKED = ['phone_click', 'whatsapp_click', 'quote_click', 'chat_open'] as const;

const BUTTON_LABELS: Record<string, string> = {
  phone_click: 'Telefon',
  whatsapp_click: 'WhatsApp',
  quote_click: 'Teklif',
  chat_open: 'Sohbet',
};

const dateFmt = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Europe/Istanbul',
});

/** Distinct colors so the same IP is instantly recognizable across rows. */
const IP_COLORS = [
  '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

const PRESETS: { key: string; label: string }[] = [
  { key: 'today', label: 'Bugün' },
  { key: 'yesterday', label: 'Dün' },
  { key: '7d', label: '7 Gün' },
  { key: '30d', label: '30 Gün' },
  { key: '90d', label: '90 Gün' },
];

type SP = { period?: string; from?: string; to?: string };

/** Türkiye (UTC+3, no DST) is fixed — build day boundaries with a +03:00 offset. */
function resolveRange(sp: SP) {
  const now = new Date();
  const istToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(now);
  const todayStart = new Date(`${istToday}T00:00:00+03:00`);
  const period = sp.period ?? '30d';

  if (period === 'today') return { period, from: todayStart, to: now, label: 'Bugün', fromStr: istToday, toStr: istToday };
  if (period === 'yesterday') {
    const y = new Date(todayStart.getTime() - 86_400_000);
    const yStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(y);
    return { period, from: y, to: todayStart, label: 'Dün', fromStr: yStr, toStr: yStr };
  }
  if (period === 'custom' && sp.from && sp.to) {
    const from = new Date(`${sp.from}T00:00:00+03:00`);
    const to = new Date(new Date(`${sp.to}T00:00:00+03:00`).getTime() + 86_400_000);
    if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from < to) {
      return { period, from, to, label: `${sp.from} – ${sp.to}`, fromStr: sp.from, toStr: sp.to };
    }
  }
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  return {
    period: period === '7d' || period === '90d' ? period : '30d',
    from: new Date(now.getTime() - days * 86_400_000),
    to: now,
    label: `Son ${days} gün`,
    fromStr: istToday,
    toStr: istToday,
  };
}

interface ClickRow {
  id: string;
  name: string;
  location: string | null;
  pageUrl: string | null;
  ipHash: string | null;
  occurredAt: Date;
}

export default async function ClickReportPage({
  searchParams,
}: {
  // Next 14: searchParams is a plain object (not a Promise).
  searchParams: SP;
}) {
  requireAdmin('leads');
  const range = resolveRange(searchParams);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Tıklama Raporu"
        description={`Telefon, WhatsApp ve teklif butonlarına yapılan tıklamalar (birinci taraf takip). Seçili dönem: ${range.label} · Türkiye saati.`}
      />

      {!isDbConfigured ? (
        <EmptyState
          title="Veritabanı yapılandırılmamış"
          description="Tıklama takibi için DATABASE_URL ortam değişkeni ayarlanmalıdır."
        />
      ) : (
        <ClickReportBody range={range} />
      )}
    </div>
  );
}

async function ClickReportBody({ range }: { range: ReturnType<typeof resolveRange> }) {
  const db = requireDb();
  const baseWhere = and(
    inArray(clickEvents.name, [...TRACKED]),
    gte(clickEvents.occurredAt, range.from),
    lt(clickEvents.occurredAt, range.to),
  );

  const visitWhere = and(
    eq(clickEvents.name, 'page_view'),
    gte(clickEvents.occurredAt, range.from),
    lt(clickEvents.occurredAt, range.to),
  );

  const [byName, agg, ipGroups, rows, visitAgg] = await Promise.all([
    db.select({ name: clickEvents.name, c: sql<number>`count(*)::int` }).from(clickEvents).where(baseWhere).groupBy(clickEvents.name),
    db
      .select({
        total: sql<number>`count(*)::int`,
        uniqueIps: sql<number>`count(distinct ${clickEvents.ipHash})::int`,
      })
      .from(clickEvents)
      .where(baseWhere),
    db
      .select({ ip: clickEvents.ipHash, c: sql<number>`count(*)::int` })
      .from(clickEvents)
      .where(and(baseWhere, isNotNull(clickEvents.ipHash)))
      .groupBy(clickEvents.ipHash)
      .orderBy(desc(sql`count(*)`)),
    db.select().from(clickEvents).where(baseWhere).orderBy(desc(clickEvents.occurredAt)).limit(200) as Promise<ClickRow[]>,
    db
      .select({
        visits: sql<number>`count(*)::int`,
        visitors: sql<number>`count(distinct ${clickEvents.sessionId})::int`,
        ips: sql<number>`count(distinct ${clickEvents.ipHash})::int`,
      })
      .from(clickEvents)
      .where(visitWhere),
  ]);

  const visits = Number(visitAgg[0]?.visits ?? 0);
  const visitVisitors = Number(visitAgg[0]?.visitors ?? 0);
  const visitIps = Number(visitAgg[0]?.ips ?? 0);

  const counts: Record<string, number> = {};
  for (const r of byName) counts[r.name] = Number(r.c);

  const total = Number(agg[0]?.total ?? 0);
  const uniqueIps = Number(agg[0]?.uniqueIps ?? 0);
  const repeatIps = ipGroups.filter((g) => Number(g.c) > 1).length;

  const ipInfo = new Map<string, { label: string; color: string; count: number }>();
  ipGroups.forEach((g, i) => {
    if (!g.ip) return;
    ipInfo.set(g.ip, { label: `IP #${i + 1}`, color: IP_COLORS[i % IP_COLORS.length] ?? '#0ea5e9', count: Number(g.c) });
  });

  const presetHref = (key: string) =>
    key === 'custom'
      ? `/admin/tiklama-raporu?period=custom&from=${range.fromStr}&to=${range.toStr}`
      : `/admin/tiklama-raporu?period=${key}`;

  const columns: Column<ClickRow>[] = [
    {
      key: 'occurredAt',
      header: 'Zaman',
      render: (row) => <span className="whitespace-nowrap text-ink-soft">{dateFmt.format(row.occurredAt)}</span>,
    },
    {
      key: 'name',
      header: 'Buton',
      render: (row) => <span className="font-medium text-ink">{BUTTON_LABELS[row.name] ?? row.name}</span>,
    },
    { key: 'location', header: 'Yer', render: (row) => <span className="text-ink-soft">{row.location ?? '—'}</span> },
    { key: 'pageUrl', header: 'Sayfa', render: (row) => <span className="text-ink-soft">{row.pageUrl ?? '—'}</span> },
    {
      key: 'ipHash',
      header: 'IP',
      render: (row) => {
        const info = row.ipHash ? ipInfo.get(row.ipHash) : undefined;
        return info ? (
          <span
            title={`${info.count} tıklama bu IP'den`}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: info.color }}
          >
            {info.label}
            {info.count > 1 && <span className="opacity-80">×{info.count}</span>}
          </span>
        ) : (
          <span className="text-xs text-ink-soft">IP yok</span>
        );
      },
    },
  ];

  return (
    <>
      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <Link
            key={p.key}
            href={presetHref(p.key)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
              p.key === range.period
                ? 'border-ink bg-ink text-white'
                : 'border-line-light bg-white text-ink-soft hover:bg-admin',
            )}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* Custom date range */}
      <form method="get" className="flex flex-wrap items-end gap-3 rounded-xl border border-line-light bg-white p-4">
        <input type="hidden" name="period" value="custom" />
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Başlangıç</label>
          <input type="date" name="from" defaultValue={range.fromStr} className="rounded-lg border border-line-light px-3 py-2 text-sm text-ink" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Bitiş</label>
          <input type="date" name="to" defaultValue={range.toStr} className="rounded-lg border border-line-light px-3 py-2 text-sm text-ink" />
        </div>
        <button type="submit" className="rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-white">
          Tarih aralığını uygula
        </button>
      </form>

      {/* Visit summary (everyone — including people who don't call/form) */}
      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-ink">Ziyaret Özeti</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Toplam ziyaret" value={visits} icon={Eye} hint="sayfa görüntüleme" />
          <MetricCard label="Benzersiz ziyaretçi" value={visitVisitors} icon={Users} hint="farklı oturum" />
          <MetricCard label="Benzersiz IP" value={visitIps} icon={Network} hint="farklı IP adresi" />
        </div>
        <p className="text-xs text-ink-soft">
          Siteyi ziyaret eden herkes sayılır (arama/form yapmasa bile).{' '}
          {visits > 0
            ? `Bu dönemde ${visits} ziyaretin ${total} tanesi bir butona tıklamayla sonuçlandı (≈%${Math.round(
                (total / visits) * 100,
              )} dönüşüm).`
            : 'Ziyaret verisi bu özellik yayına alındıktan sonraki ziyaretler için birikir.'}
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Telefon" value={counts.phone_click ?? 0} icon={Phone} />
        <MetricCard label="WhatsApp" value={counts.whatsapp_click ?? 0} icon={MessageCircle} />
        <MetricCard label="Teklif" value={counts.quote_click ?? 0} icon={MousePointerClick} />
        <MetricCard label="Sohbet" value={counts.chat_open ?? 0} icon={MessagesSquare} />
      </div>

      {/* IP signal */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Toplam tıklama" value={total} icon={Fingerprint} />
        <MetricCard label="Farklı IP" value={uniqueIps} icon={Network} />
        <MetricCard label="Tekrar eden IP" value={repeatIps} icon={Repeat} />
      </div>

      <p className="text-xs text-ink-soft">
        Her farklı IP&apos;ye bir renk/numara verilir. Aynı renk = büyük olasılıkla aynı kişi/cihaz; farklı
        renkler = farklı ziyaretçiler. IP&apos;ler gizlilik için geri döndürülemez şekilde özetlenir (ham IP saklanmaz).
      </p>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-ink">Son Tıklamalar</h2>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          emptyTitle="Bu dönemde tıklama yok"
          emptyDescription="Seçili tarih aralığında kayıtlı tıklama bulunmuyor."
        />
      </section>
    </>
  );
}
