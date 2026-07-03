import { FileText } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import type { DocumentCategory } from '@/data/landing/types';

/**
 * Document-preparation section. The trailing note reminds visitors that exact
 * requirements change and are the authorities' domain (no fixed legal facts).
 */
export function DocumentSupport({
  heading,
  categories,
  note,
}: {
  heading: string;
  categories: DocumentCategory[];
  note: string;
}) {
  return (
    <Section bg="white" ariaLabel={heading}>
      <SectionHeading
        title={heading}
        description="Aşağıdaki başlıklar genel bir çerçeve sunar; nihai liste profilinize göre birlikte netleştirilir."
        align="center"
      />
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        {categories.map((category) => (
          <div key={category.title} className="card flex flex-col p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-surface text-gold">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-h4 text-navy">{category.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {category.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink-muted">{note}</p>
    </Section>
  );
}
