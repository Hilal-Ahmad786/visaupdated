'use client';

import { useEffect, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics';

/**
 * Fixed top reading-progress bar. Tracks scroll depth through the document and
 * fires `article_progress` once at each of the 25/50/75/100 thresholds.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100)) : 0;
      setProgress(pct);

      for (const t of thresholds) {
        if (pct >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          trackEvent({ name: 'article_progress', category: 'content', metadata: { percent: t } });
        }
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      className="no-print fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
      role="progressbar"
      aria-label="Okuma ilerlemesi"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-gold transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/**
 * Sticky table of contents. Anchors to section ids; the global reduced-motion
 * rule already disables smooth scroll for users who prefer it.
 */
export function TableOfContents({ items }: { items: { id: string; heading: string }[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="İçindekiler" className="lg:sticky lg:top-24">
      <p className="font-heading text-label uppercase tracking-[0.14em] text-ink-muted">İçindekiler</p>
      <ol className="mt-3 space-y-1 border-l border-line">
        {items.map((item, i) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                className={[
                  '-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors',
                  active
                    ? 'border-gold font-semibold text-navy'
                    : 'border-transparent text-ink-soft hover:border-line hover:text-navy',
                ].join(' ')}
              >
                <span className="text-ink-muted">{i + 1}.</span> {item.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
