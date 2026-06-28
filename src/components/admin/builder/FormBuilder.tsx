'use client';

import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  AtSign,
  Calendar,
  CheckSquare,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  EyeOff,
  FileUp,
  Flag,
  Hash,
  Lock,
  type LucideIcon,
  Phone,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Stamp,
  Trash2,
  Type,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Tabs } from '@/components/admin/ui/Tabs';
import { StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { FieldType, FormDefinition, FormField, PrivacyClass } from '@/types/admin';

// ---------- static metadata ----------

const FIELD_META: Record<FieldType, { label: string; icon: LucideIcon; privacy: PrivacyClass }> = {
  text: { label: 'Kısa Metin', icon: Type, privacy: 'personal' },
  email: { label: 'E-posta', icon: AtSign, privacy: 'personal' },
  phone: { label: 'Telefon', icon: Phone, privacy: 'personal' },
  textarea: { label: 'Uzun Metin', icon: AlignLeft, privacy: 'personal' },
  number: { label: 'Sayı', icon: Hash, privacy: 'public' },
  country: { label: 'Ülke', icon: Flag, privacy: 'public' },
  visa_type: { label: 'Vize Türü', icon: Stamp, privacy: 'public' },
  applicant_status: { label: 'Başvuran Durumu', icon: UserCheck, privacy: 'public' },
  date: { label: 'Tarih', icon: Calendar, privacy: 'public' },
  select: { label: 'Açılır Liste', icon: ChevronRight, privacy: 'public' },
  file: { label: 'Dosya', icon: FileUp, privacy: 'sensitive' },
  consent: { label: 'Onay Kutusu', icon: CheckSquare, privacy: 'sensitive' },
  hidden: { label: 'Gizli Alan', icon: EyeOff, privacy: 'public' },
};

const PALETTE: { group: string; types: FieldType[] }[] = [
  { group: 'Temel', types: ['text', 'email', 'phone', 'textarea', 'number'] },
  { group: 'Başvuru', types: ['country', 'visa_type', 'applicant_status', 'date'] },
  { group: 'İçerik', types: ['select', 'file'] },
  { group: 'Onay', types: ['consent'] },
  { group: 'Gelişmiş', types: ['hidden'] },
];

const PRIVACY_META: Record<PrivacyClass, { label: string; tone: 'success' | 'info' | 'critical'; desc: string }> = {
  public: { label: 'Genel', tone: 'success', desc: 'Hassas olmayan, serbestçe işlenebilen veri.' },
  personal: { label: 'Kişisel', tone: 'info', desc: 'Kişiyi tanımlayan veri — KVKK kapsamında.' },
  sensitive: { label: 'Hassas', tone: 'critical', desc: 'Özel nitelikli/onay verisi — en yüksek koruma.' },
};

const TEAM_LABELS: Record<string, string> = {
  't-schengen': 'Schengen Ekibi',
  't-ops': 'Operasyon Ekibi',
  't-amerika': 'Amerika Ekibi',
  't-uk': 'Birleşik Krallık Ekibi',
};

const SIM_COUNTRIES: { code: string; name: string; team: string }[] = [
  { code: 'DE', name: 'Almanya', team: 't-schengen' },
  { code: 'FR', name: 'Fransa', team: 't-schengen' },
  { code: 'IT', name: 'İtalya', team: 't-schengen' },
  { code: 'US', name: 'Amerika', team: 't-amerika' },
  { code: 'GB', name: 'Birleşik Krallık', team: 't-uk' },
  { code: 'CA', name: 'Kanada', team: 't-amerika' },
];

// ---------- helpers ----------

function move<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const a = copy[from];
  const b = copy[to];
  if (a === undefined || b === undefined) return arr;
  copy[from] = b;
  copy[to] = a;
  return copy;
}

let keyCounter = 0;

// ---------- small UI atoms ----------

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-navy' : 'bg-line',
      )}
    >
      <span className={cn('inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-card border border-line-light bg-white p-4 shadow-card', className)}>{children}</div>;
}

function PrivacyBadge({ privacy }: { privacy: PrivacyClass }) {
  const m = PRIVACY_META[privacy];
  return <StatusBadge label={m.label} tone={m.tone} />;
}

// ---------- main ----------

