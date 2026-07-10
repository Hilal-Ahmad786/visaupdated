'use client';

import { KeyRound, LogOut, Pause, Play, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
import { resetPasswordAction, setUserStatusAction } from '@/lib/admin/user-actions';
import type { UserStatus } from '@/types/admin';

type PendingAction = 'suspend' | 'activate' | 'deactivate' | null;

const ACTION_COPY: Record<Exclude<PendingAction, null>, { title: string; description: string; confirm: string; tone: 'warning' | 'success' }> = {
  suspend: {
    title: 'Kullanıcıyı Askıya Al',
    description: 'Kullanıcının tüm oturumları sonlandırılır ve girişi engellenir. İşlem geri alınabilir.',
    confirm: 'Askıya Al',
    tone: 'warning',
  },
  activate: {
    title: 'Kullanıcıyı Aktifleştir',
    description: 'Kullanıcı yeniden giriş yapabilir ve mevcut rolleriyle erişim kazanır.',
    confirm: 'Aktifleştir',
    tone: 'success',
  },
  deactivate: {
    title: 'Kullanıcıyı Devre Dışı Bırak',
    description: 'Hesap kalıcı olarak kapatılır, roller geri çekilir ve oturumlar sonlandırılır.',
    confirm: 'Devre Dışı Bırak',
    tone: 'warning',
  },
};

/**
 * Account-level security actions. Self-approval is prevented: an admin cannot
 * suspend/deactivate their own account (separation of duties).
 */
export function UserSecurityActions({
  userId,
  userName,
  status,
  isSelf,
  canEdit,
}: {
  userId: string;
  userName: string;
  status: UserStatus;
  isSelf: boolean;
  canEdit: boolean;
}) {
  const { notify } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState<PendingAction>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!pending) return;
    const nextStatus: UserStatus =
      pending === 'suspend' ? 'suspended' : pending === 'activate' ? 'active' : 'deactivated';
    setBusy(true);
    const res = await setUserStatusAction(userId, nextStatus);
    setBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'İşlem başarısız oldu.', 'warning');
      setPending(null);
      return;
    }
    notify(
      `${userName}: ${ACTION_COPY[pending].confirm} uygulandı.`,
      ACTION_COPY[pending].tone === 'success' ? 'success' : 'warning',
    );
    setPending(null);
    router.refresh();
  };

  const runReset = async () => {
    setBusy(true);
    const res = await resetPasswordAction(userId, newPassword);
    setBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'Parola sıfırlanamadı.', 'warning');
      return;
    }
    notify(`${userName} için yeni parola belirlendi.`, 'success');
    setResetOpen(false);
    setNewPassword('');
  };

  if (!canEdit) {
    return (
      <p className="text-sm text-ink-soft">Bu kullanıcı üzerinde güvenlik işlemi yapma yetkiniz yok.</p>
    );
  }

  if (isSelf) {
    return (
      <p className="text-sm text-ink-soft">
        Kendi hesabınız üzerinde askıya alma / devre dışı bırakma işlemi yapamazsınız. Görevler ayrılığı gereği bu işlem
        başka bir yönetici tarafından onaylanmalıdır.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {status === 'suspended' || status === 'deactivated' ? (
          <button
            type="button"
            onClick={() => setPending('activate')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Aktifleştir
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPending('suspend')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
          >
            <Pause className="h-4 w-4" aria-hidden="true" />
            Askıya Al
          </button>
        )}
        {status !== 'deactivated' && (
          <button
            type="button"
            onClick={() => setPending('deactivate')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <UserX className="h-4 w-4" aria-hidden="true" />
            Devre Dışı Bırak
          </button>
        )}
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Parola Sıfırla
        </button>
      </div>

      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title={pending ? ACTION_COPY[pending].title : ''}
        description={pending ? ACTION_COPY[pending].description : ''}
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setPending(null)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
            >
              {pending ? ACTION_COPY[pending].confirm : 'Onayla'}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Bu işlem kullanıcının erişimini hemen etkiler.
        </p>
      </Dialog>

      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Parola Sıfırla"
        description="Kullanıcı için yeni bir geçici parola belirleyin ve güvenli bir kanaldan iletin."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setResetOpen(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={runReset}
              disabled={busy}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-50"
            >
              {busy ? 'Kaydediliyor…' : 'Parolayı Belirle'}
            </button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Yeni Parola (en az 8 karakter)</span>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </label>
      </Dialog>
    </>
  );
}

/** Per-session revoke. Never displays session tokens. */
export function SessionRevokeButton({ device, current, canEdit }: { device: string; current: boolean; canEdit: boolean }) {
  const { notify } = useToast();
  const [open, setOpen] = useState(false);

  if (!canEdit) {
    return <span className="text-xs text-ink-muted">İşlem yetkisi yok</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink hover:bg-surface"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Oturumu Sonlandır
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Oturumu Sonlandır"
        description={current ? 'Bu, şu anda kullandığınız oturumdur. Sonlandırırsanız çıkış yapılır.' : undefined}
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => {
                notify(`Oturum sonlandırıldı: ${device}. (Demo)`, 'warning');
                setOpen(false);
              }}
              className="rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Sonlandır
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Oturum belirteçleri (token) hiçbir zaman görüntülenmez. Sonlandırma yalnızca cihaz ve oturum kimliğiyle yapılır.
        </p>
      </Dialog>
    </>
  );
}
