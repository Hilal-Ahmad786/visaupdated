import { Section, SectionHeading } from '@/components/ui/Section';
import type { ProcessStep } from '@/data/landing/types';

/** Numbered application-support process. */
export function ApplicationProcess({ heading, steps }: { heading: string; steps: ProcessStep[] }) {
  return (
    <Section bg="surface" ariaLabel={heading}>
      <SectionHeading title={heading} align="center" />
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="card flex flex-col p-6">
            <span
              className="grid h-10 w-10 place-items-center rounded-full bg-navy font-heading text-base font-bold text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="mt-4 font-heading text-h4 text-navy">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
