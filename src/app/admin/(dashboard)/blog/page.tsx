import { CheckCircle2, FileText, PenLine, Star } from 'lucide-react';

import { BlogAdmin, type ArticleRow } from '@/components/admin/content/BlogAdmin';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';

/** Deterministic mock SEO-health score in the 60–95 range. */
function healthFor(index: number): number {
  return 60 + ((index * 13) % 36);
}

export default async function BlogAdminPage() {
  const user = requireAdmin('blog');

  const repo = getContentRepository();
  const [articles, categories] = await Promise.all([repo.getArticles(), repo.getBlogCategories()]);

  const categoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? slug;

  const rows: ArticleRow[] = articles.map((a, i) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    categoryTitle: categoryTitle(a.category),
    author: a.author.name,
    status: a.status,
    featured: a.featured,
    health: healthFor(i),
    updatedAt: a.updatedAt,
  }));

  const total = rows.length;
  const published = rows.filter((r) => r.status === 'published').length;
  const drafts = rows.filter((r) => r.status === 'draft').length;
  const featured = rows.filter((r) => r.featured).length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Blog İçerik Yönetimi"
        description="Yazıları arayın, SEO sağlığını izleyin ve düzenleyin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Yazı" value={total} icon={FileText} />
        <MetricCard label="Yayında" value={published} icon={CheckCircle2} />
        <MetricCard label="Taslak" value={drafts} icon={PenLine} tone={drafts > 0 ? 'action' : 'default'} />
        <MetricCard label="Öne Çıkan" value={featured} icon={Star} />
      </div>

      <BlogAdmin
        articles={rows}
        categories={categories}
        canEdit={can(user, 'blog:edit')}
        canPublish={canPublish(user, 'blog')}
      />
    </div>
  );
}
