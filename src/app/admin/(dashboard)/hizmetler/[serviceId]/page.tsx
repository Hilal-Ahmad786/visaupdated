import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ServiceEditor } from '@/components/admin/content/ServiceEditor';
import { PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { canPublish } from '@/lib/auth/permissions';
import type { PublishStatus } from '@/types/content';

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

export default async function ServiceEditPage({ params }: { params: { serviceId: string } }) {
  const user = requireAdmin('services');

  const service = await getContentRepository().getServiceBySlug(params.serviceId);
  if (!service) notFound();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title={service.name}
        description={`Kategori: ${service.category} · Slug: ${service.slug}`}
        badge={<WorkflowBadge state={STATUS_TO_WORKFLOW[service.status]} />}
      />

      <Link href="/admin/hizmetler" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Hizmet listesine dön
      </Link>

      <ServiceEditor service={service} canPublish={canPublish(user, 'services')} />
    </div>
  );
}
