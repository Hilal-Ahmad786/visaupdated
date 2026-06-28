import { ArrowRight, Check, ListChecks, X } from 'lucide-react';
import Link from 'next/link';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { ProcessTimeline } from '@/components/conversion/ProcessTimeline';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { SimpleLeadForm } from '@/components/forms/SimpleLeadForm';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ContentIcon } from '@/components/ui/Icon';
import { Section, SectionHeading } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { contactSettings } from '@/config/site';
import { SERVICE_DISCLAIMER } from '@/content/seed/services';
import { codeToFlag } from '@/lib/utils';
import type { Country, Service, ServiceCategory } from '@/types/content';

/**
 * Shared service detail renderer (design §17.4). Server component.
 * Consumed by /hizmetler/[serviceSlug].
 */
export function ServiceDetail({
  service,
  countryOptions,
  supportedCountries,
  relatedServices,
  category,
}: {
  service: Service;
  countryOptions: { value: string; label: string }[];
  supportedCountries: Country[];
  relatedServices: Service[];
  category?: ServiceCategory;
}) {
  const categoryLabel = category?.title ?? 'Hizmet';

  return (
    <>
      {/* Service-specific hero */}
      <section className="bg-gradient-to-b from-navy to-navy-deep text-white">
        <div className="container-content grid items-start gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <p className="flex items-center gap-2 font-heading text-label uppercase tracking-[0.14em] text-gold-soft">
              <ContentIcon name={service.icon} className="h-4 w-4" />
              {categoryLabel}
            </p>
            <h1 className="mt-3 text-h1 text-white">{service.heroTitle}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-white/80">{service.heroDescription}</p>
            <div className="mt-7">
              <PhoneLink
                location="service_hero"
                className="btn-primary text-lg"
                label={`Hemen Ara: ${contactSettings.phoneDisplay}`}
              />
            </div>
          </div>
          <div className="rounded-form bg-white p-6 text-ink shadow-form sm:p-7">
            <SimpleLeadForm
              leadType="service"
              countryOptions={countryOptions}
              compact
              title={`${service.name} İçin Bilgi Alın`}
              description="Kısa formu doldurun, ihtiyacınızı değerlendirip size en kısa sürede ulaşalım."
            />
          </div>
        </div>
      </section>

      {/* Scope (benefits) + exclusions */}
      <Section bg="page">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-h3">
              <ListChecks className="h-6 w-6 text-gold" aria-hidden="true" /> Hizmet Kapsamı
            </h2>
            <p className="mt-2 text-sm text-ink-soft">Bu hizmet kapsamında sizin için yaptıklarımız:</p>
            <ul className="mt-5 space-y-3">
              {service.scope.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-7">
            <h2 className="flex items-center gap-2 font-heading text-h3">
              <X className="h-6 w-6 text-danger" aria-hidden="true" /> Kapsam Dışındakiler
            </h2>
            <p className="mt-2 text-sm text-ink-soft">Şeffaflık için, bu hizmete dahil olmayanlar:</p>
            <ul className="mt-5 space-y-3">
              {service.exclusions.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Process steps */}
      {service.processSteps.length > 0 && (
        <Section bg="white">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading eyebrow="Nasıl İlerliyoruz" title="Adım Adım Süreç" />
              <p className="mt-4 text-ink-soft">
                Süreci sizin adınıza planlar, her adımda yönlendirme yaparız.
              </p>
            </div>
            <ProcessTimeline steps={service.processSteps} />
          </div>
        </Section>
      )}

      {/* Required information */}
      {service.requiredInfo.length > 0 && (
        <Section bg="page">
          <SectionHeading
            eyebrow="Sizden İhtiyacımız Olanlar"
            title="Başlamak İçin Gerekli Bilgiler"
            description="Size en doğru yönlendirmeyi yapabilmemiz için aşağıdaki bilgileri paylaşmanız yeterli."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.requiredInfo.map((item) => (
              <li key={item} className="flex items-start gap-2.5 rounded-card border border-line bg-white p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <span className="text-sm text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Supported countries */}
      {supportedCountries.length > 0 && (
        <Section bg="white">
          <SectionHeading
            eyebrow="Desteklenen Ülkeler"
            title="Bu Hizmeti Sunduğumuz Başlıca Ülkeler"
            description="Aşağıdaki ülkeler dışında da destek sağlıyoruz; durumunuzu bizimle paylaşın."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {supportedCountries.map((country) => (
              <Link key={country.slug} href={`/vize-ulkeleri/${country.slug}`} className="pill">
                <span aria-hidden="true">{codeToFlag(country.code)}</span> {country.name}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Pricing visibility */}
      <Section bg="page">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Ücretlendirme" title="Şeffaf Fiyatlandırma" align="center" />
          <div className="mt-8 card p-6 sm:p-7">
            <p className="text-body-lg text-ink">{service.pricingNote}</p>
            <StatusAlert tone="info" className="mt-5">
              Resmi vize harçları, başvuru merkezi ücretleri ve sigorta gibi resmi/üçüncü taraf bedeller
              danışmanlık ücretinden ayrıdır ve doğrudan ilgili kuruma ödenir.
            </StatusAlert>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {service.faqs.length > 0 && (
        <Section bg="white">
          <SectionHeading eyebrow="Sıkça Sorulan Sorular" title={`${service.name} Hakkında`} align="center" />
          <div className="mx-auto mt-8 max-w-3xl">
            <FAQAccordion items={service.faqs} trackContext={`service:${service.slug}`} />
          </div>
        </Section>
      )}

      {/* Related services */}
      {relatedServices.length > 0 && (
        <Section bg="page">
          <SectionHeading title="İlgili Hizmetler" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((rs) => (
              <ServiceCard key={rs.slug} service={rs} />
            ))}
          </div>
        </Section>
      )}

      {/* Bottom form */}
      <Section bg="white" ariaLabel="Hizmet talep formu">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <SimpleLeadForm
              leadType="service"
              countryOptions={countryOptions}
              title={`${service.name} İçin Talep Oluşturun`}
            />
          </div>
          <StatusAlert tone="info" className="mt-6">
            {SERVICE_DISCLAIMER}
          </StatusAlert>
          <LegalDisclaimer className="mt-4" />
        </div>
      </Section>

      <ClickToCallBanner location="service_bottom" />
    </>
  );
}
