import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';

import { formatDateTr } from '@/lib/utils';
import type { Article } from '@/types/content';

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={`card flex flex-col overflow-hidden transition-shadow hover:shadow-form ${featured ? 'md:flex-row' : ''}`}>
      <div
        className={`aspect-[16/9] bg-gradient-to-br from-navy to-navy-deep ${featured ? 'md:aspect-auto md:w-1/2' : ''}`}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">{article.category}</span>
        <h3 className={`mt-2 font-heading ${featured ? 'text-h3' : 'text-h4'}`}>
          <Link href={`/blog/${article.slug}`} className="hover:text-navy">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{article.excerpt}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDateTr(article.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingMinutes} dk
          </span>
        </div>
      </div>
    </article>
  );
}
