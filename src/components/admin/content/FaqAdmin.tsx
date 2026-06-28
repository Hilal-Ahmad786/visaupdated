'use client';

import { AlertTriangle, CheckCircle2, Copy, Pencil, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { Dialog } from '@/components/admin/ui/Dialog';
import { StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import type { FaqCategory, PublishStatus } from '@/types/content';
import { normalizeTr } from '@/lib/utils';

export interface FaqRow {
  slug: string;
  question: string;
  answer: string;
  category: string;
  categoryTitle: string;
  status: PublishStatus;
  countrySpecific: boolean;
}

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

/** Token-set similarity (Jaccard) on normalized question text. */
function similarity(a: string, b: string): number {
  const ta = new Set(normalizeTr(a).split(/\s+/).filter((w) => w.length > 2));
  const tb = new Set(normalizeTr(b).split(/\s+/).filter((w) => w.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function FaqAdmin({
  faqs,
  categories,
  canEdit,
  canPublish,
}: {
  faqs: FaqRow[];
  categories: FaqCategory[];
  canEdit: boolean;
  canPublish: boolean;
}) {
  const { notify } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);

  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.slug ?? '');

  // Pre-compute which slugs are likely duplicates (similarity >= 0.6).
  const duplicateSlugs = useMemo(() => {
    const dupes = new Set<string>();
    for (let i = 0; i < faqs.length; i += 1) {
      for (let j = i + 1; j < faqs.length; j += 1) {
        const a = faqs[i];
        const b = faqs[j];
        if (!a || !b) continue;
        if (similarity(a.question, b.question) >= 0.6) {
          dupes.add(a.slug);
          dupes.add(b.slug);
        }
      }
    }
    return dupes;
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = normalizeTr(search);
    return faqs.filter((f) => {
      if (category && f.category !== category) return false;
      if (q) {
        const hay = normalizeTr(`${f.question} ${f.categoryTitle}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [faqs, search, category]);

  const canCreate = newQuestion.trim().length > 4 && newCategory.length > 0;

  const submitWizard = () => {
    if (!canCreate) return;
    const dupe = faqs.find((f) => similarity(f.question, newQuestion) >= 0.6);
    if (dupe) {
      notify(`Benzer bir soru zaten var: "${dupe.question}". Yine de taslak oluşturuldu. (Demo)`, 'warning');
    } else {
      notify('Yeni soru taslağı oluşturuldu. (Demo)', 'success');
    }
    setWizardOpen(false);
    setNewQuestion('');
    setNewCategory(categories[0]?.slug ?? '');
  };

  const schemaEligible = (f: FaqRow) => f.status === 'published' && f.answer.trim().length > 0;

  const actionCell = (f: FaqRow) =>
    canEdit ? (
      <div className="flex justify-end">
        <Link
          href={`/admin/sss/${f.slug}`}
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

  const columns: Column<FaqRow>[] = [
    {
      key: 'question',
      header: 'Soru',
      render: (f) => (
        <div className="space-y-1">
          <Link href={`/admin/sss/${f.slug}`} className="font-semibold text-ink hover:text-gold">
            {f.question}
          </Link>
          {duplicateSlugs.has(f.slug) && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
              <Copy className="h-3 w-3" aria-hidden="true" />
              Olası Tekrar
            </span>
          )}
        </div>
      ),
    },
    { key: 'category', header: 'Kategori', hideOnMobile: true, render: (f) => <span className="text-ink-soft">{f.categoryTitle}</span> },
    {
      key: 'scope',
      header: 'Kapsam',
      render: (f) => <StatusBadge label={f.countrySpecific ? 'Ülkeye özel' : 'Genel'} tone={f.countrySpecific ? 'info' : 'neutral'} />,
    },
    { key: 'status', header: 'Durum', render: (f) => <WorkflowBadge state={STATUS_TO_WORKFLOW[f.status]} /> },
    {
      key: 'schema',
      header: 'Schema Uygun',
      hideOnMobile: true,
      render: (f) =>
        schemaEligible(f) ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Uygun
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Uygun değil
          </span>
        ),
    },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: actionCell },
  ];

  const mobileCard = (f: FaqRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/sss/${f.slug}`} className="font-semibold text-ink hover:text-gold">
          {f.question}
        </Link>
        <WorkflowBadge state={STATUS_TO_WORKFLOW[f.status]} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        <span>{f.categoryTitle}</span>
        <StatusBadge label={f.countrySpecific ? 'Ülkeye özel' : 'Genel'} tone={f.countrySpecific ? 'info' : 'neutral'} />
        {schemaEligible(f) && <StatusBadge label="Schema uygun" tone="success" />}
        {duplicateSlugs.has(f.slug) && <StatusBadge label="Olası Tekrar" tone="warning" />}
      </div>
      {actionCell(f)}
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
            placeholder="Soru veya kategori ara…"
            aria-label="Soru ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <label className="sr-only" htmlFor="faq-category-filter">Kategori filtresi</label>
        <select
          id="faq-category-filter"
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
          Yeni Soru
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft">
          {filtered.length} soru bulundu
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
        {duplicateSlugs.size > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {duplicateSlugs.size} olası tekrar tespit edildi
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(f) => f.slug}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen soru yok"
        emptyDescription="Arama veya kategori filtresini değiştirip tekrar deneyin."
      />

      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Yeni Soru"
        description="Soruyu girin; benzer bir soru varsa sistem sizi uyarır."
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
            <span className="field-label">Soru</span>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={3}
              placeholder="Örn. Schengen vizesi başvurusu ne kadar sürer?"
              className="field-input py-3 leading-relaxed"
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
              Not: Yeni soru taslak olarak oluşturulur. Yayınlama için yetkili bir kullanıcı gerekir.
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
