import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';

import { Analytics } from '@/components/analytics/Analytics';
import { FloatingWhatsApp } from '@/components/conversion/FloatingWhatsApp';
import { MobileConversionBar } from '@/components/conversion/MobileConversionBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/seo/JsonLd';
import { brand, siteUrl } from '@/config/site';
import { organizationJsonLd } from '@/lib/seo';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.full} | Vize Danışmanlık ve Randevu Desteği`,
    template: `%s | ${brand.short}`,
  },
  description:
    'VİS VİZE; vize başvurularına yönelik danışmanlık, evrak hazırlığı, randevu organizasyonu ve süreç takibi sunar. Başvuru türünüze uygun yol haritası için hemen iletişime geçin.',
  applicationName: brand.full,
  authors: [{ name: brand.full }],
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: '#0C2448',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${manrope.variable} ${inter.variable}`}>
      <body>
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
        <Analytics />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
