import type { Pipeline } from '@/types/admin';

export const pipelines: Pipeline[] = [
  {
    id: 'p-default',
    name: 'Standart Başvuru Süreci',
    stages: [
      { id: 'new', name: 'Yeni', order: 0, allowedNext: ['contacted', 'spam'], warnAfterDays: 1 },
      { id: 'contacted', name: 'İletişime Geçildi', order: 1, allowedNext: ['qualified', 'lost'], warnAfterDays: 2 },
      { id: 'qualified', name: 'Nitelikli', order: 2, allowedNext: ['documents', 'lost'], warnAfterDays: 3 },
      { id: 'documents', name: 'Evrak Bekleniyor', order: 3, allowedNext: ['appointment', 'lost'], warnAfterDays: 5 },
      { id: 'appointment', name: 'Randevu Planlandı', order: 4, allowedNext: ['completed', 'lost'], warnAfterDays: 7 },
      { id: 'completed', name: 'Tamamlandı', order: 5, allowedNext: [] },
      { id: 'lost', name: 'Kaybedildi', order: 6, allowedNext: ['new'] },
      { id: 'spam', name: 'Spam', order: 7, allowedNext: [] },
    ],
  },
];

export const STATUS_LABELS: Record<string, { label: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  new: { label: 'Yeni', tone: 'warning' },
  contacted: { label: 'İletişime Geçildi', tone: 'info' },
  qualified: { label: 'Nitelikli', tone: 'info' },
  documents: { label: 'Evrak Bekleniyor', tone: 'danger' },
  appointment: { label: 'Randevu Planlandı', tone: 'info' },
  completed: { label: 'Tamamlandı', tone: 'success' },
  lost: { label: 'Kaybedildi', tone: 'neutral' },
  spam: { label: 'Spam', tone: 'neutral' },
};

export function getPipeline(id = 'p-default'): Pipeline {
  return pipelines.find((p) => p.id === id) ?? pipelines[0]!;
}

/** Whether a stage transition is allowed (used by pipeline + tests). */
export function canTransition(pipelineId: string, fromStageId: string, toStageId: string): boolean {
  const p = getPipeline(pipelineId);
  const from = p.stages.find((s) => s.id === fromStageId);
  if (!from) return false;
  if (fromStageId === toStageId) return true;
  return from.allowedNext.includes(toStageId);
}
