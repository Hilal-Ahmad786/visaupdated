import { AlertTriangle, CalendarDays, FileText, FlagTriangleRight, Inbox, Rss, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { MetricCard, PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { adminLeads, maskPhone } from '@/lib/data/mock-leads';
import { STATUS_LABELS } from '@/lib/data/mock-pipeline';
import { codeToFlag } from '@/lib/utils';

const weeklyBars = [
  { day: 'Paz', apps: 8, appts: 2 },
  { day: 'Pzt', apps: 14, appts: 4 },
  { day: 'Sal', apps: 22, appts: 6 },
  { day: 'Çar', apps: 12, appts: 3 },
  { day: 'Per', apps: 18, appts: 5 },
  { day: 'Cum', apps: 24, appts: 9 },
  { day: 'Cmt', apps: 10, appts: 3 },
];
const maxBar = Math.max(...weeklyBars.flatMap((b) => [b.apps, b.appts]));

const priorityTasks = [
  { title: 'Almanya Randevuları', desc: 'iData sisteminde açılan boşlukları kontrol et.', tone: 'critical' as const },
  { title: 'VİP Müşteri Dönüşü', desc: "Sayın Aras Bulut'un vize sonucunu bildir.", tone: 'normal' as const },
  { title: 'Evrak Kontrolü', desc: '#VV-2026-009190 nolu başvurunun tercüme onayı.', tone: 'normal' as const },
];

const systemNotices = [
  { title: 'Analytics yapılandırması eksik', desc: 'Dönüşüm izleme verileri doğru gelmiyor olabilir.' },
  { title: 'Yedekleme tamamlandı', desc: 'Tüm veritabanı yedeği başarıyla buluta yüklendi.' },
];

export default async function AdminDashboardPage() {
  const user = requireAdmin('dashboard');
  const repo = getContentRepository();
  const [countries, articles, services] = await Promise.all([repo.getCountries(), repo.getArticles(), repo.getServices()]);

  const recent = adminLeads.slice(0, 5);
  const newCount = adminLeads.filter((l) => l.status === 'new').length;
  const followUp = adminLeads.filter((l) => l.followUpAt).length;

  const flag = (slug: string) => countries.find((c) => c.slug === slug)?.code ?? 'EU';

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Genel Bakış"
        description={`Hoş geldiniz, ${user.name.split(' ')[0]}. Bugün sistemde neler olduğunu kontrol edin.`}
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-line-light bg-white p-1 text-sm">
            <button className="rounded-md bg-navy px-3 py-1.5 font-medium text-white">Son 7 Gün</button>
            <button className="rounded-md px-3 py-1.5 text-ink-soft hover:bg-surface">Bu Ay</button>
            <button className="rounded-md px-3 py-1.5 text-ink-soft hover:bg-surface">Yıllık</button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Yeni Başvurular" value={newCount} icon={FileText} trend={{ value: '%12', direction: 'up' }} />
        <MetricCard label="Takip Bekleyen" value={followUp} icon={Inbox} tone="action" />
        <MetricCard label="Randevu Talepleri" value={8} icon={CalendarDays} />
        <MetricCard label="Form Dönüşümü" value="%4.8" icon={TrendingUp} trend={{ value: '%0.4', direction: 'up' }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent leads */}
        <section className="rounded-card border border-line-light bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line-light p-5">
            <h2 className="font-heading text-lg font-bold text-ink">Son Başvurular</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-gold hover:text-gold-hover">Tümünü Gör →</Link>
          </div>
          <div className="overflow-x-auto">
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
                        <Link href={`/admin/leads/${l.id}`} className="font-medium text-navy hover:text-gold">#{l.reference.replace('VV-2026-', 'VV-')}</Link>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-surface text-[11px] font-bold text-navy">{l.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                          <span className="text-ink">{l.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-soft">{codeToFlag(flag(l.country))} {l.country.charAt(0).toUpperCase() + l.country.slice(1)}</td>
                      <td className="px-5 py-3"><StatusBadge label={st.label} tone={st.tone} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Priority + notices */}
        <div className="space-y-6">
          <section className="rounded-card border border-line-light bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-ink">Öncelikli İşler</h2>
              <StatusBadge label="3 Kritik" tone="critical" />
            </div>
            <ul className="mt-4 space-y-3">
              {priorityTasks.map((t) => (
                <li key={t.title} className={`flex gap-3 rounded-card border p-3.5 ${t.tone === 'critical' ? 'border-danger/20 bg-danger/5' : 'border-line-light'}`}>
                  <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${t.tone === 'critical' ? 'bg-danger/10 text-danger' : 'bg-surface text-ink-soft'}`}>
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-ink">{t.title}</p>
                    <p className="text-xs text-ink-soft">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card bg-navy-deep p-5 text-white/80 shadow-card">
            <h2 className="font-heading text-base font-bold text-white">Sistem Bildirimleri</h2>
            <ul className="mt-3 space-y-3">
              {systemNotices.map((n) => (
                <li key={n.title} className="border-l-2 border-gold pl-3">
                  <p className="font-heading text-sm font-semibold text-white">{n.title}</p>
                  <p className="text-xs text-white/55">{n.desc}</p>
                </li>
              ))}
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
              <p className="text-xs text-ink-soft">Haftalık başvuru ve talep trendi</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-navy" /> Başvurular</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold" /> Randevular</span>
            </div>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-3" role="img" aria-label="Haftalık başvuru ve randevu grafiği">
            {weeklyBars.map((b) => (
              <div key={b.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <div className="w-1/2 rounded-t bg-navy" style={{ height: `${(b.apps / maxBar) * 100}%` }} title={`${b.apps} başvuru`} />
                  <div className="w-1/2 rounded-t bg-gold" style={{ height: `${(b.appts / maxBar) * 100}%` }} title={`${b.appts} randevu`} />
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
          <StatTile icon={<Inbox className="h-5 w-5" />} value={adminLeads.length} label="Toplam Başvuru" />
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
