import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Page header with title, optional description, and right-aligned actions. */
export function PageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-heading text-2xl font-bold text-ink">{title}</h1>
          {badge}
        </div>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = 'default',
  hint,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; direction: 'up' | 'down' };
  tone?: 'default' | 'action';
  hint?: string;
}) {
  return (
    <div className={cn('rounded-card border bg-white p-5 shadow-card', tone === 'action' ? 'border-warning/30' : 'border-line-light')}>
      <div className="flex items-start justify-between">
        {Icon && (
          <span className={cn('grid h-11 w-11 place-items-center rounded-xl', tone === 'action' ? 'bg-warning/10 text-warning' : 'bg-gold-surface text-gold')}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        {tone === 'action' ? (
          <span className="rounded-full bg-warning/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-warning">Aksiyon Gerekli</span>
        ) : trend ? (
          <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', trend.direction === 'up' ? 'text-success' : 'text-danger')}>
            {trend.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend.value}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

type BadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'gold' | 'critical';

const badgeTones: Record<BadgeTone, string> = {
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-surface text-ink-soft',
  gold: 'bg-gold-surface text-gold',
  critical: 'bg-critical/10 text-critical',
};

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', badgeTones[tone])}>
      {label}
    </span>
  );
}

const workflowTone: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Taslak', tone: 'neutral' },
  in_review: { label: 'İncelemede', tone: 'info' },
  changes_requested: { label: 'Değişiklik İstendi', tone: 'warning' },
  approved: { label: 'Onaylandı', tone: 'success' },
  scheduled: { label: 'Planlandı', tone: 'info' },
  published: { label: 'Yayında', tone: 'success' },
  archived: { label: 'Arşivlendi', tone: 'neutral' },
};

export function WorkflowBadge({ state }: { state: string }) {
  const cfg = workflowTone[state] ?? { label: state, tone: 'neutral' as BadgeTone };
  return <StatusBadge label={cfg.label} tone={cfg.tone} />;
}

/**
 * Permission gate. `allowed` is computed server-side via the permission API;
 * this only controls *display*. The real boundary is the server route guard.
 */
export function PermissionGuard({
  allowed,
  children,
  fallback = null,
}: {
  allowed: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <>{allowed ? children : fallback}</>;
}

export function HealthBar({ score }: { score: number }) {
  const tone = score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-danger';
  return (
    <div className="flex items-center gap-2" title={`İçerik sağlığı: %${score}`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface">
        <div className={cn('h-full', tone)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium text-ink-soft">%{score}</span>
    </div>
  );
}
