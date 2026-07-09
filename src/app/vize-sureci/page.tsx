import type { Metadata } from 'next';
import { ArrowRight, Building2, Check, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import type { ProcessStep } from '@/types/content';

const PAGE_DESCRIPTION =
  'Ön değerlendirmeden randevuya, başvuru gününden sonuca kadar aşama aşama vize süreciniz için size destek oluyoruz.';

export const metadata: Metadata = buildMetadata({
  title: 'Vize Süreci',
  description: PAGE_DESCRIPTION,
  path: '/vize-sureci',
});

const steps: ProcessStep[] = [
  {
    title: 'Ön Değerlendirme',
    description:
      'Profilinizi, seyahat amacınızı ve hedef ülkenizi değerlendirir, başvuruya uygunluğunuzu netleştiririz.',
  },
  {
    title: 'Yol Haritası & Doğru Vize Türü',
    description:
      'Durumunuza en uygun vize türünü belirler, adım adım bir yol haritası ve zaman planı oluştururuz.',
  },
  {
    title: 'Evrak Hazırlığı',
    description:
      'Başvuru türünüze özel evrak listesini hazırlar; belge formatı, çeviri ve tasdik konularında yönlendiririz.',
  },
  {
    title: 'Başvuru Formu',
    description:
      'Konsolosluk veya başvuru merkezi formlarının doğru ve eksiksiz doldurulmasında destek sağlarız.',
  },
  {
    title: 'Randevu Organizasyonu',
    description:
      'Başvuru merkezi randevu sürecini takip eder, uygun tarih seçeneklerini sizinle paylaşırız.',
  },
  {
    title: 'Başvuru Günü & Biyometrik',
    description:
      'Randevu gününe hazırlanmanızı sağlar; evrak sıralaması ve biyometrik işlemler hakkında bilgilendiririz.',
  },
  {
    title: 'Değerlendirme & Sonuç',
    description:
      'Başvurunuz resmi makamlarca değerlendirilirken süreci takip eder, sonuç ve sonraki adımlar konusunda yönlendiririz.',
  },
];

const responsibilities = [
  {
    icon: UserCheck,
    title: 'Başvuran Sorumlulukları',
    items: [
      'Doğru ve güncel bilgi paylaşmak',
      'İstenen belgeleri zamanında temin etmek',
      'Resmi harç ve ücretleri ödemek',
      'Randevuya zamanında ve eksiksiz katılmak',
      'Beyanların doğruluğundan sorumlu olmak',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'VİS VİZE Sorumlulukları',
    items: [
      'Süreci planlamak ve yönlendirmek',
      'Başvuru türüne özel evrak listesi sunmak',
      'Belge ve form kontrolü yapmak',
      'Randevu sürecini takip etmek',
      'Her aşamada bilgilendirme sağlamak',
    ],
  },
  {
    icon: Building2,
    title: 'Resmi Makam Sorumlulukları',
    items: [
      'Randevu kapasitesini belirlemek',
      'Başvuruyu değerlendirmek',
      'Vize kararını vermek',
      'İşlem süresini belirlemek',
      'Ek belge talep edebilmek',
    ],
  },
] as const;

const infoSections = [
  {
    title: 'Evrak Planlaması',
    body:
      'Eksik veya hatalı evrak en sık karşılaşılan ret nedenlerindendir. Başvuru türünüze göre kişiselleştirilmiş bir evrak listesi hazırlar; belgelerin geçerlilik süresi, çeviri ve tasdik gereksinimleri konusunda yönlendirme yaparız.',
  },
  {
    title: 'Randevu Süreci',
    body:
      'Randevu uygunluğu tamamen resmi başvuru merkezine bağlıdır. Sistemleri düzenli takip eder, uygun tarih çıktığında sizi bilgilendirir ve randevu gününe hazırlanmanızı sağlarız.',
  },
  {
    title: 'Başvuru Günü',
    body:
      'Başvuru gününde evraklarınızın sıralı ve eksiksiz olması önemlidir. Biyometrik veri (parmak izi ve fotoğraf) alımı, belge teslimi ve görüşme adımları hakkında önceden bilgilendirme yaparız.',
  },
  {
    title: 'İşlem Süresi',
    body:
      'İşlem süreleri ülkeye, vize türüne ve başvuru yoğunluğuna göre değişir ve tamamen resmi makamların inisiyatifindedir. Süreci takip ederiz; ancak hiçbir tarih veya süre garantisi verilemez.',
  },
];

const faqs = [
  {
    question: 'Vize süreci ne kadar sürer?',
    answer:
      'İşlem süresi ülkeye, vize türüne ve başvuru yoğunluğuna göre değişir ve resmi makamlarca belirlenir. Net bir süre garantisi verilemez; başvurunuzu olabildiğince erken planlamanızı öneririz.',
  },
  {
    question: 'Vize onayını garanti ediyor musunuz?',
    answer:
      'Hayır. Nihai karar ilgili konsolosluk veya resmi makamlara aittir. Biz başvurunuzu eksiksiz ve doğru hazırlamanız için danışmanlık ve destek sağlarız.',
  },
  {
    question: 'Başvurum reddedilirse ne yapmalıyım?',
    answer:
      'Ret gerekçesini birlikte değerlendirir, varsa eksiklikleri gidermenize yardımcı oluruz. Şartlarınız uygunsa yeniden başvuru için yol haritası çıkarırız.',
  },
  {
    question: 'Resmi harçlar danışmanlık ücretine dahil mi?',
    answer:
      'Hayır. Resmi vize harçları, başvuru merkezi ücretleri ve sigorta gibi resmi bedeller danışmanlık ücretinden ayrıdır ve doğrudan ilgili kuruma ödenir.',
  },
];

const relatedServices = [
  { slug: 'vize-danismanligi', label: 'Vize Danışmanlığı' },
  { slug: 'evrak-kontrolu', label: 'Evrak Kontrolü' },
  { slug: 'randevu-destegi', label: 'Randevu Desteği' },
];

export default async function VisaProcessPage() {
  const repo = getContentRepository();
  const countries = await repo.getCountries();
  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Vize Süreci', href: '/vize-sureci' }]} />

      {/* Hero (standard band + compliance bar) */}
      <PageHero
        eyebrow="Vize Süreci"
        title="VİS VİZE Randevu Merkezi ile adım adım vize süreci"
        description={PAGE_DESCRIPTION}
        actions={
          <PhoneLink
            location="process_hero"
            className="btn-primary text-lg"
            label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
          />
        }
      />

      {/* 7-step timeline */}
      <Section bg="page">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Süreç Akışı" title="7 Adımda Vize Süreci" />
            <StatusAlert tone="info" className="mt-6">
              Adımlar genel bir rehber niteliğindedir; süreç ülkeye ve vize türüne göre değişebilir. Hiçbir işlem
              süresi, randevu tarihi veya onay garantisi verilmez.
            </StatusAlert>
          </div>
          <ProcessTimeline steps={steps} />
        </div>
      </Section>

      {/* Responsibility columns */}
      <Section bg="white">
        <SectionHeading
          eyebrow="Roller ve Sorumluluklar"
          title="Süreçte Kim Neyden Sorumlu?"
          description="Şeffaflık için her tarafın sorumluluklarını net olarak paylaşıyoruz."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {responsibilities.map(({ icon: Icon, title, items }) => (
            <div key={title} className="card flex flex-col p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-surface text-gold">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-h4">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Info sections */}
      <Section bg="page">
        <SectionHeading
          eyebrow="Detaylar"
          title="Sürecin Kritik Aşamaları"
          description="Evrak hazırlığından işlem süresine kadar bilmeniz gerekenler."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {infoSections.map((s) => (
            <div key={s.title} className="card p-6">
              <h3 className="font-heading text-h4">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Rejection & reapplication */}
      <Section bg="white">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Ret ve Yeniden Başvuru" title="Başvurunuz Reddedilirse" />
            <p className="mt-4 text-ink-soft">
              Vize reddi sürecin sonu değildir. Ret gerekçesini birlikte inceler, eksiklikleri gidermenize yardımcı
              olur ve şartlarınız uygunsa daha güçlü bir yeniden başvuru hazırlarız.
            </p>
          </div>
          <div className="card p-6">
            <ul className="space-y-3">
              {[
                'Ret gerekçesini dikkatlice okuyun ve saklayın.',
                'Eksik veya yetersiz belgeleri tespit edin.',
                'Gerekçeyi gideren ek belgeler hazırlayın.',
                'Aceleci olmadan, profilinizi güçlendirerek yeniden başvurun.',
                'Süreci bir danışmanla değerlendirin.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="page">
        <SectionHeading eyebrow="Sıkça Sorulan Sorular" title="Vize Süreci Hakkında" align="center" />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={faqs} trackContext="process:overview" />
        </div>
      </Section>

      {/* Related services */}
      <Section bg="white">
        <SectionHeading title="Süreçte Size Yardımcı Olabilecek Hizmetler" />
        <div className="mt-6 flex flex-wrap gap-3">
          {relatedServices.map((rs) => (
            <Link key={rs.slug} href={`/hizmetler/${rs.slug}`} className="pill">
              {rs.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Bottom form */}
      <Section bg="page" ariaLabel="Ön başvuru formu">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm
              leadType="country"
              countryOptions={countryOptions}
              title="Vize Süreciniz İçin Ön Başvuru"
              description="Bilgilerinizi paylaşın, uzman danışmanlarımız sürecinizi değerlendirip sizi arasın."
            />
          </div>
          <LegalDisclaimer className="mt-6" />
        </div>
      </Section>

      <ClickToCallBanner location="process_bottom" />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