export function FormBuilder({ form, canEdit, canPublish }: { form: FormDefinition; canEdit: boolean; canPublish: boolean }) {
  const { notify } = useToast();
  const [def, setDef] = useState<FormDefinition>(form);
  const [dirty, setDirty] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(form.fields[0]?.id ?? null);
  const [activeStepId, setActiveStepId] = useState<string | null>(form.steps[0]?.id ?? null);
  const [simCountry, setSimCountry] = useState<string>(SIM_COUNTRIES[0]?.code ?? '');

  const update = (next: FormDefinition) => {
    setDef(next);
    setDirty(true);
  };

  const fieldById = (id: string): FormField | undefined => def.fields.find((f) => f.id === id);
  const selectedField = selectedFieldId ? fieldById(selectedFieldId) : undefined;

  const guard = (fn: () => void) => {
    if (!canEdit) {
      notify('Bu formu düzenleme yetkiniz yok.', 'warning');
      return;
    }
    fn();
  };

  // ----- field mutations -----
  const patchField = (id: string, patch: Partial<FormField>) =>
    update({ ...def, fields: def.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

  const addField = (type: FieldType) =>
    guard(() => {
      const stepId = activeStepId ?? def.steps[0]?.id;
      if (!stepId) return;
      const meta = FIELD_META[type];
      const id = `f-new-${++keyCounter}`;
      const key = `${type}_${keyCounter}`;
      const field: FormField = {
        id,
        key,
        type,
        label: meta.label,
        required: false,
        privacy: meta.privacy,
        ...(type === 'select' ? { options: [{ value: 'opt1', label: 'Seçenek 1' }] } : {}),
      };
      update({
        ...def,
        fields: [...def.fields, field],
        steps: def.steps.map((s) => (s.id === stepId ? { ...s, fieldIds: [...s.fieldIds, id] } : s)),
      });
      setSelectedFieldId(id);
      notify(`"${meta.label}" alanı eklendi.`, 'success');
    });

  const removeField = (id: string) =>
    guard(() => {
      update({
        ...def,
        fields: def.fields.filter((f) => f.id !== id),
        steps: def.steps.map((s) => ({ ...s, fieldIds: s.fieldIds.filter((fid) => fid !== id) })),
        logic: def.logic.filter((l) => {
          const f = def.fields.find((x) => x.id === id);
          return f ? l.whenFieldKey !== f.key && l.targetFieldKey !== f.key : true;
        }),
      });
      if (selectedFieldId === id) setSelectedFieldId(null);
      notify('Alan kaldırıldı.', 'info');
    });

  const moveStep = (index: number, dir: -1 | 1) => guard(() => update({ ...def, steps: move(def.steps, index, dir) }));

  const moveFieldInStep = (stepId: string, index: number, dir: -1 | 1) =>
    guard(() =>
      update({
        ...def,
        steps: def.steps.map((s) => (s.id === stepId ? { ...s, fieldIds: move(s.fieldIds, index, dir) } : s)),
      }),
    );

  // ----- checks -----
  const checks = useMemo(() => {
    const list: { label: string; ok: boolean; detail: string }[] = [];
    const hasConsent = def.fields.some((f) => f.type === 'consent' && f.required);
    list.push({ label: 'KVKK / onay alanı', ok: hasConsent, detail: hasConsent ? 'Zorunlu onay alanı mevcut.' : 'Zorunlu bir onay (consent) alanı ekleyin.' });

    const hasContact = def.fields.some((f) => f.type === 'phone' || f.type === 'email');
    list.push({ label: 'İletişim alanı', ok: hasContact, detail: hasContact ? 'Telefon veya e-posta mevcut.' : 'En az bir telefon/e-posta alanı ekleyin.' });

    const allLabeled = def.fields.every((f) => f.label.trim().length > 0);
    list.push({ label: 'Tüm alanların etiketi', ok: allLabeled, detail: allLabeled ? 'Her alan erişilebilir bir etikete sahip.' : 'Etiketsiz alanlar erişilebilirliği bozar.' });

    const stepsFilled = def.steps.every((s) => s.fieldIds.length > 0);
    list.push({ label: 'Boş adım yok', ok: stepsFilled, detail: stepsFilled ? 'Her adımda en az bir alan var.' : 'Boş adımları doldurun veya kaldırın.' });

    const hasRequired = def.fields.some((f) => f.required);
    list.push({ label: 'Zorunlu alan', ok: hasRequired, detail: hasRequired ? 'En az bir zorunlu alan tanımlı.' : 'Hiç zorunlu alan yok.' });

    const sensitiveTracked = !def.fields.some((f) => f.privacy === 'sensitive' && f.type !== 'consent' && f.type !== 'file');
    list.push({
      label: 'Hassas veri sınıflaması',
      ok: sensitiveTracked,
      detail: sensitiveTracked ? 'Hassas alanlar doğru sınıflandırılmış.' : 'Hassas işaretli alanları gözden geçirin.',
    });
    return list;
  }, [def]);

  const checksOk = checks.filter((c) => c.ok).length;

  // ----- payload preview (KEYS ONLY, no PII values) -----
  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          form: def.id,
          version: def.version,
          fields: def.fields.map((f) => ({ key: f.key, type: f.type, required: f.required, privacy: f.privacy })),
        },
        null,
        2,
      ),
    [def],
  );

  const simTeam = useMemo(() => {
    if (!def.routing.byCountry) return def.routing.team ?? 't-ops';
    return SIM_COUNTRIES.find((c) => c.code === simCountry)?.team ?? def.routing.team ?? 't-ops';
  }, [def.routing, simCountry]);

  const save = () =>
    guard(() => {
      setDirty(false);
      notify('Form taslağı kaydedildi. (Demo)', 'success');
    });

  const togglePublish = () => {
    if (!canPublish) {
      notify('Yayınlama/etkinleştirme yetkiniz yok.', 'warning');
      return;
    }
    if (def.state === 'published') {
      update({ ...def, state: 'draft' });
      notify('Form geri alındı (taslağa çekildi).', 'warning');
    } else {
      update({ ...def, state: 'published' });
      notify('Form etkinleştirildi ve yayına alındı.', 'success');
    }
  };

  // ---------- tab panels ----------

  const fieldsPanel = (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr_300px]">
      {/* LEFT: palette + structure */}
      <div className="space-y-4">
        <Card>
          <h3 className="font-heading text-sm font-bold text-ink">Alan Paleti</h3>
          <p className="mt-0.5 text-xs text-ink-muted">Eklemek için bir alan türü seçin.</p>
          <div className="mt-3 space-y-3">
            {PALETTE.map((grp) => (
              <div key={grp.group}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{grp.group}</p>
                <div className="space-y-1">
                  {grp.types.map((t) => {
                    const m = FIELD_META[t];
                    const Icon = m.icon;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addField(t)}
                        disabled={!canEdit}
                        className="flex w-full items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-left text-xs font-semibold text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
                        {m.label}
                        <Plus className="ml-auto h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-sm font-bold text-ink">Form Yapısı</h3>
          <ol className="mt-3 space-y-3">
            {def.steps.map((step, si) => (
              <li key={step.id}>
                <div className="flex items-center gap-1.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-surface text-[11px] font-bold text-gold">{si + 1}</span>
                  <span className="flex-1 truncate text-sm font-semibold text-ink">{step.title}</span>
                  <button type="button" onClick={() => moveStep(si, -1)} disabled={!canEdit || si === 0} aria-label="Adımı yukarı taşı" className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => moveStep(si, 1)} disabled={!canEdit || si === def.steps.length - 1} aria-label="Adımı aşağı taşı" className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ul className="ml-2.5 mt-1 space-y-0.5 border-l border-line-light pl-2.5">
                  {step.fieldIds.map((fid, fi) => {
                    const f = fieldById(fid);
                    if (!f) return null;
                    return (
                      <li key={fid} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFieldId(fid);
                            setActiveStepId(step.id);
                          }}
                          className={cn('flex-1 truncate rounded px-1.5 py-1 text-left text-xs', selectedFieldId === fid ? 'bg-navy/5 font-semibold text-navy' : 'text-ink-soft hover:bg-surface')}
                        >
                          {f.label}
                        </button>
                        <button type="button" onClick={() => moveFieldInStep(step.id, fi, -1)} disabled={!canEdit || fi === 0} aria-label="Alanı yukarı taşı" className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button type="button" onClick={() => moveFieldInStep(step.id, fi, 1)} disabled={!canEdit || fi === step.fieldIds.length - 1} aria-label="Alanı aşağı taşı" className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* CENTER: canvas */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-card border border-line-light bg-surface/60 p-3 text-xs text-ink-soft">
          <span className="font-semibold text-ink">Gizlilik sınıfı:</span>
          {(['public', 'personal', 'sensitive'] as PrivacyClass[]).map((p) => (
            <span key={p} className="inline-flex items-center gap-1">
              <PrivacyBadge privacy={p} />
              <span>{PRIVACY_META[p].desc}</span>
            </span>
          ))}
        </div>

        {def.steps.map((step, si) => (
          <Card key={step.id}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-xs font-bold text-white">{si + 1}</span>
              <h4 className="font-heading text-sm font-bold text-ink">{step.title}</h4>
            </div>
            <div className="space-y-2">
              {step.fieldIds.length === 0 && <p className="text-xs text-ink-muted">Bu adımda alan yok. Soldaki paletten ekleyin.</p>}
              {step.fieldIds.map((fid) => {
                const f = fieldById(fid);
                if (!f) return null;
                const Icon = FIELD_META[f.type].icon;
                return (
                  <button
                    key={fid}
                    type="button"
                    onClick={() => {
                      setSelectedFieldId(fid);
                      setActiveStepId(step.id);
                    }}
                    aria-pressed={selectedFieldId === fid}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                      selectedFieldId === fid ? 'border-navy bg-navy/5' : 'border-line bg-white hover:bg-surface',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {f.label}
                        {f.required && <span className="ml-1 text-danger">*</span>}
                      </span>
                      <span className="block font-mono text-[11px] text-ink-muted">{f.key}</span>
                    </span>
                    <PrivacyBadge privacy={f.privacy} />
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* RIGHT: field settings */}
      <div>
        <Card>
          <h3 className="font-heading text-sm font-bold text-ink">Alan Ayarları</h3>
          {!selectedField ? (
            <p className="mt-2 text-xs text-ink-muted">Düzenlemek için bir alan seçin.</p>
          ) : (
            <div className="mt-3 space-y-4">
              <label className="block">
                <span className="field-label">Etiket</span>
                <input
                  value={selectedField.label}
                  disabled={!canEdit}
                  onChange={(e) => patchField(selectedField.id, { label: e.target.value })}
                  className="field-input disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="field-label">Anahtar (key)</span>
                <input value={selectedField.key} readOnly className="field-input cursor-not-allowed bg-surface font-mono text-xs text-ink-soft" />
                <span className="mt-1 block text-[11px] text-ink-muted">Anahtar entegrasyon kararlılığı için sabittir.</span>
              </label>

              <div className="flex items-center justify-between gap-2">
                <span className="field-label mb-0">Zorunlu alan</span>
                <Toggle label="Zorunlu alan" checked={selectedField.required} disabled={!canEdit} onChange={(v) => patchField(selectedField.id, { required: v })} />
              </div>

              <label className="block">
                <span className="field-label">Gizlilik sınıfı</span>
                <select
                  value={selectedField.privacy}
                  disabled={!canEdit}
                  onChange={(e) => patchField(selectedField.id, { privacy: e.target.value as PrivacyClass })}
                  className="field-input disabled:opacity-60"
                >
                  <option value="public">Genel</option>
                  <option value="personal">Kişisel</option>
                  <option value="sensitive">Hassas</option>
                </select>
                <span className="mt-1 block text-[11px] text-ink-muted">{PRIVACY_META[selectedField.privacy].desc}</span>
              </label>

              {(selectedField.type === 'select' || selectedField.type === 'applicant_status') && (
                <div>
                  <span className="field-label">Seçenekler</span>
                  <div className="space-y-1.5">
                    {(selectedField.options ?? []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <input
                          value={opt.label}
                          disabled={!canEdit}
                          onChange={(e) =>
                            patchField(selectedField.id, {
                              options: (selectedField.options ?? []).map((o, i) => (i === oi ? { ...o, label: e.target.value } : o)),
                            })
                          }
                          className="field-input flex-1 disabled:opacity-60"
                        />
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => patchField(selectedField.id, { options: (selectedField.options ?? []).filter((_, i) => i !== oi) })}
                          aria-label="Seçeneği sil"
                          className="rounded-lg border border-line p-2 text-ink-muted hover:bg-surface disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={() =>
                        patchField(selectedField.id, {
                          options: [...(selectedField.options ?? []), { value: `opt${(selectedField.options?.length ?? 0) + 1}`, label: 'Yeni seçenek' }],
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-hover disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" /> Seçenek ekle
                    </button>
                  </div>
                </div>
              )}

              <label className="block">
                <span className="field-label">Yardım metni</span>
                <input
                  value={selectedField.helpText ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => patchField(selectedField.id, { helpText: e.target.value })}
                  placeholder="İsteğe bağlı açıklama"
                  className="field-input disabled:opacity-60"
                />
              </label>

              <button
                type="button"
                onClick={() => removeField(selectedField.id)}
                disabled={!canEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Alanı kaldır
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const logicPanel = (
    <div className="space-y-4">
      <StatusAlert tone="info" title="Koşullu mantık">
        Bir alanın değerine göre başka alanları gösterin, gizleyin veya zorunlu yapın.
      </StatusAlert>
      <div className="space-y-2">
        {def.logic.length === 0 && <p className="text-sm text-ink-muted">Henüz mantık kuralı yok.</p>}
        {def.logic.map((rule) => (
          <Card key={rule.id} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-soft">Eğer</span>
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">{rule.whenFieldKey}</code>
            <span className="text-ink-soft">=</span>
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">{rule.equals}</code>
            <span className="text-ink-soft">ise</span>
            <StatusBadge label={rule.action === 'show' ? 'Göster' : rule.action === 'hide' ? 'Gizle' : 'Zorunlu yap'} tone="gold" />
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">{rule.targetFieldKey}</code>
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => guard(() => update({ ...def, logic: def.logic.filter((l) => l.id !== rule.id) }))}
              aria-label="Kuralı sil"
              className="ml-auto rounded-lg border border-line p-1.5 text-ink-muted hover:bg-surface disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </Card>
        ))}
      </div>
      <button
        type="button"
        disabled={!canEdit}
        onClick={() => notify('Kural düzenleyici demo modunda. Kuralları mantık panelinden yönetin.', 'info')}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-50"
      >
        <Plus className="h-4 w-4" /> Kural Ekle
      </button>
    </div>
  );

  const designPanel = (
    <div className="space-y-3">
      <StatusAlert tone="info">Form sunum seçenekleri. Marka tipografisi ve renkleri merkezi tasarım sisteminden gelir.</StatusAlert>
      {[
        { id: 'progress', label: 'Adım ilerleme göstergesi', def: def.steps.length > 1 },
        { id: 'compact', label: 'Kompakt alan aralığı', def: false },
        { id: 'inline-help', label: 'Yardım metnini satır içi göster', def: true },
      ].map((opt) => (
        <Card key={opt.id} className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{opt.label}</span>
          <Toggle label={opt.label} checked={opt.def} disabled={!canEdit} onChange={() => guard(() => notify('Tasarım tercihi güncellendi. (Demo)', 'success'))} />
        </Card>
      ))}
    </div>
  );

  const routingPanel = (
    <div className="space-y-4">
      <Card className="space-y-4">
        <h3 className="font-heading text-sm font-bold text-ink">Yönlendirme</h3>
        <label className="block">
          <span className="field-label">Ekip</span>
          <select
            value={def.routing.team ?? ''}
            disabled={!canEdit}
            onChange={(e) => update({ ...def, routing: { ...def.routing, team: e.target.value || undefined } })}
            className="field-input disabled:opacity-60"
          >
            <option value="">Ekip seçilmedi</option>
            {Object.entries(TEAM_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Atanan kişi (isteğe bağlı)</span>
          <input
            value={def.routing.assignee ?? ''}
            disabled={!canEdit}
            onChange={(e) => update({ ...def, routing: { ...def.routing, assignee: e.target.value || undefined } })}
            placeholder="Örn. kullanıcı kimliği"
            className="field-input disabled:opacity-60"
          />
        </label>
        <div className="flex items-center justify-between gap-2">
          <span className="field-label mb-0">Ülkeye göre yönlendir</span>
          <Toggle label="Ülkeye göre yönlendir" checked={!!def.routing.byCountry} disabled={!canEdit} onChange={(v) => update({ ...def, routing: { ...def.routing, byCountry: v } })} />
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-heading text-sm font-bold text-ink">Yönlendirme Simülatörü</h3>
        <p className="text-xs text-ink-muted">Bir ülke seçin, başvurunun hangi ekibe gideceğini görün.</p>
        <label className="block">
          <span className="field-label">Hedef ülke</span>
          <select value={simCountry} onChange={(e) => setSimCountry(e.target.value)} className="field-input">
            {SIM_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-lg bg-surface p-3 text-sm">
          Sonuç: <span className="font-semibold text-navy">{TEAM_LABELS[simTeam] ?? simTeam}</span>
          {!def.routing.byCountry && <span className="ml-2 text-xs text-ink-muted">(ülke yönlendirmesi kapalı — sabit ekip)</span>}
        </div>
      </Card>
    </div>
  );

  const notificationsPanel = (
    <div className="space-y-3">
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Yönetici e-postası</p>
          <p className="text-xs text-ink-muted">Yeni gönderimde ekibe bildirim gönder.</p>
        </div>
        <Toggle label="Yönetici e-postası" checked={def.notifications.adminEmail} disabled={!canEdit} onChange={(v) => update({ ...def, notifications: { ...def.notifications, adminEmail: v } })} />
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Ziyaretçi e-postası</p>
          <p className="text-xs text-ink-muted">Başvurana otomatik onay e-postası gönder.</p>
        </div>
        <Toggle label="Ziyaretçi e-postası" checked={def.notifications.visitorEmail} disabled={!canEdit} onChange={(v) => update({ ...def, notifications: { ...def.notifications, visitorEmail: v } })} />
      </Card>
    </div>
  );

  const consentFields = def.fields.filter((f) => f.type === 'consent');
  const consentPanel = (
    <div className="space-y-4">
      <StatusAlert tone="warning" title="Onay (consent) alanları">
        KVKK uyumu için en az bir zorunlu onay alanı bulunmalıdır. Onay alanları her zaman "Hassas" sınıfında değerlendirilir.
      </StatusAlert>
      <div className="space-y-2">
        {consentFields.length === 0 && <p className="text-sm text-ink-muted">Onay alanı yok.</p>}
        {consentFields.map((f) => (
          <Card key={f.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">{f.label}</p>
              <p className="font-mono text-[11px] text-ink-muted">{f.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <PrivacyBadge privacy={f.privacy} />
              <StatusBadge label={f.required ? 'Zorunlu' : 'İsteğe bağlı'} tone={f.required ? 'success' : 'neutral'} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const successPanel = (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-bold text-ink">Başarı davranışı</h3>
      {([
        { id: 'thank_you', label: 'Teşekkür sayfası', desc: 'Başvuru sonrası ayrı bir teşekkür sayfasına yönlendir.' },
        { id: 'message', label: 'Satır içi mesaj', desc: 'Form yerinde başarı mesajı göster.' },
      ] as const).map((opt) => (
        <Card key={opt.id}>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="success"
              checked={def.successBehavior === opt.id}
              disabled={!canEdit}
              onChange={() => update({ ...def, successBehavior: opt.id })}
              className="mt-1 h-4 w-4 accent-navy"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">{opt.label}</span>
              <span className="block text-xs text-ink-muted">{opt.desc}</span>
            </span>
          </label>
        </Card>
      ))}
    </div>
  );

  const checksPanel = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-heading text-sm font-bold text-ink">Kontroller</span>
        <StatusBadge label={`${checksOk}/${checks.length} geçti`} tone={checksOk === checks.length ? 'success' : 'warning'} />
      </div>
      <div className="space-y-2">
        {checks.map((c) => (
          <Card key={c.label} className="flex items-start gap-3">
            {c.ok ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-warning" />}
            <div>
              <p className="text-sm font-semibold text-ink">{c.label}</p>
              <p className="text-xs text-ink-soft">{c.detail}</p>
            </div>
            <StatusBadge label={c.ok ? 'Geçti' : 'Uyarı'} tone={c.ok ? 'success' : 'warning'} />
          </Card>
        ))}
      </div>
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-info" />
          <h4 className="font-heading text-sm font-bold text-ink">Veri Yükü Önizlemesi</h4>
        </div>
        <p className="mb-2 text-xs text-ink-muted">Yalnızca alan anahtarları ve sınıflandırma — gerçek (PII) değerler asla burada görünmez.</p>
        <pre className="overflow-x-auto rounded-lg bg-navy-deep p-3 text-[11px] leading-relaxed text-white/90">{payloadPreview}</pre>
      </Card>
    </div>
  );

  const previewPanel = (
    <div className="space-y-4">
      <StatusAlert tone="warning" title="Test modu — gerçek başvuru oluşturmaz">
        Bu önizleme yalnızca görseldir. Gönderilen hiçbir veri kaydedilmez ve gerçek bir başvuru/lead üretmez.
      </StatusAlert>
      <div className="mx-auto max-w-xl space-y-5 rounded-card border border-line-light bg-white p-5 shadow-card">
        {def.steps.map((step, si) => (
          <fieldset key={step.id} className="space-y-3">
            <legend className="font-heading text-sm font-bold text-ink">
              {si + 1}. {step.title}
            </legend>
            {step.fieldIds.map((fid) => {
              const f = fieldById(fid);
              if (!f || f.type === 'hidden') return null;
              return (
                <div key={fid}>
                  <label className="field-label flex items-center gap-2">
                    {f.label}
                    {f.required && <span className="text-danger">*</span>}
                    <PrivacyBadge privacy={f.privacy} />
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea disabled rows={2} className="field-input bg-surface/60" placeholder="(önizleme)" />
                  ) : f.type === 'consent' ? (
                    <label className="flex items-start gap-2 text-xs text-ink-soft">
                      <input type="checkbox" disabled className="mt-0.5 h-4 w-4 accent-navy" /> {f.label}
                    </label>
                  ) : f.type === 'select' || f.type === 'applicant_status' ? (
                    <select disabled className="field-input bg-surface/60">
                      {(f.options ?? [{ value: '', label: 'Seçenek' }]).map((o, i) => (
                        <option key={i}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input disabled className="field-input bg-surface/60" placeholder="(önizleme)" />
                  )}
                  {f.helpText && <p className="mt-1 text-[11px] text-ink-muted">{f.helpText}</p>}
                </div>
              );
            })}
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() => notify('Test gönderimi alındı (production başvurusu oluşturulmadı).', 'info')}
          className="w-full rounded-lg bg-gold px-3.5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Test Gönderimi
        </button>
      </div>
    </div>
  );

  // ---------- shell ----------

  const tabs = [
    { id: 'fields', label: 'Alanlar', content: fieldsPanel, count: def.fields.length },
    { id: 'logic', label: 'Mantık', content: logicPanel, count: def.logic.length },
    { id: 'design', label: 'Tasarım', content: designPanel },
    { id: 'routing', label: 'Yönlendirme', content: routingPanel },
    { id: 'notifications', label: 'Bildirimler', content: notificationsPanel },
    { id: 'consent', label: 'Onay', content: consentPanel, count: consentFields.length },
    { id: 'success', label: 'Başarı', content: successPanel },
    { id: 'checks', label: 'Kontroller', content: checksPanel, count: checks.length - checksOk },
    { id: 'preview', label: 'Önizleme', content: previewPanel },
  ];

  return (
    <div className="space-y-4">
      {/* top action bar */}
      <div className="flex flex-col gap-3 rounded-card border border-line-light bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StatusBadge label={`Sürüm ${def.version}`} tone="neutral" />
          <span className="text-ink-soft">{def.fields.length} alan · {def.steps.length} adım</span>
          {dirty && <StatusBadge label="Kaydedilmemiş değişiklik" tone="warning" />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={togglePublish}
            disabled={!canPublish}
            title={canPublish ? undefined : 'Yayınlama yetkiniz yok'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50',
              def.state === 'published' ? 'border border-line text-ink hover:bg-surface' : 'bg-gold text-white hover:opacity-90',
            )}
          >
            {def.state === 'published' ? <RotateCcw className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
            {def.state === 'published' ? 'Geri Al' : 'Etkinleştir'}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canEdit}
            title={canEdit ? undefined : 'Düzenleme yetkiniz yok'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Kaydet
          </button>
        </div>
      </div>

      {!canEdit && (
        <StatusAlert tone="info" title="Salt görünüm">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Bu formu görüntüleyebilirsiniz ancak düzenleme yetkiniz yok.
          </span>
        </StatusAlert>
      )}

      {def.testMode && (
        <StatusAlert tone="warning" title="Test modu — gerçek başvuru oluşturmaz">
          Bu form test modunda. Gönderimler gerçek başvuru/lead olarak kaydedilmez.
        </StatusAlert>
      )}

      <Tabs tabs={tabs} ariaLabel="Form düzenleyici sekmeleri" />
    </div>
  );
}
