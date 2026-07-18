import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Logo } from '@/components/layout/Logo';
import { DevCredit } from '@/components/layout/DevCredit';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { CookiePreferencesLink } from '@/components/consent/CookiePreferencesLink';
import { contactSettings, legalEntity, legalNav, primaryNav, whatsappLink } from '@/config/site';

const popularCountries = [
  { label: 'Almanya Vizesi', href: '/almanya-vizesi' },
  { label: 'Fransa Vizesi', href: '/fransa-vizesi' },
  { label: 'Hollanda Vizesi', href: '/hollanda-vizesi' },
  { label: 'Yunanistan Vizesi', href: '/yunanistan-vizesi' },
  { label: 'Tüm Ülkeler', href: '/vize-ulkeleri' },
];

const serviceLinks = [
  { label: 'Vize Randevu Desteği', href: '/almanya-vize-randevu' },
  { label: 'Schengen Vizesi', href: '/almanya-schengen-vizesi' },
  { label: 'Öğrenci Vizesi', href: '/almanya-ogrenci-vizesi' },
  { label: 'Çalışma Vizesi', href: '/almanya-isci-vizesi' },
  { label: 'Tüm Hizmetler', href: '/hizmetler' },
];

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80">
      {/* Prominent call block */}
      <div className="border-b border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-left">
          <div>
            <p className="font-heading text-h4 text-white">
              Vize sürecinizle ilgili hemen bilgi alın
            </p>
            <p className="text-white/70">Uzman danışmanlarımız sizi yönlendirsin.</p>
          </div>
          <PhoneLink
            location="footer_call_block"
            className="btn-primary text-lg"
            label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
          />
        </div>
      </div>

      <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed">
            Vize başvurularına yönelik danışmanlık, evrak hazırlığı, randevu organizasyonu ve süreç
            takibi hizmeti.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href={contactSettings.phoneHref}
              className="flex items-center gap-2 hover:text-white"
            >
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" />{' '}
              {contactSettings.phoneDisplay}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> {contactSettings.whatsappDisplay}
            </a>
            <a
              href={`mailto:${contactSettings.email}`}
              className="flex items-center gap-2 hover:text-white"
            >
              <Mail className="h-4 w-4 text-gold" aria-hidden="true" /> {contactSettings.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />{' '}
              {contactSettings.address.city}, {contactSettings.address.country}
            </p>
          </div>
        </div>

        <FooterCol title="Kurumsal" links={primaryNav.slice(0, 6)} />
        <FooterCol title="Popüler Ülkeler" links={popularCountries} />
        <FooterCol title="Hizmetler" links={serviceLinks} />
      </div>

      <div className="container-content border-t border-white/10 py-6">
        {/* Corporate identity — transparent operator disclosure for Google Ads
            "Government Documents and Official Services" policy compliance. */}
        <div className="mb-5 rounded-card border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-white/65">
          <p className="font-heading text-sm text-gold-soft">Kurumsal Bilgiler</p>
          <p className="mt-2 text-white/80">
            Bu web sitesi, <strong className="text-white">{legalEntity.name}</strong> bünyesinde
            faaliyet gösteren bağımsız ve özel bir vize danışmanlık hizmetidir. Firmamız resmi bir
            devlet kurumu, konsolosluk, büyükelçilik veya vize başvuru merkezi (VFS Global, iDATA,
            TLScontact vb.) <strong className="text-white">değildir</strong>. Sunduğumuz danışmanlık
            hizmeti karşılığında, resmi vize ve başvuru merkezi ücretlerinden ayrı bir hizmet bedeli
            alınır.
          </p>
          <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            <div>
              <dt className="inline text-white/50">Ticaret Ünvanı: </dt>
              <dd className="inline">{legalEntity.name}</dd>
            </div>
            <div>
              <dt className="inline text-white/50">Kayıtlı Adres (Ticaret Sicili): </dt>
              <dd className="inline">{legalEntity.registeredAddress}</dd>
            </div>
            <div>
              <dt className="inline text-white/50">Ofis Adresi: </dt>
              <dd className="inline">
                {contactSettings.address.line}, {contactSettings.address.city}
              </dd>
            </div>
            <div>
              <dt className="inline text-white/50">Vergi Dairesi / No: </dt>
              <dd className="inline">
                {legalEntity.taxOffice} – {legalEntity.taxNumber}
              </dd>
            </div>
            <div>
              <dt className="inline text-white/50">MERSİS No: </dt>
              <dd className="inline">{legalEntity.mersisNo}</dd>
            </div>
            <div>
              <dt className="inline text-white/50">Ticaret Sicil No: </dt>
              <dd className="inline">{legalEntity.tradeRegistryNo}</dd>
            </div>
            <div>
              <dt className="inline text-white/50">İletişim: </dt>
              <dd className="inline">
                <a href={contactSettings.phoneHref} className="hover:text-white">
                  {contactSettings.phoneDisplay}
                </a>{' '}
                ·{' '}
                <a href={`mailto:${contactSettings.email}`} className="hover:text-white">
                  {contactSettings.email}
                </a>
              </dd>
            </div>
            {/* Travel-agency license — renders only once the reissued certificate
                in VİS VİZE's name is verified (legalEntity.travelAgency.verifiedDoc). */}
            {legalEntity.travelAgency?.verifiedDoc && (
              <div className="sm:col-span-2">
                <dt className="inline text-white/50">Seyahat Acentası Belgesi: </dt>
                <dd className="inline">
                  {legalEntity.travelAgency.authority} · {legalEntity.travelAgency.group} · Belge No:{' '}
                  {legalEntity.travelAgency.certNo}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <LegalDisclaimer variant="footer" />
        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} VİS VİZE RANDEVU HİZMETLERİ. Tüm hakları saklıdır.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <li>
              <Link href="/site-haritasi" className="hover:text-white">
                Site Haritası
              </Link>
            </li>
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePreferencesLink className="hover:text-white" />
            </li>
          </ul>
        </div>
        <div className="mt-6 flex justify-center">
          <DevCredit />
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-label uppercase tracking-wide text-gold-soft">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
