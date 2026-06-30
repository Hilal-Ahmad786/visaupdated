'use client';

import { ShieldAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CONSUMER_NOTICE } from '@/config/site';

const STORAGE_KEY = 'vv_consumer_notice_seen';
/** How long the notice stays on screen before auto-dismissing. */
const AUTO_DISMISS_MS = 8000;

/**
 * Consumer-protection notice (6502 sayılı Kanun). Appears once per browser
 * session on the visitor's first public page view and auto-dismisses after a
 * few seconds. No action button — purely informational.
 */
export function ConsumerNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode etc.) — show the notice.
    }
    if (seen) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setOpen(true);

    const timer = setTimeout(() => setOpen(false), AUTO_DISMISS_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consumer-notice-title"
    >
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="animate-fade-in relative w-full max-w-lg overflow-hidden rounded-form bg-white shadow-form">
        <div className="flex items-start gap-3 border-b border-line bg-surface px-5 py-4">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="consumer-notice-title" className="flex-1 font-heading text-h4 text-navy">
            {CONSUMER_NOTICE.title}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Kapat"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-input text-ink-soft hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-ink-soft">{CONSUMER_NOTICE.body}</p>
        </div>
      </div>
    </div>
  );
}
