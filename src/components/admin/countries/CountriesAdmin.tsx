'use client';

import { Archive, Download, Pencil, Plus, Search, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { Dialog } from '@/components/admin/ui/Dialog';
import { HealthBar, WorkflowBadge } from '@/components/admin/ui/primitives';
import type { PublishStatus, Region } from '@/types/content';
import { cn, codeToFlag, normalizeTr } from '@/lib/utils';

export interface CountryRow {
  slug: string;
  name: string;
  region: Region;
  code: string;
  status: PublishStatus;
  popular: boolean;
  visaCount: number;
  health: number;
  owner: string;
}

const REGIONS: Region[] = ['Schengen', 'Avrupa', 'Amerika', 'Birleşik Krallık', 'Asya Pasifik', 'Orta Doğu'];

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

export function CountriesAdmin({
  countries,
  canEdit,
  canPublish,
}: {
  countries: CountryRow[];
  canEdit: boolean;
  canPublish: boolean;
}) {
  const { notify } = useToast();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [wizardOpen, setWizardOpen] = useState(false);

  // New-country wizard quick fields
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRegion, setNewRegion] = useState<Region>('Schengen');

  const filtered = useMemo(() => {
    const q = normalizeTr(search);
    return countries.filter((c) => {
      if (region && c.region !== region) return false;
      if (q) {
        const hay = normalizeTr(`${c.name} ${c.slug} ${c.region} ${c.code}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [countries, search, region]);

  const toggleRow = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.slug));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) filtered.forEach((c) => next.delete(c.slug));
      else filtered.forEach((c) => next.add(c.slug));
      return next;
    });
  };

  const selectedCount = selected.size;

  const bulk = (action: string, tone: 'success' | 'info' | 'warning' = 'success') => {
    notify(`${selectedCount} ülke için "${action}" işlemi uygulandı. (Demo)`, tone);
    setSelected(new Set());
  };

  const codeValid = /^[A-Za-z]{2}$/.test(newCode.trim());
  const canCreate = newName.trim().length > 1 && codeValid;

  const submitWizard = () => {
    if (!canCreate) return;
    notify(`"${newName.trim()}" ülke taslağı oluşturuldu. (Demo)`, 'success');
    setWizardOpen(false);
    setNewName('');
    setNewCode('');
    setNewRegion('Schengen');
  };

  const checkbox = (slug: string) => (
    <input
      type="checkbox"
      checked={selected.has(slug)}
      onChange={() => toggleRow(slug)}
      aria-label={`${slug} seç`}
      className="h-4 w-4 rounded border-line accent-navy"
    />
  );

  const actionCell = (c: CountryRow) => (
    <div className="flex items-center justify-end gap-1.5">
      {canEdit ? (
        <Link
          href={`/admin/ulkeler/${c.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Düzenle
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="Düzenleme yetkiniz yok"
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted opacity-60"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Düzenle
        </button>
      )}
      <Link
        href={`/admin/ulke-sayfalari/${c.slug}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Sayfa
      </Link>
    </div>
  );

  const columns: Column<CountryRow>[] = [
    {
      key: 'select',
      header: '',
      className: 'w-10',
      render: (c) => checkbox(c.slug),
    },
    {
      key: 'name',
      header: 'Ülke',
      render: (c) => (
        <Link href={`/admin/ulkeler/${c.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
          <span aria-hidden="true" className="text-lg">{codeToFlag(c.code)}</span>
          {c.name}
          {c.popular && <span className="rounded-full bg-gold-surface px-2 py-0.5 text-[11px] font-semibold text-gold">Popüler</span>}
        </Link>
      ),
    },
    { key: 'region', header: 'Bölge', render: (c) => <span className="text-ink-soft">{c.region}</span> },
    {
      key: 'slug',
      header: 'Slug',
      hideOnMobile: true,
      render: (c) => <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-soft">{c.slug}</code>,
    },
    { key: 'status', header: 'Durum', render: (c) => <WorkflowBadge state={STATUS_TO_WORKFLOW[c.status]} /> },
    {
      key: 'visa',
      header: 'Vize Türü',
      hideOnMobile: true,
      render: (c) => <span className="text-ink">{c.visaCount}</span>,
    },
    { key: 'health', header: 'İçerik Sağlığı', render: (c) => <HealthBar score={c.health} /> },
    {
      key: 'owner',
      header: 'Sahip',
      hideOnMobile: true,
      render: (c) => <span className="text-ink-soft">{c.owner}</span>,
    },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: actionCell },
  ];

  const mobileCard = (c: CountryRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {checkbox(c.slug)}
          <Link href={`/admin/ulkeler/${c.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
            <span aria-hidden="true" className="text-lg">{codeToFlag(c.code)}</span>
            {c.name}
          </Link>
        </div>
        <WorkflowBadge state={STATUS_TO_WORKFLOW[c.status]} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span>{c.region}</span>
        <span>{c.visaCount} vize türü</span>
        <code className="font-mono text-ink-muted">{c.slug}</code>
      </div>
      <HealthBar score={c.health} />
      {actionCell(c)}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ülke adı, slug veya kod ara…"
            aria-label="Ülke ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <label className="sr-only" htmlFor="region-filter">Bölge filtresi</label>
        <select
          id="region-filter"
          value={region}
          onChange={(e) => setRegion(e.target.value as Region | '')}
          className="h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        >
          <option value="">Tüm bölgeler</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Ülke
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {filtered.length} ülke bulundu
          {(search || region) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setRegion(''); }}
              className="ml-2 font-semibold text-gold hover:text-gold-hover"
            >
              Filtreleri temizle
            </button>
          )}
        </p>
        {filtered.length > 0 && (
          <label className="hidden items-center gap-2 text-sm text-ink-soft md:flex">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              aria-label="Tümünü seç"
              className="h-4 w-4 rounded border-line accent-navy"
            />
            Tümünü seç
          </label>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(c) => c.slug}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen ülke yok"
        emptyDescription="Arama veya bölge filtresini değiştirip tekrar deneyin."
      />

      {/* New country wizard */}
      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Yeni Ülke"
        description="Hızlı başlangıç için temel bilgileri girin. Ayrıntıları daha sonra düzenleyebilirsiniz."
        footer={
          <>
            <button
              type="button"
              onClick={() => setWizardOpen(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={submitWizard}
              disabled={!canCreate}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              Taslak Oluştur
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="field-label">Ülke Adı</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Örn. Hollanda"
              className="field-input"
            />
          </label>
          <label className="block">
            <span className="field-label">ISO Kodu (2 harf)</span>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="Örn. NL"
              maxLength={2}
              className="field-input uppercase"
            />
            {newCode && !codeValid && <span className="field-error">İki harfli bir ISO kodu girin (örn. NL).</span>}
          </label>
          <label className="block">
            <span className="field-label">Bölge</span>
            <select
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value as Region)}
              className="field-input"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      </Dialog>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white/95 p-3 shadow-form backdrop-blur sm:inset-x-auto sm:bottom-4 sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:rounded-card sm:border">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-navy px-1.5 text-xs font-bold text-white">{selectedCount}</span>
              <span className="text-sm font-semibold text-ink">ülke seçildi</span>
              <button type="button" onClick={() => setSelected(new Set())} aria-label="Seçimi temizle" className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => bulk('Dışa Aktar', 'success')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Dışa Aktar
              </button>
              <button
                type="button"
                onClick={() => bulk('Arşivle', 'warning')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
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
