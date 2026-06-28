'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { FilterPills } from '@/components/ui/FilterPills';
import { EmptyState } from '@/components/ui/states';
import { trackEvent } from '@/lib/analytics';
import { normalizeTr } from '@/lib/utils';
import type { Article, BlogCategory } from '@/types/content';

/**
 * Interactive blog search + category filtering. Accent-insensitive search over
 * title/excerpt/tags. Privacy-safe: the raw query is never sent to analytics,
 * only a `search` event with a neutral context.
 */
export function BlogFilters({
  articles,
  categories,
}: {
  articles: Article[];
  categories: BlogCategory[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchTracked = useRef(false);

  const categoryOptions = useMemo(
    () => [{ value: 'all', label: 'Tümü' }, ...categories.map((c) => ({ value: c.slug, label: c.title }))],
    [categories],
  );

  const normalizedQuery = normalizeTr(query);

  const results = useMemo(() => {
    return articles.filter((article) => {
      if (category !== 'all' && article.category !== category) return false;
      if (!normalizedQuery) return true;
      const haystack = normalizeTr(
        [article.title, article.excerpt, ...article.tags].join(' '),
      );
      return haystack.includes(normalizedQuery);
    });
  }, [articles, category, normalizedQuery]);

  // Fire a single, privacy-safe `search` event once the user actually searches.
  useEffect(() => {
    if (!normalizedQuery) {
      searchTracked.current = false;
      return;
    }
    if (searchTracked.current) return;
    const id = window.setTimeout(() => {
      searchTracked.current = true;
      trackEvent({ name: 'search', category: 'content', metadata: { context: 'blog' } });
    }, 600);
    return () => window.clearTimeout(id);
  }, [normalizedQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <label htmlFor="blog-search" className="sr-only">
          Yazılarda ara
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara (örn. Schengen, randevu, belgeler)"
            className="min-h-[48px] w-full rounded-input border border-line bg-white pl-12 pr-4 text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <FilterPills
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          ariaLabel="Kategoriye göre filtrele"
        />
      </div>

      <p className="text-sm text-ink-muted" aria-live="polite">
        {results.length} yazı listeleniyor
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Eşleşen yazı bulunamadı"
          description="Farklı bir anahtar kelime deneyin veya kategori filtresini temizleyin."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
