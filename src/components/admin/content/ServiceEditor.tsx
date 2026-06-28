'use client';

import { AlertTriangle, History, Save, Send, Upload } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Tabs } from '@/components/admin/ui/Tabs';
import { StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { Service } from '@/types/content';
import { formatDateTr } from '@/lib/utils';

const RISKY_RE = /garanti|%100|kesin|resmi vize|onay garanti/i;
const RISKY_G = /garanti|%100|kesin|resmi vize|onay garanti/gi;

const PRICING_MODES = ['Sabit', 'Başlangıç fiyatı', 'Aralık', 'Teklif gerekli', 'Gizli', 'Ücretsiz'] as const;
type PricingMode = (typeof PRICING_MODES)[number];

function scanRisky(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(RISKY_G)) {
    if (m[0]) found.add(m[0].toLowerCase());
  }
  return [...found];
}

function RiskyChip({ text }: { text: string }) {
  if (!RISKY_RE.test(text)) return null;
  const terms = scanRisky(text);
  return (
    <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      Riskli ifade: {terms.join(', ')} — bu tür iddialar yasaktır
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  hint,
  placeholder,
  showRisky,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  placeholder?: string;
  showRisky?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="field-input py-3 leading-relaxed"
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field-input" />
      )}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
      {showRisky && <RiskyChip text={value} />}
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
      <h3 className="mb-4 font-heading text-base font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

const lines = (arr: string[]) => arr.join('\n');
const toList = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);

