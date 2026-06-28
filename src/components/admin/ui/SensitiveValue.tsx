'use client';

import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { Dialog } from '@/components/admin/ui/Dialog';
import { useToast } from '@/components/admin/feedback/Toast';

/**
 * Masked sensitive value with a reveal flow. Revealing requires an explicit
 * re-authentication confirmation (placeholder for real MFA/re-auth) and emits
 * an audit note via toast. When `canReveal` is false, the value can never be
 * unmasked from the UI.
 */
export function SensitiveValue({
  masked,
  value,
  canReveal,
  label,
}: {
  masked: string;
  value: string;
  canReveal: boolean;
  label: string;
}) {
  const { notify } = useToast();
  const [revealed, setRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!canReveal) {
    return (
      <span className="inline-flex items-center gap-1.5 text-ink" title="Bu veriyi görüntüleme yetkiniz yok">
        {masked}
        <ShieldAlert className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
      </span>
    );
  }

  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <span className="text-ink">{revealed ? value : masked}</span>
        <button
          type="button"
          onClick={() => (revealed ? setRevealed(false) : setConfirming(true))}
          aria-label={revealed ? `${label} gizle` : `${label} göster`}
          className="text-ink-muted hover:text-navy"
        >
          {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </span>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Hassas Veriyi Görüntüle"
        description="Bu işlem denetim kaydına işlenir. Devam etmek için kimliğinizi doğrulayın."
        size="sm"
        footer={
          <>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink hover:bg-surface">
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => {
                setRevealed(true);
                setConfirming(false);
                notify(`${label} görüntülendi ve denetim kaydına işlendi.`, 'warning');
              }}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Doğrula ve Göster
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          Gerçek ortamda burada yeniden kimlik doğrulama (MFA) istenir. Görüntüleme talebi, kullanıcı ve zaman bilgisiyle
          birlikte denetim kayıtlarına kaydedilir.
        </p>
      </Dialog>
    </>
  );
}
