'use client';

import { AlertTriangle, History, Save, Send, Upload } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Tabs } from '@/components/admin/ui/Tabs';
import { StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { Country, Region } from '@/types/content';
import { formatDateTr } from '@/lib/utils';

const REGIONS: Region[] = ['Schengen', 'Avrupa', 'Amerika', 'Birleşik Krallık', 'Asya Pasifik', 'Orta Doğu'];

const RISKY_RE = /garanti|%100|kesin|resmi/i;

/** Returns the list of forbidden claim keywords found in a text. */
function scanRisky(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(/garanti|%100|kesin|resmi/gi)) {
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

export function CountryEditor({ country, canPublish }: { country: Country; canPublish: boolean }) {
  const { notify } = useToast();

  // ---- Genel ----
  const [name, setName] = useState(country.name);
  const [region, setRegion] = useState<Region>(country.region);
  const [heroEyebrow, setHeroEyebrow] = useState(country.heroEyebrow);
  const [heroTitle, setHeroTitle] = useState(country.heroTitle);
  const [heroDescription, setHeroDescription] = useState(country.heroDescription);
  const [timelineNote, setTimelineNote] = useState(country.timelineNote);

  // ---- Vize Türleri ----
  const [visaTypes, setVisaTypes] = useState(country.visaTypes.map((v) => ({ ...v })));
  const updateVisa = (i: number, patch: Partial<(typeof visaTypes)[number]>) =>
    setVisaTypes((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  // ---- Operasyon ----
  const [quickFacts, setQuickFacts] = useState(country.quickFacts.map((q) => ({ ...q })));
  const updateFact = (i: number, value: string) =>
    setQuickFacts((prev) => prev.map((q, idx) => (idx === i ? { ...q, value } : q)));
  const [whoCanApply, setWhoCanApply] = useState(lines(country.whoCanApply));
  const [commonMistakes, setCommonMistakes] = useState(lines(country.commonMistakes));
  const [rejectionGuidance, setRejectionGuidance] = useState(lines(country.rejectionGuidance));

  // ---- Randevu (demo, içerik modelinde alan yok) ----
  const [apptChannel, setApptChannel] = useState('Konsolosluk randevu sistemi');
  const [apptLeadTime, setApptLeadTime] = useState('2–4 hafta');
  const [apptNote, setApptNote] = useState('');

  // ---- Formlar & Yönlendirme ----
  const [applicantStatuses, setApplicantStatuses] = useState(
    country.applicantStatuses.map((s) => ({ key: s.key, label: s.label, documents: lines(s.documents) })),
  );
  const updateStatus = (i: number, patch: Partial<(typeof applicantStatuses)[number]>) =>
    setApplicantStatuses((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const [leadForm, setLeadForm] = useState('default');

  // ---- İlişkiler ----
  const [relatedCountries, setRelatedCountries] = useState(lines(country.relatedCountrySlugs));
  const [relatedServices, setRelatedServices] = useState(lines(country.relatedServiceSlugs));

  // ---- SEO ----
  const [seoTitle, setSeoTitle] = useState(country.seo.title);
  const [seoDescription, setSeoDescription] = useState(country.seo.description);
  const [seoCanonical, setSeoCanonical] = useState(country.seo.canonical ?? '');

  const riskyTexts = useMemo(
    () =>
      [heroEyebrow, heroTitle, heroDescription, timelineNote, seoTitle, seoDescription, apptNote, ...visaTypes.map((v) => v.summary)].filter(
        (t) => RISKY_RE.test(t),
      ),
    [heroEyebrow, heroTitle, heroDescription, timelineNote, seoTitle, seoDescription, apptNote, visaTypes],
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

  // ---------- Tab contents ----------
  const genelTab = (
    <div className="space-y-4">
      <SectionCard title="Temel Bilgiler">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ülke Adı" value={name} onChange={setName} />
          <label className="block">
            <span className="field-label">Bölge</span>
            <select value={region} onChange={(e) => setRegion(e.target.value as Region)} className="field-input">
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>
      <SectionCard title="Hero Alanı">
        <div className="space-y-4">
          <Field label="Üst Başlık (Eyebrow)" value={heroEyebrow} onChange={setHeroEyebrow} showRisky />
          <Field label="Başlık" value={heroTitle} onChange={setHeroTitle} showRisky />
          <Field label="Açıklama" value={heroDescription} onChange={setHeroDescription} textarea rows={4} showRisky />
        </div>
      </SectionCard>
      <SectionCard title="Zaman Çizelgesi Notu">
        <Field label="Not" value={timelineNote} onChange={setTimelineNote} textarea showRisky />
      </SectionCard>
    </div>
  );

  const visaTab = (
    <div className="space-y-4">
      {visaTypes.length === 0 ? (
        <StatusAlert tone="info" title="Vize türü yok">Bu ülke için tanımlı vize türü bulunmuyor.</StatusAlert>
      ) : (
        visaTypes.map((v, i) => (
          <SectionCard key={v.slug} title={v.name || `Vize Türü ${i + 1}`}>
            <div className="space-y-4">
              <Field label="Ad" value={v.name} onChange={(val) => updateVisa(i, { name: val })} />
              <Field label="Özet" value={v.summary} onChange={(val) => updateVisa(i, { summary: val })} textarea showRisky />
            </div>
          </SectionCard>
        ))
      )}
    </div>
  );

  const operasyonTab = (
    <div className="space-y-4">
      <SectionCard title="Hızlı Bilgiler">
        {quickFacts.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı hızlı bilgi yok.</p>
        ) : (
          <div className="space-y-3">
            {quickFacts.map((q, i) => (
              <Field key={`${q.label}-${i}`} label={q.label} value={q.value} onChange={(val) => updateFact(i, val)} />
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Kimler Başvurabilir">
        <Field label="Her satır bir madde" value={whoCanApply} onChange={setWhoCanApply} textarea rows={5} />
      </SectionCard>
      <SectionCard title="Sık Yapılan Hatalar">
        <Field label="Her satır bir madde" value={commonMistakes} onChange={setCommonMistakes} textarea rows={5} showRisky />
      </SectionCard>
      <SectionCard title="Ret Sonrası Rehber">
        <Field label="Her satır bir madde" value={rejectionGuidance} onChange={setRejectionGuidance} textarea rows={5} showRisky />
      </SectionCard>
    </div>
  );

  const randevuTab = (
    <SectionCard title="Randevu Bilgisi (Demo)">
      <div className="space-y-4">
        <Field label="Randevu Kanalı" value={apptChannel} onChange={setApptChannel} />
        <Field label="Ortalama Bekleme Süresi" value={apptLeadTime} onChange={setApptLeadTime} />
        <Field label="Not" value={apptNote} onChange={setApptNote} textarea placeholder="Başvuranlara gösterilecek randevu notu" showRisky />
        <StatusAlert tone="info">
          Resmi konsolosluk randevu sistemleriyle doğrudan entegrasyon yoktur. Bu alanlar yalnızca bilgilendirme amaçlıdır.
        </StatusAlert>
      </div>
    </SectionCard>
  );

  const formlarTab = (
    <div className="space-y-4">
      <SectionCard title="Başvuran Durumları ve Belgeleri">
        {applicantStatuses.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı başvuran durumu yok.</p>
        ) : (
          <div className="space-y-4">
            {applicantStatuses.map((s, i) => (
              <div key={s.key} className="rounded-lg border border-line-light p-4">
                <Field label="Durum Etiketi" value={s.label} onChange={(val) => updateStatus(i, { label: val })} />
                <div className="mt-3">
                  <Field label="Belgeler (her satır bir belge)" value={s.documents} onChange={(val) => updateStatus(i, { documents: val })} textarea rows={4} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Lead Formu Yönlendirmesi">
        <label className="block">
          <span className="field-label">Bu ülke sayfasına bağlı form</span>
          <select value={leadForm} onChange={(e) => setLeadForm(e.target.value)} className="field-input">
            <option value="default">Varsayılan Başvuru Formu</option>
            <option value="appointment">Randevu Talep Formu</option>
            <option value="callback">Geri Arama Formu</option>
          </select>
        </label>
      </SectionCard>
    </div>
  );

  const iliskilerTab = (
    <div className="space-y-4">
      <SectionCard title="İlgili Ülkeler">
        <Field label="Slug listesi (her satır bir slug)" value={relatedCountries} onChange={setRelatedCountries} textarea rows={5} />
      </SectionCard>
      <SectionCard title="İlgili Hizmetler">
        <Field label="Slug listesi (her satır bir slug)" value={relatedServices} onChange={setRelatedServices} textarea rows={5} />
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
        <Field label="Canonical (path)" value={seoCanonical} onChange={setSeoCanonical} placeholder="/vize-ulkeleri/almanya" />
      </div>
    </SectionCard>
  );

  const yayinTab = (
    <div className="space-y-4">
      <SectionCard title="Yayın Durumu">
        <div className="flex flex-wrap items-center gap-3">
          <WorkflowBadge state={country.status === 'published' ? 'published' : country.status === 'archived' ? 'archived' : 'draft'} />
          <span className="text-sm text-ink-soft">Son kayıt: {formatDateTr('2026-06-20')}</span>
        </div>
      </SectionCard>
      <SectionCard title="Yayın Kontrol Listesi">
        <ul className="space-y-2 text-sm">
          {[
            { ok: heroTitle.trim().length > 0, label: 'Hero başlığı dolu' },
            { ok: heroDescription.trim().length > 0, label: 'Hero açıklaması dolu' },
            { ok: visaTypes.length > 0, label: 'En az bir vize türü tanımlı' },
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
    { id: 'v4', label: 'Taslak güncellendi', actor: 'VİS VİZE Editör', at: '2026-06-20', state: 'draft' as const },
    { id: 'v3', label: 'Yayınlandı', actor: 'İçerik Yöneticisi', at: '2026-05-12', state: 'published' as const },
    { id: 'v2', label: 'İncelemeden geçti', actor: 'İçerik Yöneticisi', at: '2026-05-10', state: 'approved' as const },
    { id: 'v1', label: 'Oluşturuldu', actor: 'VİS VİZE Editör', at: '2026-04-28', state: 'draft' as const },
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
          {riskyTexts.length} alanda yasak iddia (garanti/%100/kesin/resmi) bulundu. Yayınlamadan önce düzeltilmelidir.
        </StatusAlert>
      )}

      {/* Action bar */}
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
        ariaLabel="Ülke düzenleme sekmeleri"
        tabs={[
          { id: 'genel', label: 'Genel', content: genelTab },
          { id: 'visa', label: 'Vize Türleri', count: visaTypes.length, content: visaTab },
          { id: 'operasyon', label: 'Operasyon', content: operasyonTab },
          { id: 'randevu', label: 'Randevu', content: randevuTab },
          { id: 'formlar', label: 'Formlar & Yönlendirme', content: formlarTab },
          { id: 'iliskiler', label: 'İlişkiler', content: iliskilerTab },
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
