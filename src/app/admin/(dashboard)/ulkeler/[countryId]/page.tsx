import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CountryEditor } from '@/components/admin/countries/CountryEditor';
import { PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { canPublish } from '@/lib/auth/permissions';
import { codeToFlag } from '@/lib/utils';
import type { PublishStatus } from '@/types/content';

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

export default async function CountryEditPage({ params }: { params: { countryId: string } }) {
  const user = requireAdmin('countries');

  const country = await getContentRepository().getCountryBySlug(params.countryId);
  if (!country) notFound();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={`${codeToFlag(country.code)}  ${country.name}`}
        description={`Bölge: ${country.region} · Slug: ${country.slug}`}
        badge={<WorkflowBadge state={STATUS_TO_WORKFLOW[country.status]} />}
      />

      <Link href="/admin/ulkeler" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Ülke listesine dön
      </Link>

      <CountryEditor country={country} canPublish={canPublish(user, 'country_pages')} />
    </div>
  );
}
