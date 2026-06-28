'use client';

import {
  AtSign,
  Bell,
  Building2,
  Clock,
  Cog,
  Globe,
  Image as ImageIcon,
  Languages,
  Lock,
  type LucideIcon,
  Megaphone,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Tag,
  Wrench,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { PageHeader } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { cn } from '@/lib/utils';
import type { GeneralSettings } from '@/types/admin';

interface FormOption {
  id: string;
  name: string;
}

interface CategoryDef {
  id: string;
  label: string;
  icon: LucideIcon;
}

const categories: CategoryDef[] = [
  { id: 'general', label: 'Genel', icon: Cog },
  { id: 'brand', label: 'Marka', icon: Sparkles },
  { id: 'contact', label: 'İletişim', icon: AtSign },
  { id: 'hours', label: 'Çalışma Saatleri', icon: Clock },
  { id: 'company', label: 'Şirket Bilgileri', icon: Building2 },
  { id: 'cta', label: "Global CTA'lar", icon: Megaphone },
  { id: 'forms', label: 'Varsayılan Formlar', icon: Settings2 },
  { id: 'locale', label: 'Dil & Yerel', icon: Languages },
  { id: 'seo', label: 'SEO Varsayılanları', icon: Tag },
  { id: 'social', label: 'Sosyal Medya', icon: Globe },
  { id: 'legal', label: 'Yasal & Gizlilik', icon: ShieldCheck },
  { id: 'email', label: 'E-posta & Bildirim', icon: Bell },
  { id: 'search', label: 'Arama', icon: Search },
  { id: 'media', label: 'Medya', icon: ImageIcon },
  { id: 'application', label: 'Başvuru Varsayılanları', icon: Settings2 },
  { id: 'features', label: 'Özellikler', icon: Sparkles },
  { id: 'maintenance', label: 'Bakım', icon: Wrench },
  { id: 'security', label: 'Güvenlik', icon: Lock },
];

/** Labelled text field. */
function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  type = 'text',
  placeholder,
  hint,
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className="field-input min-h-[88px] py-2 !text-sm disabled:opacity-60"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
        />
      )}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-card border border-line-light bg-white p-4 shadow-card">
      <div>
        <p className="font-heading text-sm font-semibold text-ink">{label}</p>
        {description && <p className="mt-0.5 text-xs text-ink-soft">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        disabled={disabled}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-success' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-line-light bg-white p-5 shadow-card">
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export function GeneralSettingsForm({
  settings,
  forms,
  canManage,
}: {
  settings: GeneralSettings;
  forms: FormOption[];
  canManage: boolean;
}) {
  const { notify } = useToast();
  const [active, setActive] = useState('general');

  // Source-of-truth values, prefilled from settings.
  const [form, setForm] = useState({
    brandShort: settings.brandShort,
    brandFull: settings.brandFull,
    phoneDisplay: settings.phoneDisplay,
    phoneE164: settings.phoneE164,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    defaultFormId: settings.defaultFormId,
    seoTitleTemplate: settings.seoTitleTemplate,
    legalDisclaimer: settings.legalDisclaimer,
    metaDescription: 'Türkiye geneli online vize randevu ve danışmanlık hizmetleri.',
    locale: 'tr-TR',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    notifyEmail: settings.email,
    ctaPrimaryLabel: 'Ücretsiz Ön Başvuru',
    ctaSecondaryLabel: 'WhatsApp ile Yaz',
    searchPlaceholder: 'Ülke veya hizmet ara…',
    mediaMaxMb: '8',
    appDefaultStatus: 'Yeni',
    legalCompany: settings.brandFull,
  });
  const [workingHours, setWorkingHours] = useState(settings.workingHours.map((h) => ({ ...h })));
  const [social, setSocial] = useState(settings.social.map((s) => ({ ...s })));

  const [features, setFeatures] = useState({
    blog: true,
    liveChat: false,
    announcement: false,
    multiCurrency: false,
  });
  const [maintenance, setMaintenance] = useState(false);
  const [security, setSecurity] = useState({ twoFactor: true, ipAllowlist: false });

  const set = (key: keyof typeof form, v: string) => setForm((p) => ({ ...p, [key]: v }));

  const requireManage = (action: () => void) => {
    if (!canManage) {
      notify('Ayarları değiştirme yetkiniz yok.', 'warning');
      return;
    }
    action();
  };

  const onSave = () =>
    requireManage(() => {
      const cat = categories.find((c) => c.id === active)?.label ?? 'Ayarlar';
      notify(`${cat} ayarları kaydedildi. (Demo)`, 'success');
    });

  const lockNote = (
    <p className="text-xs text-ink-muted">
      Bu alan sitenin tamamında tek doğru kaynak olarak kullanılır.
    </p>
  );

  const renderPanel = () => {
    switch (active) {
      case 'general':
        return (
          <Section title="Genel" description="Sitenin temel kimliği.">
            <Field id="brandShort" label="Kısa Marka Adı" value={form.brandShort} onChange={(v) => set('brandShort', v)} disabled={!canManage} />
            <Field id="brandFull" label="Tam Marka Adı" value={form.brandFull} onChange={(v) => set('brandFull', v)} disabled={!canManage} />
            <Field id="metaDescription" label="Site Açıklaması" value={form.metaDescription} onChange={(v) => set('metaDescription', v)} disabled={!canManage} textarea />
          </Section>
        );
      case 'brand':
        return (
          <Section title="Marka" description="Logo ve marka adları (site genelinde kullanılır).">
            <Field id="b-short" label="Kısa Ad" value={form.brandShort} onChange={(v) => set('brandShort', v)} disabled={!canManage} />
            <Field id="b-full" label="Tam Ad" value={form.brandFull} onChange={(v) => set('brandFull', v)} disabled={!canManage} />
            <div>
              <span className="field-label">Logo</span>
              <div className="flex items-center gap-3 rounded-card border border-dashed border-line bg-surface p-4">
                <ImageIcon className="h-8 w-8 text-ink-muted" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-ink">logo.svg</p>
                  <p className="text-xs text-ink-muted">SVG/PNG, en fazla 1MB. Footer ve başlıkta kullanılır.</p>
                </div>
                <button
                  type="button"
                  onClick={() => requireManage(() => notify('Logo yükleme demo modunda. (Demo)', 'info'))}
                  disabled={!canManage}
                  className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-50"
                >
                  Değiştir
                </button>
              </div>
              {lockNote}
            </div>
          </Section>
        );
      case 'contact':
        return (
          <Section title="İletişim" description="Telefon, WhatsApp ve e-posta — site genelinde tek kaynak.">
            <Field id="phoneDisplay" label="Telefon (görünen)" value={form.phoneDisplay} onChange={(v) => set('phoneDisplay', v)} disabled={!canManage} hint="Örn. 0850 000 00 00" />
            <Field id="phoneE164" label="Telefon (E.164)" value={form.phoneE164} onChange={(v) => set('phoneE164', v)} disabled={!canManage} placeholder="+908500000000" />
            <Field id="whatsapp" label="WhatsApp" value={form.whatsapp} onChange={(v) => set('whatsapp', v)} disabled={!canManage} />
            <Field id="email" label="E-posta" type="email" value={form.email} onChange={(v) => set('email', v)} disabled={!canManage} />
            <Field id="address" label="Adres" value={form.address} onChange={(v) => set('address', v)} disabled={!canManage} textarea />
            {lockNote}
          </Section>
        );
      case 'hours':
        return (
          <Section title="Çalışma Saatleri" description="Footer ve iletişim sayfasında gösterilir.">
            <div className="space-y-3">
              {workingHours.map((h, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor={`wh-label-${i}`}>
                      Gün
                    </label>
                    <input
                      id={`wh-label-${i}`}
                      type="text"
                      value={h.label}
                      onChange={(e) =>
                        requireManage(() => setWorkingHours((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x))))
                      }
                      disabled={!canManage}
                      className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor={`wh-value-${i}`}>
                      Saat
                    </label>
                    <input
                      id={`wh-value-${i}`}
                      type="text"
                      value={h.value}
                      onChange={(e) =>
                        requireManage(() => setWorkingHours((p) => p.map((x, j) => (j === i ? { ...x, value: e.target.value } : x))))
                      }
                      disabled={!canManage}
                      className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'company':
        return (
          <Section title="Şirket Bilgileri" description="Yasal kuruluş bilgileri.">
            <Field id="legalCompany" label="Kayıtlı Ticari Unvan" value={form.legalCompany} onChange={(v) => set('legalCompany', v)} disabled={!canManage} />
            <Field id="address2" label="Kayıtlı Adres" value={form.address} onChange={(v) => set('address', v)} disabled={!canManage} textarea />
          </Section>
        );
      case 'cta':
        return (
          <Section title="Global CTA'lar" description="Site genelindeki birincil ve ikincil çağrı butonları.">
            <Field id="cta1" label="Birincil CTA Etiketi" value={form.ctaPrimaryLabel} onChange={(v) => set('ctaPrimaryLabel', v)} disabled={!canManage} />
            <Field id="cta2" label="İkincil CTA Etiketi" value={form.ctaSecondaryLabel} onChange={(v) => set('ctaSecondaryLabel', v)} disabled={!canManage} />
            <StatusAlert tone="info">CTA hedefleri (telefon/WhatsApp/form) İletişim ve Varsayılan Formlar ayarlarından gelir.</StatusAlert>
          </Section>
        );
      case 'forms':
        return (
          <Section title="Varsayılan Formlar" description="Açılış sayfası ve CTA'larda kullanılan varsayılan form.">
            <div>
              <label className="field-label" htmlFor="defaultForm">
                Varsayılan Başvuru Formu
              </label>
              <select
                id="defaultForm"
                value={form.defaultFormId}
                onChange={(e) => set('defaultFormId', e.target.value)}
                disabled={!canManage}
                className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </Section>
        );
      case 'locale':
        return (
          <Section title="Dil & Yerel" description="Dil, saat dilimi ve para birimi.">
            <Field id="locale" label="Dil / Bölge" value={form.locale} onChange={(v) => set('locale', v)} disabled={!canManage} />
            <Field id="timezone" label="Saat Dilimi" value={form.timezone} onChange={(v) => set('timezone', v)} disabled={!canManage} />
            <Field id="currency" label="Para Birimi" value={form.currency} onChange={(v) => set('currency', v)} disabled={!canManage} />
          </Section>
        );
      case 'seo':
        return (
          <Section title="SEO Varsayılanları" description="Başlık şablonu ve meta açıklaması (tüm sayfalar için temel).">
            <Field id="seoTitle" label="Başlık Şablonu" value={form.seoTitleTemplate} onChange={(v) => set('seoTitleTemplate', v)} disabled={!canManage} hint="%s sayfa başlığı ile değiştirilir." />
            <Field id="seoDesc" label="Varsayılan Meta Açıklama" value={form.metaDescription} onChange={(v) => set('metaDescription', v)} disabled={!canManage} textarea />
            {lockNote}
          </Section>
        );
      case 'social':
        return (
          <Section title="Sosyal Medya" description="Footer ve yapılandırılmış veride kullanılan profiller.">
            <div className="space-y-3">
              {social.map((s, i) => (
                <div key={i}>
                  <label className="field-label" htmlFor={`soc-${i}`}>
                    {s.label}
                  </label>
                  <input
                    id={`soc-${i}`}
                    type="url"
                    value={s.url}
                    onChange={(e) => requireManage(() => setSocial((p) => p.map((x, j) => (j === i ? { ...x, url: e.target.value } : x))))}
                    disabled={!canManage}
                    placeholder="https://…"
                    className="field-input !min-h-[44px] !text-sm disabled:opacity-60"
                  />
                </div>
              ))}
            </div>
          </Section>
        );
      case 'legal':
        return (
          <Section title="Yasal & Gizlilik" description="Site genelinde tekrar eden yasal uyarı metni.">
            <Field id="disclaimer" label="Yasal Uyarı Metni" value={form.legalDisclaimer} onChange={(v) => set('legalDisclaimer', v)} disabled={!canManage} textarea />
            {lockNote}
            <StatusAlert tone="info">Yasal sayfaların (KVKK, Gizlilik vb.) bağlantıları Navigasyon &amp; Footer ekranında kilitlidir.</StatusAlert>
          </Section>
        );
      case 'email':
        return (
          <Section title="E-posta & Bildirim" description="Sistem bildirimlerinin gönderileceği adres.">
            <Field id="notifyEmail" label="Bildirim E-postası" type="email" value={form.notifyEmail} onChange={(v) => set('notifyEmail', v)} disabled={!canManage} />
            <StatusAlert tone="info">Yeni lead ve form gönderimlerinde bu adrese bildirim gönderilir.</StatusAlert>
          </Section>
        );
      case 'search':
        return (
          <Section title="Arama" description="Site içi arama davranışı.">
            <Field id="searchPh" label="Arama Kutusu Yer Tutucu" value={form.searchPlaceholder} onChange={(v) => set('searchPlaceholder', v)} disabled={!canManage} />
          </Section>
        );
      case 'media':
        return (
          <Section title="Medya" description="Yükleme kısıtlamaları.">
            <Field id="mediaMax" label="Maksimum Dosya Boyutu (MB)" type="number" value={form.mediaMaxMb} onChange={(v) => set('mediaMaxMb', v)} disabled={!canManage} />
          </Section>
        );
      case 'application':
        return (
          <Section title="Başvuru Varsayılanları" description="Yeni başvuruların varsayılan durumu.">
            <Field id="appStatus" label="Varsayılan Başlangıç Durumu" value={form.appDefaultStatus} onChange={(v) => set('appDefaultStatus', v)} disabled={!canManage} />
          </Section>
        );
      case 'features':
        return (
          <Section title="Özellikler" description="Site genelinde özellik aç/kapama.">
            <Toggle label="Blog" description="Blog bölümünü etkinleştir." checked={features.blog} onChange={() => requireManage(() => setFeatures((p) => ({ ...p, blog: !p.blog })))} disabled={!canManage} />
            <Toggle label="Canlı Sohbet" description="Üçüncü taraf canlı sohbet widget'ı." checked={features.liveChat} onChange={() => requireManage(() => setFeatures((p) => ({ ...p, liveChat: !p.liveChat })))} disabled={!canManage} />
            <Toggle label="Duyuru Çubuğu" description="Üst duyuru şeridini etkinleştir." checked={features.announcement} onChange={() => requireManage(() => setFeatures((p) => ({ ...p, announcement: !p.announcement })))} disabled={!canManage} />
            <Toggle label="Çoklu Para Birimi" description="Fiyatları birden çok para biriminde göster." checked={features.multiCurrency} onChange={() => requireManage(() => setFeatures((p) => ({ ...p, multiCurrency: !p.multiCurrency })))} disabled={!canManage} />
          </Section>
        );
      case 'maintenance':
        return (
          <Section title="Bakım" description="Siteyi geçici olarak bakım moduna alın.">
            <Toggle
              label="Bakım Modu"
              description="Açıkken ziyaretçilere bakım sayfası gösterilir; yöneticiler erişmeye devam eder."
              checked={maintenance}
              onChange={() => requireManage(() => setMaintenance((v) => !v))}
              disabled={!canManage}
            />
            {maintenance && <StatusAlert tone="warning" title="Bakım modu etkin">Site şu anda ziyaretçilere kapalı görünecek. Yayına almadan önce kapatmayı unutmayın.</StatusAlert>}
          </Section>
        );
      case 'security':
        return (
          <Section title="Güvenlik" description="Yönetici erişim güvenliği.">
            <Toggle label="İki Adımlı Doğrulama (2FA)" description="Tüm yönetici hesapları için zorunlu kıl." checked={security.twoFactor} onChange={() => requireManage(() => setSecurity((p) => ({ ...p, twoFactor: !p.twoFactor })))} disabled={!canManage} />
            <Toggle label="IP İzin Listesi" description="Yönetim paneline yalnızca onaylı IP'lerden erişim." checked={security.ipAllowlist} onChange={() => requireManage(() => setSecurity((p) => ({ ...p, ipAllowlist: !p.ipAllowlist })))} disabled={!canManage} />
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Genel Ayarlar"
        description="Marka, iletişim, SEO ve site genelindeki yapılandırmayı yönetin."
        actions={
          <button
            type="button"
            onClick={onSave}
            disabled={!canManage}
            title={canManage ? undefined : 'Ayarları değiştirme yetkiniz yok'}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Kaydet
          </button>
        }
      />

      <StatusAlert tone="info" title="Tek doğru kaynak">
        Buradaki telefon, e-posta, WhatsApp, logo, yasal uyarı ve SEO varsayılanları sitenin tamamında kullanılan tek
        doğru kaynaktır. Bir değeri değiştirmek tüm sayfaları günceller.
      </StatusAlert>

      {!canManage && (
        <StatusAlert tone="info">
          Ayarları yalnızca görüntüleyebilirsiniz. Değişiklik için <strong>settings:manage_settings</strong> yetkisi gerekir.
        </StatusAlert>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Category navigation */}
        <nav aria-label="Ayar kategorileri" className="lg:sticky lg:top-4 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto rounded-card border border-line-light bg-white p-2 shadow-card lg:flex-col lg:overflow-visible">
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = c.id === active;
              return (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(c.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                      isActive ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface hover:text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Active panel */}
        <div>{renderPanel()}</div>
      </div>
    </div>
  );
}
