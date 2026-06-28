'use client';

import { HelpCircle, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { ArticleCard } from '@/components/blog/ArticleCard';
import { PhoneLink } from '@/components/conversion/PhoneLink';
import { CountryCard } from '@/components/countries/CountryCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { FilterPills } from '@/components/ui/FilterPills';
import { EmptyState } from '@/components/ui/states';
import { trackEvent } from '@/lib/analytics';
import { cn, normalizeTr } from '@/lib/utils';
import type { Article, Country, FaqItem, Service } from '@/types/content';

type ResultType = 'all' | 'countries' | 'services' | 'articles' | 'faqs';

const POPULAR_SUGGESTIONS = [
  'Schengen',
  'Almanya',
  'Randevu',
  'Evrak kontrolü',
  'Vize danışmanlığı',
  'Çalışma vizesi',
];

/** Build an accent-insensitive haystack once per item. */
function haystackFor(text: string): string {
  return normalizeTr(text);
}

function snippet(text: string, max = 180): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function SearchExperience({
  countries,
  services,
  faqs,
  articles,
  initialQuery,
}: {
  countries: Country[];
  services: Service[];
  faqs: FaqItem[];
  articles: Article[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<ResultType>('all');
  const searchId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const needle = normalizeTr(trimmed);
  const active = needle.length > 0;

  // Precompute searchable text per item (stable across keystrokes).
  const indexed = useMemo(
    () => ({
      countries: countries.map((c) => ({
        item: c,
        hay: haystackFor(`${c.name} ${c.region} ${c.heroTitle} ${c.heroDescription} ${c.visaTypes.map((v) => v.name).join(' ')}`),
      })),
      services: services.map((s) => ({
        item: s,
        hay: haystackFor(`${s.name} ${s.category} ${s.shortDescription} ${s.heroDescription} ${s.scope.join(' ')}`),
      })),
      articles: articles.map((a) => ({
        item: a,
        hay: haystackFor(`${a.title} ${a.category} ${a.excerpt} ${a.tags.join(' ')}`),
      })),
      faqs: faqs.map((f) => ({
        item: f,
        hay: haystackFor(`${f.question} ${f.answer} ${f.category}`),
      })),
    }),
    [countries, services, articles, faqs],
  );

  const results = useMemo(() => {
    if (!active) {
      return { countries: [], services: [], articles: [], faqs: [] };
    }
    const match = <T,>(rows: { item: T; hay: string }[]) =>
      rows.filter((r) => r.hay.includes(needle)).map((r) => r.item);
    return {
      countries: match(indexed.countries),
      services: match(indexed.services),
      articles: match(indexed.articles),
      faqs: match(indexed.faqs),
    };
  }, [active, needle, indexed]);

  const counts = {
    countries: results.countries.length,
    services: results.services.length,
    articles: results.articles.length,
    faqs: results.faqs.length,
  };
  const total = counts.countries + counts.services + counts.articles + counts.faqs;

  // Best match: the single FAQ whose question best matches the query.
  const bestFaq = useMemo(() => {
    if (!active || results.faqs.length === 0) return null;
    const exact = results.faqs.find((f) => normalizeTr(f.question).includes(needle));
    return exact ?? results.faqs[0] ?? null;
  }, [active, needle, results.faqs]);

  // Debounced URL sync + privacy-safe analytics (count only, never the text).
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (trimmed) params.set('q', trimmed);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

      if (active) {
        trackEvent({
          name: 'search',
          category: 'content',
          metadata: { context: 'global', result_count: total },
        });
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed]);

  const pillOptions = useMemo(
    () => [
      { value: 'all', label: `Tümü${active ? ` (${total})` : ''}` },
      { value: 'countries', label: `Ülkeler${active ? ` (${counts.countries})` : ''}` },
      { value: 'services', label: `Hizmetler${active ? ` (${counts.services})` : ''}` },
      { value: 'articles', label: `Rehberler${active ? ` (${counts.articles})` : ''}` },
      { value: 'faqs', label: `S.S.S.${active ? ` (${counts.faqs})` : ''}` },
    ],
    [active, total, counts.countries, counts.services, counts.articles, counts.faqs],
  );

  const show = (t: ResultType) => type === 'all' || type === t;

  return (
    <div>
      {/* Search input */}
      <div className="mx-auto max-w-2xl">
        <label htmlFor={searchId} className="field-label sr-only">
          Sitede arayın
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ülke, hizmet, rehber veya soru arayın…"
            autoComplete="off"
            className="min-h-[56px] w-full rounded-input border border-line bg-white pl-12 pr-4 text-body-lg text-ink shadow-form placeholder:text-ink-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
            aria-describedby={`${searchId}-count`}
          />
        </div>
        <p id={`${searchId}-count`} className="mt-2 text-sm text-ink-muted" role="status" aria-live="polite">
          {active ? `“${trimmed}” için ${total} sonuç bulundu` : 'Aramak için yukarıya yazın'}
        </p>
      </div>

      {/* Type filter pills */}
      {active && (
        <div className="mx-auto mt-5 max-w-2xl">
          <FilterPills
            options={pillOptions}
            value={type}
            onChange={(v) => setType(v as ResultType)}
            ariaLabel="Sonuç türünü filtreleyin"
          />
        </div>
      )}

      {/* Empty query prompt */}
      {!active && (
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-full bg-gold-surface text-gold">
            <Search className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-h4">Aramak için yazın</h2>
          <p className="mt-1.5 text-ink-soft">
            Ülke adı, hizmet, rehber konusu ya da sık sorulan bir soru deneyin.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {POPULAR_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  inputRef.current?.focus();
                }}
                className="pill"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {active && total === 0 && (
        <div className="mt-10">
          <EmptyState
            title="Aramanıza uygun sonuç bulamadık"
            description="Farklı bir anahtar kelime deneyebilir ya da doğrudan bizimle iletişime geçebilirsiniz."
            action={
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <PhoneLink location="search_no_results" className="btn-primary" />
                <Link href="/iletisim" className="btn-outline">
                  İletişim
                </Link>
                <Link href="/online-on-basvuru" className="btn-navy">
                  Ön Başvuru
                </Link>
              </div>
            }
          />
        </div>
      )}

      {active && total > 0 && (
        <div className="mx-auto mt-8 max-w-5xl space-y-12">
          {/* Best match quick answer (approved FAQ content only) */}
          {bestFaq && (type === 'all' || type === 'faqs') && (
            <div className="card border-gold/40 bg-gold-surface p-6">
              <p className="mb-2 inline-flex items-center gap-1.5 font-heading text-label uppercase tracking-[0.14em] text-gold">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> En iyi eşleşme
              </p>
              <h2 className="font-heading text-h4">{bestFaq.question}</h2>
              <p className="mt-2 text-ink-soft">{snippet(bestFaq.answer, 260)}</p>
              <Link
                href={`/sss/${bestFaq.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-navy hover:text-gold"
              >
                Yanıtın tamamını okuyun
              </Link>
            </div>
          )}

          {show('countries') && counts.countries > 0 && (
            <section aria-label="Ülke sonuçları">
              <h2 className="mb-4 font-heading text-h3">
                Ülkeler <span className="text-ink-muted">({counts.countries})</span>
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.countries.map((c) => (
                  <CountryCard key={c.slug} country={c} />
                ))}
              </div>
            </section>
          )}

          {show('services') && counts.services > 0 && (
            <section aria-label="Hizmet sonuçları">
              <h2 className="mb-4 font-heading text-h3">
                Hizmetler <span className="text-ink-muted">({counts.services})</span>
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.services.map((s) => (
                  <ServiceCard key={s.slug} service={s} />
                ))}
              </div>
            </section>
          )}

          {show('articles') && counts.articles > 0 && (
            <section aria-label="Rehber sonuçları">
              <h2 className="mb-4 font-heading text-h3">
                Rehberler <span className="text-ink-muted">({counts.articles})</span>
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.articles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          )}

          {show('faqs') && counts.faqs > 0 && (
            <section aria-label="S.S.S. sonuçları">
              <h2 className="mb-4 font-heading text-h3">
                S.S.S. <span className="text-ink-muted">({counts.faqs})</span>
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {results.faqs.map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/sss/${f.slug}`}
                      className={cn('card flex h-full flex-col p-5 transition-shadow hover:shadow-form')}
                    >
                      <span className="mb-2 inline-grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-muted">
                        <HelpCircle className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="font-heading text-h4">{f.question}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{snippet(f.answer)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
