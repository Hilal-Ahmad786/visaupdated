'use client';

import { Eye, MailPlus, Pause, Play, RotateCw, ShieldPlus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
import { DataTable, type Column } from '@/components/admin/ui/DataTable';
import { SensitiveValue } from '@/components/admin/ui/SensitiveValue';
import { StatusBadge } from '@/components/admin/ui/primitives';
import { RISK_META } from '@/lib/admin/role-meta';
import { maskEmail } from '@/lib/data/mock-leads';
import { formatDateTr } from '@/lib/utils';
import type { AdminUser, Invitation, Role, RoleRisk, Team, UserStatus } from '@/types/admin';

export { RISK_META };

const STATUS_META: Record<UserStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'neutral' }> = {
  active: { label: 'Aktif', tone: 'success' },
  invited: { label: 'Davetli', tone: 'info' },
  suspended: { label: 'Askıda', tone: 'warning' },
  deactivated: { label: 'Devre Dışı', tone: 'neutral' },
};

const INVITATION_STATUS_META: Record<Invitation['status'], { label: string; tone: 'info' | 'warning' | 'success' }> = {
  pending: { label: 'Bekliyor', tone: 'info' },
  expired: { label: 'Süresi Doldu', tone: 'warning' },
  accepted: { label: 'Kabul Edildi', tone: 'success' },
};

/** Avatar bubble with initials. */
function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10 text-xs font-bold text-navy" aria-hidden="true">
      {initials}
    </span>
  );
}

