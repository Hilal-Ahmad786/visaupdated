import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Compass, Mail, Phone, ShieldCheck, Target, X } from 'lucide-react';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { brand, contactSettings } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const PAGE_DESCRIPTION =
  'VİS VİZE; vize başvuru sürecinde danışmanlık ve destek sunan bağımsız bir hizmet kuruluşudur. Misyonumuzu, çalışma ilkelerimizi ve şeffaflık yaklaşımımızı keşfedin.';

export const metadata: Metadata = buildMetadata({
  title: 'Hakkımızda',
  description: PAGE_DESCRIPTION,
  path: '/hakkimizda',
});

const doList = [
  'Vize türü ve ülke seçiminde yönlendirme yaparız.',
  'Başvuru için gerekli evrak listesini hazırlar ve eksikleri birlikte tamamlarız.',
  'Form doldurma ve randevu organizasyonu adımlarında destek sağlarız.',
  'Süreci başvurunuz sonuçlanana kadar takip eder, gelişmeleri sizinle paylaşırız.',
];

const dontList = [
  'Resmi bir konsolosluk, büyükelçilik veya vize başvuru merkezi değiliz.',
  'Vize onayı ya da olumlu sonuç garantisi vermeyiz; nihai karar resmi makamlara aittir.',
  'Sizden istenen resmi harç ve ücretleri kurum adına tahsil etmeyiz.',
  'Gerçeğe aykırı belge veya beyan hazırlığına aracılık etmeyiz.',
];

const howItWorks = [
  {
    title: 'Ön Değerlendirme',
    description: 'Profilinizi ve seyahat amacınızı dinler, ihtiyacınızı netleştiririz.',
  },
  {
    title: 'Planlama ve Evrak',
    description: 'Size özel evrak listesini ve zaman planını hazırlar, hazırlık aşamasında yönlendiririz.',
  },
  {
    title: 'Randevu ve Takip',
    description: 'Randevu adımlarını organize eder, başvurunuz sonuçlanana kadar süreci izleriz.',
  },
];

const companyFaqs = [
  {
    question: 'VİS VİZE resmi bir devlet kurumu mu?',
    answer:
      'Hayır. VİS VİZE; konsolosluk, büyükelçilik veya vize başvuru merkezi değildir. Vize başvuru sürecinde danışmanlık ve destek hizmeti sunan bağımsız bir kuruluştur. Nihai vize kararı ilgili resmi makamlar tarafından verilir.',
  },
  {
    question: 'Vize onayı garantisi veriyor musunuz?',
    answer:
      'Hayır. Hiçbir danışmanlık kuruluşu vize onayını garanti edemez. Bizim rolümüz, başvurunuzu eksiksiz ve doğru biçimde hazırlamanız için size rehberlik etmektir.',
  },
  {
    question: 'Hizmetlerinizden nasıl yararlanabilirim?',
    answer:
      'Telefonla bize ulaşabilir veya sitedeki kısa ön değerlendirme formunu doldurabilirsiniz. Bilgilerinizi inceleyip size en uygun destek kapsamını paylaşırız.',
  },
];

