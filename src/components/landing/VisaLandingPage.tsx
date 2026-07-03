import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { LANDING_COUNTRY_OPTIONS } from '@/data/landing/countries';
import type { LandingPageConfig } from '@/data/landing/types';
import { serviceJsonLd } from '@/lib/seo';
import type { LeadAttribution } from '@/types/lead';

import { ApplicationProcess } from './ApplicationProcess';
import { DocumentSupport } from './DocumentSupport';
import { LandingFAQ } from './LandingFAQ';
import { LandingHero } from './LandingHero';
import { LandingTracker } from './LandingTracker';
import { ProfileDocuments } from './ProfileDocuments';
import { RelatedServices } from './RelatedServices';
import { ServiceBenefits } from './ServiceBenefits';
import { ServiceOverview } from './ServiceOverview';
import { StickyMobileCTA } from './StickyMobileCTA';
import { TrustSection } from './TrustSection';
import type { LandingFormTracking } from './LandingLeadForm';

const DOCUMENT_NOTE =
  'Gerekli belgeler; başvuru türüne, kişisel durumunuza ve ilgili resmi makamın güncel uygulamasına göre değişebilir. Kesin liste için ön değerlendirme sırasında birlikte değerlendirme yaparız.';

/**
 * Data-driven landing page. Renders entirely from a single `LandingPageConfig`;
 * there is no per-page component. Server-rendered — the only client islands are
 * the lead form, the page-view tracker and the mobile sticky CTA.
 */
export function VisaLandingPage({ config }: { config: LandingPageConfig }) {
  const attribution: LeadAttribution = {
    pageSlug: config.slug,
    pageTitle: config.metadataTitle,
    campaignName: config.campaignName,
    campaignId: config.campaignId,
    adGroupName: config.adGroupName,
    adGroupId: config.adGroupId,
    landingCategory: config.category,
    country: config.country,
    visaType: config.visaType,
  };

  const tracking: LandingFormTracking = {
    campaign_name: config.campaignName,
    ad_group_name: config.adGroupName,
    country: config.country,
    visa_type: config.visaType,
    page_slug: config.slug,
  };

  const whatsappMessage = `Merhaba, ${config.visaType} hakkında bilgi almak istiyorum.`;

  return (
    <>
      <LandingTracker context={{ ...tracking }} />

      <Breadcrumbs items={[{ name: config.breadcrumbLabel, href: `/${config.slug}` }]} />

      <LandingHero
        config={config}
        countryOptions={LANDING_COUNTRY_OPTIONS}
        attribution={attribution}
        tracking={tracking}
      />

      <ServiceBenefits heading={config.sectionHeadings.benefits} items={config.benefitItems} />

      <ServiceOverview config={config} />

      <ApplicationProcess heading={config.sectionHeadings.process} steps={config.processSteps} />

      <DocumentSupport
        heading={config.sectionHeadings.documents}
        categories={config.documentCategories}
        note={DOCUMENT_NOTE}
      />

      {config.profileDocuments && config.profileDocuments.length > 0 && (
        <ProfileDocuments
          heading={config.sectionHeadings.profiles}
          groups={config.profileDocuments}
        />
      )}

      <TrustSection heading={config.sectionHeadings.whyChoose} items={config.whyChoose} />

      <LandingFAQ heading={config.sectionHeadings.faq} items={config.faqItems} />

      {/* Final / repeated CTA */}
      <ClickToCallBanner
        location={`landing_bottom_${config.category}`}
        title={`${config.country} Vize Sürecinizi Bugün Başlatın`}
        subtitle="Danışmanlarımız başvuru türünüzü değerlendirerek size uygun yol haritasını açıklasın."
      />

      <RelatedServices heading={config.sectionHeadings.related} links={config.relatedPages} />

      {/* Consultancy disclaimer (also present in the hero and global footer) */}
      <div className="container-content pb-14">
        <LegalDisclaimer text={config.disclaimerText} />
      </div>

      <StickyMobileCTA whatsappMessage={whatsappMessage} />

      <JsonLd
        data={serviceJsonLd({
          name: `${config.visaType} Danışmanlık ve Destek Hizmeti`,
          description: config.metadataDescription,
          path: `/${config.slug}`,
          serviceType: 'Vize başvuru danışmanlığı ve destek hizmeti',
        })}
      />
    </>
  );
}
