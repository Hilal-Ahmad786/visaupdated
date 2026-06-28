'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { ApplicantStatus } from '@/types/content';

/** Accessible tablist for applicant-status document groups. */
export function ApplicantStatusTabs({ statuses }: { statuses: ApplicantStatus[] }) {
  const [active, setActive] = useState(0);
  if (statuses.length === 0) return null;
  const current = statuses[active]!;

  return (
    <div>
      <div role="tablist" aria-label="Başvuran durumu" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {statuses.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            id={`tab-${s.key}`}
            aria-selected={i === active}
            aria-controls={`panel-${s.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => {
              setActive(i);
              trackEvent({ name: 'document_tab_view', category: 'content', metadata: { status: s.key } });
            }}
            className={cn('pill shrink-0', i === active && 'pill-active')}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${current.key}`}
        aria-labelledby={`tab-${current.key}`}
        className="mt-5 rounded-card border border-line bg-white p-5"
      >
        <h3 className="font-heading text-h4">{current.label} için ek belgeler</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {current.documents.map((doc) => (
            <li key={doc} className="flex items-start gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              {doc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
