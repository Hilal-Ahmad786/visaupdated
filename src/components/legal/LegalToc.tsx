'use client';

import { List, Printer, X } from 'lucide-react';
import { useState } from 'react';

export interface TocItem {
  id: string;
  heading: string;
}

/** Sticky desktop table of contents + mobile contents drawer + print action. */
export function LegalToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  const links = (
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            onClick={() => setOpen(false)}
            className="block rounded-input px-3 py-2 text-sm text-ink-soft hover:bg-surface hover:text-navy"
          >
            {it.heading}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile contents button */}
      <div className="mb-5 flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-outline flex-1 text-sm"
          aria-haspopup="dialog"
        >
          <List className="h-4 w-4" aria-hidden="true" /> İçindekiler
        </button>
        <button type="button" onClick={() => window.print()} className="btn-outline text-sm" aria-label="Yazdır">
          <Printer className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Desktop sticky TOC */}
      <nav aria-label="İçindekiler" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-label uppercase tracking-[0.14em] text-ink-muted">İçindekiler</h2>
            <button type="button" onClick={() => window.print()} className="text-ink-muted hover:text-navy" aria-label="Yazdır">
              <Printer className="h-4 w-4" />
            </button>
          </div>
          {links}
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="İçindekiler">
          <button type="button" aria-label="Kapat" className="absolute inset-0 bg-navy-deep/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-form bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-h4">İçindekiler</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-surface">
                <X className="h-5 w-5" />
              </button>
            </div>
            {links}
          </div>
        </div>
      )}
    </>
  );
}
