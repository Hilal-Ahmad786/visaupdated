'use client';

import { Clock, FileText, Menu, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/layout/Logo';
import { contactSettings, primaryNav, whatsappLink } from '@/config/site';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll when drawer open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-deep text-white/90 lg:block">
        <div className="container-content flex h-9 items-center justify-between text-sm">
          <span>{contactSettings.serviceArea}</span>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {contactSettings.workingHours[0]?.value}
            </span>
            <a
              href={contactSettings.phoneHref}
              onClick={() => trackEvent({ name: 'phone_click', category: 'conversion', metadata: { CTA_location: 'utility_bar' } })}
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-gold-soft"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {contactSettings.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={cn('border-b border-line bg-white transition-shadow', scrolled && 'shadow-header')}>
        <div className="container-content flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          <nav aria-label="Ana menü" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'rounded-input px-3 py-2 font-heading text-[15px] font-semibold transition-colors',
                        active ? 'text-gold' : 'text-ink hover:text-navy',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={contactSettings.phoneHref}
              onClick={() => trackEvent({ name: 'phone_click', category: 'conversion', metadata: { CTA_location: 'header' } })}
              className="hidden items-center gap-2 font-heading font-bold text-navy md:inline-flex"
            >
              <Phone className="h-5 w-5 text-gold" aria-hidden="true" />
              <span className="text-[15px]">{contactSettings.phoneDisplay}</span>
            </a>
            <Link href="/online-on-basvuru" className="btn-primary hidden md:inline-flex">
              Ön Başvuru
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
              className="grid h-11 w-11 place-items-center rounded-input text-navy hover:bg-surface xl:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 top-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-navy-deep/50"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-drawer"
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-5 shadow-form"
          >
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menüyü kapat"
                className="grid h-11 w-11 place-items-center rounded-input text-navy hover:bg-surface"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Mobil menü">
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-input px-3 py-3 font-heading text-base font-semibold text-ink hover:bg-surface"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 space-y-2 border-t border-line pt-5">
              <a href={contactSettings.phoneHref} className="btn-navy w-full">
                <Phone className="h-5 w-5" aria-hidden="true" />
                {contactSettings.phoneDisplay}
              </a>
              <Link href="/online-on-basvuru" className="btn-primary w-full">
                <FileText className="h-5 w-5" aria-hidden="true" />
                Ön Başvuru
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                WhatsApp’tan Yaz
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-soft">
              {contactSettings.workingHours.map((h) => `${h.label}: ${h.value}`).join(' · ')}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
