import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FlagTriangleRight,
  Inbox,
  Megaphone,
  Rss,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

import { MetricCard, PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { UrlDateRange } from '@/components/admin/ui/UrlDateRange';
import { getContentRepository } from '@/content/repository';
import { getSubmittedAdminLeads } from '@/lib/admin/lead-bridge';
import {
  RANGE_LABELS,
  dailyBuckets,
  isInRange,
  resolveRange,
  type RangeKey,
} from '@/lib/admin/date-range';
import { requireAdmin } from '@/lib/auth/guard';
import { STATUS_LABELS } from '@/lib/data/mock-pipeline';
import { codeToFlag } from '@/lib/utils';

// Live data: reads the real submission store + the current date on every request.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { range?: string; from?: string; to?: string };
}) {
  const user = requireAdmin('dashboard');
  const repo = getContentRepository();
  const [countries, articles, services, allLeads] = await Promise.all([
    repo.getCountries(),
    repo.getArticles(),
    repo.getServices(),
    getSubmittedAdminLeads(),
  ]);

  const rangeKey = (searchParams.range as RangeKey) || '7d';
  const range = resolveRange(rangeKey, searchParams.from, searchParams.to);
  const rangeLabel = RANGE_LABELS[range.key];

  // Real, persisted leads within the selected range (newest first already).
  const leads = allLeads.filter((l) => isInRange(l.createdAt, range));
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const adsCount = leads.filter((l) => l.source === 'Google Ads').length;
  const organicCount = total - adsCount;

  const recent = leads.slice(0, 5);

  // Leads still awaiting first contact (across all time) — the real "to-do" list.
  const needAction = allLeads.filter((l) => l.status === 'new').slice(0, 4);

  // Real activity chart: last 7 days, split by channel (Google Ads vs Organik).
  const buckets = dailyBuckets(allLeads, (l) => l.createdAt, 7);
  const weekly = buckets.map((b) => {
    const ads = b.items.filter((l) => l.source === 'Google Ads').length;
    return { day: b.label, ads, organic: b.items.length - ads };
  });
  const maxBar = Math.max(1, ...weekly.flatMap((b) => [b.ads, b.organic]));

  // Real system-health notices from configuration.
  const notices = [
    !process.env.DATABASE_URL && {
      title: 'Veritabanı bağlı değil',
      desc: 'Başvurular geçici bellekte tutuluyor; DATABASE_URL tanımlanmalı.',
      tone: 'critical' as const,
    },
    !process.env.EMAIL_PROVIDER && {
      title: 'E-posta bildirimleri kapalı',
      desc: 'Yeni başvuru e-postaları için EMAIL_PROVIDER yapılandırılmalı.',
      tone: 'warning' as const,
    },
    !process.env.NEXT_PUBLIC_GTM_ID && {
      title: 'Dönüşüm takibi eksik',
      desc: 'GTM kimliği (NEXT_PUBLIC_GTM_ID) tanımlı değil.',
      tone: 'warning' as const,
    },
  ].filter(Boolean) as { title: string; desc: string; tone: 'critical' | 'warning' }[];

  const flag = (slug: string) => countries.find((c) => c.slug === slug)?.code ?? 'EU';

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Genel Bakış"
        description={`Hoş geldiniz, ${user.name.split(' ')[0]}. Seçili dönem: ${rangeLabel}.`}
        actions={<UrlDateRange defaultRange="7d" />}
      />

      {/* Metrics — all derived from real submissions in the selected range */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Başvuru" value={total} icon={Inbox} hint={rangeLabel} />
        <MetricCard
          label="Yeni Başvurular"
          value={newCount}
          icon={FileText}
          tone={newCount > 0 ? 'action' : 'default'}
        />
        <MetricCard label="Google Ads" value={adsCount} icon={Megaphone} hint={rangeLabel} />
        <MetricCard label="Organik / Diğer" value={organicCount} icon={TrendingUp} hint={rangeLabel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent leads */}
        <section className="rounded-card border border-line-light bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line-light p-5">
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">Son Başvurular</h2>
              <p className="text-xs text-ink-soft">
                {rangeLabel} · {total} başvuru
              </p>
            </div>
            <Link href="/admin/leads" className="text-sm font-semibold text-gold hover:text-gold-hover">
              Tümünü Gör →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recent.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink-soft">Bu dönemde başvuru bulunmuyor.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line-light text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-5 py-3 font-semibold">Referans</th>
                    <th className="px-5 py-3 font-semibold">Başvuran</th>
                    <th className="px-5 py-3 font-semibold">Ülke</th>
                    <th className="px-5 py-3 font-semibold">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-light">
                  {recent.map((l) => {
                    const st = STATUS_LABELS[l.status] ?? { label: l.status, tone: 'neutral' as const };
                    return (
                      <tr key={l.id} className="hover:bg-admin">
                        <td className="px-5 py-3">
                          <Link href={`/admin/leads/${l.id}`} className="font-medium text-navy hover:text-gold">
                            #{l.reference}
                          </Link>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-surface text-[11px] font-bold text-navy">
                              {l.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                            <span className="text-ink">{l.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-soft">
                          {codeToFlag(flag(l.country))}{' '}
                          {l.country.charAt(0).toUpperCase() + l.country.slice(1)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge label={st.label} tone={st.tone} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* To-do + system health */}
        <div className="space-y-6">
          <section className="rounded-card border border-line-light bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-ink">İşlem Bekleyen</h2>
              {needAction.length > 0 && <StatusBadge label={`${needAction.length} yeni`} tone="warning" />}
            </div>
            <ul className="mt-4 space-y-3">
              {needAction.length === 0 ? (
                <li className="flex items-center gap-2 rounded-card border border-line-light p-3.5 text-sm text-ink-soft">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  Bekleyen yeni başvuru yok. Her şey güncel.
                </li>
              ) : (
                needAction.map((l) => (
                  <li key={l.id} className="flex gap-3 rounded-card border border-warning/20 bg-warning/5 p-3.5">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-warning/10 text-warning">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="font-heading text-sm font-semibold text-ink hover:text-gold"
                      >
                        {l.name} · #{l.reference}
                      </Link>
                      <p className="truncate text-xs text-ink-soft">İlk iletişim bekliyor · {l.source}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-card bg-navy-deep p-5 text-white/80 shadow-card">
            <h2 className="font-heading text-base font-bold text-white">Sistem Durumu</h2>
            <ul className="mt-3 space-y-3">
              {notices.length === 0 ? (
                <li className="flex items-center gap-2 border-l-2 border-success pl-3">
                  <Sparkles className="h-4 w-4 text-success" aria-hidden="true" />
                  <p className="text-sm text-white/80">Tüm entegrasyonlar yapılandırılmış.</p>
                </li>
              ) : (
                notices.map((n) => (
                  <li
                    key={n.title}
                    className={`border-l-2 pl-3 ${n.tone === 'critical' ? 'border-danger' : 'border-gold'}`}
                  >
                    <p className="font-heading text-sm font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-white/55">{n.desc}</p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Chart + stat tiles */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-card border border-line-light bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">Başvuru Yoğunluğu</h2>
              <p className="text-xs text-ink-soft">Son 7 günün kanal bazlı başvuru trendi</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-navy" /> Google Ads
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Organik
              </span>
            </div>
          </div>
          <div
            className="mt-6 flex h-48 items-end justify-between gap-3"
            role="img"
            aria-label="Son 7 gün başvuru grafiği"
          >
            {weekly.map((b, i) => (
              <div key={`${b.day}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <div
                    className="w-1/2 rounded-t bg-navy"
                    style={{ height: `${(b.ads / maxBar) * 100}%` }}
                    title={`${b.ads} Google Ads`}
                  />
                  <div
                    className="w-1/2 rounded-t bg-gold"
                    style={{ height: `${(b.organic / maxBar) * 100}%` }}
                    title={`${b.organic} organik`}
                  />
                </div>
                <span className="text-[11px] text-ink-muted">{b.day}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <StatTile icon={<FlagTriangleRight className="h-5 w-5" />} value={countries.length} label="Aktif Ülke" />
          <StatTile icon={<Rss className="h-5 w-5" />} value={articles.length} label="Blog Yazısı" />
          <StatTile icon={<FileText className="h-5 w-5" />} value={services.length} label="Hizmet" />
          <StatTile icon={<Inbox className="h-5 w-5" />} value={allLeads.length} label="Toplam Başvuru" />
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-line-light bg-white p-5 text-center shadow-card">
      <span className="text-gold">{icon}</span>
      <p className="mt-2 font-heading text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-ink-muted">{label}</p>
    </div>
  );
}
