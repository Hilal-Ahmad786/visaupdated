'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Monitor,
  Save,
  Send,
  Smartphone,
  Upload,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { HealthBar } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { Country } from '@/types/content';
import { cn, codeToFlag, formatDateTr } from '@/lib/utils';

const RISKY_GLOBAL = /garanti|%100|kesin|resmi/gi;
const RISKY_TEST = /garanti|%100|kesin|resmi/i;

interface SectionDef {
  id: string;
  label: string;
}

const SECTIONS: SectionDef[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'quickFacts', label: 'Hızlı Bilgiler' },
  { id: 'visaTypes', label: 'Vize Türleri' },
  { id: 'applicantStatuses', label: 'Başvuran Durumları' },
  { id: 'documentGroups', label: 'Belge Grupları' },
  { id: 'process', label: 'Süreç' },
  { id: 'appointment', label: 'Randevu Bilgisi' },
  { id: 'fees', label: 'Ücret & Kapsam' },
  { id: 'commonMistakes', label: 'Sık Hatalar' },
  { id: 'rejection', label: 'Ret Rehberi' },
  { id: 'faqs', label: 'S.S.S.' },
  { id: 'relatedServices', label: 'İlgili Hizmetler' },
  { id: 'relatedGuides', label: 'İlgili Rehberler' },
  { id: 'relatedCountries', label: 'İlgili Ülkeler' },
  { id: 'footerForm', label: 'Alt Form' },
  { id: 'legal', label: 'Yasal Bilgilendirme' },
];

const lines = (arr: string[]) => arr.join('\n');

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="field-input py-3 leading-relaxed" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field-input" />
      )}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
      {RISKY_TEST.test(value) && (
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Riskli ifade tespit edildi — yasaktır
        </span>
      )}
    </label>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
      <h3 className="mb-3 font-heading text-sm font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}