export default async function AboutPage() {
  const repo = getContentRepository();
  const [settings, countries] = await Promise.all([
    repo.getSiteSettings(),
    repo.getCountries(),
  ]);

  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  // Only render metrics the business has explicitly verified.
  const verifiedMetrics = settings.trustMetrics.filter((m) => m.verified);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Hakkımızda', href: '/hakkimizda' }]} />

      {/* Standard hero band + compliance bar */}
      <PageHero
        eyebrow="Hakkımızda"
        title="Vize Sürecinde Güvenilir Yol Arkadaşınız"
        description="Vize başvuru sürecini sadeleştirmek için kurulmuş, bağımsız ve özel bir danışmanlık ve destek kuruluşuyuz."
      />

      {/* Intro */}
      <Section bg="page" ariaLabel="Hakkımızda">
        <div className="max-w-3xl space-y-4 text-body-lg text-ink-soft">
          <p>
            {brand.short}, vize başvuru sürecini ilk kez deneyimleyenler için karmaşık ve yorucu
            olabilen adımları sadeleştirmek amacıyla kurulmuş bağımsız bir danışmanlık ve destek
            kuruluşudur. Amacımız; doğru bilgiyi, şeffaf bir şekilde ve sizi yormadan sunmaktır.
          </p>
          <p>
            Her başvuranın koşulları farklıdır. Bu nedenle hazır kalıplar yerine, profilinize uygun
            yönlendirme yapmayı ve süreci sizin adınıza planlamayı önemsiyoruz.{' '}
            {settings.serviceArea} kapsamında, başvurunuzun her adımında yanınızda oluruz.
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section bg="white" ariaLabel="Misyon ve vizyon">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-surface text-navy">
              <Target className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-h3">Misyonumuz</h2>
            <p className="mt-3 text-ink-soft">
              Vize başvuru sürecini herkes için anlaşılır, düzenli ve stressiz hale getirmek;
              başvuranların eksiksiz ve doğru bir dosyayla resmi makamların karşısına çıkmasına
              destek olmak.
            </p>
          </div>
          <div className="card p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-surface text-navy">
              <Compass className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-h3">Vizyonumuz</h2>
            <p className="mt-3 text-ink-soft">
              Şeffaflığı ve dürüst bilgilendirmeyi merkeze alan, başvuranların güvenle başvurabildiği
              bir vize danışmanlığı anlayışını standart haline getirmek.
            </p>
          </div>
        </div>
      </Section>

      {/* What we do vs do not */}
      <Section bg="surface" ariaLabel="Çalışma ilkelerimiz">
        <SectionHeading
          eyebrow="Şeffaflık"
          title="Ne Yapıyoruz, Ne Yapmıyoruz?"
          description="Hizmetimizin sınırlarını baştan net olarak paylaşmak, güvenin temelidir."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <p className="text-label font-semibold uppercase tracking-wide text-success">
              Yaptıklarımız
            </p>
            <ul className="mt-4 space-y-3">
              {doList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8">
            <p className="text-label font-semibold uppercase tracking-wide text-danger">
              Yapmadıklarımız
            </p>
            <ul className="mt-4 space-y-3">
              {dontList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section bg="white" ariaLabel="Nasıl çalışıyoruz">
        <SectionHeading
          eyebrow="Süreç"
          title="Sizinle Nasıl Çalışıyoruz?"
          description="Detaylı adımlar için vize sürecimizi inceleyebilirsiniz."
        />
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="card flex flex-col p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-heading font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-heading text-h4">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/vize-sureci" className="btn-outline">
            Vize Sürecini İncele
          </Link>
        </div>
      </Section>

      {/* Trust & transparency */}
      <Section bg="page" ariaLabel="Güven ve şeffaflık">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Güven"
            title="Şeffaflık ve Dürüst Bilgilendirme"
            description="Vaat ettiğimiz tek şey, sürecin her aşamasında size karşı açık ve dürüst olmaktır."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              'Hizmet kapsamını ve sınırlarını baştan paylaşırız.',
              'Resmi harçlar ile danışmanlık ücretini birbirinden ayrı ve net belirtiriz.',
              'Gerçeğe aykırı vaat ve onay garantisi vermeyiz.',
              'Kişisel verilerinizi KVKK kapsamında işleriz.',
            ].map((item) => (
              <li key={item} className="card flex items-start gap-3 p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
                <span className="text-sm text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Verified trust metrics — rendered ONLY when verified data exists */}
      {verifiedMetrics.length > 0 && (
        <Section bg="navy" ariaLabel="Rakamlarla biz">
          <SectionHeading eyebrow="Rakamlarla" title="Güven Veren Rakamlar" align="center" />
          <dl className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-3">
            {verifiedMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block font-heading text-display text-gold">{metric.value}</span>
                  <span className="mt-1 block text-sm text-white/75">{metric.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* Contact info */}
      <Section bg="white" ariaLabel="İletişim bilgileri">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <SectionHeading
            eyebrow="İletişim"
            title="Sorularınız İçin Bize Ulaşın"
            description="Telefon veya e-posta ile bize ulaşabilir, ön değerlendirme talebinde bulunabilirsiniz."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex flex-col gap-3 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-surface text-navy">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-heading font-semibold text-ink">Telefon</p>
              <PhoneLink location="about_contact" className="font-semibold text-navy" />
            </div>
            <div className="card flex flex-col gap-3 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-surface text-navy">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-heading font-semibold text-ink">E-posta</p>
              <a
                href={`mailto:${contactSettings.email}`}
                className="inline-flex min-h-[44px] items-center font-semibold text-navy hover:text-navy-deep"
              >
                {contactSettings.email}
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="surface" ariaLabel="Sıkça sorulan sorular">
        <SectionHeading eyebrow="Sıkça Sorulan Sorular" title="Kurumumuz Hakkında" align="center" />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={companyFaqs} trackContext="about" />
        </div>
      </Section>

      {/* Bottom lead form */}
      <Section bg="page" ariaLabel="Ön değerlendirme formu">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm leadType="country" countryOptions={countryOptions} />
          </div>
        </div>
      </Section>

      <ClickToCallBanner location="about_bottom" />

      <Section bg="white" ariaLabel="Yasal bilgilendirme">
        <LegalDisclaimer />
      </Section>
    </>
  );
}
