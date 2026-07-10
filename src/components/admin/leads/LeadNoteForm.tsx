'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { addLeadNoteAction } from '@/lib/admin/lead-actions';

/** Add a real internal note to a lead (persisted to the leads table). */
export function LeadNoteForm({ leadId, disabled }: { leadId: string; disabled?: boolean }) {
  const { notify } = useToast();
  const router = useRouter();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  if (disabled) return null;

  const submit = async () => {
    if (!body.trim()) {
      notify('Not boş olamaz.', 'warning');
      return;
    }
    setBusy(true);
    const res = await addLeadNoteAction(leadId, body);
    setBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'Not eklenemedi.', 'warning');
      return;
    }
    setBody('');
    notify('Not eklendi.', 'success');
    router.refresh();
  };

  return (
    <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Bu başvuru için dahili bir not ekleyin…"
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
        >
          {busy ? 'Ekleniyor…' : 'Not Ekle'}
        </button>
      </div>
    </div>
  );
}
