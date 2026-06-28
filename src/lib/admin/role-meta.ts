import type { RoleRisk } from '@/types/admin';

/**
 * Role-risk display metadata. Lives in a server-safe module (no 'use client')
 * so BOTH server pages and client components can import and dot into it.
 */
export const RISK_META: Record<RoleRisk, { label: string; tone: 'neutral' | 'info' | 'warning' | 'critical' }> = {
  low: { label: 'Düşük', tone: 'neutral' },
  medium: { label: 'Orta', tone: 'info' },
  high: { label: 'Yüksek', tone: 'warning' },
  critical: { label: 'Kritik', tone: 'critical' },
};
