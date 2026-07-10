'use client';

import { AlertTriangle, History, Plus, Save, Send, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { deleteArticleAction, saveArticleAction } from '@/lib/admin/blog-actions';
import { Tabs } from '@/components/admin/ui/Tabs';
import { StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { Article } from '@/types/content';
import { formatDateTr } from '@/lib/utils';

const RISKY_RE = /garanti|%100|kesin|resmi vize|onay garanti/i;
const RISKY_G = /garanti|%100|kesin|resmi vize|onay garanti/gi;

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
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  placeholder?: string;
  showRisky?: boolean;
  type?: string;
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
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field-input" />
      )}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
      {showRisky && <RiskyChip text={value} />}
    </label>
  );
}

function SectionCard({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-bold text-ink">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  );
}

const lines = (arr: string[]) => arr.join('\n');
const toList = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);

interface EditableSection {
  id: string;
  heading: string;
  paragraphs: string; // newline-separated paragraphs
  bullets: string; // newline-separated
}

export function ArticleEditor({ article, canPublish }: { article: Article; canPublish: boolean }) {
  const { notify } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  // ---- İçerik ----
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [intro, setIntro] = useState(article.intro);
  const [sections, setSections] = useState<EditableSection[]>(
    article.sections.map((s, i) => ({
      id: `s-${i}`,
      heading: s.heading,
      paragraphs: lines(s.paragraphs),
      bullets: lines(s.bullets ?? []),
    })),
  );
  const updateSection = (id: string, patch: Partial<EditableSection>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const addSection = () =>
    setSections((prev) => [...prev, { id: `s-${Date.now()}`, heading: '', paragraphs: '', bullets: '' }]);
  const removeSection = (id: string) => setSections((prev) => prev.filter((s) => s.id !== id));

  // ---- S.S.S. ----
  const [faqs, setFaqs] = useState((article.faqs ?? []).map((f, i) => ({ id: `f-${i}`, question: f.question, answer: f.answer })));
  const updateFaq = (id: string, patch: Partial<{ question: string; answer: string }>) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const addFaq = () => setFaqs((prev) => [...prev, { id: `f-${Date.now()}`, question: '', answer: '' }]);
  const removeFaq = (id: string) => setFaqs((prev) => prev.filter((f) => f.id !== id));

  // ---- Kaynak & İnceleme ----
  const [sourceNotes, setSourceNotes] = useState('');
  const [lastReviewed, setLastReviewed] = useState(article.updatedAt.slice(0, 10));
  const [reviewerName, setReviewerName] = useState(article.reviewer?.name ?? '');
  const [reviewerRole, setReviewerRole] = useState(article.reviewer?.role ?? '');

  // ---- İlişkiler ----
  const [relatedCountries, setRelatedCountries] = useState(lines(article.relatedCountrySlugs ?? []));
  const [relatedServices, setRelatedServices] = useState(lines(article.relatedServiceSlugs ?? []));
  const [tags, setTags] = useState(lines(article.tags));

  // ---- SEO ----
  const [seoTitle, setSeoTitle] = useState(article.seo.title);
  const [seoDescription, setSeoDescription] = useState(article.seo.description);
  const [seoCanonical, setSeoCanonical] = useState(article.seo.canonical ?? '');

  // ---- Yayın & Planlama ----
  const [publishMode, setPublishMode] = useState<'draft' | 'scheduled' | 'publish'>(
    article.status === 'published' ? 'publish' : 'draft',
  );
  const [scheduledAt, setScheduledAt] = useState('');

  const riskyTexts = useMemo(() => {
    const all = [
      title,
      excerpt,
      intro,
      seoTitle,
      seoDescription,
      ...sections.flatMap((s) => [s.heading, s.paragraphs, s.bullets]),
      ...faqs.flatMap((f) => [f.question, f.answer]),
    ];
    return all.filter((t) => RISKY_RE.test(t));
  }, [title, excerpt, intro, seoTitle, seoDescription, sections, faqs]);

  const buildArticle = (status: Article['status']): Article => ({
    ...article,
    title,
    excerpt,
    intro,
    status,
    sections: sections.map((s) => ({
      heading: s.heading,
      paragraphs: toList(s.paragraphs),
      bullets: toList(s.bullets),
    })),
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    reviewer: reviewerName ? { name: reviewerName, role: reviewerRole } : undefined,
    relatedCountrySlugs: toList(relatedCountries),
    relatedServiceSlugs: toList(relatedServices),
    tags: toList(tags),
    seo: {
      ...article.seo,
      title: seoTitle,
      description: seoDescription,
      canonical: seoCanonical || undefined,
    },
    updatedAt: new Date().toISOString(),
  });

  const persist = async (status: Article['status'], successMsg: string): Promise<boolean> => {
    setBusy(true);
    const res = await saveArticleAction(buildArticle(status));
    setBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'Kaydedilemedi.', 'warning');
      return false;
    }
    notify(successMsg, 'success');
    router.refresh();
    return true;
  };

  const save = () =>
    void persist(article.status === 'published' ? 'published' : 'draft', `"${title}" kaydedildi.`);
  const submit = () => {
    if (riskyTexts.length > 0) {
      notify('Kaydetmeden önce riskli ifadeleri düzeltin.', 'warning');
      return;
    }
    void persist('draft', `"${title}" taslak olarak kaydedildi.`);
  };
  const publish = () => {
    if (!canPublish) {
      notify('Yayınlama yetkiniz yok.', 'warning');
      return;
    }
    if (riskyTexts.length > 0) {
      notify('Riskli ifadeler nedeniyle yayınlanamaz.', 'error');
      return;
    }
    void persist('published', `"${title}" yayınlandı.`);
  };
  const removeArticle = async () => {
    setBusy(true);
    const res = await deleteArticleAction(article.slug);
    setBusy(false);
    if (!res.ok) {
      notify(res.error ?? 'Silinemedi.', 'warning');
      return;
    }
    notify('Yazı silindi.', 'warning');
    router.push('/admin/blog');
  };

  const icerikTab = (
    <div className="space-y-4">
      <SectionCard title="Üst Bilgiler">
        <div className="space-y-4">
          <Field label="Başlık" value={title} onChange={setTitle} showRisky />
          <Field label="Özet (excerpt)" value={excerpt} onChange={setExcerpt} textarea showRisky />
          <Field label="Giriş (intro)" value={intro} onChange={setIntro} textarea rows={4} showRisky />
        </div>
      </SectionCard>

      <SectionCard
        title={`Bölümler (${sections.length})`}
        actions={
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Bölüm Ekle
          </button>
        }
      >
        {sections.length === 0 ? (
          <p className="text-sm text-ink-muted">Henüz bölüm yok. "Bölüm Ekle" ile yapılandırılmış içerik oluşturun.</p>
        ) : (
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-line-light p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-ink-muted">Bölüm {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSection(s.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger/5"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Kaldır
                  </button>
                </div>
                <div className="space-y-3">
                  <Field label="Başlık" value={s.heading} onChange={(v) => updateSection(s.id, { heading: v })} showRisky />
                  <Field
                    label="Paragraflar (her satır bir paragraf)"
                    value={s.paragraphs}
                    onChange={(v) => updateSection(s.id, { paragraphs: v })}
                    textarea
                    rows={5}
                    showRisky
                  />
                  <Field
                    label="Madde işaretleri (opsiyonel, her satır bir madde)"
                    value={s.bullets}
                    onChange={(v) => updateSection(s.id, { bullets: v })}
                    textarea
                    rows={3}
                    showRisky
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-ink-muted">
          İçerik yapılandırılmış alanlarda tutulur (ham HTML kullanılmaz); bu sayede güvenli ve tutarlı şekilde render edilir.
        </p>
      </SectionCard>
    </div>
  );

  const sssTab = (
    <SectionCard
      title={`S.S.S. (${faqs.length})`}
      actions={
        <button
          type="button"
          onClick={addFaq}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Soru Ekle
        </button>
      }
    >
      {faqs.length === 0 ? (
        <p className="text-sm text-ink-muted">Bu yazıya bağlı sık sorulan soru yok.</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-line-light p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-ink-muted">Soru {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeFaq(f.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger/5"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Kaldır
                </button>
              </div>
              <div className="space-y-3">
                <Field label="Soru" value={f.question} onChange={(v) => updateFaq(f.id, { question: v })} showRisky />
                <Field label="Yanıt" value={f.answer} onChange={(v) => updateFaq(f.id, { answer: v })} textarea showRisky />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );

  const kaynakTab = (
    <div className="space-y-4">
      <StatusAlert tone="info" title="Güvenilirlik">
        Kaynakları ve son inceleme tarihini belgeleyin. İnceleyen kişi için yalnızca gerçek bilgileri girin; unvan veya yetkinlik uydurmayın.
      </StatusAlert>
      <SectionCard title="Kaynak Notları">
        <Field
          label="Kaynaklar / referanslar (her satır bir kaynak)"
          value={sourceNotes}
          onChange={setSourceNotes}
          textarea
          rows={5}
          placeholder="Örn. Resmî konsolosluk duyuru bağlantısı, mevzuat referansı…"
          hint="Yalnızca doğrulanabilir, resmî kaynaklara bağlantı verin."
        />
      </SectionCard>
      <SectionCard title="İnceleme">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Son İnceleme Tarihi" value={lastReviewed} onChange={setLastReviewed} type="date" />
          <Field label="İnceleyen (Ad Soyad)" value={reviewerName} onChange={setReviewerName} placeholder="Boş bırakılabilir" />
          <Field label="İnceleyen Rolü" value={reviewerRole} onChange={setReviewerRole} placeholder="Örn. İçerik Editörü" />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          İnceleyen unvanı yalnızca gerçek ve doğrulanmış olduğunda gösterilmelidir; uzmanlık iddiası uydurmayın.
        </p>
      </SectionCard>
    </div>
  );

  const iliskilerTab = (
    <div className="space-y-4">
      <SectionCard title="İlgili Ülkeler">
        <Field label="Ülke slug listesi (her satır bir slug)" value={relatedCountries} onChange={setRelatedCountries} textarea rows={4} />
      </SectionCard>
      <SectionCard title="İlgili Hizmetler">
        <Field label="Hizmet slug listesi (her satır bir slug)" value={relatedServices} onChange={setRelatedServices} textarea rows={4} />
      </SectionCard>
      <SectionCard title="Etiketler">
        <Field label="Etiketler (her satır bir etiket)" value={tags} onChange={setTags} textarea rows={4} hint={`${toList(tags).length} etiket`} />
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
        <Field label="Canonical (path)" value={seoCanonical} onChange={setSeoCanonical} placeholder="/blog/schengen-vize-hatalari" />
      </div>
    </SectionCard>
  );

  const yayinTab = (
    <div className="space-y-4">
      <SectionCard title="Yayın Durumu">
        <div className="flex flex-wrap items-center gap-3">
          <WorkflowBadge state={article.status === 'published' ? 'published' : article.status === 'archived' ? 'archived' : 'draft'} />
          <span className="text-sm text-ink-soft">Son güncelleme: {formatDateTr(article.updatedAt)}</span>
        </div>
      </SectionCard>
      <SectionCard title="Yayın Modu">
        <fieldset className="space-y-2">
          <legend className="field-label">Mod seçin</legend>
          {[
            { v: 'draft' as const, label: 'Taslak olarak tut' },
            { v: 'scheduled' as const, label: 'İleri tarihe planla' },
            { v: 'publish' as const, label: 'Hemen yayınla' },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="publish-mode"
                checked={publishMode === o.v}
                onChange={() => setPublishMode(o.v)}
                className="h-4 w-4 accent-navy"
              />
              {o.label}
            </label>
          ))}
        </fieldset>
        {publishMode === 'scheduled' && (
          <div className="mt-4">
            <Field label="Planlanan Tarih" value={scheduledAt} onChange={setScheduledAt} type="date" />
          </div>
        )}
      </SectionCard>
      <SectionCard title="Yayın Kontrol Listesi">
        <ul className="space-y-2 text-sm">
          {[
            { ok: title.trim().length > 0, label: 'Başlık dolu' },
            { ok: intro.trim().length > 0, label: 'Giriş dolu' },
            { ok: sections.length > 0, label: 'En az bir bölüm tanımlı' },
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
    { id: 'v3', label: 'Taslak güncellendi', actor: article.author.name, at: article.updatedAt, state: 'draft' as const },
    { id: 'v2', label: 'Yayınlandı', actor: 'İçerik Yöneticisi', at: article.publishedAt, state: 'published' as const },
    { id: 'v1', label: 'Oluşturuldu', actor: article.author.name, at: article.publishedAt, state: 'draft' as const },
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
          onClick={removeArticle}
          disabled={busy}
          className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3.5 py-2 text-sm font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Sil
        </button>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Kaydet
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Taslak Kaydet
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={!canPublish || busy}
          title={canPublish ? undefined : 'Yayınlama yetkiniz yok'}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-white hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Yayınla
        </button>
      </div>

      <Tabs
        ariaLabel="Yazı düzenleme sekmeleri"
        tabs={[
          { id: 'icerik', label: 'İçerik', content: icerikTab },
          { id: 'sss', label: 'S.S.S.', count: faqs.length, content: sssTab },
          { id: 'kaynak', label: 'Kaynak & İnceleme', content: kaynakTab },
          { id: 'iliskiler', label: 'İlişkiler', content: iliskilerTab },
          { id: 'seo', label: 'SEO', content: seoTab },
          { id: 'yayin', label: 'Yayın & Planlama', content: yayinTab },
          { id: 'surumler', label: 'Sürümler', content: surumlerTab },
        ]}
      />

      <p className="text-xs text-ink-muted">
        <StatusBadge label="Demo" tone="neutral" /> Değişiklikler bu önizleme ortamında kalıcı olarak kaydedilmez.
      </p>
    </div>
  );
}
