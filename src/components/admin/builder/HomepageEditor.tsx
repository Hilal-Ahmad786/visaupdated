'use client';

import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  RotateCcw,
  Save,
  Send,
  Smartphone,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { generalSettings } from '@/lib/data/mock-settings';
import { cn } from '@/lib/utils';

type SourceMode = 'manual' | 'auto' | 'hybrid';

type SelectorKind = 'countries' | 'services' | 'articles' | 'faqs';

type SectionId =
  | 'announcement'
  | 'hero'
  | 'trust'
  | 'popular_countries'
  | 'services'
  | 'process'
  | 'why'
  | 'appointment'
  | 'featured_guides'
  | 'faq'
  | 'phone_cta'
  | 'bottom_form'
  | 'legal'
  | 'campaign';

interface SectionConfig {
  id: SectionId;
  label: string;
  description: string;
  sourceable: boolean;
  selector?: SelectorKind;
  special?: 'hero' | 'phone' | 'legal';
  locked?: boolean;
  defaultVisible: boolean;
}

const SECTIONS: SectionConfig[] = [
  { id: 'announcement', label: 'Duyuru Çubuğu', description: 'Sayfanın en üstünde ince bilgilendirme şeridi.', sourceable: true, defaultVisible: false },
  { id: 'hero', label: 'Hero', description: 'Ana başlık, alt başlık ve birincil çağrı.', sourceable: false, special: 'hero', defaultVisible: true },
  { id: 'trust', label: 'Güven Mesajları', description: 'Kısa güven/itibar rozetleri.', sourceable: false, defaultVisible: true },
  { id: 'popular_countries', label: 'Popüler Ülkeler', description: 'Öne çıkan ülke kartları.', sourceable: true, selector: 'countries', defaultVisible: true },
  { id: 'services', label: 'Hizmetler', description: 'Sunulan hizmetlerin listesi.', sourceable: true, selector: 'services', defaultVisible: true },
  { id: 'process', label: 'Süreç', description: 'Adım adım nasıl çalıştığımız.', sourceable: false, defaultVisible: true },
  { id: 'why', label: 'Neden VİS VİZE', description: 'Farklılaştırıcı değer önermeleri.', sourceable: false, defaultVisible: true },
  { id: 'appointment', label: 'Randevu Desteği', description: 'Randevu desteği bilgilendirmesi.', sourceable: false, defaultVisible: true },
  { id: 'featured_guides', label: 'Öne Çıkan Rehberler', description: 'Blog/rehber içeriklerinden seçki.', sourceable: true, selector: 'articles', defaultVisible: true },
  { id: 'faq', label: 'S.S.S. Önizleme', description: 'Sık sorulan soruların kısa listesi.', sourceable: true, selector: 'faqs', defaultVisible: true },
  { id: 'phone_cta', label: 'Telefon CTA', description: 'Telefonla iletişim çağrısı.', sourceable: false, special: 'phone', defaultVisible: true },
  { id: 'bottom_form', label: 'Alt Form', description: 'Sayfa sonundaki ön başvuru formu.', sourceable: false, defaultVisible: true },
  { id: 'legal', label: 'Yasal Bilgilendirme', description: 'Zorunlu yasal uyarı — kaldırılamaz.', sourceable: false, special: 'legal', locked: true, defaultVisible: true },
  { id: 'campaign', label: 'Kampanya', description: 'Süreli kampanya/şerit (isteğe bağlı).', sourceable: true, defaultVisible: false },
];

const SOURCE_LABELS: Record<SourceMode, string> = { manual: 'Manuel', auto: 'Otomatik', hybrid: 'Hibrit' };

