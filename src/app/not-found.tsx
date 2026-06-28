import { ArrowRight, Globe2, Home, Mail, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PhoneLink } from '@/components/conversion/PhoneLink';
import { contactSettings } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: false },
};

// Hardcoded popular links — keep the 404 fast and static (no repo fetch).
const POPULAR_COUNTRIES = [
  { name: 'Almanya', href: '/vize-ulkeleri/almanya' },
  { name: 'Fransa', href: '/vize-ulkeleri/fransa' },
  { name: 'İtalya', href: '/vize-ulkeleri/italya' },
];

const POPULAR_SERVICES = [
  { name: 'Vize Danışmanlığı', href: '/hizmetler/vize-danismanligi' },
  { name: 'Evrak Kontrolü', href: '/hizmetler/evrak-kontrolu' },
  { name: 'Randevu Desteği', href: '/hizmetler/randevu-destegi' },
];

// Recovery search shortcuts — real, content-backed queries (not fabricated stats).
const POPULAR_SEARCHES = [
  'Almanya Vizesi',
  'Schengen Belgeleri',
  'Vize Randevusu',
  'Vize Ret Nedenleri',
];

const mailtoReport = `mailto:${contactSettings.email}?subject=${encodeURIComponent(
  'Kırık bağlantı bildirimi',
)}&body=${encodeURIComponent('Merhaba, sitenizde ulaşamadığım bir sayfa bağlantısını bildirmek istiyorum:\n\nBağlantı: \nGeldiğim sayfa: \n')}`;

export default function NotFound() {
  return (
    <main className="bg-page">
      <div className="container-content py-16 text-center md:py-24">
        <p className="font-heading text-[5rem] font-bold leading-none text-gold md:text-[7rem]">404</p>
        <h1 className="mt-2 text-h1">Aradığınız sayfayı bulamadık.</h1>
        <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink-soft">
          Sayfa taşınmış, kaldırılmış ya da bağlantı hatalı olabilir. Aşağıdaki seçeneklerle
          aradığınıza hızlıca ulaşabilirsiniz.
        </p>

        {/* Recovery actions */}
        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <Home className="h-[18px] w-[18px]" aria-hidden="true" /> Ana Sayfa
          </Link>
          <Link href="/vize-ulkeleri" className="btn-navy">
            <Globe2 className="h-[18px] w-[18px]" aria-hidden="true" /> Vize Ülkeleri
          </Link>
          <PhoneLink location="not_found" className="btn-outline" label="Hemen Ara" />
          <Link href="/online-on-basvuru" className="btn-outline">
            Ön Başvuru <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
        </div>

        {/* Recovery search — submits to the real /arama experience (no JS needed) */}
        <form action="/arama" method="get" role="search" className="mx-auto mt-10 max-w-xl">
          <label htmlFor="nf-search" className="sr-only">
            Sitede arayın
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              id="nf-search"
              type="search"
              name="q"
              placeholder="Ülke, vize türü, belge veya randevu arayın…"
              autoComplete="off"
              className="min-h-[52px] w-full rounded-input border border-line bg-white pl-12 pr-24 text-ink shadow-form placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
            <button type="submit" className="btn-navy absolute right-1.5 top-1/2 -translate-y-1/2 px-5">
              Ara
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-ink-muted">Popüler aramalar:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link key={term} href={`/arama?q=${encodeURIComponent(term)}`} className="pill">
                {term}
              </Link>
            ))}
          </div>
        </form>

        {/* Quick links */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
          <div className="card p-6">
            <h2 className="font-heading text-h4">Popüler Ülkeler</h2>
            <ul className="mt-3 space-y-2">
              {POPULAR_COUNTRIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="inline-flex items-center gap-1.5 text-ink-soft hover:text-navy">
                    <ArrowRight className="h-4 w-4 text-gold" aria-hidden="true" /> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-heading text-h4">Popüler Hizmetler</h2>
            <ul className="mt-3 space-y-2">
              {POPULAR_SERVICES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="inline-flex items-center gap-1.5 text-ink-soft hover:text-navy">
                    <ArrowRight className="h-4 w-4 text-gold" aria-hidden="true" /> {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-sm text-ink-muted">
          Kırık bir bağlantı mı buldunuz?{' '}
          <a href={mailtoReport} className="inline-flex items-center gap-1 font-medium text-navy hover:text-gold">
            <Mail className="h-4 w-4" aria-hidden="true" /> Bize bildirin
          </a>
        </p>
      </div>
    </main>
  );
}
