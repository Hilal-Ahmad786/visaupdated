'use client';

import { AlertTriangle, GripVertical, LayoutGrid, List, MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
import { StatusBadge } from '@/components/admin/ui/primitives';
import { canTransition } from '@/lib/data/mock-pipeline';
import { userById } from '@/lib/data/mock-users';
import type { AdminLead, LeadPriority, Pipeline } from '@/types/admin';
import { cn, codeToFlag } from '@/lib/utils';

export interface CountryRef {
  slug: string;
  code: string;
  name: string;
}

const PRIORITY_DOT: Record<LeadPriority, { cls: string; label: string }> = {
  low: { cls: 'bg-ink-muted', label: 'Düşük öncelik' },
  normal: { cls: 'bg-info', label: 'Normal öncelik' },
  high: { cls: 'bg-warning', label: 'Yüksek öncelik' },
  urgent: { cls: 'bg-critical', label: 'Acil öncelik' },
};

interface PendingMove {
  leadId: string;
  fromStageId: string;
  toStageId: string;
  toStageName: string;
}

export function PipelineBoard({
  pipeline,
  leads,
  countries,
}: {
  pipeline: Pipeline;
  leads: AdminLead[];
  countries: CountryRef[];
}) {
  const { notify } = useToast();
  const countryMap = useMemo(() => new Map(countries.map((c) => [c.slug, c])), [countries]);

  const [board, setBoard] = useState<AdminLead[]>(leads);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingMove | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const stages = [...pipeline.stages].sort((a, b) => a.order - b.order);
  const flagFor = (slug: string) => codeToFlag(countryMap.get(slug)?.code ?? '');
  const nameFor = (slug: string) => countryMap.get(slug)?.name ?? slug;

  const leadsByStage = (stageId: string) => board.filter((l) => l.stageId === stageId);

  const requestMove = (lead: AdminLead, toStageId: string) => {
    if (lead.stageId === toStageId) return;
    if (!canTransition(pipeline.id, lead.stageId, toStageId)) {
      notify('Bu aşamaya geçiş yapılamaz.', 'warning');
      return;
    }
    const toStage = stages.find((s) => s.id === toStageId);
    setPending({ leadId: lead.id, fromStageId: lead.stageId, toStageId, toStageName: toStage?.name ?? toStageId });
  };

  const confirmMove = () => {
    if (!pending) return;
    setBoard((prev) => prev.map((l) => (l.id === pending.leadId ? { ...l, stageId: pending.toStageId } : l)));
    notify(`Başvuru "${pending.toStageName}" aşamasına taşındı. (Demo)`, 'success');
    setPending(null);
  };

  const onDrop = (stageId: string) => {
    const lead = board.find((l) => l.id === dragId);
    setDragId(null);
    if (!lead) return;
    requestMove(lead, stageId);
  };

  const pendingLead = pending ? board.find((l) => l.id === pending.leadId) : undefined;

  function LeadCard({ lead, dragging = true }: { lead: AdminLead; dragging?: boolean }) {
    const dot = PRIORITY_DOT[lead.priority];
    const assignee = lead.assigneeId ? userById(lead.assigneeId) : undefined;
    const allowed = stages.filter((s) => s.id !== lead.stageId && canTransition(pipeline.id, lead.stageId, s.id));
    const open = menuFor === lead.id;
    return (
      <div
        draggable={dragging}
        onDragStart={() => setDragId(lead.id)}
        onDragEnd={() => setDragId(null)}
        className={cn(
          'rounded-card border border-line-light bg-white p-3 shadow-card',
          dragging && 'cursor-grab active:cursor-grabbing',
          dragId === lead.id && 'opacity-50',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/leads/${lead.id}`} className="text-sm font-semibold text-navy hover:text-gold">
            #{lead.reference}
          </Link>
          <div className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', dot.cls)} title={dot.label} aria-label={dot.label} />
            {dragging && <GripVertical className="h-4 w-4 text-ink-muted" aria-hidden="true" />}
          </div>
        </div>
        <p className="mt-1 text-sm text-ink">{lead.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">{flagFor(lead.country)}</span>
            {nameFor(lead.country)}
          </span>
          <span>{lead.ageInStageDays} gün</span>
          <span>{assignee?.name ?? 'Atanmamış'}</span>
        </div>

        <div className="relative mt-2.5">
          <button
            type="button"
            onClick={() => setMenuFor(open ? null : lead.id)}
            aria-expanded={open}
            aria-haspopup="menu"
            disabled={allowed.length === 0}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MoveRight className="h-3.5 w-3.5" aria-hidden="true" />
            {allowed.length === 0 ? 'Geçiş yok' : 'Taşı'}
          </button>
          {open && allowed.length > 0 && (
            <div role="menu" className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-line bg-white shadow-form">
              {allowed.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuFor(null);
                    requestMove(lead, s.id);
                  }}
                  className="block w-full px-3 py-2 text-left text-xs font-medium text-ink hover:bg-surface"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center gap-1 rounded-lg border border-line-light bg-white p-1">
          <button
            type="button"
            onClick={() => setView('board')}
            aria-pressed={view === 'board'}
            className={cn('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold', view === 'board' ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface')}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Pano
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            className={cn('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold', view === 'list' ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface')}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            Liste
          </button>
        </div>
      </div>

      {view === 'board' ? (
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {stages.map((stage) => {
            const items = leadsByStage(stage.id);
            const hasWarning =
              typeof stage.warnAfterDays === 'number' && items.some((l) => l.ageInStageDays > stage.warnAfterDays!);
            return (
              <section
                key={stage.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(stage.id)}
                className="flex w-72 min-w-[18rem] flex-col rounded-card border border-line-light bg-admin/60"
                aria-label={`${stage.name} aşaması`}
              >
                <header className="flex items-center justify-between gap-2 border-b border-line-light px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-ink">{stage.name}</h3>
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-surface px-1.5 text-xs font-semibold text-ink-soft">{items.length}</span>
                  </div>
                  {hasWarning && (
                    <span className="inline-flex items-center gap-1 text-warning" title="Bekleme süresi aşıldı">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </header>
                <div className="flex flex-1 flex-col gap-2.5 p-2.5">
                  {items.length === 0 ? (
                    <p className="grid place-items-center rounded-lg border border-dashed border-line py-8 text-center text-xs text-ink-muted">
                      Bu aşamada başvuru yok
                    </p>
                  ) : (
                    items.map((lead) => <LeadCard key={lead.id} lead={lead} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5">
          {stages.map((stage) => {
            const items = leadsByStage(stage.id);
            return (
              <section key={stage.id} aria-label={`${stage.name} aşaması`}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-ink">{stage.name}</h3>
                  <StatusBadge label={String(items.length)} tone="neutral" />
                </div>
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-line px-4 py-5 text-center text-xs text-ink-muted">Bu aşamada başvuru yok</p>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} dragging={false} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Move confirmation */}
      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Aşama Değişikliğini Onayla"
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setPending(null)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button type="button" onClick={confirmMove} className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep">
              Taşı
            </button>
          </>
        }
      >
        {pending && pendingLead && (
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">#{pendingLead.reference}</span> başvurusunu{' '}
            <span className="font-semibold text-ink">{pending.toStageName}</span> aşamasına taşımak istediğinize emin misiniz?
          </p>
        )}
      </Dialog>
    </div>
  );
}