export function CountryPageEditor({ country, canPublish }: { country: Country; canPublish: boolean }) {
  const { notify } = useToast();

  const [active, setActive] = useState('hero');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [comment, setComment] = useState('');

  // ---- Section-structured editable state ----
  const [hero, setHero] = useState({
    eyebrow: country.heroEyebrow,
    title: country.heroTitle,
    description: country.heroDescription,
  });
  const [quickFacts, setQuickFacts] = useState(country.quickFacts.map((q) => ({ ...q })));
  const [visaTypes, setVisaTypes] = useState(country.visaTypes.map((v) => ({ ...v })));
  const [applicantStatuses, setApplicantStatuses] = useState(
    country.applicantStatuses.map((s) => ({ key: s.key, label: s.label, documents: lines(s.documents) })),
  );
  const [documentGroups, setDocumentGroups] = useState(
    country.documentGroups.map((g) => ({ title: g.title, items: lines(g.items) })),
  );
  const [process, setProcess] = useState(country.processSteps.map((p) => ({ ...p })));
  const [appointment, setAppointment] = useState({ channel: 'Konsolosluk randevu sistemi', leadTime: '2–4 hafta', note: '' });
  const [fees, setFees] = useState({ note: '' });
  const [commonMistakes, setCommonMistakes] = useState(lines(country.commonMistakes));
  const [rejection, setRejection] = useState(lines(country.rejectionGuidance));
  const [faqs, setFaqs] = useState(country.faqs.map((f) => ({ ...f })));
  const [relatedServices, setRelatedServices] = useState(lines(country.relatedServiceSlugs));
  const [relatedGuides, setRelatedGuides] = useState('');
  const [relatedCountries, setRelatedCountries] = useState(lines(country.relatedCountrySlugs));
  const [footerForm, setFooterForm] = useState({ form: 'default', heading: 'Ücretsiz ön değerlendirme alın' });
  const [legal, setLegal] = useState(
    'VİS VİZE bağımsız bir danışmanlık firmasıdır; herhangi bir resmi konsolosluk veya elçilikle bağlantılı değildir. Vize kararı ilgili makamlara aittir.',
  );

  // ---- Cross-section helpers ----
  const allText = useMemo(
    () =>
      [
        hero.eyebrow,
        hero.title,
        hero.description,
        ...quickFacts.map((q) => q.value),
        ...visaTypes.map((v) => v.summary),
        ...applicantStatuses.map((s) => s.documents),
        ...documentGroups.map((g) => g.items),
        ...process.map((p) => p.description),
        appointment.note,
        fees.note,
        commonMistakes,
        rejection,
        ...faqs.map((f) => f.answer),
        legal,
      ].join('\n'),
    [hero, quickFacts, visaTypes, applicantStatuses, documentGroups, process, appointment, fees, commonMistakes, rejection, faqs, legal],
  );

  const riskyMatches = useMemo(() => {
    const set = new Set<string>();
    for (const m of allText.matchAll(RISKY_GLOBAL)) if (m[0]) set.add(m[0].toLowerCase());
    return [...set];
  }, [allText]);

  const health = 60 + ((country.slug.length * 7) % 36);

  const checklist = [
    { ok: hero.title.trim().length > 0, label: 'Hero başlığı dolu' },
    { ok: hero.description.trim().length > 0, label: 'Hero açıklaması dolu' },
    { ok: quickFacts.length > 0, label: 'Hızlı bilgiler tanımlı' },
    { ok: visaTypes.length > 0, label: 'En az bir vize türü' },
    { ok: faqs.length > 0, label: 'En az bir S.S.S.' },
    { ok: legal.trim().length > 0, label: 'Yasal bilgilendirme dolu' },
    { ok: riskyMatches.length === 0, label: 'Riskli ifade yok' },
  ];

  const save = () => notify('Sayfa taslağı kaydedildi. (Demo)', 'success');
  const preview = () => notify(`${device === 'desktop' ? 'Masaüstü' : 'Mobil'} önizleme açıldı. (Demo)`, 'info');
  const publish = () => {
    if (!canPublish) {
      notify('Yayınlama yetkiniz yok.', 'warning');
      return;
    }
    if (riskyMatches.length > 0) {
      notify('Riskli ifadeler nedeniyle yayınlanamaz.', 'error');
      return;
    }
    notify('Ülke sayfası yayınlandı. (Demo)', 'success');
  };

  // ---- update helpers ----
  const updFact = (i: number, value: string) => setQuickFacts((p) => p.map((q, idx) => (idx === i ? { ...q, value } : q)));
  const updVisa = (i: number, patch: Partial<(typeof visaTypes)[number]>) =>
    setVisaTypes((p) => p.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const updStatus = (i: number, patch: Partial<(typeof applicantStatuses)[number]>) =>
    setApplicantStatuses((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const updGroup = (i: number, patch: Partial<(typeof documentGroups)[number]>) =>
    setDocumentGroups((p) => p.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const updProcess = (i: number, patch: Partial<(typeof process)[number]>) =>
    setProcess((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const updFaq = (i: number, patch: Partial<(typeof faqs)[number]>) =>
    setFaqs((p) => p.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  // ---- center editor ----
  function renderEditor() {
    switch (active) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Field label="Üst Başlık (Eyebrow)" value={hero.eyebrow} onChange={(v) => setHero((h) => ({ ...h, eyebrow: v }))} />
            <Field label="Başlık" value={hero.title} onChange={(v) => setHero((h) => ({ ...h, title: v }))} />
            <Field label="Açıklama" value={hero.description} onChange={(v) => setHero((h) => ({ ...h, description: v }))} textarea rows={4} />
          </div>
        );
      case 'quickFacts':
        return quickFacts.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı hızlı bilgi yok.</p>
        ) : (
          <div className="space-y-3">
            {quickFacts.map((q, i) => (
              <Field key={`${q.label}-${i}`} label={q.label} value={q.value} onChange={(v) => updFact(i, v)} />
            ))}
          </div>
        );
      case 'visaTypes':
        return visaTypes.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı vize türü yok.</p>
        ) : (
          <div className="space-y-4">
            {visaTypes.map((v, i) => (
              <div key={v.slug} className="rounded-lg border border-line-light p-4">
                <Field label="Ad" value={v.name} onChange={(val) => updVisa(i, { name: val })} />
                <div className="mt-3">
                  <Field label="Özet" value={v.summary} onChange={(val) => updVisa(i, { summary: val })} textarea />
                </div>
              </div>
            ))}
          </div>
        );
      case 'applicantStatuses':
        return applicantStatuses.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı başvuran durumu yok.</p>
        ) : (
          <div className="space-y-4">
            {applicantStatuses.map((s, i) => (
              <div key={s.key} className="rounded-lg border border-line-light p-4">
                <Field label="Durum" value={s.label} onChange={(val) => updStatus(i, { label: val })} />
                <div className="mt-3">
                  <Field label="Belgeler (her satır bir belge)" value={s.documents} onChange={(val) => updStatus(i, { documents: val })} textarea rows={4} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'documentGroups':
        return documentGroups.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı belge grubu yok.</p>
        ) : (
          <div className="space-y-4">
            {documentGroups.map((g, i) => (
              <div key={`${g.title}-${i}`} className="rounded-lg border border-line-light p-4">
                <Field label="Grup Başlığı" value={g.title} onChange={(val) => updGroup(i, { title: val })} />
                <div className="mt-3">
                  <Field label="Belgeler (her satır bir belge)" value={g.items} onChange={(val) => updGroup(i, { items: val })} textarea rows={4} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'process':
        return process.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı süreç adımı yok.</p>
        ) : (
          <div className="space-y-4">
            {process.map((s, i) => (
              <div key={`${s.title}-${i}`} className="rounded-lg border border-line-light p-4">
                <Field label={`Adım ${i + 1} Başlığı`} value={s.title} onChange={(val) => updProcess(i, { title: val })} />
                <div className="mt-3">
                  <Field label="Açıklama" value={s.description} onChange={(val) => updProcess(i, { description: val })} textarea />
                </div>
              </div>
            ))}
          </div>
        );
      case 'appointment':
        return (
          <div className="space-y-4">
            <Field label="Randevu Kanalı" value={appointment.channel} onChange={(v) => setAppointment((a) => ({ ...a, channel: v }))} />
            <Field label="Ortalama Bekleme Süresi" value={appointment.leadTime} onChange={(v) => setAppointment((a) => ({ ...a, leadTime: v }))} />
            <Field label="Not" value={appointment.note} onChange={(v) => setAppointment((a) => ({ ...a, note: v }))} textarea placeholder="Randevu hakkında bilgilendirme" />
            <StatusAlert tone="info">Resmi randevu sistemleriyle doğrudan entegrasyon yoktur.</StatusAlert>
          </div>
        );
      case 'fees':
        return (
          <div className="space-y-4">
            <Field label="Ücret & Kapsam Açıklaması" value={fees.note} onChange={(v) => setFees({ note: v })} textarea rows={5} placeholder="Hizmet kapsamı ve ücretlendirme bilgisi" />
            <StatusAlert tone="warning">Resmi konsolosluk harçları ayrıdır; kesin tutar taahhüdü vermeyin.</StatusAlert>
          </div>
        );
      case 'commonMistakes':
        return <Field label="Sık Yapılan Hatalar (her satır bir madde)" value={commonMistakes} onChange={setCommonMistakes} textarea rows={7} />;
      case 'rejection':
        return <Field label="Ret Sonrası Rehber (her satır bir madde)" value={rejection} onChange={setRejection} textarea rows={7} />;
      case 'faqs':
        return faqs.length === 0 ? (
          <p className="text-sm text-ink-muted">Tanımlı S.S.S. yok.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={`${f.question}-${i}`} className="rounded-lg border border-line-light p-4">
                <Field label="Soru" value={f.question} onChange={(val) => updFaq(i, { question: val })} />
                <div className="mt-3">
                  <Field label="Yanıt" value={f.answer} onChange={(val) => updFaq(i, { answer: val })} textarea />
                </div>
              </div>
            ))}
          </div>
        );
      case 'relatedServices':
        return <Field label="İlgili Hizmet Slugları (her satır bir slug)" value={relatedServices} onChange={setRelatedServices} textarea rows={6} />;
      case 'relatedGuides':
        return <Field label="İlgili Rehber Slugları (her satır bir slug)" value={relatedGuides} onChange={setRelatedGuides} textarea rows={6} placeholder="rehber-slug-1" />;
      case 'relatedCountries':
        return <Field label="İlgili Ülke Slugları (her satır bir slug)" value={relatedCountries} onChange={setRelatedCountries} textarea rows={6} />;
      case 'footerForm':
        return (
          <div className="space-y-4">
            <Field label="Form Başlığı" value={footerForm.heading} onChange={(v) => setFooterForm((f) => ({ ...f, heading: v }))} />
            <label className="block">
              <span className="field-label">Bağlı Form</span>
              <select value={footerForm.form} onChange={(e) => setFooterForm((f) => ({ ...f, form: e.target.value }))} className="field-input">
                <option value="default">Varsayılan Başvuru Formu</option>
                <option value="appointment">Randevu Talep Formu</option>
                <option value="callback">Geri Arama Formu</option>
              </select>
            </label>
          </div>
        );
      case 'legal':
        return (
          <div className="space-y-4">
            <Field label="Yasal Bilgilendirme Metni" value={legal} onChange={setLegal} textarea rows={6} />
            <StatusAlert tone="info">Resmi makamlarla bağlantı iması yapılmamalıdır.</StatusAlert>
          </div>
        );
      default:
        return null;
    }
  }

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? '';

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">Son güncelleme: {formatDateTr('2026-06-18')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={save} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <Save className="h-4 w-4" aria-hidden="true" />
            Taslağı Kaydet
          </button>
          <button type="button" onClick={preview} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Önizleme
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
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr_320px]">
        {/* LEFT — section list */}
        <nav aria-label="Sayfa bölümleri" className="rounded-card border border-line-light bg-white p-2 shadow-card lg:sticky lg:top-4 lg:self-start">
          <ul className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActive(s.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors',
                      isActive ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface hover:text-ink',
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CENTER — active section editor */}
        <section aria-label={`${activeLabel} düzenleyici`} className="rounded-card border border-line-light bg-white p-5 shadow-card">
          <h2 className="mb-4 font-heading text-base font-bold text-ink">{activeLabel}</h2>
          {renderEditor()}
        </section>

        {/* RIGHT — preview / checks / comments */}
        <aside aria-label="Önizleme ve kontroller" className="space-y-4">
          <Panel title="Önizleme">
            <div className="mb-3 inline-flex rounded-lg border border-line p-0.5">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                aria-pressed={device === 'desktop'}
                className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold', device === 'desktop' ? 'bg-navy text-white' : 'text-ink-soft')}
              >
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                Masaüstü
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                aria-pressed={device === 'mobile'}
                className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold', device === 'mobile' ? 'bg-navy text-white' : 'text-ink-soft')}
              >
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                Mobil
              </button>
            </div>
            <div className={cn('mx-auto overflow-hidden rounded-lg border border-line bg-admin', device === 'mobile' ? 'max-w-[220px]' : 'w-full')}>
              <div className="bg-navy p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">{hero.eyebrow || country.heroEyebrow}</p>
                <p className="mt-1 font-heading text-sm font-bold leading-snug">
                  <span aria-hidden="true">{codeToFlag(country.code)} </span>
                  {hero.title || country.name}
                </p>
                <p className="mt-1 line-clamp-3 text-[11px] text-white/80">{hero.description}</p>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-semibold text-ink">{activeLabel}</p>
                <p className="mt-1 line-clamp-4 text-[11px] text-ink-soft">
                  {active === 'hero' ? hero.description : active === 'commonMistakes' ? commonMistakes : active === 'rejection' ? rejection : 'Bu bölümün canlı önizlemesi.'}
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="İçerik Sağlığı">
            <HealthBar score={health} />
          </Panel>

          <Panel title="Riskli İfade Kontrolü">
            {riskyMatches.length === 0 ? (
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Sorun bulunamadı
              </p>
            ) : (
              <ul className="space-y-1.5">
                {riskyMatches.map((m) => (
                  <li key={m} className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    “{m}” — yasak iddia
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Yayın Kontrol Listesi">
            <ul className="space-y-2 text-sm">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                  )}
                  <span className={c.ok ? 'text-ink' : 'text-danger'}>{c.label}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Yorumlar">
            <ul className="space-y-3">
              <li className="text-sm">
                <p className="font-semibold text-ink">İçerik Yöneticisi <span className="ml-1 text-xs font-normal text-ink-muted">{formatDateTr('2026-06-15')}</span></p>
                <p className="text-ink-soft">Hero açıklamasını biraz kısaltabilir miyiz?</p>
              </li>
            </ul>
            <div className="mt-3 space-y-2">
              <label className="sr-only" htmlFor="new-comment">Yorum ekle</label>
              <textarea
                id="new-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Yorum ekle…"
                className="field-input py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (!comment.trim()) {
                    notify('Boş yorum eklenemez.', 'warning');
                    return;
                  }
                  notify('Yorum eklendi. (Demo)', 'success');
                  setComment('');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Gönder
              </button>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
