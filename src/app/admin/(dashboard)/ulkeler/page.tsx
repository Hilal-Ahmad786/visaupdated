import { Globe2, Sparkles, ClipboardList, CheckCircle2 } from 'lucide-react';

import { CountriesAdmin, type CountryRow } from '@/components/admin/countries/CountriesAdmin';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';

/** Deterministic mock content-health score in the 60–95 range. */
function healthFor(index: number): number {
  return 60 + ((index * 7) % 36);
}

export default async function CountriesAdminPage() {
  const user = requireAdmin('countries');

  const countries = await getContentRepository().getCountries();

  const rows: CountryRow[] = countries.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    region: c.region,
    code: c.code,
    status: c.status,
    popular: c.popular,
    visaCount: c.visaTypes.length,
    health: healthFor(i),
    owner: 'VİS VİZE Editör',
  }));

  const total = rows.length;
  const published = rows.filter((r) => r.status === 'published').length;
  const popular = rows.filter((r) => r.popular).length;
  const inReview = 0; // demo — review queue not wired to mock content yet

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title="Ülke İçerik Yönetimi"
        description="Ülke kayıtlarını arayın, içerik sağlığını izleyin ve düzenleyin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Ülke" value={total} icon={Globe2} />
        <MetricCard label="Yayında" value={published} icon={CheckCircle2} />
        <MetricCard label="Popüler" value={popular} icon={Sparkles} />
        <MetricCard label="İncelemede" value={inReview} icon={ClipboardList} tone={inReview > 0 ? 'action' : 'default'} />
      </div>

      <CountriesAdmin
        countries={rows}
        canEdit={can(user, 'countries:edit')}
        canPublish={canPublish(user, 'country_pages')}
      />
    </div>
  );
}
