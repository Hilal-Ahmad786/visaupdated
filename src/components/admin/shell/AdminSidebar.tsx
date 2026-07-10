'use client';

import { ChevronLeft, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { AdminIcon } from '@/components/admin/shell/AdminIcon';
import { signOutAction } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import type { AdminNavGroup } from '@/config/admin-nav';

export function AdminSidebar({
  groups,
  user,
  badges,
  mobileOpen,
  onCloseMobile,
}: {
  groups: AdminNavGroup[];
  user: { name: string; role: string; initials: string };
  badges: { newLeads?: number };
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const nav = (
    <div className="flex h-full flex-col bg-navy-deep text-white/80">
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <Link href="/admin" aria-label="Yönetim paneli ana sayfa" className="flex items-center gap-2.5">
          {collapsed ? (
            <Image src="/favicon.png" alt="VİS VİZE" width={36} height={36} className="h-9 w-9 rounded-lg" priority />
          ) : (
            <>
              <Image src="/logo-dark.png" alt="VİS VİZE" width={720} height={240} className="h-9 w-auto" priority />
              <span className="font-heading text-[10px] uppercase tracking-[0.16em] text-gold-soft">
                Yönetim
              </span>
            </>
          )}
        </Link>
      </div>

      <nav aria-label="Yönetim menüsü" className="flex-1 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <p className="px-2 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{group.title}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const badge = item.badgeKey === 'newLeads' ? badges.newLeads : undefined;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 font-heading text-sm font-medium transition-colors',
                        active ? 'bg-gold text-navy-deep' : 'text-white/75 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <AdminIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                      {!collapsed && badge ? (
                        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', active ? 'bg-navy-deep text-white' : 'bg-gold text-navy-deep')}>
                          {badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 font-heading text-sm font-bold text-white">
            {user.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-white/50">{user.role}</p>
            </div>
          )}
          <form action={signOutAction}>
            <button type="submit" aria-label="Çıkış yap" className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white">
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="hidden items-center justify-center gap-2 border-t border-white/10 py-2.5 text-xs text-white/50 hover:bg-white/5 hover:text-white lg:flex"
        aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        {!collapsed && 'Daralt'}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn('hidden shrink-0 lg:block', collapsed ? 'w-[76px]' : 'w-[260px]')}>
        <div className={cn('fixed inset-y-0 left-0 z-30', collapsed ? 'w-[76px]' : 'w-[260px]')}>{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Menüyü kapat" className="absolute inset-0 bg-navy-deep/50" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-[280px]">{nav}</div>
        </div>
      )}
    </>
  );
}
