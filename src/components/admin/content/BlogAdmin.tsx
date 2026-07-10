'use client';

import { Pencil, Plus, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { createArticleAction } from '@/lib/admin/blog-actions';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { Dialog } from '@/components/admin/ui/Dialog';
import { HealthBar, StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import type { BlogCategory, PublishStatus } from '@/types/content';
import { formatDateTr, normalizeTr } from '@/lib/utils';

export interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  categoryTitle: string;
  author: string;
  status: PublishStatus;
  featured: boolean;
  health: number;
  updatedAt: string;
}

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

const WORKFLOW_OPTIONS: { value: PublishStatus | ''; label: string }[] = [
  { value: '', label: 'Tüm durumlar' },
  { value: 'published', label: 'Yayında' },
  { value: 'draft', label: 'Taslak' },
  { value: 'archived', label: 'Arşivlendi' },
];

export function BlogAdmin({
  articles,
  categories,
  canEdit,
  canPublish,
}: {
  articles: ArticleRow[];
  categories: BlogCategory[];
  canEdit: boolean;
  canPublish: boolean;
}) {
  const { notify } = useToast();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [workflow, setWorkflow] = useState<PublishStatus | ''>('');
  const [wizardOpen, setWizardOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.slug ?? '');
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = normalizeTr(search);
    return articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (workflow && a.status !== workflow) return false;
      if (q) {
        const hay = normalizeTr(`${a.title} ${a.slug} ${a.author} ${a.categoryTitle}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [articles, search, category, workflow]);

  const canCreate = newTitle.trim().length > 2 && newCategory.length > 0;

  const submitWizard = async () => {
    if (!canCreate || creating) return;
    setCreating(true);
    const res = await createArticleAction({ title: newTitle, category: newCategory });
    setCreating(false);
    if (!res.ok || !res.slug) {
      notify(res.error ?? 'Taslak oluşturulamadı.', 'warning');
      return;
    }
    notify(`"${newTitle.trim()}" taslağı oluşturuldu.`, 'success');
    setWizardOpen(false);
    setNewTitle('');
    setNewCategory(categories[0]?.slug ?? '');
    router.push(`/admin/blog/${res.slug}`);
  };

  const actionCell = (a: ArticleRow) =>
    canEdit ? (
      <div className="flex justify-end">
        <Link
          href={`/admin/blog/${a.slug}`}
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

  const featuredBadge = (a: ArticleRow) =>
    a.featured ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-gold-surface px-2 py-0.5 text-[11px] font-semibold text-gold">
        <Star className="h-3 w-3" aria-hidden="true" />
        Öne çıkan
      </span>
    ) : (
      <span className="text-ink-muted">—</span>
    );

  const columns: Column<ArticleRow>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (a) => (
        <Link href={`/admin/blog/${a.slug}`} className="font-semibold text-ink hover:text-gold">
          {a.title}
        </Link>
      ),
    },
    { key: 'category', header: 'Kategori', hideOnMobile: true, render: (a) => <span className="text-ink-soft">{a.categoryTitle}</span> },
    { key: 'author', header: 'Yazar', hideOnMobile: true, render: (a) => <span className="text-ink-soft">{a.author}</span> },
    { key: 'status', header: 'Durum', render: (a) => <WorkflowBadge state={STATUS_TO_WORKFLOW[a.status]} /> },
    { key: 'featured', header: 'Öne Çıkan', hideOnMobile: true, render: featuredBadge },
    { key: 'health', header: 'SEO Sağlık', render: (a) => <HealthBar score={a.health} /> },
    { key: 'updated', header: 'Güncelleme', hideOnMobile: true, render: (a) => <span className="text-ink-soft">{formatDateTr(a.updatedAt)}</span> },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: actionCell },
  ];

  const mobileCard = (a: ArticleRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/blog/${a.slug}`} className="font-semibold text-ink hover:text-gold">
          {a.title}
        </Link>
        <WorkflowBadge state={STATUS_TO_WORKFLOW[a.status]} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span>{a.categoryTitle}</span>
        <span>{a.author}</span>
        <span>{formatDateTr(a.updatedAt)}</span>
        {featuredBadge(a)}
      </div>
      <HealthBar score={a.health} />
      {actionCell(a)}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık, yazar veya kategori ara…"
            aria-label="Yazı ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <label className="sr-only" htmlFor="blog-category-filter">Kategori filtresi</label>
        <select
          id="blog-category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="blog-workflow-filter">Durum filtresi</label>
        <select
          id="blog-workflow-filter"
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value as PublishStatus | '')}
          className="h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
        >
          {WORKFLOW_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Yazı
        </button>
      </div>

      <p className="text-sm text-ink-soft">
        {filtered.length} yazı bulundu
        {(search || category || workflow) && (
          <button
            type="button"
            onClick={() => { setSearch(''); setCategory(''); setWorkflow(''); }}
            className="ml-2 font-semibold text-gold hover:text-gold-hover"
          >
            Filtreleri temizle
          </button>
        )}
      </p>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(a) => a.slug}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen yazı yok"
        emptyDescription="Arama veya filtreleri değiştirip tekrar deneyin."
      />

      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Yeni Yazı"
        description="Hızlı başlangıç için temel bilgileri girin. İçeriği daha sonra düzenleyebilirsiniz."
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
            <span className="field-label">Yazı Başlığı</span>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Örn. Schengen Vizesinde Sık Yapılan Hatalar"
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
              Not: Yeni yazı taslak olarak oluşturulur. Yayınlama için yetkili bir kullanıcı gerekir.
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
