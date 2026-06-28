import { AlertCircle, CheckCircle2, Info, SearchX, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-muted">
        {icon ?? <SearchX className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="font-heading text-h4">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Bir sorun oluştu',
  description = 'İçerik şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.',
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div role="alert" className="grid place-items-center rounded-card border border-line bg-white px-6 py-14 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-h4">{title}</h3>
      <p className="mt-1.5 max-w-md text-ink-soft">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const toneMap = {
  info: { cls: 'border-navy/15 bg-navy/5 text-navy', Icon: Info },
  success: { cls: 'border-success/20 bg-success/10 text-success', Icon: CheckCircle2 },
  warning: { cls: 'border-warning/25 bg-warning/10 text-warning', Icon: AlertCircle },
  error: { cls: 'border-danger/25 bg-danger/10 text-danger', Icon: TriangleAlert },
} as const;

export function StatusAlert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: keyof typeof toneMap;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { cls, Icon } = toneMap[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-card border p-4', cls, className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-relaxed text-ink">
        {title && <p className="font-heading font-semibold text-ink">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-card bg-line/60', className)} aria-hidden="true" />;
}
