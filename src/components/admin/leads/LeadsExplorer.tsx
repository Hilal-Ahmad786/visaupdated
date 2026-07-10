'use client';

import {
  Archive,
  CalendarClock,
  CalendarDays,
  Download,
  FileText,
  Filter,
  Inbox,
  Search,
  SlidersHorizontal,
  UserPlus,
  UserX,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { DateRangeChips } from '@/components/admin/ui/DateRangeChips';
import { Dialog, SideDrawer } from '@/components/admin/ui/Dialog';
import { SensitiveValue } from '@/components/admin/ui/SensitiveValue';
import { MetricCard, StatusBadge } from '@/components/admin/ui/primitives';
import { bulkArchiveLeadsAction, bulkAssignLeadsAction } from '@/lib/admin/lead-actions';
import { RANGE_LABELS, isInRange, resolveRange, type RangeKey } from '@/lib/admin/date-range';
import { maskEmail, maskPhone } from '@/lib/data/mock-leads';
import { STATUS_LABELS } from '@/lib/data/mock-pipeline';
import type { AdminLead, LeadPriority } from '@/types/admin';
import { cn, codeToFlag, formatDateTimeTr, formatDateTr, normalizeTr } from '@/lib/utils';

export interface CountryRef {
  slug: string;
  code: string;
  name: string;
}
export interface UserRef {
  id: string;
  name: string;
}

const PAGE_SIZE = 6;

const PRIORITY_META: Record<LeadPriority, { label: string; tone: 'neutral' | 'info' | 'warning' | 'critical' }> = {
  low: { label: 'Düşük', tone: 'neutral' },
  normal: { label: 'Normal', tone: 'info' },
  high: { label: 'Yüksek', tone: 'warning' },
  urgent: { label: 'Acil', tone: 'critical' },
};

type QuickFilter = 'all' | 'new' | 'progress' | 'followup' | 'spam';

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'new', label: 'Yeni' },
  { id: 'progress', label: 'İşlemde' },
  { id: 'followup', label: 'Takip' },
  { id: 'spam', label: 'Spam' },
];

const PROGRESS_STATUSES = new Set(['contacted', 'qualified', 'documents', 'appointment']);

// Demo saved views — apply a deterministic preset (no persistence).
const SAVED_VIEWS: { id: string; label: string; priority?: LeadPriority; quick?: QuickFilter }[] = [
  { id: 'urgent', label: 'Acil Olanlar', priority: 'urgent' },
  { id: 'unassigned', label: 'Atanmamışlar' },
  { id: 'today-followup', label: 'Takip Bekleyen', quick: 'followup' },
];

