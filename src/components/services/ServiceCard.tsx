import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ContentIcon } from '@/components/ui/Icon';
import type { Service } from '@/types/content';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card flex flex-col p-6 transition-shadow hover:shadow-form">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-surface text-gold">
        <ContentIcon name={service.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-heading text-h4">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-soft">{service.shortDescription}</p>
      <Link
        href={`/hizmetler/${service.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-navy hover:text-gold"
      >
        Detayları İncele
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
