'use client';

import { Search } from 'lucide-react';
import { useDeferredValue, useId, useMemo, useState } from 'react';

import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { FaqQuestionForm } from '@/components/forms/FaqQuestionForm';
import { FilterPills } from '@/components/ui/FilterPills';
import { EmptyState } from '@/components/ui/states';
import { trackEvent } from '@/lib/analytics';
import { normalizeTr } from '@/lib/utils';
import type { FaqCategory, FaqItem } from '@/types/content';

/**
 * Client-side FAQ browser: accent-insensitive search over question + answer,
 * category filter via FilterPills, results rendered as an accordion. Search
 * analytics are privacy-safe — the raw query text is never forwarded.
 */
export function FaqExplorer({ faqs, categories }: { faqs: FaqItem[]; categories: FaqCategory[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchId = useId();

  const deferredQuery = useDeferredValue(query);

  const pillOptions = useMemo(
    () => [
      { value: 'all', label: 'Tümü' },
      ...categories.map((c) => ({ value: c.slug, label: c.title })),
    ],
    [categories],
  );

  const filtered = useMemo(() => {
    const needle = normalizeTr(deferredQuery.trim());
    return faqs.filter((faq) => {
      if (category !== 'all' && faq.category !== category) return false;
      if (!needle) return true;
      const haystack = normalizeTr(`${faq.question} ${faq.answer}`);
      return haystack.includes(needle);
    });
  }, [faqs, category, deferredQuery]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      {/* Category nav — sticky on desktop */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-ink-muted">
          Kategoriler
        </h2>
        <div className="lg:flex lg:flex-col lg:gap-1">
          <div className="lg:hidden">
            <FilterPills
              options={pillOptions}
              value={category}
              onChange={setCategory}
              ariaLabel="S.S.S. kategorisi seçin"
            />
          </div>
          <div
            role="radiogroup"
            aria-label="S.S.S. kategorisi seçin"
            className="hidden lg:flex lg:flex-col lg:gap-1"
          >
            {pillOptions.map((opt) => {
              const active = opt.value === category;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCategory(opt.value)}
                  className={
                    active
                      ? 'rounded-input bg-navy px-4 py-2.5 text-left font-medium text-white'
                      : 'rounded-input px-4 py-2.5 text-left text-ink-soft hover:bg-surface'
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div>
        {/* Search */}
        <div className="mb-6">
          <label htmlFor={searchId} className="sr-only">
            Sorularda arayın
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                if (next.trim()) {
                  trackEvent({ name: 'search', category: 'content', metadata: { context: 'faq' } });
                }
              }}
              placeholder="Sorunuzu arayın (ör. randevu, sigorta, ücret)"
              className="min-h-[52px] w-full rounded-input border border-line bg-white pl-12 pr-4 text-ink shadow-form placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              aria-describedby={`${searchId}-count`}
            />
          </div>
          <p id={`${searchId}-count`} className="mt-2 text-sm text-ink-muted" aria-live="polite">
            {filtered.length} sonuç
          </p>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <FAQAccordion
            items={filtered.map((f) => ({ question: f.question, answer: f.answer }))}
            trackContext="faq_explorer"
          />
        ) : (
          <EmptyState
            title="Sorunuza uygun bir sonuç bulamadık"
            description="Farklı bir anahtar kelime deneyin veya sorunuzu bize iletin; uzman ekibimiz yanıtlasın."
            action={
              <div className="w-full max-w-md text-left">
                <FaqQuestionForm />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