/** Client users table. Reveal of e-posta gated by `canRevealEmail`. */
export function UsersTable({
  users,
  roles,
  teams,
  canEdit,
  canRevealEmail,
}: {
  users: AdminUser[];
  roles: Role[];
  teams: Team[];
  canEdit: boolean;
  canRevealEmail: boolean;
}) {
  const { notify } = useToast();
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? id;
  const teamName = (id?: string) => (id ? teams.find((t) => t.id === id)?.name ?? id : '—');

  const toggleStatus = (u: AdminUser) => {
    if (u.status === 'suspended' || u.status === 'deactivated') {
      notify(`${u.name} yeniden aktifleştirildi. (Demo)`, 'success');
    } else {
      notify(`${u.name} askıya alındı. İşlem denetim kaydına işlendi. (Demo)`, 'warning');
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'user',
      header: 'Kullanıcı',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar initials={u.avatarInitials} />
          <span className="font-semibold text-ink">{u.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'E-posta',
      render: (u) => (
        <SensitiveValue masked={maskEmail(u.email)} value={u.email} canReveal={canRevealEmail} label="E-posta" />
      ),
    },
    {
      key: 'roles',
      header: 'Roller',
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roleIds.map((id) => (
            <StatusBadge key={id} label={roleName(id)} tone="neutral" />
          ))}
        </div>
      ),
    },
    { key: 'team', header: 'Ekip', hideOnMobile: true, render: (u) => <span className="text-ink-soft">{teamName(u.teamId)}</span> },
    {
      key: 'status',
      header: 'Durum',
      render: (u) => <StatusBadge label={STATUS_META[u.status].label} tone={STATUS_META[u.status].tone} />,
    },
    {
      key: 'mfa',
      header: 'MFA',
      hideOnMobile: true,
      render: (u) => <StatusBadge label={u.mfaEnabled ? 'Açık' : 'Kapalı'} tone={u.mfaEnabled ? 'success' : 'warning'} />,
    },
    {
      key: 'lastActive',
      header: 'Son Aktivite',
      hideOnMobile: true,
      render: (u) => <span className="text-ink-soft">{u.lastActiveAt ? formatDateTr(u.lastActiveAt) : '—'}</span>,
    },
    {
      key: 'actions',
      header: 'İşlemler',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/kullanicilar/${u.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Görüntüle
          </Link>
          {canEdit && u.status !== 'deactivated' && (
            <button
              type="button"
              onClick={() => toggleStatus(u)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
            >
              {u.status === 'suspended' ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
              {u.status === 'suspended' ? 'Aktifleştir' : 'Askıya Al'}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      getRowKey={(u) => u.id}
      emptyTitle="Kullanıcı bulunamadı"
      emptyDescription="Henüz kayıtlı yönetici kullanıcı yok."
    />
  );
}

/** "Kullanıcı Davet Et" dialog → notify (demo, no mutation). */
export function InviteUserButton({ roles, disabled }: { roles: Role[]; disabled?: boolean }) {
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');

  const submit = () => {
    if (!email.trim()) {
      notify('Lütfen bir e-posta adresi girin.', 'warning');
      return;
    }
    const role = roles.find((r) => r.id === roleId);
    notify(`${email.trim()} adresine "${role?.name ?? 'rol'}" rolüyle davet gönderildi. (Demo)`, 'success');
    setOpen(false);
    setEmail('');
  };

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title="Kullanıcı davet etme yetkiniz yok"
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white opacity-40"
      >
        <MailPlus className="h-4 w-4" aria-hidden="true" />
        Kullanıcı Davet Et
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        <MailPlus className="h-4 w-4" aria-hidden="true" />
        Kullanıcı Davet Et
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Kullanıcı Davet Et"
        description="Davet bağlantısı e-posta ile gönderilir ve belirlenen süre sonunda geçersiz olur."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button type="button" onClick={submit} className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep">
              Davet Gönder
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">E-posta</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ad.soyad@visvize.com"
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Rol</span>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Dialog>
    </>
  );
}

/** Per-invitation resend / cancel actions → notify (demo). */
export function InvitationActions({ email, status, disabled }: { email: string; status: Invitation['status']; disabled?: boolean }) {
  const { notify } = useToast();
  const meta = INVITATION_STATUS_META[status];

  if (status === 'accepted') {
    return <StatusBadge label={meta.label} tone={meta.tone} />;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => notify(`${email} adresine davet tekrar gönderildi. (Demo)`, 'success')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
        Tekrar Gönder
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => notify(`${email} daveti iptal edildi. (Demo)`, 'warning')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        İptal
      </button>
    </div>
  );
}

/** "Yeni Rol" dialog → notify (demo). Shared by users page roles tab and roles page. */
export function NewRoleButton({ disabled }: { disabled?: boolean }) {
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [risk, setRisk] = useState<RoleRisk>('low');

  const submit = () => {
    if (!name.trim()) {
      notify('Lütfen bir rol adı girin.', 'warning');
      return;
    }
    notify(`"${name.trim()}" rolü oluşturuldu. İzinleri rol detayından düzenleyin. (Demo)`, 'success');
    setOpen(false);
    setName('');
    setDescription('');
  };

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title="Rol oluşturma yetkiniz yok"
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink opacity-40"
      >
        <ShieldPlus className="h-4 w-4" aria-hidden="true" />
        Yeni Rol
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
      >
        <ShieldPlus className="h-4 w-4" aria-hidden="true" />
        Yeni Rol
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Rol Oluştur"
        description="Yeni rol minimum yetkiyle başlar. Ayrıcalık yükseltmeleri ayrı onaya tabidir."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button type="button" onClick={submit} className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep">
              Oluştur
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Rol Adı</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn. Bölge Editörü"
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Açıklama</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Risk Seviyesi</span>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as RoleRisk)}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              {(Object.keys(RISK_META) as RoleRisk[]).map((k) => (
                <option key={k} value={k}>
                  {RISK_META[k].label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Dialog>
    </>
  );
}

/** Role edit demo button (read-only matrix; edit is gated). */
export function RoleEditButton({ roleName, system, canEdit }: { roleName: string; system: boolean; canEdit: boolean }) {
  const { notify } = useToast();
  const onClick = () => {
    if (system) {
      notify('Sistem rolünün çekirdek izinleri değiştirilemez. (Demo)', 'warning');
      return;
    }
    notify(`"${roleName}" rolü düzenleme moduna alındı. (Demo)`, 'info');
  };

  if (!canEdit) {
    return (
      <button
        type="button"
        disabled
        title="Rol düzenleme yetkiniz yok"
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white opacity-40"
      >
        Düzenle
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
    >
      Düzenle
    </button>
  );
}
