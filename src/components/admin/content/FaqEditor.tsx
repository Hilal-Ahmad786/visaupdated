'use client';

import { AlertTriangle, CheckCircle2, Info, Save, Send, Upload } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { StatusBadge, WorkflowBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import type { FaqCategory, FaqItem } from '@/types/content';
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

export function FaqEditor({
  faq,
  categories,
  canPublish,
}: {
  faq: FaqItem;
  categories: FaqCategory[];
  canPublish: boolean;
}) {
  const { notify } = useToast();

  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [category, setCategory] = useState(faq.category);

  // Visibility contexts
  const [visibility, setVisibility] = useState<'general' | 'scoped'>(
    (faq.relatedCountrySlugs?.length ?? 0) > 0 || (faq.relatedServiceSlugs?.length ?? 0) > 0 ? 'scoped' : 'general',
  );
  const [relatedCountries, setRelatedCountries] = useState(lines(faq.relatedCountrySlugs ?? []));
  const [relatedServices, setRelatedServices] = useState(lines(faq.relatedServiceSlugs ?? []));

  // Source verification
  const [sourceUrl, setSourceUrl] = useState('');
  const [lastVerified, setLastVerified] = useState('');
  const [verified, setVerified] = useState(false);

  const riskyTexts = useMemo(() => [question, answer].filter((t) => RISKY_RE.test(t)), [question, answer]);

  const hasAnswer = answer.trim().length > 0;
  const schemaEligible = faq.status === 'published' && hasAnswer;

  const countryCount = toList(relatedCountries).length;
  const conditionalHint = visibility === 'general' && countryCount === 0;

  const save = () => notify('S.S.S. taslağı kaydedildi. (Demo)', 'success');
  const submit = () => {
    if (riskyTexts.length > 0) {
      notify('İncelemeye göndermeden önce riskli ifadeleri düzeltin.', 'warning');
      return;
    }
    notify('Soru incelemeye gönderildi. (Demo)', 'info');
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
    if (!hasAnswer) {
      notify('Yanıt boşken yayınlanamaz.', 'warning');
      return;
    }
    notify('Soru yayınlandı. (Demo)', 'success');
  };

  return (
    <div className="space-y-4">
      {riskyTexts.length > 0 && (
        <StatusAlert tone="error" title="Riskli ifadeler tespit edildi">
          Soru veya yanıtta yasak iddia (garanti/%100/kesin/resmi vize/onay garanti) bulundu. Yayınlamadan önce düzeltilmelidir.
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

      <SectionCard title="Soru ve Yanıt">
        <div className="space-y-4">
          <label className="block">
            <span className="field-label">Soru</span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="field-input py-3 leading-relaxed"
            />
            <RiskyChip text={question} />
          </label>
          <label className="block">
            <span className="field-label">Yanıt (yapılandırılmış metin)</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="field-input py-3 leading-relaxed"
              placeholder="Net, doğrulanabilir ve resmi makamlara dayalı bir yanıt yazın."
            />
            <RiskyChip text={answer} />
          </label>
          <label className="block">
            <span className="field-label">Kategori</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field-input">
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Görünürlük Bağlamı">
        <fieldset className="space-y-2">
          <legend className="field-label">Bu yanıt nerede geçerli?</legend>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="faq-visibility"
              checked={visibility === 'general'}
              onChange={() => setVisibility('general')}
              className="h-4 w-4 accent-navy"
            />
            Genel (tüm bağlamlarda gösterilir)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="faq-visibility"
              checked={visibility === 'scoped'}
              onChange={() => setVisibility('scoped')}
              className="h-4 w-4 accent-navy"
            />
            Ülke / hizmet bağlamına özel
          </label>
        </fieldset>

        {visibility === 'scoped' && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">İlgili Ülkeler (her satır bir slug)</span>
              <textarea
                value={relatedCountries}
                onChange={(e) => setRelatedCountries(e.target.value)}
                rows={4}
                className="field-input py-3 leading-relaxed"
              />
            </label>
            <label className="block">
              <span className="field-label">İlgili Hizmetler (her satır bir slug)</span>
              <textarea
                value={relatedServices}
                onChange={(e) => setRelatedServices(e.target.value)}
                rows={4}
                className="field-input py-3 leading-relaxed"
              />
            </label>
          </div>
        )}

        {conditionalHint && (
          <StatusAlert tone="info" title="Koşullu yanıtlar">
            Yanıt ülkeye göre değişiyorsa tek bir genel metin kullanmayın. Görünürlüğü "ülke / hizmet bağlamına özel" yapıp
            her bağlam için ayrı, doğru yanıt tanımlayın.
          </StatusAlert>
        )}
      </SectionCard>

      <SectionCard title="Kaynak Doğrulama">
        <div className="space-y-4">
          <label className="block">
            <span className="field-label">Kaynak / referans bağlantısı</span>
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Resmî konsolosluk veya mevzuat bağlantısı"
              className="field-input"
            />
            <span className="mt-1 block text-xs text-ink-muted">Yalnızca doğrulanabilir, resmî kaynaklara bağlantı verin.</span>
          </label>
          <label className="block">
            <span className="field-label">Son Doğrulama Tarihi</span>
            <input type="date" value={lastVerified} onChange={(e) => setLastVerified(e.target.value)} className="field-input" />
            {lastVerified && <span className="mt-1 block text-xs text-ink-muted">Doğrulandı: {formatDateTr(lastVerified)}</span>}
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="h-4 w-4 rounded border-line accent-navy" />
            Bu yanıt güncel ve resmi bir kaynakla doğrulandı
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Durum ve Schema Uygunluğu">
        <div className="flex flex-wrap items-center gap-3">
          <WorkflowBadge state={faq.status === 'published' ? 'published' : faq.status === 'archived' ? 'archived' : 'draft'} />
          {schemaEligible ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              FAQ Schema'ya uygun
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Schema için yayında olmalı ve dolu bir yanıt içermeli
            </span>
          )}
        </div>
        {!canPublish && (
          <div className="mt-4">
            <StatusAlert tone="warning" title="Yayınlama yetkisi yok">
              İçeriği yayınlayamazsınız; ancak taslağı kaydedip incelemeye gönderebilirsiniz.
            </StatusAlert>
          </div>
        )}
      </SectionCard>

      <p className="text-xs text-ink-muted">
        <StatusBadge label="Demo" tone="neutral" /> Değişiklikler bu önizleme ortamında kalıcı olarak kaydedilmez.
      </p>
    </div>
  );
}
