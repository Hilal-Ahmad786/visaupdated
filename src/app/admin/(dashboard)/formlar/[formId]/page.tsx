import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FormBuilder } from '@/components/admin/builder/FormBuilder';
import { PageHeader, WorkflowBadge } from '@/components/admin/ui/primitives';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';
import { formById } from '@/lib/data/mock-forms';

export default function FormBuilderPage({ params }: { params: { formId: string } }) {
  const user = requireAdmin('forms');

  const form = formById(params.formId);
  if (!form) notFound();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={form.name}
        description={`Sürüm ${form.version} · ${form.submissions} gönderim · ${form.steps.length} adım`}
        badge={<WorkflowBadge state={form.state} />}
      />

      <Link href="/admin/formlar" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Form listesine dön
      </Link>

      <FormBuilder form={form} canEdit={can(user, 'forms:edit')} canPublish={canPublish(user, 'forms')} />
    </div>
  );
}
