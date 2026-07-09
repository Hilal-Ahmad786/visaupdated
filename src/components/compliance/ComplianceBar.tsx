import { ShieldAlert } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Persistent compliance bar shown directly under the hero on the homepage and
 * every Google Ads landing page (Google Ads "Government Documents and Official
 * Services" policy). Always visible, non-dismissable — leads with the verified
 * TÜRSAB A-class credential, then the not-affiliated + separate-fee disclosure.
 *
 * Single source of truth so the bar reads identically everywhere.
 */
export function ComplianceBar({ className }: { className?: string }) {
  return (
    <div className={cn('border-b border-gold/30 bg-gold-surface', className)}>
      <div className="container-content flex items-start gap-3 py-3 text-sm text-ink-soft">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-navy">
            Firmamız, TÜRSAB tarafından belgelendirilmiş A sınıfı bir seyahat acentasıdır.
          </strong>{' '}
          VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ; vize başvuru süreçlerinde danışmanlık ve
          destek vermek üzere yetkilendirilmiş A sınıfı bir acentadır. Firmamızın resmi başvuru
          merkezleri (VFS Global, iDATA, TLScontact vb.) ve konsolosluk/büyükelçilikler ile doğrudan
          bir bağlantısı ya da resmi temsilciliği yoktur; bağımsız ve özel bir vize danışmanlık
          hizmeti sunarız. Verdiğimiz danışmanlık hizmeti karşılığında resmi konsolosluk/başvuru
          merkezi ücretlerinden <strong className="text-navy">ayrı</strong> bir hizmet bedeli alırız.
        </p>
      </div>
    </div>
  );
}
