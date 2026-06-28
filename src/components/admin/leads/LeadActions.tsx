'use client';

import { Archive, ArrowRightLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
import { canTransition, getPipeline } from '@/lib/data/mock-pipeline';
import { cn } from '@/lib/utils';

export interface AssigneeOption {
  id: string;
  name: string;
}

/**
 * Lead-level actions. Stage change only offers allowed next stages
 * (via the pipeline transition rules); invalid transitions stay blocked.
 */
export function LeadActions({
  pipelineId,
  currentStageId,
  currentAssigneeId,
  assignees,
}: {
  pipelineId: string;
  currentStageId: string;
  currentAssigneeId?: string;
  assignees: AssigneeOption[];
}) {
  const { notify } = useToast();
  const pipeline = getPipeline(pipelineId);

  const [stageOpen, setStageOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [targetStage, setTargetStage] = useState('');
  const [targetAssignee, setTargetAssignee] = useState(currentAssigneeId ?? '');

  const current = pipeline.stages.find((s) => s.id === currentStageId);
  const allowedStages = pipeline.stages.filter(
    (s) => s.id !== currentStageId && canTransition(pipelineId, currentStageId, s.id),
  );

  const confirmStage = () => {
    if (!targetStage) {
      notify('Lütfen bir aşama seçin.', 'warning');
      return;
    }
    if (!canTransition(pipelineId, currentStageId, targetStage)) {
      notify('Bu aşamaya geçiş yapılamaz.', 'warning');
      return;
    }
    const stage = pipeline.stages.find((s) => s.id === targetStage);
    notify(`Başvuru "${stage?.name}" aşamasına taşındı. (Demo)`, 'success');
    setStageOpen(false);
    setTargetStage('');
  };

  const confirmAssign = () => {
    const person = assignees.find((a) => a.id === targetAssignee);
    notify(
      targetAssignee ? `Başvuru ${person?.name ?? 'kullanıcıya'} atandı. (Demo)` : 'Atama kaldırıldı. (Demo)',
      'success',
    );
    setAssignOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStageOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
          Aşama Değiştir
        </button>
        <button
          type="button"
          onClick={() => setAssignOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Ata
        </button>
        <button
          type="button"
          onClick={() => notify('Başvuru arşivlendi. (Demo)', 'warning')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <Archive className="h-4 w-4" aria-hidden="true" />
          Arşivle
        </button>
      </div>

      {/* Stage change */}
      <Dialog
        open={stageOpen}
        onClose={() => setStageOpen(false)}
        title="Aşama Değiştir"
        description={`Mevcut aşama: ${current?.name ?? currentStageId}. Yalnızca izin verilen geçişler listelenir.`}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setStageOpen(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={confirmStage}
              disabled={!targetStage}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              Onayla
            </button>
          </>
        }
      >
        {allowedStages.length === 0 ? (
          <p className="text-sm text-ink-soft">Bu aşamadan geçiş yapılabilecek başka bir aşama yok.</p>
        ) : (
          <div className="space-y-2">
            {allowedStages.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTargetStage(s.id)}
                aria-pressed={targetStage === s.id}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
                  targetStage === s.id ? 'border-navy bg-navy/5 text-navy' : 'border-line text-ink hover:bg-surface',
                )}
              >
                {s.name}
                {targetStage === s.id && <span className="text-xs font-bold text-navy">Seçildi</span>}
              </button>
            ))}
          </div>
        )}
      </Dialog>

      {/* Assign */}
      <Dialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Başvuruyu Ata"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAssignOpen(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={confirmAssign}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Ata
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Temsilci</span>
          <select
            value={targetAssignee}
            onChange={(e) => setTargetAssignee(e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          >
            <option value="">Atama yok</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </Dialog>
    </>
  );
}
