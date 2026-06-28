'use client';

import { FileSearch, StickyNote } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';

type Mode = 'note' | 'investigation' | null;

/**
 * Annotations & investigations are SEPARATE records — they never mutate the
 * underlying audit event. Submitting only emits a toast (demo) representing the
 * creation of a new, linked record.
 */
export function AuditAnnotations({ eventId }: { eventId: string }) {
  const { notify } = useToast();
  const [mode, setMode] = useState<Mode>(null);
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) {
      notify('Lütfen bir açıklama girin.', 'warning');
      return;
    }
    if (mode === 'note') {
      notify(`İnceleme notu eklendi (olay ${eventId}). Ayrı kayıt olarak tutuldu. (Demo)`, 'success');
    } else {
      notify(`Soruşturma başlatıldı (olay ${eventId}). Ayrı kayıt olarak tutuldu. (Demo)`, 'info');
    }
    setMode(null);
    setText('');
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('note')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <StickyNote className="h-4 w-4" aria-hidden="true" />
          İnceleme Notu Ekle
        </button>
        <button
          type="button"
          onClick={() => setMode('investigation')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          <FileSearch className="h-4 w-4" aria-hidden="true" />
          Soruşturma Başlat
        </button>
      </div>

      <Dialog
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode === 'investigation' ? 'Soruşturma Başlat' : 'İnceleme Notu Ekle'}
        description="Bu kayıt orijinal olaya bağlı, ayrı ve değiştirilemez bir kayıt olarak saklanır. Olayın kendisi değiştirilmez."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setMode(null)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button type="button" onClick={submit} className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep">
              {mode === 'investigation' ? 'Başlat' : 'Kaydet'}
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {mode === 'investigation' ? 'Soruşturma gerekçesi' : 'Not'}
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={mode === 'investigation' ? 'Soruşturmanın kapsamı ve nedeni…' : 'İnceleme notunuz…'}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </label>
      </Dialog>
    </>
  );
}