export function LeadsExplorer({
  leads,
  countries,
  users,
  canRevealSensitive,
  canExport,
}: {
  leads: AdminLead[];
  countries: CountryRef[];
  users: UserRef[];
  canRevealSensitive: boolean;
  canExport: boolean;
}) {
  const { notify } = useToast();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [quick, setQuick] = useState<QuickFilter>('all');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkAssignUser, setBulkAssignUser] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);

  // Advanced filters
  const [countrySlug, setCountrySlug] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<LeadPriority | ''>('');
  const [activeView, setActiveView] = useState('');

  // Date-range filter (Bugün / Dün / Son 7 Gün / Bu Ay / Tümü / Özel).
  const [dateKey, setDateKey] = useState<RangeKey>('all');
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  const countryMap = useMemo(() => new Map(countries.map((c) => [c.slug, c])), [countries]);
  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u.name])), [users]);

  const resetFilters = () => {
    setSearch('');
    setQuick('all');
    setCountrySlug('');
    setAssigneeId('');
    setPriority('');
    setActiveView('');
    setDateKey('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  // Leads within the selected date range only — drives the metric cards so they
  // always reflect the chosen period. Other filters narrow this further below.
  const dateFiltered = useMemo(() => {
    const range = resolveRange(dateKey, dateFrom, dateTo);
    return leads.filter((l) => isInRange(l.createdAt, range));
  }, [leads, dateKey, dateFrom, dateTo]);

  const metrics = useMemo(
    () => ({
      newCount: dateFiltered.filter((l) => l.status === 'new').length,
      unassigned: dateFiltered.filter((l) => !l.assigneeId).length,
      overdue: dateFiltered.filter(
        (l) => l.followUpAt && new Date(l.followUpAt).getTime() < new Date(l.lastActivityAt).getTime(),
      ).length,
      appointments: dateFiltered.filter((l) => l.status === 'appointment').length,
    }),
    [dateFiltered],
  );

  const rangeLabel = RANGE_LABELS[dateKey];

  const filtered = useMemo(() => {
    const q = normalizeTr(search);
    return dateFiltered.filter((l) => {
      if (quick === 'new' && l.status !== 'new') return false;
      if (quick === 'spam' && l.status !== 'spam') return false;
      if (quick === 'progress' && !PROGRESS_STATUSES.has(l.status)) return false;
      if (quick === 'followup' && !l.followUpAt) return false;
      if (countrySlug && l.country !== countrySlug) return false;
      if (assigneeId === '__none__' && l.assigneeId) return false;
      if (assigneeId && assigneeId !== '__none__' && l.assigneeId !== assigneeId) return false;
      if (priority && l.priority !== priority) return false;
      if (q) {
        const hay = normalizeTr(`${l.reference} ${l.name} ${l.email} ${l.phone} ${l.city ?? ''} ${l.country}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [dateFiltered, search, quick, countrySlug, assigneeId, priority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const advancedCount = [countrySlug, assigneeId, priority].filter(Boolean).length;

  const applyView = (view: (typeof SAVED_VIEWS)[number]) => {
    if (activeView === view.id) {
      resetFilters();
      return;
    }
    resetFilters();
    setActiveView(view.id);
    if (view.priority) setPriority(view.priority);
    if (view.quick) setQuick(view.quick);
    if (view.id === 'unassigned') setAssigneeId('__none__');
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleAllPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageRows.forEach((r) => next.delete(r.id));
      else pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  };

  const flagFor = (slug: string) => codeToFlag(countryMap.get(slug)?.code ?? '');
  const nameFor = (slug: string) => countryMap.get(slug)?.name ?? slug;

  const applicantCell = (l: AdminLead) => (
    <div className="flex flex-col gap-0.5">
      <Link href={`/admin/leads/${l.id}`} className="font-medium text-ink hover:text-gold">
        {l.name}
      </Link>
      <span className="text-xs text-ink-soft">
        <SensitiveValue masked={maskPhone(l.phone)} value={l.phone} canReveal={canRevealSensitive} label="Telefon" />
      </span>
      <span className="text-xs text-ink-soft">
        <SensitiveValue masked={maskEmail(l.email)} value={l.email} canReveal={canRevealSensitive} label="E-posta" />
      </span>
    </div>
  );

  const columns: Column<AdminLead>[] = [
    {
      key: 'select',
      header: '',
      className: 'w-10',
      render: (l) => (
        <input
          type="checkbox"
          checked={selected.has(l.id)}
          onChange={() => toggleRow(l.id)}
          aria-label={`${l.reference} seç`}
          className="h-4 w-4 rounded border-line accent-navy"
        />
      ),
    },
    {
      key: 'reference',
      header: 'Referans',
      render: (l) => (
        <div className="flex flex-col gap-1">
          <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy hover:text-gold">
            #{l.reference}
          </Link>
          {l.duplicateOf && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
              Olası Tekrar
            </span>
          )}
        </div>
      ),
    },
    { key: 'applicant', header: 'Başvuran', render: applicantCell },
    {
      key: 'country',
      header: 'Ülke',
      render: (l) => (
        <span className="inline-flex items-center gap-1.5 text-ink">
          <span aria-hidden="true">{flagFor(l.country)}</span>
          {nameFor(l.country)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Durum',
      render: (l) => {
        const st = STATUS_LABELS[l.status] ?? { label: l.status, tone: 'neutral' as const };
        return <StatusBadge label={st.label} tone={st.tone} />;
      },
    },
    {
      key: 'priority',
      header: 'Öncelik',
      render: (l) => {
        const p = PRIORITY_META[l.priority];
        return <StatusBadge label={p.label} tone={p.tone} />;
      },
    },
    {
      key: 'assignee',
      header: 'Atanan',
      render: (l) =>
        l.assigneeId && userMap.has(l.assigneeId) ? (
          <span className="text-ink">{userMap.get(l.assigneeId)}</span>
        ) : (
          <span className="text-ink-muted">Atanmamış</span>
        ),
    },
    {
      key: 'followUp',
      header: 'Takip',
      hideOnMobile: true,
      render: (l) => <span className="text-ink-soft">{l.followUpAt ? formatDateTr(l.followUpAt) : '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Başvuru Tarihi',
      hideOnMobile: true,
      render: (l) => (
        <span className="whitespace-nowrap text-ink-soft">{formatDateTimeTr(l.createdAt)}</span>
      ),
    },
  ];

  const mobileCard = (l: AdminLead) => {
    const st = STATUS_LABELS[l.status] ?? { label: l.status, tone: 'neutral' as const };
    const p = PRIORITY_META[l.priority];
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.has(l.id)}
              onChange={() => toggleRow(l.id)}
              aria-label={`${l.reference} seç`}
              className="h-4 w-4 rounded border-line accent-navy"
            />
            <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy hover:text-gold">
              #{l.reference}
            </Link>
          </div>
          <StatusBadge label={st.label} tone={st.tone} />
        </div>
        {l.duplicateOf && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
            Olası Tekrar
          </span>
        )}
        {applicantCell(l)}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true">{flagFor(l.country)}</span>
            {nameFor(l.country)}
          </span>
          <StatusBadge label={p.label} tone={p.tone} />
          <span>{l.assigneeId && userMap.has(l.assigneeId) ? userMap.get(l.assigneeId) : 'Atanmamış'}</span>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDateTimeTr(l.createdAt)}
        </p>
      </div>
    );
  };

  const selectedCount = selected.size;

  const exportSelected = () => {
    const rows = leads.filter((l) => selected.has(l.id));
    const header = ['Referans', 'Ad Soyad', 'Telefon', 'E-posta', 'Ülke', 'Durum', 'Kaynak', 'Oluşturma'];
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [
      header.map(escape).join(','),
      ...rows.map((l) =>
        [l.reference, l.name, l.phone, l.email, l.country, l.status, l.source, l.createdAt]
          .map(escape)
          .join(','),
      ),
    ].join('\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `basvurular-${rows.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`${rows.length} başvuru CSV olarak dışa aktarıldı.`, 'success');
  };

  const runBulkArchive = async () => {
    const ids = [...selected];
    setBulkBusy(true);
    const res = await bulkArchiveLeadsAction(ids);
    setBulkBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'İşlem başarısız oldu.', 'warning');
      return;
    }
    notify(`${ids.length} başvuru arşivlendi.`, 'warning');
    setSelected(new Set());
    router.refresh();
  };

  const runBulkAssign = async () => {
    const ids = [...selected];
    setBulkBusy(true);
    const res = await bulkAssignLeadsAction(ids, bulkAssignUser || null);
    setBulkBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'İşlem başarısız oldu.', 'warning');
      return;
    }
    notify(
      bulkAssignUser ? `${ids.length} başvuru atandı.` : `${ids.length} başvurunun ataması kaldırıldı.`,
      'success',
    );
    setBulkAssignOpen(false);
    setSelected(new Set());
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Date range — filters the whole view and the metrics below */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Tarih Aralığı
        </span>
        <DateRangeChips
          value={dateKey}
          from={dateFrom}
          to={dateTo}
          onChange={(k, f, t) => {
            setDateKey(k);
            setDateFrom(f);
            setDateTo(t);
            setActiveView('');
            setPage(1);
          }}
        />
      </div>

      {/* Metrics — reflect the selected date range */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Yeni Başvurular" value={metrics.newCount} icon={FileText} hint={rangeLabel} />
        <MetricCard label="Atanmamış" value={metrics.unassigned} icon={UserX} tone="action" hint={rangeLabel} />
        <MetricCard
          label="Takip Geç Kalan"
          value={metrics.overdue}
          icon={CalendarClock}
          tone={metrics.overdue > 0 ? 'action' : 'default'}
          hint={rangeLabel}
        />
        <MetricCard label="Randevu Talepleri" value={metrics.appointments} icon={Inbox} hint={rangeLabel} />
      </div>

      {/* Search + filter trigger */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Referans, ad, e-posta veya telefon ara…"
            aria-label="Başvuru ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-3.5 text-sm font-semibold text-ink hover:bg-surface"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Gelişmiş Filtre
          {advancedCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-navy px-1 text-[11px] font-bold text-white">{advancedCount}</span>
          )}
        </button>
      </div>

      {/* Quick filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setQuick(f.id);
              setActiveView('');
              setPage(1);
            }}
            aria-pressed={quick === f.id}
            className={cn(
              'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
              quick === f.id ? 'bg-navy text-white' : 'border border-line text-ink hover:bg-surface',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Saved views (demo) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          Kayıtlı Görünümler
        </span>
        {SAVED_VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => applyView(v)}
            aria-pressed={activeView === v.id}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              activeView === v.id ? 'bg-gold-surface text-gold ring-1 ring-gold/40' : 'border border-line-light text-ink-soft hover:bg-surface',
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-sm text-ink-soft">
        {filtered.length} başvuru bulundu
        {(advancedCount > 0 || quick !== 'all' || search || dateKey !== 'all') && (
          <button type="button" onClick={resetFilters} className="ml-2 font-semibold text-gold hover:text-gold-hover">
            Filtreleri temizle
          </button>
        )}
      </p>

      {/* Table */}
      {pageRows.length > 0 && (
        <div className="hidden items-center gap-2 md:flex">
          <input
            type="checkbox"
            checked={allPageSelected}
            onChange={toggleAllPage}
            aria-label="Sayfadaki tümünü seç"
            className="h-4 w-4 rounded border-line accent-navy"
          />
          <span className="text-sm text-ink-soft">Bu sayfadaki tümünü seç</span>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={pageRows}
        getRowKey={(r) => r.id}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen başvuru yok"
        emptyDescription="Arama veya filtre kriterlerinizi değiştirip tekrar deneyin."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Önceki
          </button>
          <span className="text-sm text-ink-soft">
            Sayfa {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sonraki
          </button>
        </div>
      )}

      {/* Advanced filters drawer */}
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Gelişmiş Filtre"
        footer={
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setCountrySlug('');
                setAssigneeId('');
                setPriority('');
                setActiveView('');
                setPage(1);
              }}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Sıfırla
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setPage(1);
              }}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Uygula
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Ülke</span>
            <select
              value={countrySlug}
              onChange={(e) => {
                setCountrySlug(e.target.value);
                setActiveView('');
              }}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              <option value="">Tüm ülkeler</option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Atanan</span>
            <select
              value={assigneeId}
              onChange={(e) => {
                setAssigneeId(e.target.value);
                setActiveView('');
              }}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              <option value="">Herkes</option>
              <option value="__none__">Atanmamış</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Öncelik</span>
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value as LeadPriority | '');
                setActiveView('');
              }}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              <option value="">Tüm öncelikler</option>
              {(Object.keys(PRIORITY_META) as LeadPriority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SideDrawer>

      {/* Bulk assign */}
      <Dialog
        open={bulkAssignOpen}
        onClose={() => setBulkAssignOpen(false)}
        title={`${selectedCount} başvuruyu ata`}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBulkAssignOpen(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={runBulkAssign}
              disabled={bulkBusy}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
            >
              Ata
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Temsilci</span>
          <select
            value={bulkAssignUser}
            onChange={(e) => setBulkAssignUser(e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          >
            <option value="">Atama yok</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </Dialog>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white/95 p-3 shadow-form backdrop-blur sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:rounded-card sm:border">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-navy px-1.5 text-xs font-bold text-white">{selectedCount}</span>
              <span className="text-sm font-semibold text-ink">başvuru seçildi</span>
              <button type="button" onClick={() => setSelected(new Set())} aria-label="Seçimi temizle" className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBulkAssignOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Ata
              </button>
              <button
                type="button"
                onClick={() => (canExport ? exportSelected() : notify('Dışa aktarma yetkiniz yok.', 'warning'))}
                disabled={!canExport}
                title={canExport ? undefined : 'Dışa aktarma yetkiniz yok'}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Dışa Aktar
              </button>
              <button
                type="button"
                onClick={runBulkArchive}
                disabled={bulkBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
              >
                <Archive className="h-4 w-4" aria-hidden="true" />
                Arşivle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
