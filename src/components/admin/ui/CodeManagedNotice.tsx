import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Honest banner for admin sections that are NOT yet wired to a real backend.
 * The editors below render for reference, but their "Kaydet/Yayınla" actions do
 * not persist — this content is managed in code (or env). Shown instead of
 * pretending the demo buttons save anything.
 */
export function CodeManagedNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-warning/30 bg-warning/5 p-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
        <Lock className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="text-sm">
        <p className="font-heading font-semibold text-ink">Bu bölüm kod ile yönetilmektedir</p>
        <p className="mt-0.5 text-ink-soft">
          {children ??
            'Aşağıdaki alanlar bilgi amaçlıdır; buradaki değişiklikler kaydedilmez. İçerik güncellemeleri geliştirici tarafından yapılır.'}
        </p>
      </div>
    </div>
  );
}
