'use client';

import { Pencil, Plus, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { Dialog } from '@/components/admin/ui/Dialog';
import { HealthBar, StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import type { PublishStatus, ServiceCategory } from '@/types/content';
import { normalizeTr } from '@/lib/utils';

export interface ServiceRow {
  slug: string;
  name: string;
  category: string;
  categoryTitle: string;
  status: PublishStatus;
  popular: boolean;
  icon: string;
  health: number;
  pricingMode: string;
}

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

export function ServicesAdmin({
  services,
  categories,
  canEdit,
  canPublish,
}: {
  services: ServiceRow[];
  categories: ServiceCategory[];
  canEdit: boolean;
  canPublish: boolean;
}) {
  const { notify } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.slug ?? '');

  const filtered = useMemo(() => {
    const q = normalizeTr(search);
    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (q) {
        const hay = normalizeTr(`${s.name} ${s.slug} ${s.categoryTitle}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [services, search, category]);

  const canCreate = newName.trim().length > 1 && newCategory.length > 0;

  const submitWizard = () => {
    if (!canCreate) return;
    notify(`"${newName.trim()}" hizmet taslağı oluşturuldu. (Demo)`, 'success');
    setWizardOpen(false);
    setNewName('');
    setNewCategory(categories[0]?.slug ?? '');
  };

  const actionCell = (s: ServiceRow) =>
    canEdit ? (
      <div className="flex justify-end">
        <Link
          href={`/admin/hizmetler/${s.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Düzenle
        </Link>
      </div>
    ) : (
      <div className="flex justify-end">
        <button
          type="button"
          disabled
          title="Düzenleme yetkiniz yok"
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted opacity-60"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Düzenle
        </button>
      </div>
    );

  const columns: Column<ServiceRow>[] = [
    {
      key: 'name',
      header: 'Ad',
      render: (s) => (
        <Link href={`/admin/hizmetler/${s.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-gold-surface text-sm">{s.icon || '◆'}</span>
          {s.name}
          {s.popular && <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />}
        </Link>
      ),
    },
    { key: 'category', header: 'Kategori', render: (s) => <span className="text-ink-soft">{s.categoryTitle}</span> },
    { key: 'status', header: 'Durum', render: (s) => <WorkflowBadge state={STATUS_TO_WORKFLOW[s.status]} /> },
    {
      key: 'pricing',
      header: 'Fiyat Modu',
      hideOnMobile: true,
      render: (s) => <StatusBadge label={s.pricingMode} tone="neutral" />,
    },
    { key: 'health', header: 'İçerik Sağlığı', render: (s) => <HealthBar score={s.health} /> },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: actionCell },
  ];

  const mobileCard = (s: ServiceRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/hizmetler/${s.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-gold-surface text-sm">{s.icon || '◆'}</span>
          {s.name}
        </Link>
        <WorkflowBadge state={STATUS_TO_WORKFLOW[s.status]} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span>{s.categoryTitle}</span>
        <span>{s.pricingMode}</span>
      </div>
      <HealthBar score={s.health} />
      {actionCell(s)}
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
            placeholder="Hizmet adı veya kategori ara…"
            aria-label="Hizmet ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <label className="sr-only" htmlFor="category-filter">Kategori filtresi</label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Hizmet
        </button>
      </div>

      <p className="text-sm text-ink-soft">
        {filtered.length} hizmet bulundu
        {(search || category) && (
          <button
            type="button"
            onClick={() => { setSearch(''); setCategory(''); }}
            className="ml-2 font-semibold text-gold hover:text-gold-hover"
          >
            Filtreleri temizle
          </button>
        )}
      </p>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(s) => s.slug}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen hizmet yok"
        emptyDescription="Arama veya kategori filtresini değiştirip tekrar deneyin."
      />

      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Yeni Hizmet"
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
            <span className="field-label">Hizmet Adı</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Örn. Schengen Vize Danışmanlığı"
              className="field-input"
            />
          </label>
          <label className="block">
            <span className="field-label">Kategori</span>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="field-input">
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </label>
          {!canPublish && (
            <p className="text-xs text-ink-muted">
              Not: Yeni hizmet taslak olarak oluşturulur. Yayınlama için yetkili bir kullanıcı gerekir.
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
