'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
  count?: number;
}

/** Accessible tablist with panels. Horizontal-scroll on mobile. */
export function Tabs({ tabs, ariaLabel }: { tabs: TabDef[]; ariaLabel: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => {
          const isActive = t.id === current?.id;
          return (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                'shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 font-heading text-sm font-semibold transition-colors',
                isActive ? 'border-gold text-navy' : 'border-transparent text-ink-soft hover:text-navy',
              )}
            >
              {t.label}
              {typeof t.count === 'number' && (
                <span className="ml-1.5 rounded-full bg-surface px-1.5 py-0.5 text-[11px] text-ink-soft">{t.count}</span>
              )}
            </button>
          );
        })}
      </div>
      {current && (
        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} className="pt-5">
          {current.content}
        </div>
      )}
    </div>
  );
}
