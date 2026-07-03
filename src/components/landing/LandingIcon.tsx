import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  Headset,
  HeartHandshake,
  HelpCircle,
  Info,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Slug → Lucide icon map for data-driven landing content. Keeps the icon names
 * portable (plain strings in the config) instead of importing components there.
 */
const MAP: Record<string, LucideIcon> = {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  Headset,
  HeartHandshake,
  Info,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Users,
};

export function LandingIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? HelpCircle;
  return <Icon className={className} aria-hidden="true" />;
}
