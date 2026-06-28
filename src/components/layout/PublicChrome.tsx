'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { FloatingWhatsApp } from '@/components/conversion/FloatingWhatsApp';
import { MobileConversionBar } from '@/components/conversion/MobileConversionBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd } from '@/lib/seo';

/**
 * Renders the public site chrome (header, footer, conversion bars) for public
 * routes only. Admin routes (`/admin/*`) provide their own shell, so the public
 * header/footer are omitted there.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-input focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        İçeriğe geç
      </a>
      <Header />
      <main id="main" className="min-h-[60vh] pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileConversionBar />
      <FloatingWhatsApp />
      <JsonLd data={organizationJsonLd()} />
    </>
  );
}
