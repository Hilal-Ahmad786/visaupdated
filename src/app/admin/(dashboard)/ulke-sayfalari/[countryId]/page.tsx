import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CountryPageEditor } from '@/components/admin/countries/CountryPageEditor';
import { PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
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

export default async function CountryPageEditorRoute({ params }: { params: { countryId: string } }) {
  const user = requireAdmin('country_pages');

  const country = await getContentRepository().getCountryBySlug(params.countryId);
  if (!country) notFound();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title={`${codeToFlag(country.code)}  ${country.name} — Sayfa Düzenleyici`}
        description="Bölüm bazlı açılış sayfası içeriğini düzenleyin ve önizleyin."
        badge={<WorkflowBadge state={STATUS_TO_WORKFLOW[country.status]} />}
      />

      <Link href="/admin/ulke-sayfalari" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Ülke sayfaları listesine dön
      </Link>

      <CountryPageEditor country={country} canPublish={canPublish(user, 'country_pages')} />
    </div>
  );
}
