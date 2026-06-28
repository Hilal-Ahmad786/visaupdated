'use client';

import { AlertCircle, CheckCircle2, Info, X, TriangleAlert } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

const ToastContext = createContext<{ notify: (message: string, tone?: ToastTone) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const toneStyle: Record<ToastTone, { cls: string; Icon: typeof Info }> = {
  success: { cls: 'border-success/30 text-success', Icon: CheckCircle2 },
  error: { cls: 'border-danger/30 text-danger', Icon: TriangleAlert },
  info: { cls: 'border-info/30 text-info', Icon: Info },
  warning: { cls: 'border-warning/30 text-warning', Icon: AlertCircle },
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = ++counter;
    setToasts((t) => [...t, { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2" role="region" aria-label="Bildirimler" aria-live="polite">
        {toasts.map((t) => {
          const { cls, Icon } = toneStyle[t.tone];
          return (
            <div key={t.id} className={cn('animate-fade-in flex items-start gap-3 rounded-card border bg-white p-3.5 shadow-form', cls)}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm text-ink">{t.message}</p>
              <button type="button" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Kapat" className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
