'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface QA {
  question: string;
  answer: string;
}

export function FAQAccordion({ items, trackContext }: { items: QA[]; trackContext?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) {
                    trackEvent({ name: 'faq_open', category: 'content', metadata: { context: trackContext ?? 'faq', index: i } });
                  }
                }}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading font-semibold text-ink hover:bg-surface"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-gold transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-5 pb-5 text-ink-soft"
            >
              <p className="leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
