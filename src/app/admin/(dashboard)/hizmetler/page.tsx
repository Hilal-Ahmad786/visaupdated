import { Briefcase, CheckCircle2, Layers, Sparkles } from 'lucide-react';

import { ServicesAdmin, type ServiceRow } from '@/components/admin/content/ServicesAdmin';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';

/** Deterministic mock content-health score in the 60–95 range. */
function healthFor(index: number): number {
  return 60 + ((index * 11) % 36);
}

export default async function ServicesAdminPage() {
  const user = requireAdmin('services');

  const repo = getContentRepository();
  const [services, categories] = await Promise.all([repo.getServices(), repo.getServiceCategories()]);

  const categoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? slug;

  const rows: ServiceRow[] = services.map((s, i) => ({
    slug: s.slug,
    name: s.name,
    category: s.category,
    categoryTitle: categoryTitle(s.category),
    status: s.status,
    popular: s.popular,
    icon: s.icon,
    health: healthFor(i),
    pricingMode: 'Teklif gerekli',
  }));

  const total = rows.length;
  const published = rows.filter((r) => r.status === 'published').length;
  const popular = rows.filter((r) => r.popular).length;
  const categoryCount = categories.length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Hizmet İçerik Yönetimi"
        description="Hizmetleri arayın, içerik sağlığını izleyin ve düzenleyin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Hizmet" value={total} icon={Briefcase} />
        <MetricCard label="Yayında" value={published} icon={CheckCircle2} />
        <MetricCard label="Popüler" value={popular} icon={Sparkles} />
        <MetricCard label="Kategori Sayısı" value={categoryCount} icon={Layers} />
      </div>

      <ServicesAdmin
        services={rows}
        categories={categories}
        canEdit={can(user, 'services:edit')}
        canPublish={canPublish(user, 'services')}
      />
    </div>
  );
}
