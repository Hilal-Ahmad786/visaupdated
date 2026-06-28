import { Check, KeyRound, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SessionRevokeButton, UserSecurityActions } from '@/components/admin/users/UserSecurityActions';
import { RISK_META } from '@/lib/admin/role-meta';
import { SensitiveValue } from '@/components/admin/ui/SensitiveValue';
import { Tabs } from '@/components/admin/ui/Tabs';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { EmptyState, StatusAlert } from '@/components/ui/states';
import { requireAdmin } from '@/lib/auth/guard';
import { can, canViewSensitiveData, permissionsForModule, roleById } from '@/lib/auth/permissions';
import { maskEmail } from '@/lib/data/mock-leads';
import { sessions, teams, userById } from '@/lib/data/mock-users';
import { formatDateTr } from '@/lib/utils';
import type { AdminModule, PermissionAction, UserStatus } from '@/types/admin';

const STATUS_META: Record<UserStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'neutral' }> = {
  active: { label: 'Aktif', tone: 'success' },
  invited: { label: 'Davetli', tone: 'info' },
  suspended: { label: 'Askıda', tone: 'warning' },
  deactivated: { label: 'Devre Dışı', tone: 'neutral' },
};

const MODULES: { id: AdminModule; label: string }[] = [
  { id: 'dashboard', label: 'Panel' },
  { id: 'leads', label: 'Başvurular' },
  { id: 'pipeline', label: 'İş Akışı' },
  { id: 'countries', label: 'Ülkeler' },
  { id: 'country_pages', label: 'Ülke Sayfaları' },
  { id: 'services', label: 'Hizmetler' },
  { id: 'blog', label: 'Blog' },
  { id: 'faq', label: 'SSS' },
  { id: 'forms', label: 'Formlar' },
  { id: 'homepage', label: 'Ana Sayfa' },
  { id: 'navigation', label: 'Navigasyon' },
  { id: 'tracking', label: 'Takip' },
  { id: 'settings', label: 'Ayarlar' },
  { id: 'users', label: 'Kullanıcılar' },
  { id: 'audit', label: 'Denetim' },
];

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: 'Görüntüle',
  create: 'Oluştur',
  edit: 'Düzenle',
  review: 'İncele',
  approve: 'Onayla',
  publish: 'Yayınla',
  unpublish: 'Yayından Kaldır',
  archive: 'Arşivle',
  delete: 'Sil',
  export: 'Dışa Aktar',
  manage_settings: 'Ayar Yönet',
  view_sensitive: 'Hassas Veri',
  assign: 'Ata',
};

const SCOPE_LABELS: Record<string, string> = {
  own: 'Yalnızca kendi',
  team: 'Ekip',
  all: 'Tümü',
  countries: 'Ülkeler',
  services: 'Hizmetler',
  pipelines: 'İş akışları',
  modules: 'Modüller',
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
  return <div className="rounded-card border border-line-light bg-white p-5 shadow-card">{children}</div>;
}

