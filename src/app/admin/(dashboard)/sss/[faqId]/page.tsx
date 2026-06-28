import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FaqEditor } from '@/components/admin/content/FaqEditor';
import { PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { canPublish } from '@/lib/auth/permissions';
import type { PublishStatus } from '@/types/content';

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

export default async function FaqEditPage({ params }: { params: { faqId: string } }) {
  const user = requireAdmin('faq');

  const repo = getContentRepository();
  const [faq, categories] = await Promise.all([repo.getFaqBySlug(params.faqId), repo.getFaqCategories()]);
  if (!faq) notFound();

  const categoryTitle = categories.find((c) => c.slug === faq.category)?.title ?? faq.category;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={faq.question}
        description={`Kategori: ${categoryTitle}`}
        badge={<WorkflowBadge state={STATUS_TO_WORKFLOW[faq.status]} />}
      />

      <Link href="/admin/sss" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← S.S.S. listesine dön
      </Link>

      <FaqEditor faq={faq} categories={categories} canPublish={canPublish(user, 'faq')} />
    </div>
  );
}