export function ServiceEditor({ service, canPublish }: { service: Service; canPublish: boolean }) {
  const { notify } = useToast();

  // ---- Genel ----
  const [name, setName] = useState(service.name);
  const [icon, setIcon] = useState(service.icon);
  const [popular, setPopular] = useState(service.popular);
  const [shortDescription, setShortDescription] = useState(service.shortDescription);
  const [heroTitle, setHeroTitle] = useState(service.heroTitle);
  const [heroDescription, setHeroDescription] = useState(service.heroDescription);

  // ---- Fiyatlandırma ----
  const [pricingMode, setPricingMode] = useState<PricingMode>('Teklif gerekli');
  const [consultancyFee, setConsultancyFee] = useState('');
  const [officialFee, setOfficialFee] = useState('');
  const [pricingNote, setPricingNote] = useState(service.pricingNote);

  // ---- Kapsam ----
  const [scope, setScope] = useState(lines(service.scope));
  const [exclusions, setExclusions] = useState(lines(service.exclusions));
  const [requiredInfo, setRequiredInfo] = useState(lines(service.requiredInfo));

  // ---- Ülke & Vize İlişkileri ----
  const [supportedCountries, setSupportedCountries] = useState(lines(service.supportedCountrySlugs));
  const [relatedServices, setRelatedServices] = useState(lines(service.relatedServiceSlugs));

  // ---- Form & Yönlendirme ----
  const [leadForm, setLeadForm] = useState('default');
  const [ctaLabel, setCtaLabel] = useState('Ücretsiz Ön Değerlendirme');

  // ---- SEO ----
  const [seoTitle, setSeoTitle] = useState(service.seo.title);
  const [seoDescription, setSeoDescription] = useState(service.seo.description);
  const [seoCanonical, setSeoCanonical] = useState(service.seo.canonical ?? '');

  const showFeeFields = pricingMode !== 'Teklif gerekli' && pricingMode !== 'Gizli' && pricingMode !== 'Ücretsiz';

  const riskyTexts = useMemo(
    () =>
      [shortDescription, heroTitle, heroDescription, pricingNote, ctaLabel, seoTitle, seoDescription, scope, exclusions].filter((t) =>
        RISKY_RE.test(t),
      ),
    [shortDescription, heroTitle, heroDescription, pricingNote, ctaLabel, seoTitle, seoDescription, scope, exclusions],
  );

  const save = () => notify(`"${name}" taslağı kaydedildi. (Demo)`, 'success');
  const submit = () => {
    if (riskyTexts.length > 0) {
      notify('İncelemeye göndermeden önce riskli ifadeleri düzeltin.', 'warning');
      return;
    }
    notify(`"${name}" incelemeye gönderildi. (Demo)`, 'info');
  };
  const publish = () => {
    if (!canPublish) {
      notify('Yayınlama yetkiniz yok. İçeriği incelemeye gönderebilirsiniz.', 'warning');
      return;
    }
    if (riskyTexts.length > 0) {
      notify('Riskli ifadeler nedeniyle yayınlanamaz.', 'error');
      return;
    }
    notify(`"${name}" yayınlandı. (Demo)`, 'success');
  };

  const genelTab = (
    <div className="space-y-4">
      <SectionCard title="Temel Bilgiler">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hizmet Adı" value={name} onChange={setName} />
          <Field label="İkon (emoji veya kısaltma)" value={icon} onChange={setIcon} placeholder="◆" />
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="h-4 w-4 rounded border-line accent-navy" />
          Popüler hizmet olarak işaretle
        </label>
      </SectionCard>
      <SectionCard title="Tanıtım Alanı">
        <div className="space-y-4">
          <Field label="Kısa Açıklama" value={shortDescription} onChange={setShortDescription} textarea showRisky />
          <Field label="Hero Başlığı" value={heroTitle} onChange={setHeroTitle} showRisky />
          <Field label="Hero Açıklaması" value={heroDescription} onChange={setHeroDescription} textarea rows={4} showRisky />
        </div>
      </SectionCard>
    </div>
  );

  const fiyatTab = (
    <div className="space-y-4">
      <StatusAlert tone="warning" title="Ücretler ayrı tutulur">
        Resmî/konsolosluk harçları yetkili makamlarca belirlenir; danışmanlık ücretinden ayrı, bilgilendirme amaçlı gösterilir.
        Bu iki kalemi asla tek bir tutar olarak birleştirmeyin.
      </StatusAlert>
      <SectionCard title="Fiyatlandırma Modu">
        <label className="block">
          <span className="field-label">Mod</span>
          <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value as PricingMode)} className="field-input">
            {PRICING_MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-ink-muted">
            Görünür fiyat stratejisini belirler. "Teklif gerekli" ve "Gizli" modlarında tutar gösterilmez.
          </span>
        </label>
      </SectionCard>
      <SectionCard title="Danışmanlık Ücreti (VİS VİZE)">
        {showFeeFields ? (
          <Field
            label="Danışmanlık Ücreti"
            value={consultancyFee}
            onChange={setConsultancyFee}
            placeholder="Örn. 4.500 ₺ (başlangıç)"
            hint="Yalnızca VİS VİZE hizmet bedeli. Resmî harçları buraya dahil etmeyin."
          />
        ) : (
          <p className="text-sm text-ink-muted">Seçili modda görünür danışmanlık tutarı girilmez.</p>
        )}
      </SectionCard>
      <SectionCard title="Resmî / Konsolosluk Harcı (bilgilendirme)">
        <Field
          label="Resmî Harç"
          value={officialFee}
          onChange={setOfficialFee}
          placeholder="Örn. 90 € (Schengen vize harcı)"
          hint="Yetkili makamlarca belirlenir, VİS VİZE tarafından tahsil edilmez. Yalnızca bilgilendirme amaçlıdır."
        />
        <div className="mt-4">
          <Field label="Fiyatlandırma Notu" value={pricingNote} onChange={setPricingNote} textarea showRisky />
        </div>
      </SectionCard>
    </div>
  );

  const kapsamTab = (
    <div className="space-y-4">
      <SectionCard title="Kapsam (Dahil Olanlar)">
        <Field label="Her satır bir madde" value={scope} onChange={setScope} textarea rows={6} showRisky />
      </SectionCard>
      <SectionCard title="Kapsam Dışı (Hariç Olanlar)">
        <Field label="Her satır bir madde" value={exclusions} onChange={setExclusions} textarea rows={6} showRisky />
      </SectionCard>
      <SectionCard title="Gerekli Bilgiler">
        <Field label="Her satır bir madde" value={requiredInfo} onChange={setRequiredInfo} textarea rows={6} />
      </SectionCard>
    </div>
  );

  const iliskilerTab = (
    <div className="space-y-4">
      <SectionCard title="Desteklenen Ülkeler">
        <Field label="Ülke slug listesi (her satır bir slug)" value={supportedCountries} onChange={setSupportedCountries} textarea rows={6} hint={`${toList(supportedCountries).length} ülke bağlı`} />
      </SectionCard>
      <SectionCard title="İlgili Hizmetler">
        <Field label="Hizmet slug listesi (her satır bir slug)" value={relatedServices} onChange={setRelatedServices} textarea rows={5} />
      </SectionCard>
    </div>
  );

  const formTab = (
    <div className="space-y-4">
      <SectionCard title="Lead Formu Yönlendirmesi">
        <label className="block">
          <span className="field-label">Bu hizmet sayfasına bağlı form</span>
          <select value={leadForm} onChange={(e) => setLeadForm(e.target.value)} className="field-input">
            <option value="default">Varsayılan Başvuru Formu</option>
            <option value="appointment">Randevu Talep Formu</option>
            <option value="callback">Geri Arama Formu</option>
          </select>
        </label>
      </SectionCard>
      <SectionCard title="Eylem Çağrısı (CTA)">
        <Field label="CTA Etiketi" value={ctaLabel} onChange={setCtaLabel} showRisky />
      </SectionCard>
    </div>
  );

  const seoTab = (
    <SectionCard title="SEO">
      <div className="space-y-4">
        <div>
          <Field label="Meta Başlık" value={seoTitle} onChange={setSeoTitle} showRisky />
          <p className={`mt-1 text-xs ${seoTitle.length > 60 ? 'text-warning' : 'text-ink-muted'}`}>{seoTitle.length} / 60 karakter</p>
        </div>
        <div>
          <Field label="Meta Açıklama" value={seoDescription} onChange={setSeoDescription} textarea showRisky />
          <p className={`mt-1 text-xs ${seoDescription.length > 160 ? 'text-warning' : 'text-ink-muted'}`}>{seoDescription.length} / 160 karakter</p>
        </div>
        <Field label="Canonical (path)" value={seoCanonical} onChange={setSeoCanonical} placeholder="/hizmetler/schengen-vize-danismanligi" />
      </div>
    </SectionCard>
  );

  const yayinTab = (
    <div className="space-y-4">
      <SectionCard title="Yayın Durumu">
        <div className="flex flex-wrap items-center gap-3">
          <WorkflowBadge state={service.status === 'published' ? 'published' : service.status === 'archived' ? 'archived' : 'draft'} />
          <span className="text-sm text-ink-soft">Son kayıt: {formatDateTr('2026-06-20')}</span>
        </div>
      </SectionCard>
      <SectionCard title="Yayın Kontrol Listesi">
        <ul className="space-y-2 text-sm">
          {[
            { ok: heroTitle.trim().length > 0, label: 'Hero başlığı dolu' },
            { ok: shortDescription.trim().length > 0, label: 'Kısa açıklama dolu' },
            { ok: toList(scope).length > 0, label: 'En az bir kapsam maddesi tanımlı' },
            { ok: seoTitle.trim().length > 0 && seoDescription.trim().length > 0, label: 'SEO başlık ve açıklama dolu' },
            { ok: riskyTexts.length === 0, label: 'Riskli ifade içermiyor' },
          ].map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${c.ok ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                {c.ok ? '✓' : '!'}
              </span>
              <span className={c.ok ? 'text-ink' : 'text-danger'}>{c.label}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      {!canPublish && (
        <StatusAlert tone="warning" title="Yayınlama yetkisi yok">
          İçeriği yayınlayamazsınız; ancak taslağı kaydedip incelemeye gönderebilirsiniz.
        </StatusAlert>
      )}
    </div>
  );

  const versions = [
    { id: 'v3', label: 'Taslak güncellendi', actor: 'VİS VİZE Editör', at: '2026-06-20', state: 'draft' as const },
    { id: 'v2', label: 'Yayınlandı', actor: 'İçerik Yöneticisi', at: '2026-05-08', state: 'published' as const },
    { id: 'v1', label: 'Oluşturuldu', actor: 'VİS VİZE Editör', at: '2026-04-22', state: 'draft' as const },
  ];

  const surumlerTab = (
    <SectionCard title="Sürüm Geçmişi (Demo)">
      <ol className="space-y-3">
        {versions.map((v) => (
          <li key={v.id} className="flex items-center justify-between gap-3 rounded-lg border border-line-light p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-soft">
                <History className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{v.label}</p>
                <p className="text-xs text-ink-muted">{v.actor} · {formatDateTr(v.at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WorkflowBadge state={v.state} />
              <button
                type="button"
                onClick={() => notify(`"${v.label}" sürümü önizlemesi açıldı. (Demo)`, 'info')}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
              >
                Görüntüle
              </button>
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  );

  return (
    <div className="space-y-4">
      {riskyTexts.length > 0 && (
        <StatusAlert tone="error" title="Riskli ifadeler tespit edildi">
          {riskyTexts.length} alanda yasak iddia (garanti/%100/kesin/resmi vize/onay garanti) bulundu. Yayınlamadan önce düzeltilmelidir.
        </StatusAlert>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Taslağı Kaydet
        </button>
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          İncelemeye Gönder
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={!canPublish}
          title={canPublish ? undefined : 'Yayınlama yetkiniz yok'}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-white hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Yayınla
        </button>
      </div>

      <Tabs
        ariaLabel="Hizmet düzenleme sekmeleri"
        tabs={[
          { id: 'genel', label: 'Genel', content: genelTab },
          { id: 'fiyat', label: 'Fiyatlandırma', content: fiyatTab },
          { id: 'kapsam', label: 'Kapsam', content: kapsamTab },
          { id: 'iliskiler', label: 'Ülke & Vize İlişkileri', content: iliskilerTab },
          { id: 'form', label: 'Form & Yönlendirme', content: formTab },
          { id: 'seo', label: 'SEO', content: seoTab },
          { id: 'yayin', label: 'Yayın', content: yayinTab },
          { id: 'surumler', label: 'Sürümler', content: surumlerTab },
        ]}
      />

      <p className="text-xs text-ink-muted">
        <StatusBadge label="Demo" tone="neutral" /> Değişiklikler bu önizleme ortamında kalıcı olarak kaydedilmez.
      </p>
    </div>
  );
}
