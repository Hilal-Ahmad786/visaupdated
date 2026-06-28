'use client';

import { LogOut, Pause, Play, UserX } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
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
  userName,
  status,
  isSelf,
  canEdit,
}: {
  userName: string;
  status: UserStatus;
  isSelf: boolean;
  canEdit: boolean;
}) {
  const { notify } = useToast();
  const [pending, setPending] = useState<PendingAction>(null);

  const run = () => {
    if (!pending) return;
    notify(`${userName} için işlem uygulandı: ${ACTION_COPY[pending].confirm}. Denetim kaydına işlendi. (Demo)`, ACTION_COPY[pending].tone === 'success' ? 'success' : 'warning');
    setPending(null);
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
            <button type="button" onClick={run} className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep">
              {pending ? ACTION_COPY[pending].confirm : 'Onayla'}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Gerçek ortamda bu işlem için yeniden kimlik doğrulama (MFA) istenir ve işlem değiştirilemez denetim kaydına yazılır.
        </p>
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
