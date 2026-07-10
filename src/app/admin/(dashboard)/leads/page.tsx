import { LeadsExplorer } from '@/components/admin/leads/LeadsExplorer';
import { PageHeader } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { getSubmittedAdminLeads } from '@/lib/admin/lead-bridge';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canViewSensitiveData } from '@/lib/auth/permissions';
import { listActiveAdminUsers } from '@/lib/auth/users';

// Read the live in-memory submission store on every request.
export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const user = requireAdmin('leads');

  const countries = (await getContentRepository().getCountries()).map((c) => ({
    slug: c.slug,
    code: c.code,
    name: c.name,
  }));

  const users = await listActiveAdminUsers();

  // Only real, persisted form submissions (newest first). No demo data.
  const leads = await getSubmittedAdminLeads();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Başvurular"
        description="Tüm vize başvurularını arayın, filtreleyin ve yönetin."
      />

      <LeadsExplorer
        leads={leads}
        countries={countries}
        users={users}
        canRevealSensitive={canViewSensitiveData(user)}
        canExport={can(user, 'leads:export')}
      />
    </div>
  );
}
