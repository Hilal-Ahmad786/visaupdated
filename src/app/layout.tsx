import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';

import { Analytics } from '@/components/analytics/Analytics';
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/GoogleTagManager';
import { PublicChrome } from '@/components/layout/PublicChrome';
import PageViewTracker from '@/components/PageViewTracker';
import { TrackingAutoEvents } from '@/components/TrackingAutoEvents';
import { brand, siteUrl } from '@/config/site';

import 'flag-icons/css/flag-icons.min.css';
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
        {/* GTM <noscript> fallback — must be immediately after <body> opens. */}
        <GoogleTagManagerNoScript />
        <PublicChrome>{children}</PublicChrome>
        <PageViewTracker />
        {/* Global delegated click tracking (tel/WhatsApp/mailto) + UTM capture. */}
        <TrackingAutoEvents />
        {/* Single site-wide tag manager. GA4 + Google Ads tags live in GTM. */}
        <GoogleTagManager />
        <Analytics />
      </body>
    </html>
  );
}
