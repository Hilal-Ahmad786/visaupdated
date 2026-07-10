import { Pencil } from 'lucide-react';
import Link from 'next/link';

import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { HealthBar, PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { codeToFlag, formatDateTr } from '@/lib/utils';
import type { PublishStatus } from '@/types/content';

const STATUS_TO_WORKFLOW: Record<PublishStatus, 'draft' | 'published' | 'archived'> = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
};

interface PageRow {
  slug: string;
  name: string;
  code: string;
  status: PublishStatus;
  health: number;
  updatedAt: string;
}

export default async function CountryPagesIndex() {
  requireAdmin('country_pages');

  const countries = await getContentRepository().getCountries();

  const rows: PageRow[] = countries.map((c, i) => {
    const day = ((i * 3) % 27) + 1;
    return {
      slug: c.slug,
      name: c.name,
      code: c.code,
      status: c.status,
      health: 60 + ((i * 7) % 36),
      updatedAt: `2026-06-${String(day).padStart(2, '0')}`,
    };
  });

  const editLink = (r: PageRow) => (
    <Link
      href={`/admin/ulke-sayfalari/${r.slug}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
    >
      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
      Düzenle
    </Link>
  );

  const columns: Column<PageRow>[] = [
    {
      key: 'name',
      header: 'Ülke Sayfası',
      render: (r) => (
        <Link href={`/admin/ulke-sayfalari/${r.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
          <span aria-hidden="true" className="text-lg">{codeToFlag(r.code)}</span>
          {r.name}
        </Link>
      ),
    },
    { key: 'status', header: 'Durum', render: (r) => <WorkflowBadge state={STATUS_TO_WORKFLOW[r.status]} /> },
    { key: 'health', header: 'İçerik Sağlığı', render: (r) => <HealthBar score={r.health} /> },
    {
      key: 'updated',
      header: 'Son Güncelleme',
      hideOnMobile: true,
      render: (r) => <span className="text-ink-soft">{formatDateTr(r.updatedAt)}</span>,
    },
    { key: 'actions', header: 'İşlemler', className: 'text-right', render: editLink },
  ];

  const mobileCard = (r: PageRow) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/admin/ulke-sayfalari/${r.slug}`} className="inline-flex items-center gap-2 font-semibold text-ink hover:text-gold">
          <span aria-hidden="true" className="text-lg">{codeToFlag(r.code)}</span>
          {r.name}
        </Link>
        <WorkflowBadge state={STATUS_TO_WORKFLOW[r.status]} />
      </div>
      <HealthBar score={r.health} />
      <p className="text-xs text-ink-soft">Son güncelleme: {formatDateTr(r.updatedAt)}</p>
      {editLink(r)}
    </div>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title="Ülke Sayfaları"
        description="Ülke açılış sayfalarının yapılandırılmış bölümlerini düzenleyin."
      />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.slug}
        mobileCard={mobileCard}
        emptyTitle="Ülke sayfası yok"
        emptyDescription="Henüz yapılandırılmış bir ülke sayfası bulunmuyor."
      />
    </div>
  );
}
