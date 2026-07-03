import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Logo } from '@/components/layout/Logo';
import { DevCredit } from '@/components/layout/DevCredit';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { contactSettings, legalNav, primaryNav, whatsappLink } from '@/config/site';

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
        <LegalDisclaimer variant="footer" />
        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} VİS VİZE RANDEVU HİZMETLERİ. Tüm hakları saklıdır.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
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
