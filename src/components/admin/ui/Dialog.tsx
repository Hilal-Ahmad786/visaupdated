'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Accessible modal dialog with focus trap + Escape to close. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // focus first focusable
    ref.current?.querySelector<HTMLElement>('button, input, [tabindex]')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const width = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Kapat" className="absolute inset-0 bg-navy-deep/50" onClick={onClose} />
      <div ref={ref} className={cn('relative w-full rounded-t-form bg-white shadow-form sm:rounded-form', width)}>
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-surface">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children && <div className="max-h-[60vh] overflow-y-auto p-5">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}

/** Right-side drawer for contextual panels (filters, details). */
export function SideDrawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Kapat" className="absolute inset-0 bg-navy-deep/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-white shadow-form">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-surface">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-line p-4">{footer}</div>}
      </div>
    </div>
  );
}
