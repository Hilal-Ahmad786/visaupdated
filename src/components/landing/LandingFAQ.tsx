import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { faqJsonLd } from '@/lib/seo';
import type { FaqItem } from '@/data/landing/types';

/**
 * FAQ section. The FAQPage JSON-LD is generated from the exact same `items` that
 * render on screen, so structured data always matches visible content.
 */
export function LandingFAQ({ heading, items }: { heading: string; items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section bg="page" ariaLabel={heading}>
      <SectionHeading eyebrow="Sıkça Sorulan Sorular" title={heading} align="center" />
      <div className="mx-auto mt-8 max-w-3xl">
        <FAQAccordion items={items} trackContext="landing_faq" />
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </Section>
  );
}