export default function UserDetailPage({ params }: { params: { userId: string } }) {
  const viewer = requireAdmin('users');
  const target = userById(params.userId);
  if (!target) notFound();

  const isSelf = viewer.id === target.id;
  const canEdit = can(viewer, 'users:edit');
  const canRevealEmail = canViewSensitiveData(viewer, 'users');
  const status = STATUS_META[target.status];
  const team = target.teamId ? teams.find((t) => t.id === target.teamId) : undefined;
  const userSessions = sessions.filter((s) => s.userId === target.id);
  const targetRoles = target.roleIds.map((id) => roleById(id)).filter((r): r is NonNullable<typeof r> => Boolean(r));

  const inheritedRoleNames = targetRoles
    .flatMap((r) => r.inheritsRoleIds ?? [])
    .map((id) => roleById(id)?.name ?? id);

  // ---- Genel ----
  const generalTab = (
    <SectionCard>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Ad Soyad">{target.name}</Field>
        <Field label="E-posta">
          <SensitiveValue masked={maskEmail(target.email)} value={target.email} canReveal={canRevealEmail} label="E-posta" />
        </Field>
        <Field label="Durum">
          <StatusBadge label={status.label} tone={status.tone} />
        </Field>
        <Field label="Ekip">{team?.name ?? '—'}</Field>
        <Field label="MFA">
          <StatusBadge label={target.mfaEnabled ? 'Açık' : 'Kapalı'} tone={target.mfaEnabled ? 'success' : 'warning'} />
        </Field>
        <Field label="Oluşturulma">{formatDateTr(target.createdAt)}</Field>
        <Field label="Son Aktivite">{target.lastActiveAt ? formatDateTr(target.lastActiveAt) : '—'}</Field>
      </dl>
    </SectionCard>
  );

  // ---- Roller & İzinler ----
  const permModules = MODULES.map((m) => ({ ...m, actions: permissionsForModule(target, m.id) })).filter((m) => m.actions.length > 0);
  const permsTab = (
    <div className="space-y-4">
      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Roller</h3>
        <ul className="space-y-3">
          {targetRoles.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 rounded-lg border border-line p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/roller/${r.id}`} className="font-semibold text-navy hover:underline">
                    {r.name}
                  </Link>
                  <StatusBadge label={RISK_META[r.risk].label} tone={RISK_META[r.risk].tone} />
                  {r.system && <StatusBadge label="Sistem" tone="info" />}
                </div>
                <p className="text-xs text-ink-soft">{r.description}</p>
              </div>
              <span className="shrink-0 text-xs text-ink-muted">Kapsam: {SCOPE_LABELS[r.scope.kind] ?? r.scope.kind}</span>
            </li>
          ))}
        </ul>
        {inheritedRoleNames.length > 0 && (
          <p className="mt-3 text-xs text-ink-muted">Devralınan roller: {inheritedRoleNames.join(', ')}</p>
        )}
      </SectionCard>

      {(target.directGrants?.length || target.directDenies?.length) && (
        <SectionCard>
          <h3 className="mb-3 font-heading text-base font-bold text-ink">Doğrudan İzinler</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Eklenen</p>
              <div className="flex flex-wrap gap-1.5">
                {(target.directGrants ?? []).length === 0 ? (
                  <span className="text-sm text-ink-soft">—</span>
                ) : (
                  (target.directGrants ?? []).map((p) => <StatusBadge key={p} label={p} tone="success" />)
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Reddedilen</p>
              <div className="flex flex-wrap gap-1.5">
                {(target.directDenies ?? []).length === 0 ? (
                  <span className="text-sm text-ink-soft">—</span>
                ) : (
                  (target.directDenies ?? []).map((p) => <StatusBadge key={p} label={p} tone="danger" />)
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Etkin İzinler (modül bazında)</h3>
        {permModules.length === 0 ? (
          <EmptyState title="İzin yok" description="Bu kullanıcıya tanımlı etkin bir izin bulunmuyor." />
        ) : (
          <ul className="space-y-3">
            {permModules.map((m) => (
              <li key={m.id} className="flex flex-col gap-1.5 border-b border-line-light pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-ink">{m.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {m.actions.map((a) => (
                    <StatusBadge key={a} label={ACTION_LABELS[a]} tone="neutral" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );

  // ---- Oturumlar ----
  const sessionsTab =
    userSessions.length === 0 ? (
      <EmptyState title="Aktif oturum yok" description="Bu kullanıcı için kayıtlı bir oturum bulunmuyor." />
    ) : (
      <ul className="space-y-3">
        {userSessions.map((s) => (
          <li
            key={s.id}
            className="flex flex-col gap-3 rounded-card border border-line-light bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{s.device}</span>
                {s.current && <StatusBadge label="Geçerli oturum" tone="success" />}
              </div>
              <p className="text-xs text-ink-muted">
                IP: {s.ip} · Başlangıç: {formatDateTr(s.startedAt)} · Son görülme: {formatDateTr(s.lastSeenAt)}
              </p>
            </div>
            <SessionRevokeButton device={s.device} current={s.current} canEdit={canEdit} />
          </li>
        ))}
      </ul>
    );

  // ---- Güvenlik ----
  const securityTab = (
    <div className="space-y-4">
      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Çok Faktörlü Doğrulama</h3>
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl ${target.mfaEnabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{target.mfaEnabled ? 'MFA etkin' : 'MFA devre dışı'}</p>
            <p className="text-xs text-ink-soft">
              MFA gizli anahtarları ve kurtarma kodları hiçbir zaman görüntülenmez. Sıfırlama kullanıcıya e-posta ile gönderilir.
            </p>
          </div>
        </div>
      </SectionCard>

      <StatusAlert tone="info" title="Yeniden kimlik doğrulama gerekir">
        Güvenlik işlemleri (askıya alma, devre dışı bırakma, oturum sonlandırma) gerçek ortamda yeniden kimlik doğrulama (MFA)
        ister ve değiştirilemez denetim kaydına yazılır.
      </StatusAlert>

      <SectionCard>
        <h3 className="mb-4 font-heading text-base font-bold text-ink">Hesap İşlemleri</h3>
        <UserSecurityActions userName={target.name} status={target.status} isSelf={isSelf} canEdit={canEdit} />
      </SectionCard>
    </div>
  );

  // ---- Aktivite (demo) ----
  const activityTab = (
    <ol className="space-y-4 border-l border-line-light pl-5">
      {[
        { id: 'a1', text: 'Başarılı giriş yaptı', at: target.lastActiveAt ?? target.createdAt },
        { id: 'a2', text: 'Profil bilgileri güncellendi', at: target.createdAt },
        { id: 'a3', text: 'Hesap oluşturuldu', at: target.createdAt },
      ].map((a) => (
        <li key={a.id} className="relative">
          <span className="absolute -left-[1.46rem] top-1 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-white" aria-hidden="true" />
          <p className="text-sm text-ink">{a.text}</p>
          <p className="text-xs text-ink-muted">{formatDateTr(a.at)}</p>
        </li>
      ))}
      <li className="text-xs text-ink-muted">Tam aktivite geçmişi için denetim kayıtlarına bakın.</li>
    </ol>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={target.name}
        description={team ? `${team.name} ekibi` : 'Yönetici hesabı'}
        badge={<StatusBadge label={status.label} tone={status.tone} />}
      />

      <Link href="/admin/kullanicilar" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Kullanıcı listesine dön
      </Link>

      <SectionCard>
        <div className="flex flex-wrap items-center gap-2">
          {targetRoles.map((r) => (
            <StatusBadge key={r.id} label={r.name} tone={RISK_META[r.risk].tone} />
          ))}
          {target.mfaEnabled ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> MFA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
              <X className="h-3.5 w-3.5" aria-hidden="true" /> MFA yok
            </span>
          )}
        </div>
      </SectionCard>

      <Tabs
        ariaLabel="Kullanıcı detay sekmeleri"
        tabs={[
          { id: 'general', label: 'Genel', content: generalTab },
          { id: 'perms', label: 'Roller & İzinler', content: permsTab },
          { id: 'sessions', label: 'Oturumlar', count: userSessions.length, content: sessionsTab },
          { id: 'security', label: 'Güvenlik', content: securityTab },
          { id: 'activity', label: 'Aktivite', content: activityTab },
        ]}
      />

      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Parolalar, MFA anahtarları ve oturum belirteçleri hiçbir zaman görüntülenmez.
      </p>
    </div>
  );
}
