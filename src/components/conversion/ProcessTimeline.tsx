import type { ProcessStep } from '@/types/content';

/**
 * Vertical (mobile) / numbered process timeline. Server component.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-line pl-8">
      {steps.map((step, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-[42px] grid h-8 w-8 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white ring-4 ring-page"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <h3 className="font-heading text-h4">{step.title}</h3>
          <p className="mt-1 text-ink-soft">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
