'use client';

import { Pencil, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { Dialog } from '@/components/admin/ui/Dialog';
import { WorkflowBadge } from '@/components/admin/ui/primitives';
import { formatDateTr, normalizeTr } from '@/lib/utils';

export interface FormRow {
  id: string;
  name: string;
  state: string;
  stepCount: number;
  fieldCount: number;
  submissions: number;
  updatedAt: string;
}

/** Client list for the Form Builder index: search + create dialog + table. */
export function FormsAdmin({ rows, canCreate }: { rows: FormRow[]; canCreate: boolean }) {
  const { notify } = useToast();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const filtered = useMemo(() => {
    const q = normalizeTr(search.trim());
    if (!q) return rows;
    return rows.filter((r) => normalizeTr(r.name).includes(q));
  }, [rows, search]);

  const nameValid = newName.trim().length > 2;

  const submit = () => {
    if (!nameValid) return;
    notify(`"${newName.trim()}" formu taslak olarak oluşturuldu. (Demo)`, 'success');
    setOpen(false);
    setNewName('');
  };

  const editAction = (r: FormRow) => (
    <div className="flex justify-end">
      <Link
        href={`/admin/formlar/${r.id}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Düzenle
      </Link>
    </div>
  );

  const columns: Column<FormRow>[] = [
    {
      key: 'name',
      header: 'Ad',
      render: (r) => (
        <Link href={`/admin/formlar/${r.id}`} className="font-semibold text-ink hover:text-gold">
          {r.name}
        </Link>
      ),
    },
    { key: 'state', header: 'Durum', render: (r) => <WorkflowBadge state={r.state} /> },
    { key: 'steps', header: 'Adım', hideOnMobile: true, render: (r) => <span className="text-ink-soft">{r.stepCount}</span> },
    { key: 'fields', header: 'Alan', hideOnMobile: true, render: (r) => <span className="text-ink-soft">{r.fieldCount}</span> },
    { key: 'subs', header: 'Gönderim', render: (r) => <span className="font-semibold text-ink">{r.submissions}</span> },
    { key: 'updated', header: 'Güncelleme', hideOnMobile: true, render: (r) => <span className="text-ink-soft">{formatDateTr(r.updatedAt)}</span> },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: editAction },
  ];

  const mobileCard = (r: FormRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/formlar/${r.id}`} className="font-semibold text-ink hover:text-gold">
          {r.name}
        </Link>
        <WorkflowBadge state={r.state} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span>{r.stepCount} adım</span>
        <span>{r.fieldCount} alan</span>
        <span>{r.submissions} gönderim</span>
        <span>{formatDateTr(r.updatedAt)}</span>
      </div>
      {editAction(r)}
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
            placeholder="Form adı ara…"
            aria-label="Form ara"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <button
          type="button"
          onClick={() => (canCreate ? setOpen(true) : notify('Form oluşturma yetkiniz yok.', 'warning'))}
          disabled={!canCreate}
          title={canCreate ? undefined : 'Form oluşturma yetkiniz yok'}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-navy px-3.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Form
        </button>
      </div>

      <p className="text-sm text-ink-soft">
        {filtered.length} form bulundu
        {search && (
          <button type="button" onClick={() => setSearch('')} className="ml-2 font-semibold text-gold hover:text-gold-hover">
            Aramayı temizle
          </button>
        )}
      </p>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        mobileCard={mobileCard}
        emptyTitle="Eşleşen form yok"
        emptyDescription="Arama terimini değiştirip tekrar deneyin."
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Form"
        description="Form temel bilgisini girin. Alanları ve adımları sonra form düzenleyicide kurabilirsiniz."
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!nameValid}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              Taslak Oluştur
            </button>
          </>
        }
      >
        <label className="block">
          <span className="field-label">Form Adı</span>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Örn. Online Ön Başvuru Formu" className="field-input" />
        </label>
        <p className="mt-3 text-xs text-ink-muted">Yeni form her zaman taslak olarak başlar ve yayınlanmadan canlı başvuru almaz.</p>
      </Dialog>
    </div>
  );
}
