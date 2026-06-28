import { ArrowRight, Fingerprint, Gavel, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AuditAnnotations } from '@/components/admin/audit/AuditAnnotations';
import { SensitiveValue } from '@/components/admin/ui/SensitiveValue';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { requireAdmin } from '@/lib/auth/guard';
import { canViewSensitiveData } from '@/lib/auth/permissions';
import { auditEventById, auditEvents } from '@/lib/data/mock-audit';
import { formatDateTr } from '@/lib/utils';
import type { AuditEvent } from '@/types/admin';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'critical';

const SEVERITY_META: Record<AuditEvent['severity'], { label: string; tone: Tone }> = {
  critical: { label: 'Kritik', tone: 'critical' },
  warning: { label: 'Uyarı', tone: 'warning' },
  notice: { label: 'Bildirim', tone: 'info' },
  info: { label: 'Bilgi', tone: 'neutral' },
};
const RESULT_META: Record<AuditEvent['result'], { label: string; tone: Tone }> = {
  success: { label: 'Başarılı', tone: 'success' },
  denied: { label: 'Reddedildi', tone: 'warning' },
  failure: { label: 'Hata', tone: 'danger' },
};
const REVIEW_META: Record<AuditEvent['reviewStatus'], { label: string; tone: Tone }> = {
  none: { label: 'İncelenmedi', tone: 'neutral' },
  reviewed: { label: 'İncelendi', tone: 'success' },
  investigating: { label: 'Soruşturuluyor', tone: 'warning' },
  legal_hold: { label: 'Yasal Saklama', tone: 'critical' },
};
const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Panel', leads: 'Başvurular', pipeline: 'İş Akışı', countries: 'Ülkeler',
  country_pages: 'Ülke Sayfaları', services: 'Hizmetler', blog: 'Blog', faq: 'SSS',
  forms: 'Formlar', homepage: 'Ana Sayfa', navigation: 'Navigasyon', tracking: 'Takip',
  settings: 'Ayarlar', users: 'Kullanıcılar', audit: 'Denetim',
};

function dateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const time = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(d);
  return `${formatDateTr(iso)} ${time}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
      <h2 className="mb-4 font-heading text-base font-bold text-ink">{title}</h2>
      {children}
    </div>
  );
}

export default function AuditEventDetailPage({ params }: { params: { eventId: string } }) {
  const user = requireAdmin('audit');
  const event = auditEventById(params.eventId);
  if (!event) notFound();

  const canReveal = canViewSensitiveData(user, 'audit');
  const related = auditEvents.filter((e) => e.correlationId === event.correlationId && e.id !== event.id);
  const severity = SEVERITY_META[event.severity];
  const result = RESULT_META[event.result];
  const review = REVIEW_META[event.reviewStatus];
  const hasValueChange = event.previousValue !== undefined || event.newValue !== undefined;

  const renderValue = (value: string | undefined) => {
    if (value === undefined) return <span className="text-ink-muted">—</span>;
    if (event.sensitive) {
      return <SensitiveValue masked="••• (hassas)" value={value} canReveal={canReveal} label="Değer" />;
    }
    return <span className="font-mono text-xs text-ink">{value}</span>;
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title={event.event}
        description={`Olay #${event.id}`}
        badge={<StatusBadge label={severity.label} tone={severity.tone} />}
      />

      <Link href="/admin/denetim-kayitlari" className="inline-flex text-sm font-semibold text-gold hover:text-gold-hover">
        ← Denetim kayıtlarına dön
      </Link>

      {event.reviewStatus === 'legal_hold' && (
        <StatusAlert tone="warning" title="Yasal Saklama (Legal Hold)">
          <span className="inline-flex items-center gap-1.5">
            <Gavel className="h-4 w-4" aria-hidden="true" />
            Bu kayıt yasal saklama altındadır ve hiçbir koşulda silinemez veya değiştirilemez.
          </span>
        </StatusAlert>
      )}

      <SectionCard title="Olay Özeti">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Olay">{event.event}</Field>
          <Field label="Zaman">{dateTime(event.at)}</Field>
          <Field label="Ortam">Canlı</Field>
          <Field label="Modül">{MODULE_LABELS[event.module] ?? event.module}</Field>
          <Field label="Sonuç">
            <StatusBadge label={result.label} tone={result.tone} />
          </Field>
          <Field label="İnceleme Durumu">
            <StatusBadge label={review.label} tone={review.tone} />
          </Field>
          <Field label="Korelasyon ID">
            <span className="font-mono text-xs">{event.correlationId}</span>
          </Field>
          <Field label="Hassas Veri">
            <StatusBadge label={event.sensitive ? 'Evet' : 'Hayır'} tone={event.sensitive ? 'critical' : 'neutral'} />
          </Field>
        </dl>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Aktör">
          <dl className="space-y-3">
            <Field label="Kullanıcı">{event.actorName}</Field>
            <Field label="Rol">{event.actorRole}</Field>
            <Field label="Aktör ID">
              <span className="font-mono text-xs">{event.actorId}</span>
            </Field>
          </dl>
        </SectionCard>

        <SectionCard title="Hedef & Bağlam">
          <dl className="space-y-3">
            <Field label="Hedef">{event.target}</Field>
            <Field label="Kaynak IP (maskeli)">
              <span className="font-mono text-xs">{event.source}</span>
            </Field>
            <Field label="İstek Bağlamı">Admin oturumu · web</Field>
          </dl>
        </SectionCard>
      </div>

      {hasValueChange && (
        <SectionCard title="Değer Değişikliği">
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-lg border border-line bg-surface/50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Önceki Değer</p>
              {renderValue(event.previousValue)}
            </div>
            <ArrowRight className="mx-auto hidden h-5 w-5 text-ink-muted sm:block" aria-hidden="true" />
            <div className="rounded-lg border border-line bg-surface/50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Yeni Değer</p>
              {renderValue(event.newValue)}
            </div>
          </div>
          {event.sensitive && (
            <p className="mt-3 text-xs text-ink-muted">
              Hassas değerler maskelidir. Görüntülemek için yeniden kimlik doğrulama gerekir ve görüntüleme talebi ayrı bir
              denetim kaydı oluşturur.
            </p>
          )}
        </SectionCard>
      )}

      <SectionCard title="Bütünlük">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/10 text-success">
            <Fingerprint className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Bütünlük doğrulandı</p>
            <p className="text-xs text-ink-soft">Kayıt, oluşturulduğundan beri değiştirilmemiştir (hash zinciri doğrulandı).</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="İlgili Olaylar">
        {related.length === 0 ? (
          <p className="text-sm text-ink-soft">Aynı korelasyon kimliğine sahip başka bir olay bulunmuyor.</p>
        ) : (
          <ul className="space-y-2">
            {related.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/admin/denetim-kayitlari/${e.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line p-3 hover:bg-surface"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-navy">{e.event}</p>
                    <p className="text-xs text-ink-muted">{dateTime(e.at)} · {e.actorName}</p>
                  </div>
                  <StatusBadge label={SEVERITY_META[e.severity].label} tone={SEVERITY_META[e.severity].tone} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="İnceleme & Soruşturma">
        <p className="mb-4 text-sm text-ink-soft">
          Aşağıdaki işlemler olayı <span className="font-semibold">değiştirmez</span>. Her biri orijinal kayda bağlı, ayrı ve
          değiştirilemez bir kayıt oluşturur.
        </p>
        <AuditAnnotations eventId={event.id} />
      </SectionCard>

      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Denetim kayıtları salt okunurdur. Bu sayfada düzenleme veya silme işlemi yapılamaz.
      </p>
    </div>
  );
}
