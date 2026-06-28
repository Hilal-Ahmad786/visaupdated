import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { MapPlaceholder } from '@/components/contact/MapPlaceholder';
import { ContactForm } from '@/components/forms/ContactForm';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui/Section';
import { contactSettings, whatsappLink } from '@/config/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'İletişim',
  description:
    'VİS VİZE ile iletişime geçin. Telefon, WhatsApp veya e-posta ile ulaşın; vize sürecinizle ilgili hemen bilgi alın.',
  path: '/iletisim',
});

const contactFaqs = [
  { question: 'Çalışma saatleriniz nedir?', answer: 'Hafta içi 09:00–18:00, Cumartesi 10:00–15:00 saatleri arasında hizmet veriyoruz.' },
  { question: 'Yüz yüze görüşme şart mı?', answer: 'Hayır. Türkiye geneli online hizmet sunuyoruz; süreci telefon, WhatsApp ve e-posta ile yürütebiliriz.' },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'İletişim', href: '/iletisim' }]} />

      <Section bg="page">
        <SectionHeading eyebrow="İletişim" title="Vize Sürecinizle İlgili Hemen Bilgi Alın" description="En hızlı yanıt için bizi arayın. Dilerseniz WhatsApp veya e-posta ile de ulaşabilirsiniz." />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {/* Phone — strongest element */}
          <div className="card flex flex-col items-start p-6 ring-2 ring-gold/30">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-white">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-h4">Telefon</h2>
            <p className="mt-1 text-sm text-ink-soft">Hafta içi 09:00–18:00</p>
            <PhoneLink location="contact_phone_card" className="mt-3 font-heading text-h3 text-navy" showIcon={false} />
            <PhoneLink location="contact_phone_btn" className="btn-primary mt-4 w-full" label="Hemen Ara" />
          </div>

          {/* WhatsApp */}
          <div className="card flex flex-col items-start p-6">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-h4">WhatsApp</h2>
            <p className="mt-1 text-sm text-ink-soft">Mesajla hızlı iletişim</p>
            <p className="mt-3 font-heading text-h4 text-navy">{contactSettings.whatsappDisplay}</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 w-full">
              WhatsApp’tan Yaz
            </a>
          </div>

          {/* Email */}
          <div className="card flex flex-col items-start p-6">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-white">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-h4">E-posta</h2>
            <p className="mt-1 text-sm text-ink-soft">Detaylı talepleriniz için</p>
            <p className="mt-3 break-all font-heading text-h4 text-navy">{contactSettings.email}</p>
            <a href={`mailto:${contactSettings.email}`} className="btn-outline mt-4 w-full">
              E-posta Gönder
            </a>
          </div>
        </div>

        {/* Address + hours + map + form */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="card p-6">
              <h2 className="font-heading text-h4">Ofis & Çalışma Saatleri</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" /> {contactSettings.address.line}, {contactSettings.address.city}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {contactSettings.workingHours.map((h) => (
                  <li key={h.label} className="flex items-center justify-between gap-4 border-b border-line/60 pb-1.5">
                    <span className="flex items-center gap-2 text-ink-soft">
                      <Clock className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {h.label}
                    </span>
                    <span className="font-medium text-ink">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5">
              <MapPlaceholder />
            </div>
            <LegalDisclaimer className="mt-5" />
          </div>

          <div className="card p-6 sm:p-7">
            <h2 className="font-heading text-h3">Bize Yazın</h2>
            <p className="mt-1 text-sm text-ink-soft">Formu doldurun, en kısa sürede size dönelim.</p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <Section bg="white">
        <SectionHeading title="Sık Sorulanlar" align="center" />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={contactFaqs} trackContext="contact" />
        </div>
      </Section>
    </>
  );
}
