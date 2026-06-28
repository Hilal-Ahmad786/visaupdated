import type { Metadata } from 'next';

import { ClickToCallBanner } from '@/components/conversion/ClickToCallBanner';
import { FaqExplorer } from '@/components/faq/FaqExplorer';
import { FaqQuestionForm } from '@/components/forms/FaqQuestionForm';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getContentRepository } from '@/content/repository';
import { buildMetadata, faqJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Sıkça Sorulan Sorular',
  description:
    'Vize süreci, belgeler, randevu ve ücretler hakkında en çok sorulan sorular.',
  path: '/sss',
});

export default async function FaqPage() {
  const repo = getContentRepository();
  const [faqs, categories] = await Promise.all([repo.getFaqs(), repo.getFaqCategories()]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'S.S.S.', href: '/sss' }]} />

      <Section bg="page">
        <SectionHeading
          as="h1"
          eyebrow="Yardım Merkezi"
          title="Sıkça Sorulan Sorular"
          description="Vize süreci, belgeler, randevu ve ücretler hakkında en çok merak edilenleri bir araya getirdik. Aradığınızı bulamazsanız sorunuzu bize iletebilirsiniz."
        />
        <div className="mt-10">
          <FaqExplorer faqs={faqs} categories={categories} />
        </div>
      </Section>

      <Section bg="surface" ariaLabel="Sorunuzu gönderin">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <SectionHeading
            title="Sorunuzu bulamadınız mı?"
            description="Aradığınız yanıtı bulamadıysanız sorunuzu yazın. Uzman ekibimiz en kısa sürede dönüş yapsın."
          />
          <div className="card p-6 md:p-8">
            <FaqQuestionForm />
          </div>
        </div>
      </Section>

      <ClickToCallBanner location="faq_bottom" />

      {faqs.length > 0 && (
        <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
    </>
  );
}
