import { ArrowRight, CheckCircle2, FileText, Phone } from 'lucide-react';
import Link from 'next/link';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
import { TrustStrip } from '@/components/conversion/TrustStrip';
import { CountryCard } from '@/components/countries/CountryCard';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ServiceCard } from '@/components/services/ServiceCard';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { contactSettings } from '@/config/site';
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
      <section className="bg-gradient-to-b from-navy to-navy-deep text-white" aria-label="Giriş">
        <div className="container-content grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              Profesyonel Vize Randevu ve Başvuru Desteği
            </p>
            <h1 className="mt-3 text-h1 text-white lg:text-display">
              Vize Sürecinizi Doğru Planlayın, Başvurunuza Güvenle Başlayın
            </h1>
            <p className="mt-4 max-w-xl text-body-lg text-white/80">
              Gideceğiniz ülkeye ve seyahat amacınıza uygun başvuru sürecini birlikte planlayalım. Kısa formu doldurun
              veya danışma hattımızı hemen arayın.
            </p>
            <ul className="mt-6 grid max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              {['2–3 dakikada tamamlanır', 'Güvenli bilgi aktarımı', 'Ücretsiz ilk değerlendirme', 'Türkiye geneli online hizmet'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 text-gold-soft" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/online-on-basvuru" className="btn-primary text-lg">
                <FileText className="h-5 w-5" aria-hidden="true" /> Ücretsiz Ön Başvuruyu Başlat
              </Link>
              <PhoneLink location="hero" className="btn-outline border-white/30 bg-transparent text-lg text-white hover:bg-white/10" label={`Hemen Ara: ${contactSettings.phoneDisplay}`} />
            </div>
          </div>

          {/* Hero form card */}
          <div className="rounded-form bg-white p-6 text-ink shadow-form sm:p-7">
            <SimpleLeadForm
              leadType="country"
              countryOptions={countryOptions}
              compact
              title="Ücretsiz Vize Ön Değerlendirmenizi Başlatın"
              description="Kısa formu doldurun. Uzman ekibimiz başvuru türünüzü değerlendirerek size en kısa sürede ulaşsın."
            />
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
