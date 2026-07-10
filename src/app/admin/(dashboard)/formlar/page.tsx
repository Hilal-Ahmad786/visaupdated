import { FileText, CheckCircle2, FileEdit, Inbox } from 'lucide-react';

import { FormsAdmin, type FormRow } from '@/components/admin/builder/FormsAdmin';
import { MetricCard, PageHeader } from '@/components/admin/ui/primitives';
import { CodeManagedNotice } from '@/components/admin/ui/CodeManagedNotice';
import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import { formDefinitions } from '@/lib/data/mock-forms';

export default function FormsPage() {
  const user = requireAdmin('forms');

  const rows: FormRow[] = formDefinitions.map((f) => ({
    id: f.id,
    name: f.name,
    state: f.state,
    stepCount: f.steps.length,
    fieldCount: f.fields.length,
    submissions: f.submissions,
    updatedAt: f.updatedAt,
  }));

  const total = rows.length;
  const published = formDefinitions.filter((f) => f.state === 'published').length;
  const draft = formDefinitions.filter((f) => f.state === 'draft').length;
  const totalSubmissions = formDefinitions.reduce((sum, f) => sum + f.submissions, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <CodeManagedNotice />

      <PageHeader
        title="Form Yönetimi"
        description="Başvuru ve iletişim formlarını yönetin, alanları ve yönlendirmeyi düzenleyin."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Toplam Form" value={total} icon={FileText} />
        <MetricCard label="Yayında" value={published} icon={CheckCircle2} />
        <MetricCard label="Taslak" value={draft} icon={FileEdit} />
        <MetricCard label="Toplam Gönderim" value={totalSubmissions} icon={Inbox} />
      </div>

      <FormsAdmin rows={rows} canCreate={can(user, 'forms:create')} />
    </div>
  );
}
