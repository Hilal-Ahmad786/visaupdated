import {
  CalendarClock,
  FileText,
  MessageSquare,
  Paperclip,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LeadActions } from '@/components/admin/leads/LeadActions';
import { LeadNoteForm } from '@/components/admin/leads/LeadNoteForm';
import { Tabs } from '@/components/admin/ui/Tabs';
import { SensitiveValue } from '@/components/admin/ui/SensitiveValue';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { EmptyState, StatusAlert } from '@/components/ui/states';
import { getContentRepository } from '@/content/repository';
import { getSubmittedAdminLeads } from '@/lib/admin/lead-bridge';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canViewSensitiveData } from '@/lib/auth/permissions';
import { listActiveAdminUsers } from '@/lib/auth/users';
import { maskEmail, maskPhone } from '@/lib/data/mock-leads';
import { STATUS_LABELS } from '@/lib/data/mock-pipeline';
import type { AdminLead, LeadPriority } from '@/types/admin';
import { codeToFlag, formatDateTimeTr, formatDateTr } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const PRIORITY_META: Record<
  LeadPriority,
  { label: string; tone: 'neutral' | 'info' | 'warning' | 'critical' }
> = {
  low: { label: 'Düşük', tone: 'neutral' },
  normal: { label: 'Normal', tone: 'info' },
  high: { label: 'Yüksek', tone: 'warning' },
  urgent: { label: 'Acil', tone: 'critical' },
};

const CHANNEL_LABELS: Record<string, string> = {
  phone: 'Telefon',
  whatsapp: 'WhatsApp',
  email: 'E-posta',
  note: 'Not',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-5 shadow-card">{children}</div>
  );
}

