import { Check } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import type { ProfileDocumentGroup } from '@/data/landing/types';

/**
 * Profession / profile-specific document explanation (e.g. employee vs employer,
 * student vs sponsor, applicant vs sponsor for family reunification).
 */
export function ProfileDocuments({
  heading,
  groups,
}: {
  heading: string;
  groups: ProfileDocumentGroup[];
}) {
  return (
    <Section bg="surface" ariaLabel={heading}>
      <SectionHeading
        title={heading}
        description="Mesleki veya kişisel durumunuza göre ek belgeler farklılaşır. Profilinize uygun listeyi birlikte belirleriz."
        align="center"
      />
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="card flex flex-col p-6">
            <h3 className="font-heading text-h4 text-navy">{group.title}</h3>
            {group.description && (
              <p className="mt-1.5 text-sm text-ink-soft">{group.description}</p>
            )}
            <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
