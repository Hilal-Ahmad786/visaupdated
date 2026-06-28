import {
  Briefcase,
  CalendarCheck,
  Compass,
  FileCheck,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/** Maps a content `icon` slug to a Lucide icon (keeps content DB-portable). */
const map: Record<string, LucideIcon> = {
  compass: Compass,
  'file-check': FileCheck,
  'calendar-check': CalendarCheck,
  'shield-check': ShieldCheck,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
};

export function ContentIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? HelpCircle;
  return <Cmp className={className} aria-hidden="true" />;
}
