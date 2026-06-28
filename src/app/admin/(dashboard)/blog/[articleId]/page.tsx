import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleEditor } from '@/components/admin/content/ArticleEditor';
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

export default async function ArticleEditPage({ params }: { params: { articleId: string } }) {
  const user = requireAdmin('blog');

  const article = await getContentRepository().getArticleBySlug(params.articleId);
  if (!article) notFound();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={article.title}
        description={`Kategori: ${article.category} · Yazar: ${article.author.name}`}
        badge={<WorkflowBadge state={STATUS_TO_WORKFLOW[article.status]} />}
      />

      <Link href="/admin/blog" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Blog listesine dön
      </Link>

      <ArticleEditor article={article} canPublish={canPublish(user, 'blog')} />
    </div>
  );
}