export function HomepageEditor({
  canPublish,
  options,
}: {
  canPublish: boolean;
  options: {
    countries: { slug: string; name: string; popular: boolean }[];
    services: { slug: string; name: string; popular: boolean }[];
    articles: { slug: string; title: string; featured: boolean }[];
    faqs: { slug: string; question: string }[];
  };
}) {
  const { notify } = useToast();

  const [order, setOrder] = useState<SectionId[]>(SECTIONS.map((s) => s.id));
  const [visible, setVisible] = useState<Record<SectionId, boolean>>(
    () => Object.fromEntries(SECTIONS.map((s) => [s.id, s.defaultVisible])) as Record<SectionId, boolean>,
  );
  const [source, setSource] = useState<Record<SectionId, SourceMode>>(
    () => Object.fromEntries(SECTIONS.map((s) => [s.id, s.sourceable ? 'auto' : 'manual'])) as Record<SectionId, SourceMode>,
  );
  const [selected, setSelected] = useState<SectionId>('hero');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [dirty, setDirty] = useState(false);

  const [hero, setHero] = useState({
    headline: 'Vize başvurunuzu güvenle yönetin',
    subtitle: 'Randevu ve başvuru sürecinizde uçtan uca destek.',
    cta: 'Ücretsiz Ön Değerlendirme',
  });

  const [picks, setPicks] = useState<Record<SelectorKind, string[]>>({
    countries: options.countries.filter((c) => c.popular).map((c) => c.slug),
    services: options.services.filter((s) => s.popular).map((s) => s.slug),
    articles: options.articles.filter((a) => a.featured).map((a) => a.slug),
    faqs: options.faqs.slice(0, 6).map((f) => f.slug),
  });

  const cfgById = useMemo(() => Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<SectionId, SectionConfig>, []);
  const orderedConfigs = order.map((id) => cfgById[id]);
  const selectedCfg = cfgById[selected];

  const touch = () => setDirty(true);

  const toggleVisible = (id: SectionId) => {
    const cfg = cfgById[id];
    if (cfg.locked) {
      notify('Yasal bilgilendirme bölümü zorunludur ve gizlenemez.', 'warning');
      return;
    }
    setVisible((v) => ({ ...v, [id]: !v[id] }));
    touch();
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const copy = [...prev];
      const a = copy[index];
      const b = copy[to];
      if (a === undefined || b === undefined) return prev;
      copy[index] = b;
      copy[to] = a;
      return copy;
    });
    touch();
  };

  const setSourceMode = (id: SectionId, mode: SourceMode) => {
    setSource((s) => ({ ...s, [id]: mode }));
    touch();
  };

  const togglePick = (kind: SelectorKind, slug: string) => {
    setPicks((p) => {
      const cur = p[kind];
      const next = cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug];
      return { ...p, [kind]: next };
    });
    touch();
  };

  const saveDraft = () => {
    setDirty(false);
    notify('Ana sayfa taslağı kaydedildi. (Demo)', 'success');
  };

  const publish = () => {
    if (!canPublish) {
      notify('Ana sayfayı yayınlama yetkiniz yok.', 'warning');
      return;
    }
    setDirty(false);
    notify('Ana sayfa yayınlandı. Değişiklikler canlıda. (Demo)', 'success');
  };

  const rollback = () => notify('Acil geri alma tetiklendi — son yayınlanan sürüme dönülüyor. (Demo)', 'warning');

  // ----- selector picker -----
  const selectorItems = (kind: SelectorKind): { slug: string; label: string }[] => {
    if (kind === 'countries') return options.countries.map((c) => ({ slug: c.slug, label: c.name }));
    if (kind === 'services') return options.services.map((s) => ({ slug: s.slug, label: s.name }));
    if (kind === 'articles') return options.articles.map((a) => ({ slug: a.slug, label: a.title }));
    return options.faqs.map((f) => ({ slug: f.slug, label: f.question }));
  };

  const renderSettings = () => {
    if (selectedCfg.special === 'hero') {
      return (
        <div className="space-y-4">
          <label className="block">
            <span className="field-label">Ana başlık</span>
            <input value={hero.headline} onChange={(e) => { setHero((h) => ({ ...h, headline: e.target.value })); touch(); }} className="field-input" />
          </label>
          <label className="block">
            <span className="field-label">Alt başlık</span>
            <input value={hero.subtitle} onChange={(e) => { setHero((h) => ({ ...h, subtitle: e.target.value })); touch(); }} className="field-input" />
          </label>
          <label className="block">
            <span className="field-label">Çağrı (CTA) metni</span>
            <input value={hero.cta} onChange={(e) => { setHero((h) => ({ ...h, cta: e.target.value })); touch(); }} className="field-input" />
          </label>
          <p className="text-xs text-ink-muted">Çağrı butonu varsayılan ön başvuru formuna yönlenir.</p>
        </div>
      );
    }

    if (selectedCfg.special === 'phone') {
      return (
        <StatusAlert tone="info" title="Telefon kaynağı">
          Telefon numarası genel ayarlardan gelir:{' '}
          <span className="font-semibold text-ink">{generalSettings.phoneDisplay}</span>. Numarayı değiştirmek için Ayarlar bölümünü kullanın.
        </StatusAlert>
      );
    }

    if (selectedCfg.special === 'legal') {
      return (
        <div className="space-y-3">
          <StatusAlert tone="warning" title="Kilitli bölüm">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Bu bölüm yasal olarak zorunludur; gizlenemez ve içeriği serbestçe değiştirilemez.
            </span>
          </StatusAlert>
          <label className="block">
            <span className="field-label">Yasal uyarı metni</span>
            <textarea value={generalSettings.legalDisclaimer} readOnly rows={4} className="field-input cursor-not-allowed bg-surface text-xs text-ink-soft" />
          </label>
        </div>
      );
    }

    if (selectedCfg.selector) {
      const kind = selectedCfg.selector;
      const items = selectorItems(kind);
      const chosen = picks[kind];
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="field-label mb-0">İçerik seçimi</span>
            <StatusBadge label={`${chosen.length} seçili`} tone={chosen.length > 0 ? 'gold' : 'neutral'} />
          </div>
          {source[selectedCfg.id] === 'auto' && (
            <p className="text-xs text-ink-muted">Otomatik modda seçim sistemce yönetilir. Manuel/Hibrit moda geçerek elle seçim yapabilirsiniz.</p>
          )}
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-line-light p-2">
            {items.map((it) => {
              const isOn = chosen.includes(it.slug);
              const disabled = source[selectedCfg.id] === 'auto';
              return (
                <label
                  key={it.slug}
                  className={cn('flex items-start gap-2 rounded px-2 py-1.5 text-sm', disabled ? 'opacity-50' : 'cursor-pointer hover:bg-surface')}
                >
                  <input type="checkbox" checked={isOn} disabled={disabled} onChange={() => togglePick(kind, it.slug)} className="mt-0.5 h-4 w-4 accent-navy" />
                  <span className="text-ink">{it.label}</span>
                </label>
              );
            })}
            {items.length === 0 && <p className="px-2 py-3 text-xs text-ink-muted">Seçilebilir içerik yok.</p>}
          </div>
        </div>
      );
    }

    return (
      <StatusAlert tone="info">
        Bu bölümün içeriği merkezi olarak yönetilir. Buradan görünürlüğünü ve sırasını ayarlayabilirsiniz.
      </StatusAlert>
    );
  };

  const visibleOrdered = orderedConfigs.filter((c) => visible[c.id]);

  return (
    <div className="space-y-4">
      {/* top actions */}
      <div className="flex flex-col gap-3 rounded-card border border-line-light bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-line p-0.5" role="group" aria-label="Önizleme cihazı">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              aria-pressed={device === 'desktop'}
              className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold', device === 'desktop' ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface')}
            >
              <Monitor className="h-3.5 w-3.5" /> Masaüstü
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              aria-pressed={device === 'mobile'}
              className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold', device === 'mobile' ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface')}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobil
            </button>
          </div>
          {dirty && <StatusBadge label="Kaydedilmemiş değişiklik" tone="warning" />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={rollback} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <RotateCcw className="h-4 w-4" /> Acil Geri Al
          </button>
          <button type="button" onClick={saveDraft} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <Save className="h-4 w-4" /> Taslağı Kaydet
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={!canPublish}
            title={canPublish ? undefined : 'Yayınlama yetkiniz yok'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Yayınla
          </button>
        </div>
      </div>

      <StatusAlert tone="info" title="Taslak / Canlı">
        Değişiklikler önce taslağa kaydedilir; "Yayınla" ile canlıya alınır. Bu düzenleyici yalnızca onaylı bölümleri yönetir — keyfi bölüm eklenemez.
      </StatusAlert>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* LEFT: section list */}
        <div className="space-y-2">
          {orderedConfigs.map((cfg, i) => (
            <div
              key={cfg.id}
              className={cn(
                'rounded-card border bg-white p-3 shadow-card transition-colors',
                selected === cfg.id ? 'border-navy' : 'border-line-light',
              )}
            >
              <div className="flex items-start gap-2">
                <button type="button" onClick={() => setSelected(cfg.id)} className="flex-1 text-left">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-ink">{cfg.label}</span>
                    {cfg.locked && <Lock className="h-3 w-3 text-ink-muted" aria-label="Kilitli" />}
                    {!visible[cfg.id] && <StatusBadge label="Gizli" tone="neutral" />}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{cfg.description}</span>
                </button>
                <div className="flex flex-col gap-0.5">
                  <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label={`${cfg.label} bölümünü yukarı taşı`} className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => moveSection(i, 1)} disabled={i === order.length - 1} aria-label={`${cfg.label} bölümünü aşağı taşı`} className="rounded p-0.5 text-ink-muted hover:bg-surface disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleVisible(cfg.id)}
                  aria-pressed={visible[cfg.id]}
                  disabled={cfg.locked}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50',
                    visible[cfg.id] ? 'border-success/30 text-success' : 'border-line text-ink-soft',
                  )}
                >
                  {visible[cfg.id] ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {visible[cfg.id] ? 'Görünür' : 'Gizli'}
                </button>
                {cfg.sourceable && (
                  <label className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                    <span className="sr-only">{cfg.label} içerik kaynağı</span>
                    Kaynak:
                    <select
                      value={source[cfg.id]}
                      onChange={(e) => setSourceMode(cfg.id, e.target.value as SourceMode)}
                      className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold text-ink focus:border-navy focus:outline-none"
                    >
                      {(['manual', 'auto', 'hybrid'] as SourceMode[]).map((m) => (
                        <option key={m} value={m}>
                          {SOURCE_LABELS[m]}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: settings + preview */}
        <div className="space-y-4">
          <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-heading text-base font-bold text-ink">{selectedCfg.label}</h3>
              <StatusBadge label={visible[selected] ? 'Görünür' : 'Gizli'} tone={visible[selected] ? 'success' : 'neutral'} />
            </div>
            {renderSettings()}
          </div>

          <div className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <h3 className="mb-3 font-heading text-sm font-bold text-ink">Önizleme — {device === 'desktop' ? 'Masaüstü' : 'Mobil'}</h3>
            <div className={cn('mx-auto space-y-1.5 rounded-xl border border-line bg-surface/40 p-3 transition-all', device === 'mobile' ? 'max-w-xs' : 'max-w-full')}>
              {visibleOrdered.map((cfg, i) => (
                <div key={cfg.id} className="flex items-center gap-2 rounded-lg border border-line-light bg-white px-3 py-2 text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-surface text-[11px] font-bold text-gold">{i + 1}</span>
                  <span className="font-semibold text-ink">{cfg.label}</span>
                  {cfg.sourceable && <StatusBadge label={SOURCE_LABELS[source[cfg.id]]} tone="info" />}
                  {cfg.locked && <Lock className="ml-auto h-3 w-3 text-ink-muted" aria-hidden="true" />}
                </div>
              ))}
              {visibleOrdered.length === 0 && <p className="py-4 text-center text-xs text-ink-muted">Görünür bölüm yok.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
