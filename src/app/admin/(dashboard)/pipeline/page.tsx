import { PipelineBoard } from '@/components/admin/leads/PipelineBoard';
import { PageHeader } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { getSubmittedAdminLeads } from '@/lib/admin/lead-bridge';
import { requireAdmin } from '@/lib/auth/guard';
import { listActiveAdminUsers } from '@/lib/auth/users';
import { getPipeline, pipelines } from '@/lib/data/mock-pipeline';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  requireAdmin('pipeline');

  const pipeline = getPipeline();
  const [countriesRaw, leads, users] = await Promise.all([
    getContentRepository().getCountries(),
    getSubmittedAdminLeads(),
    listActiveAdminUsers(),
  ]);
  const countries = countriesRaw.map((c) => ({ slug: c.slug, code: c.code, name: c.name }));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Süreç Panosu"
        description="Başvuruları aşamalar arasında sürükleyip bırakın. Yalnızca izin verilen geçişler yapılabilir."
        actions={
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="font-semibold text-ink-soft">Süreç:</span>
            <select
              defaultValue={pipeline.id}
              aria-label="Süreç seç"
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              {pipelines.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <PipelineBoard pipeline={pipeline} leads={leads} users={users} countries={countries} />
    </div>
  );
}
