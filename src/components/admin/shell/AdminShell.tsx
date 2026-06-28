'use client';

import { Bell, Languages, Menu, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { AdminSidebar } from '@/components/admin/shell/AdminSidebar';
import { ToastProvider } from '@/components/admin/feedback/Toast';
import type { AdminNavGroup } from '@/config/admin-nav';

/**
 * The single reusable admin shell for all screens 23–38. Receives the
 * already-permission-filtered nav + current user from the server layout.
 */
export function AdminShell({
  groups,
  user,
  badges,
  children,
}: {
  groups: AdminNavGroup[];
  user: { name: string; role: string; initials: string };
  badges: { newLeads?: number };
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-admin">
        <AdminSidebar groups={groups} user={user} badges={badges} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top header */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line-light bg-white px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
              className="grid h-10 w-10 place-items-center rounded-lg text-navy hover:bg-surface lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input
                type="search"
                placeholder="Hızlı arama yapın… (Ctrl + K)"
                aria-label="Yönetim panelinde ara"
                className="h-10 w-full rounded-lg border border-line bg-admin pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Link href="/" target="_blank" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface md:block">
                Siteyi Görüntüle
              </Link>
              <button type="button" className="hidden items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 font-heading text-sm font-semibold text-white hover:bg-gold-hover sm:inline-flex">
                <Plus className="h-4 w-4" aria-hidden="true" /> Yeni Oluştur
              </button>
              <button type="button" aria-label="Bildirimler" className="relative grid h-10 w-10 place-items-center rounded-lg text-ink-soft hover:bg-surface">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Dil" className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft hover:bg-surface">
                <Languages className="h-5 w-5" />
              </button>
              <span className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white" title={user.name}>
                {user.initials}
              </span>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