export default async function LeadDetailPage({ params }: { params: { leadId: string } }) {
  const user = requireAdmin('leads');
  // Real, persisted submissions only.
  const lead = (await getSubmittedAdminLeads()).find((l) => l.id === params.leadId);
  if (!lead) notFound();

  const canReveal = canViewSensitiveData(user);
  const canEdit = can(user, 'leads:edit');
  const countries = await getContentRepository().getCountries();
  const country = countries.find((c) => c.slug === lead.country);
  const flag = codeToFlag(country?.code ?? '');
  const countryName = country?.name ?? lead.country;

  // Real admin users for assignment + author-name resolution.
  const activeUsers = await listActiveAdminUsers();
  const userMap = new Map(activeUsers.map((u) => [u.id, u.name]));
  const assignees = activeUsers.map((u) => ({ id: u.id, name: u.name }));

  const assigneeName = lead.assigneeId ? userMap.get(lead.assigneeId) ?? lead.assigneeId : undefined;
  const priority = PRIORITY_META[lead.priority];
  const status = STATUS_LABELS[lead.status] ?? { label: lead.status, tone: 'neutral' as const };
  // Real submissions don't carry duplicate links; the banner stays inert.
  const duplicate = ([] as AdminLead[]).find((l) => l.reference === lead.duplicateOf);

  const contactBlock = (
    <SectionCard>
      <h2 className="mb-4 font-heading text-base font-bold text-ink">İletişim Bilgileri</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon">
          <SensitiveValue
            masked={maskPhone(lead.phone)}
            value={lead.phone}
            canReveal={canReveal}
            label="Telefon"
          />
        </Field>
        <Field label="E-posta">
          <SensitiveValue
            masked={maskEmail(lead.email)}
            value={lead.email}
            canReveal={canReveal}
            label="E-posta"
          />
        </Field>
        <Field label="Şehir">{lead.city ?? '—'}</Field>
        <Field label="Ülke">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true">{flag}</span>
            {countryName}
          </span>
        </Field>
      </dl>
    </SectionCard>
  );

  // ---- Tab contents (server-rendered) ----
  const generalTab = (
    <div className="space-y-4">
      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Özet</h3>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Hizmet">{lead.service ?? '—'}</Field>
          <Field label="Vize Türü">{lead.visaType ?? '—'}</Field>
          <Field label="Durum">
            <StatusBadge label={status.label} tone={status.tone} />
          </Field>
          <Field label="Öncelik">
            <StatusBadge label={priority.label} tone={priority.tone} />
          </Field>
          <Field label="Atanan">{assigneeName ?? 'Atanmamış'}</Field>
          <Field label="Oluşturulma">{formatDateTr(lead.createdAt)}</Field>
        </dl>
      </SectionCard>
      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Kaynak ve UTM</h3>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Kaynak">{lead.source}</Field>
          <Field label="UTM Source">{lead.campaign?.utm_source ?? '—'}</Field>
          <Field label="UTM Medium">{lead.campaign?.utm_medium ?? '—'}</Field>
          <Field label="UTM Campaign">{lead.campaign?.utm_campaign ?? '—'}</Field>
        </dl>
      </SectionCard>
    </div>
  );

  const applicantTab = (
    <SectionCard>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Ad Soyad">{lead.name}</Field>
        <Field label="Telefon">
          <SensitiveValue
            masked={maskPhone(lead.phone)}
            value={lead.phone}
            canReveal={canReveal}
            label="Telefon"
          />
        </Field>
        <Field label="E-posta">
          <SensitiveValue
            masked={maskEmail(lead.email)}
            value={lead.email}
            canReveal={canReveal}
            label="E-posta"
          />
        </Field>
        <Field label="Şehir">{lead.city ?? '—'}</Field>
        <Field label="Ülke">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true">{flag}</span>
            {countryName}
          </span>
        </Field>
        <Field label="Hizmet">{lead.service ?? '—'}</Field>
        <Field label="Vize Türü">{lead.visaType ?? '—'}</Field>
      </dl>
    </SectionCard>
  );

  const followUpsTab =
    lead.followUps.length === 0 ? (
      <EmptyState
        title="Takip kaydı yok"
        description="Bu başvuru için henüz planlanmış bir takip bulunmuyor."
        icon={<CalendarClock className="h-6 w-6" />}
      />
    ) : (
      <ul className="space-y-3">
        {lead.followUps.map((f) => (
          <li key={f.id}>
            <SectionCard>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{f.note}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    Son tarih: {formatDateTr(f.dueAt)}
                    {f.assigneeId && userMap.get(f.assigneeId)
                      ? ` · ${userMap.get(f.assigneeId)}`
                      : ''}
                  </p>
                </div>
                <StatusBadge
                  label={f.done ? 'Tamamlandı' : 'Bekliyor'}
                  tone={f.done ? 'success' : 'warning'}
                />
              </div>
            </SectionCard>
          </li>
        ))}
      </ul>
    );

  const notesTab = (
    <div className="space-y-4">
      <LeadNoteForm leadId={lead.id} disabled={!canEdit} />
      {lead.notes.length === 0 ? (
        <EmptyState
          title="Not yok"
          description="Bu başvuru için henüz not eklenmemiş."
          icon={<MessageSquare className="h-6 w-6" />}
        />
      ) : (
        <ul className="space-y-3">
          {lead.notes.map((n) => (
            <li key={n.id}>
              <SectionCard>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {n.authorName ?? userMap.get(n.authorId) ?? n.authorId}
                  </span>
                  {n.internal && <StatusBadge label="Dahili" tone="neutral" />}
                  <span className="text-xs text-ink-muted">{formatDateTimeTr(n.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-soft">{n.body}</p>
              </SectionCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const filesTab =
    lead.files.length === 0 ? (
      <EmptyState
        title="Dosya yok"
        description="Bu başvuruya henüz dosya yüklenmemiş."
        icon={<Paperclip className="h-6 w-6" />}
      />
    ) : (
      <ul className="space-y-2">
        {lead.files.map((f) => (
          <li
            key={f.id}
            className="flex items-center justify-between gap-3 rounded-card border border-line-light bg-white p-3.5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-soft">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{f.name}</p>
                <p className="text-xs text-ink-muted">
                  {f.kind} · {f.sizeKb} KB · {formatDateTr(f.uploadedAt)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );

  const commsTab =
    lead.communications.length === 0 ? (
      <EmptyState
        title="İletişim kaydı yok"
        description="Bu başvuru için kayıtlı bir iletişim bulunmuyor."
        icon={<Phone className="h-6 w-6" />}
      />
    ) : (
      <ul className="space-y-3">
        {lead.communications.map((c) => (
          <li key={c.id}>
            <SectionCard>
              <div className="flex items-center gap-2">
                <StatusBadge label={CHANNEL_LABELS[c.channel] ?? c.channel} tone="info" />
                <StatusBadge label={c.direction === 'in' ? 'Gelen' : 'Giden'} tone="neutral" />
                <span className="text-xs text-ink-muted">{formatDateTr(c.at)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{c.summary}</p>
            </SectionCard>
          </li>
        ))}
      </ul>
    );

  const consentTab = (
    <SectionCard>
      <h3 className="mb-4 font-heading text-base font-bold text-ink">Onay Kayıtları</h3>
      <dl className="grid gap-4 sm:grid-cols-3">
        <Field label="KVKK Aydınlatma">
          <StatusBadge
            label={lead.consent.kvkk ? 'Onaylandı' : 'Onaylanmadı'}
            tone={lead.consent.kvkk ? 'success' : 'danger'}
          />
        </Field>
        <Field label="Pazarlama İzni">
          <StatusBadge
            label={lead.consent.marketing ? 'Onaylandı' : 'Reddedildi'}
            tone={lead.consent.marketing ? 'success' : 'neutral'}
          />
        </Field>
        <Field label="Onay Zamanı">{formatDateTr(lead.consent.consentedAt)}</Field>
      </dl>
    </SectionCard>
  );

  const timelineTab =
    lead.timeline.length === 0 ? (
      <EmptyState title="Aktivite yok" description="Bu başvuru için kayıtlı aktivite bulunmuyor." />
    ) : (
      <ol className="space-y-4 border-l border-line-light pl-5">
        {lead.timeline.map((t) => (
          <li key={t.id} className="relative">
            <span
              className="absolute -left-[1.46rem] top-1 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-white"
              aria-hidden="true"
            />
            <p className="text-sm text-ink">{t.text}</p>
            <p className="text-xs text-ink-muted">
              {t.actor} · {formatDateTr(t.at)}
            </p>
          </li>
        ))}
      </ol>
    );

  const relatedTab = duplicate ? (
    <SectionCard>
      <p className="mb-3 text-sm text-ink-soft">
        Bu başvuru muhtemelen aşağıdaki kaydın bir tekrarıdır:
      </p>
      <Link
        href={`/admin/leads/${duplicate.id}`}
        className="flex items-center justify-between gap-3 rounded-lg border border-line p-3.5 hover:bg-surface"
      >
        <div>
          <p className="font-semibold text-navy">#{duplicate.reference}</p>
          <p className="text-sm text-ink-soft">{duplicate.name}</p>
        </div>
        <StatusBadge
          label={
            (
              STATUS_LABELS[duplicate.status] ?? {
                label: duplicate.status,
                tone: 'neutral' as const,
              }
            ).label
          }
          tone={(STATUS_LABELS[duplicate.status] ?? { tone: 'neutral' as const }).tone}
        />
      </Link>
    </SectionCard>
  ) : (
    <EmptyState
      title="İlgili kayıt yok"
      description="Bu başvuruyla ilişkilendirilmiş başka bir kayıt bulunmuyor."
    />
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={`Başvuru #${lead.reference}`}
        description={lead.name}
        badge={<StatusBadge label={status.label} tone={status.tone} />}
      />

      <Link
        href="/admin/leads"
        className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover"
      >
        ← Başvuru listesine dön
      </Link>

      {duplicate && (
        <StatusAlert tone="warning" title="Olası Tekrar Kayıt">
          Bu başvuru,{' '}
          <Link href={`/admin/leads/${duplicate.id}`} className="font-semibold underline">
            #{duplicate.reference}
          </Link>{' '}
          ({duplicate.name}) kaydının bir tekrarı olabilir.
        </StatusAlert>
      )}

      {/* Header card */}
      <SectionCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <dl className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Referans">#{lead.reference}</Field>
            <Field label="Başvuran">{lead.name}</Field>
            <Field label="Ülke">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">{flag}</span>
                {countryName}
              </span>
            </Field>
            <Field label="Durum">
              <StatusBadge label={status.label} tone={status.tone} />
            </Field>
            <Field label="Öncelik">
              <StatusBadge label={priority.label} tone={priority.tone} />
            </Field>
            <Field label="Atanan">{assigneeName ?? 'Atanmamış'}</Field>
            <Field label="Oluşturulma">{formatDateTimeTr(lead.createdAt)}</Field>
          </dl>
          <div className="shrink-0">
            <LeadActions
              leadId={lead.id}
              pipelineId={lead.pipelineId}
              currentStageId={lead.stageId}
              currentAssigneeId={lead.assigneeId}
              assignees={assignees}
            />
          </div>
        </div>
      </SectionCard>

      {contactBlock}

      <Tabs
        ariaLabel="Başvuru detay sekmeleri"
        tabs={[
          { id: 'general', label: 'Genel', content: generalTab },
          { id: 'applicant', label: 'Başvuran', content: applicantTab },
          {
            id: 'followups',
            label: 'Takipler',
            count: lead.followUps.length,
            content: followUpsTab,
          },
          { id: 'notes', label: 'Notlar', count: lead.notes.length, content: notesTab },
          { id: 'files', label: 'Dosyalar', count: lead.files.length, content: filesTab },
          { id: 'comms', label: 'İletişim', count: lead.communications.length, content: commsTab },
          { id: 'consent', label: 'Onaylar', content: consentTab },
          { id: 'timeline', label: 'Aktivite', count: lead.timeline.length, content: timelineTab },
          { id: 'related', label: 'İlgili Kayıtlar', content: relatedTab },
        ]}
      />

      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Hassas veriler varsayılan olarak maskelidir. Görüntüleme talepleri denetim kaydına işlenir.
      </p>
    </div>
  );
}
