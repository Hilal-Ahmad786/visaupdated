'use client';

import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CountryCard } from '@/components/countries/CountryCard';
import { FilterPills } from '@/components/ui/FilterPills';
import { EmptyState } from '@/components/ui/states';
import { trackEvent } from '@/lib/analytics';
import { normalizeTr } from '@/lib/utils';
import type { Country, Region } from '@/types/content';

const ALL = 'all';

// Stable display order for region filter pills.
const REGION_ORDER: Region[] = [
  'Schengen',
  'Avrupa',
  'Birleşik Krallık',
  'Amerika',
  'Asya Pasifik',
  'Orta Doğu',
];

export function CountriesExplorer({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string>(ALL);

  // Region pills: only the regions actually present, in a stable order.
  const regionOptions = useMemo(() => {
    const present = new Set(countries.map((c) => c.region));
    const ordered = REGION_ORDER.filter((r) => present.has(r));
    return [
      { value: ALL, label: 'Tümü' },
      ...ordered.map((r) => ({ value: r, label: r })),
    ];
  }, [countries]);

  // Alphabetical (Turkish-aware) base ordering.
  const sorted = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name, 'tr')),
    [countries],
  );

  const normalizedQuery = normalizeTr(query);
  const hasFilters = normalizedQuery.length > 0 || region !== ALL;

  const filtered = useMemo(() => {
    return sorted.filter((c) => {
      if (region !== ALL && c.region !== region) return false;
      if (normalizedQuery.length > 0 && !normalizeTr(c.name).includes(normalizedQuery)) {
        return false;
      }
      return true;
    });
  }, [sorted, region, normalizedQuery]);

  const popular = useMemo(() => sorted.filter((c) => c.popular), [sorted]);

  const handleSearch = (value: string) => {
    setQuery(value);
    // PII-safe: never forward the raw query string.
    trackEvent({ name: 'search', category: 'content', metadata: { context: 'countries' } });
  };

  const reset = () => {
    setQuery('');
    setRegion(ALL);
  };

  return (
    <div>
      {/* Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <label htmlFor="country-search" className="sr-only">
            Ülke ara
          </label>
          <input
            id="country-search"
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ülke adı ile arayın (ör. Almanya)"
            autoComplete="off"
            className="min-h-[48px] w-full rounded-input border border-line bg-white py-3 pl-12 pr-12 text-ink shadow-sm outline-none transition-colors placeholder:text-ink-muted focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-surface hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <FilterPills
          options={regionOptions}
          value={region}
          onChange={setRegion}
          ariaLabel="Bölgeye göre filtrele"
        />
      </div>

      {/* Popular destinations: only when browsing (no active search/filter) */}
      {!hasFilters && popular.length > 0 && (
        <section className="mt-10" aria-label="Popüler destinasyonlar">
          <h2 className="font-heading text-h3">Popüler Destinasyonlar</h2>
          <p className="mt-1.5 text-ink-soft">En çok başvuru yapılan ülkeler.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>
        </section>
      )}

      {/* Full / filtered directory */}
      <section className="mt-10" aria-label="Tüm ülkeler">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-h3">
            {hasFilters ? 'Arama Sonuçları' : 'Tüm Ülkeler'}
          </h2>
          <p className="shrink-0 text-sm text-ink-soft" aria-live="polite">
            {filtered.length} ülke
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Aradığınız kriterlere uygun ülke bulunamadı"
              description="Arama teriminizi veya bölge filtresini değiştirmeyi deneyin."
              action={
                <button type="button" onClick={reset} className="btn-outline">
                  Filtreleri Sıfırla
                </button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
