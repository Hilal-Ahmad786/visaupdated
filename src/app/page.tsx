import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { ComplianceBar } from '@/components/compliance/ComplianceBar';
import { TrustStrip } from '@/components/conversion/TrustStrip';
import { CountryCard } from '@/components/countries/CountryCard';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ServiceCard } from '@/components/services/ServiceCard';
import { PreApplicationForm } from '@/components/forms/PreApplicationForm';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { faqJsonLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

const homepageFaqs = [
  {
    question: 'VİS VİZE vize onayını garanti ediyor mu?',
    answer:
      'Hayır. Hiçbir danışmanlık firması onay, randevu veya işlem süresini garanti edemez. Nihai karar resmi makamlara aittir; biz başvurunuzu doğru ve eksiksiz hazırlamanıza yardımcı oluruz.',
  },
  {
    question: 'Hangi ülkeler için destek veriyorsunuz?',
    answer:
      'Başta Schengen ülkeleri olmak üzere birçok destinasyon için danışmanlık ve evrak desteği sunuyoruz. Ülke listesini Vize Ülkeleri sayfasından inceleyebilirsiniz.',
  },
  {
    question: 'Süreç nasıl başlıyor?',
    answer:
      'Kısa ön başvuru formunu doldurmanız veya bizi aramanız yeterli. Profilinizi değerlendirip size özel bir yol haritası hazırlıyoruz.',
  },
];

// Dark "4 Basit Adım" band steps (numbered 01–04)
const applicationSteps = [
  { title: 'Formu Doldurun', description: 'Sitedeki kısa ön başvuru formunu yaklaşık 1 dakikada doldurun.' },
  { title: 'Sizi Arayalım', description: 'Uzman danışmanlarımız seyahat amacınıza göre sizi bilgilendirsin.' },
  { title: 'Süreci Planlayalım', description: 'Gerekli evrak listesini hazırlayıp randevu sürecinizi planlayalım.' },
  { title: 'Takip Edin', description: 'Başvurunuz sonuçlanana dek süreci birlikte adım adım izleyelim.' },
];

// Applicant status groups (left "tabs")
const applicantGroups = ['Sigortalı Çalışan', 'Şirket Sahibi / İşveren', 'Emekli', 'Öğrenci / Ev Hanımı'];

// Base required documents checklist
const baseDocuments = [
  'Son 6 ay içerisinde alınmış biyometrik fotoğraf',
  'SGK işe giriş bildirgesi ve hizmet dökümü',
  'İzin ve seyahat amacını belirten şirket yazısı',
  'Son 3 aylık kaşeli-imzalı maaş bordrosu',
  'Bakiyeli banka hesap dökümleri',
];

export default async function HomePage() {
  const repo = getContentRepository();
  const [countries, services, articles, testimonials] = await Promise.all([
    repo.getCountries(),
    repo.getServices(),
    repo.getArticles(),
    repo.getTestimonials(),
  ]);

  const countryOptions = countries.map((c) => ({ value: c.slug, label: c.name }));
  const popular = countries.filter((c) => c.popular).slice(0, 6);
  const topServices = services.slice(0, 4);

  return (
    <>
      {/* Hero (form-first) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-deep text-white" aria-label="Giriş">
        {/* Soft decorative glows for depth (no heavy imagery) */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 h-[24rem] w-[24rem] rounded-full bg-gold/5 blur-3xl" />

        <div className="container-content relative grid items-start gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
          {/* Left column — top-aligned with the form card */}
          <div className="lg:pt-1.5">
            <h1 className="text-h1 text-balance text-white lg:text-[3.25rem] lg:leading-[1.1]">
              Vize Sürecinizi Doğru Planlayın,{' '}
              <span className="text-gold-soft">Başvurunuza Güvenle Başlayın</span>
            </h1>

            <p className="mt-5 max-w-xl text-body-lg text-white/80">
              Gideceğiniz ülkeye ve seyahat amacınıza uygun başvuru sürecini birlikte planlayalım. Kısa formu doldurun
              veya danışma hattımızı hemen arayın.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {['Hızlı Randevu Takibi', 'Eksiksiz Evrak Hazırlığı', 'Ücretsiz İlk Değerlendirme'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <CheckCircle2 className="h-[18px] w-[18px] text-gold-soft" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>

            {/* Phone card + explore */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-card border border-white/10 bg-white p-2 pl-4 shadow-card">
                <div className="pr-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Hemen Arayın</p>
                  <PhoneLink location="hero_phone_card" showIcon={false} className="font-heading text-lg font-bold text-navy" />
                </div>
                <PhoneLink
                  location="hero_phone_btn"
                  showIcon
                  label=""
                  className="h-12 w-12 shrink-0 rounded-xl bg-gold text-white hover:bg-gold-hover"
                />
              </div>
              <Link href="/vize-ulkeleri" className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">
                Vize Ülkelerini İncele
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <ShieldCheck className="h-4 w-4 text-gold-soft" aria-hidden="true" />
              KVKK uyumlu, güvenli bilgi aktarımı · Türkiye geneli online hizmet
            </p>
          </div>

          {/* Hero form card (multi-step pre-application) */}
          <div className="relative">
            <span className="absolute -top-3 right-5 z-10 rounded-full bg-gold px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wide text-white shadow-card">
              Ücretsiz Ön Değerlendirme
            </span>
            <PreApplicationForm countryOptions={countryOptions} />
          </div>
        </div>
      </section>

      {/* Persistent compliance bar under the hero (shared with landing pages). */}
      <ComplianceBar />

      <TrustStrip />

      {/* Popular destinations */}
      <Section bg="page">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="En Çok Tercih Edilenler" title="Popüler Vize Ülkeleri" />
          <Link href="/vize-ulkeleri" className="hidden shrink-0 items-center gap-1.5 font-heading font-semibold text-navy hover:text-gold sm:inline-flex">
            Tüm Ülkeleri Gör <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <CountryCard key={c.slug} country={c} />
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section bg="white">
        <SectionHeading
          align="center"
          eyebrow="Hizmetlerimiz"
          title="Vize Sürecinizin Her Adımında Yanınızdayız"
          description="Vize sürecinizin her adımında uzman desteği sunarak işinizi kolaylaştırıyoruz."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>

      {/* 4 simple steps — dark navy band */}
      <Section bg="navy" ariaLabel="Başvuru adımları">
        <div className="text-center">
          <h2 className="text-h2 text-balance text-white">Başvurunuza 4 Basit Adımda Başlayın</h2>
          <p className="mx-auto mt-3 max-w-2xl text-body-lg text-white/70">
            Süreci sizin için sade tuttuk. Formu doldurun, gerisini birlikte planlayalım.
          </p>
        </div>
        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-white/15 lg:block" />
          {applicationSteps.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <span className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-gold/60 bg-navy-deep font-heading text-h4 font-bold text-gold" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-heading text-h4 text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link href="/iletisim" className="btn-primary">
            Ücretsiz Ön Başvuruya Başlayın
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      {/* Applicant status groups + required documents */}
      <Section bg="gold-surface" ariaLabel="Meslek grupları">
        <SectionHeading
          eyebrow="Evrak Hazırlığı"
          title="Başvuru Sahibi Meslek Grupları"
          description="Meslek durumunuza göre istenen evraklar değişkenlik gösterebilir. Size özel listeyi birlikte hazırlayalım."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: status groups */}
          <ul className="flex flex-col gap-3">
            {applicantGroups.map((g, i) => (
              <li key={g}>
                <span
                  className={cn(
                    'flex items-center justify-between rounded-card border px-5 py-4 font-heading font-semibold',
                    i === 0
                      ? 'border-gold bg-white text-navy shadow-card'
                      : 'border-line bg-white/60 text-ink-soft',
                  )}
                >
                  {g}
                  <ChevronRight className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                </span>
              </li>
            ))}
          </ul>

          {/* Right: base checklist + email card */}
          <div className="grid gap-6 sm:grid-cols-[1.3fr_1fr]">
            <div className="card p-6">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-gold" aria-hidden="true" />
                <h3 className="font-heading text-h4">Gerekli Temel Evraklar</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {baseDocuments.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card flex flex-col items-start justify-center bg-navy p-6 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 text-gold">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-h4 text-white">Detaylı Liste ister misiniz?</h3>
              <p className="mt-2 text-sm text-white/70">
                Başvuru türünüze özel tam evrak listesini sizin için hazırlayıp e-posta ile gönderelim.
              </p>
              <Link href="/iletisim" className="btn-primary mt-5 w-full justify-center">
                E-posta ile Gönderelim
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="white">
        <SectionHeading eyebrow="Sıkça Sorulan Sorular" title="Aklınızdaki Sorular" align="center" />
        <div className="mx-auto mt-8 max-w-3xl">
          <FAQAccordion items={homepageFaqs} trackContext="homepage" />
          <div className="mt-4 text-center">
            <Link href="/sss" className="font-heading font-semibold text-navy hover:text-gold">
              Tüm soruları görüntüle
            </Link>
          </div>
        </div>
      </Section>

      {/* Testimonials — only verified, else hidden */}
      {testimonials.length > 0 && (
        <Section bg="page">
          <SectionHeading eyebrow="Müşteri Yorumları" title="Bizimle Çalışanların Görüşleri" align="center" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="card p-6">
                <blockquote className="text-ink-soft">“{t.text}”</blockquote>
                <figcaption className="mt-4 font-heading font-semibold text-navy">
                  {t.name} <span className="font-normal text-ink-muted">· {t.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* Latest articles */}
      <Section bg="white">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Vize Rehberleri" title="Güncel Bilgiler ve İpuçları" />
          <Link href="/blog" className="hidden shrink-0 items-center gap-1.5 font-heading font-semibold text-navy hover:text-gold sm:inline-flex">
            Tüm Yazılar <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      {/* Bottom lead form */}
      <Section bg="page" ariaLabel="İletişim formu">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <SectionHeading eyebrow="Ücretsiz Değerlendirme" title="Uzman Danışmanlarımız Sizi Arasın" description="Kısa formu doldurun, başvuru türünüzü değerlendirip size en uygun süreci açıklayalım." />
            <div className="mt-6 flex items-center gap-3 rounded-card bg-white p-4 shadow-card">
              <Phone className="h-6 w-6 text-gold" aria-hidden="true" />
              <div>
                <p className="text-sm text-ink-soft">Hemen konuşmak ister misiniz?</p>
                <PhoneLink location="bottom_form" className="font-heading text-h4 text-navy" showIcon={false} />
              </div>
            </div>
            <LegalDisclaimer className="mt-6" />
          </div>
          <div className="card p-6 sm:p-7">
            <SimpleLeadForm leadType="country" countryOptions={countryOptions} title="Geri Arama Talebi" />
          </div>
        </div>
      </Section>

      <ClickToCallBanner location="homepage_bottom" />

      <JsonLd data={faqJsonLd(homepageFaqs)} />
    </>
  );
}
