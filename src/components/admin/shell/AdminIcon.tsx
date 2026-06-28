import {
  BookOpen,
  Bell,
  Briefcase,
  ClipboardList,
  Flag,
  GitBranch,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  LineChart,
  Menu,
  Rss,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  inbox: Inbox,
  'git-branch': GitBranch,
  flag: Flag,
  'book-open': BookOpen,
  briefcase: Briefcase,
  rss: Rss,
  'help-circle': HelpCircle,
  home: Home,
  'clipboard-list': ClipboardList,
  menu: Menu,
  'line-chart': LineChart,
  settings: Settings,
  users: Users,
  'scroll-text': ScrollText,
  bell: Bell,
};

export function AdminIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? LayoutDashboard;
  return <Cmp className={className} aria-hidden="true" />;
}
