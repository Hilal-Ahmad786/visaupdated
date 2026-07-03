import { CalendarClock, FileText, Inbox, UserX } from 'lucide-react';

import { LeadsExplorer } from '@/components/admin/leads/LeadsExplorer';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
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

  const newCount = leads.filter((l) => l.status === 'new').length;
  const unassignedCount = leads.filter((l) => !l.assigneeId).length;
  const overdueFollowUp = leads.filter(
    (l) => l.followUpAt && new Date(l.followUpAt).getTime() < new Date(l.lastActivityAt).getTime(),
  ).length;
  const appointmentRequests = leads.filter((l) => l.status === 'appointment').length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Başvurular"
        description="Tüm vize başvurularını arayın, filtreleyin ve yönetin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Yeni Başvurular" value={newCount} icon={FileText} />
        <MetricCard label="Atanmamış" value={unassignedCount} icon={UserX} tone="action" />
        <MetricCard
          label="Takip Geç Kalan"
          value={overdueFollowUp}
          icon={CalendarClock}
          tone={overdueFollowUp > 0 ? 'action' : 'default'}
        />
        <MetricCard label="Randevu Talepleri" value={appointmentRequests} icon={Inbox} />
      </div>

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
