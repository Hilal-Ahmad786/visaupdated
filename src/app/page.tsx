import { ArrowRight, CheckCircle2, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
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

const whyChoose = [
  { title: 'Başvuru Türünüze Özel Yol Haritası', desc: 'Profilinize ve hedef ülkenize göre net bir plan.' },
  { title: 'Eksiksiz Evrak Hazırlığı', desc: 'En sık ret sebebi olan evrak hatalarını önleyin.' },
  { title: 'Randevu Takibi', desc: 'Başvuru merkezi randevu sürecini sizin adınıza izleriz.' },
  { title: 'Şeffaf ve Güvenli Süreç', desc: 'KVKK uyumlu, açık ve dürüst iletişim.' },
];

const applicantStatuses = ['Sigortalı Çalışan', 'İşveren', 'Emekli', 'Öğrenci', 'Serbest Meslek'];

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
  const topServices = services.slice(0, 6);
  const processSteps = [
    { title: 'Ön Değerlendirme', description: 'Profilinizi ve seyahat amacınızı alırız.' },
    { title: 'Yol Haritası', description: 'Başvuru türünüze uygun planı paylaşırız.' },
    { title: 'Evrak Hazırlığı', description: 'Belgelerinizi eksiksiz hazırlatırız.' },
    { title: 'Randevu', description: 'Randevu sürecini takip ederiz.' },
    { title: 'Başvuru ve Takip', description: 'Sonuçlanana dek süreci izleriz.' },
  ];

  return (
    <>
      {/* Hero (form-first) */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-gold-surface/50 via-page to-page" aria-label="Giriş">
        {/* Soft decorative glows for depth (no heavy imagery) */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 h-[24rem] w-[24rem] rounded-full bg-navy/5 blur-3xl" />

        <div className="container-content relative grid items-start gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
          {/* Left column — top-aligned with the form card */}
          <div className="lg:pt-1.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-surface px-3.5 py-1.5 font-heading text-label uppercase tracking-[0.1em] text-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Profesyonel Vize Randevu ve Başvuru Desteği
            </span>

            <h1 className="mt-5 text-h1 text-balance text-ink lg:text-[3.25rem] lg:leading-[1.1]">
              Vize Sürecinizi Doğru Planlayın,{' '}
              <span className="text-gold">Başvurunuza Güvenle Başlayın</span>
            </h1>

            <p className="mt-5 max-w-xl text-body-lg text-ink-soft">
              Gideceğiniz ülkeye ve seyahat amacınıza uygun başvuru sürecini birlikte planlayalım. Kısa formu doldurun
              veya danışma hattımızı hemen arayın.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {['Hızlı Randevu Takibi', 'Eksiksiz Evrak Hazırlığı', 'Ücretsiz İlk Değerlendirme'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-ink">
                  <CheckCircle2 className="h-[18px] w-[18px] text-success" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>

            {/* Phone card + explore */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-card border border-line bg-white p-2 pl-4 shadow-card">
                <div className="pr-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Hemen Arayın</p>
                  <PhoneLink location="hero_phone_card" showIcon={false} className="font-heading text-lg font-bold text-navy" />
                </div>
                <PhoneLink
                  location="hero_phone_btn"
                  showIcon
                  label=""
                  className="!grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-white hover:bg-gold-hover"
                />
              </div>
              <Link href="/vize-ulkeleri" className="btn-outline">
                Vize Ülkelerini İncele
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
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

      <TrustStrip />

      {/* Popular destinations */}
      <Section bg="page">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Popüler Destinasyonlar" title="Hangi Ülkeye Başvurmak İstiyorsunuz?" />
          <Link href="/vize-ulkeleri" className="hidden shrink-0 items-center gap-1.5 font-heading font-semibold text-navy hover:text-gold sm:inline-flex">
            Tüm Ülkeler <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
        <SectionHeading eyebrow="Hizmetlerimiz" title="Size En Uygun Desteği Seçin" align="center" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section bg="page">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Vize Süreci" title="Başvurunuza Uygun Süreci Birlikte Planlayalım" description="Beş adımda net ve şeffaf bir süreç." />
            <Link href="/vize-sureci" className="mt-6 inline-flex items-center gap-1.5 font-heading font-semibold text-navy hover:text-gold">
              Süreci Detaylı İncele <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ProcessTimeline steps={processSteps} />
        </div>
      </Section>

      {/* Why choose */}
      <Section bg="white">
        <SectionHeading eyebrow="Neden VİS VİZE" title="Güvenilir, Şeffaf ve Sonuç Odaklı" align="center" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.map((w) => (
            <div key={w.title} className="card p-6">
              <CheckCircle2 className="h-7 w-7 text-gold" aria-hidden="true" />
              <h3 className="mt-3 font-heading text-h4">{w.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{w.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Applicant status info */}
      <Section bg="gold-surface">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <SectionHeading eyebrow="Başvuran Durumunuz" title="Evraklarınızı Başvuru Türünüze Göre Hazırlayın" description="Çalışan, işveren, emekli, öğrenci veya serbest meslek — her profile özel evrak listesi hazırlıyoruz." />
          <div className="flex flex-wrap gap-2.5">
            {applicantStatuses.map((s) => (
              <span key={s} className="rounded-full border border-gold/30 bg-white px-4 py-2 font-heading text-sm font-semibold text-navy">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials — only verified, else hidden */}
      {testimonials.length > 0 && (
        <Section bg="white">
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
      <Section bg="page">
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

      {/* Bottom lead form */}
      <Section bg="page" ariaLabel="İletişim formu">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
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
