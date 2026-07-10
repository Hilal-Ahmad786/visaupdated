import { CheckCircle2, Globe2, HelpCircle, Layers } from 'lucide-react';

import { FaqAdmin, type FaqRow } from '@/components/admin/content/FaqAdmin';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';

export default async function FaqAdminPage() {
  const user = requireAdmin('faq');

  const repo = getContentRepository();
  const [faqs, categories] = await Promise.all([repo.getFaqs(), repo.getFaqCategories()]);

  const categoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? slug;

  const rows: FaqRow[] = faqs.map((f) => ({
    slug: f.slug,
    question: f.question,
    answer: f.answer,
    category: f.category,
    categoryTitle: categoryTitle(f.category),
    status: f.status,
    countrySpecific: (f.relatedCountrySlugs?.length ?? 0) > 0,
  }));

  const total = rows.length;
  const published = rows.filter((r) => r.status === 'published').length;
  const countrySpecific = rows.filter((r) => r.countrySpecific).length;
  const categoryCount = categories.length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title="S.S.S. İçerik Yönetimi"
        description="Sık sorulan soruları arayın, tekrarları tespit edin ve düzenleyin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Soru" value={total} icon={HelpCircle} />
        <MetricCard label="Yayında" value={published} icon={CheckCircle2} />
        <MetricCard label="Ülkeye Özel" value={countrySpecific} icon={Globe2} />
        <MetricCard label="Kategori Sayısı" value={categoryCount} icon={Layers} />
      </div>

      <FaqAdmin
        faqs={rows}
        categories={categories}
        canEdit={can(user, 'faq:edit')}
        canPublish={canPublish(user, 'faq')}
      />
    </div>
  );
}
