'use client';

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Lock,
  Megaphone,
  Monitor,
  Plus,
  Save,
  Smartphone,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useToast } from '@/components/admin/feedback/Toast';
import { Dialog } from '@/components/admin/ui/Dialog';
import { PageHeader, StatusBadge } from '@/components/admin/ui/primitives';
import { StatusAlert } from '@/components/ui/states';
import { Tabs } from '@/components/admin/ui/Tabs';
import { cn } from '@/lib/utils';

type LinkType = 'internal' | 'external' | 'phone' | 'form';

interface MenuItem {
  id: string;
  label: string;
  type: LinkType;
  url: string;
  /** Required legal/system links cannot be deleted. */
  locked?: boolean;
  /** Demo: destination page is not yet published. */
  unpublished?: boolean;
}

interface NavEntry {
  label: string;
  href: string;
}

const linkTypeOptions: { value: LinkType; label: string }[] = [
  { value: 'internal', label: 'İç Sayfa' },
  { value: 'external', label: 'Dış Bağlantı' },
  { value: 'phone', label: 'Telefon' },
  { value: 'form', label: 'Form' },
];

const linkTypeLabel = (t: LinkType) => linkTypeOptions.find((o) => o.value === t)?.label ?? t;

/** Validate a destination URL. Blocks unsafe protocols and non-http(s) externals. */
function validateUrl(type: LinkType, url: string): string | null {
  const v = url.trim();
  if (!v) return 'Bağlantı boş bırakılamaz.';
  const lower = v.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return 'Güvenli olmayan bağlantı engellendi — javascript:, data: ve benzeri protokoller yasaktır.';
  }
  if (type === 'external') {
    if (!/^https?:\/\//i.test(v)) return 'Dış bağlantı http:// veya https:// ile başlamalıdır.';
    try {
      const u = new URL(v);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'Yalnızca http(s) bağlantılarına izin verilir.';
    } catch {
      return 'Geçersiz URL biçimi.';
    }
  }
  if (type === 'internal' && !v.startsWith('/')) return 'İç sayfa bağlantısı "/" ile başlamalıdır.';
  if (type === 'phone' && !/^(tel:)?[+0-9 ()-]{6,}$/.test(v)) return 'Geçerli bir telefon numarası girin.';
  return null;
}

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

/** Reusable ordered menu editor with inline validation and locked items. */
function MenuEditor({
  items,
  onChange,
  describedBy,
}: {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  describedBy: string;
}) {
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const a = copy[index];
    const b = copy[target];
    if (!a || !b) return;
    copy[index] = b;
    copy[target] = a;
    onChange(copy);
  };

  const update = (id: string, patch: Partial<MenuItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  return (
    <ul className="space-y-3" aria-describedby={describedBy}>
      {items.map((item, index) => {
        const error = validateUrl(item.type, item.url);
        return (
          <li
            key={item.id}
            className="rounded-card border border-line-light bg-white p-4 shadow-card"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex shrink-0 gap-1" role="group" aria-label={`${item.label} sıralama`}>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`${item.label} yukarı taşı`}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`${item.label} aşağı taşı`}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_140px]">
                <div>
                  <label className="field-label" htmlFor={`label-${item.id}`}>
                    Etiket
                  </label>
                  <input
                    id={`label-${item.id}`}
                    type="text"
                    value={item.label}
                    onChange={(e) => update(item.id, { label: e.target.value })}
                    className="field-input !min-h-[44px] !text-sm"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor={`type-${item.id}`}>
                    Bağlantı Türü
                  </label>
                  <select
                    id={`type-${item.id}`}
                    value={item.type}
                    onChange={(e) => update(item.id, { type: e.target.value as LinkType })}
                    className="field-input !min-h-[44px] !text-sm"
                  >
                    {linkTypeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor={`url-${item.id}`}>
                    Hedef
                  </label>
                  <input
                    id={`url-${item.id}`}
                    type="text"
                    value={item.url}
                    onChange={(e) => update(item.id, { url: e.target.value })}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `err-${item.id}` : undefined}
                    className={cn('field-input !min-h-[44px] !text-sm', error && '!border-danger focus:!ring-danger/30')}
                  />
                  {error && (
                    <p id={`err-${item.id}`} className="field-error">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      {error}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {item.locked && (
                      <StatusBadge label="Zorunlu yasal bağlantı" tone="info" />
                    )}
                    {item.unpublished && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        Hedef sayfa yayında değil
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 sm:pt-6">
                {item.locked ? (
                  <span
                    title="Zorunlu yasal bağlantı — silinemez"
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted"
                  >
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Kilitli — silinemez</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`${item.label} bağlantısını sil`}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Live preview of a menu in desktop or mobile presentation. */
function MenuPreview({ items, device }: { items: MenuItem[]; device: 'desktop' | 'mobile' }) {
  return (
    <div
      className={cn(
        'rounded-card border border-line-light bg-navy p-4 text-white',
        device === 'mobile' && 'mx-auto max-w-xs',
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/60">Önizleme</p>
      <nav
        className={cn(
          'gap-2 text-sm font-semibold',
          device === 'desktop' ? 'flex flex-wrap items-center' : 'flex flex-col',
        )}
        aria-label="Menü önizleme"
      >
        {items.map((it) => (
          <span key={it.id} className="rounded px-2 py-1 text-white/90 hover:bg-white/10">
            {it.label}
          </span>
        ))}
      </nav>
    </div>
  );
}

export function NavFooterManager({
  canPublish,
  primaryNav,
  legalNav,
}: {
  canPublish: boolean;
  primaryNav: NavEntry[];
  legalNav: NavEntry[];
}) {
  const { notify } = useToast();

  const initialPrimary: MenuItem[] = useMemo(
    () =>
      primaryNav.map((n, i) => ({
        id: `primary-${i}`,
        label: n.label,
        type: 'internal' as LinkType,
        url: n.href,
        unpublished: n.href === '/blog',
      })),
    [primaryNav],
  );

  const legalItems: MenuItem[] = useMemo(
    () =>
      legalNav.map((n, i) => ({
        id: `legal-${i}`,
        label: n.label,
        type: 'internal' as LinkType,
        url: n.href,
        locked: true,
      })),
    [legalNav],
  );

  const [topMenu, setTopMenu] = useState<MenuItem[]>(initialPrimary);
  const [mobileMenu, setMobileMenu] = useState<MenuItem[]>(initialPrimary);
  const [footerLinks, setFooterLinks] = useState<MenuItem[]>([
    { id: 'f-1', label: 'Hizmetler', type: 'internal', url: '/hizmetler' },
    { id: 'f-2', label: 'Vize Süreci', type: 'internal', url: '/vize-sureci' },
    { id: 'f-3', label: 'İletişim', type: 'internal', url: '/iletisim' },
  ]);

  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [annEnabled, setAnnEnabled] = useState(false);
  const [annText, setAnnText] = useState('Yaz dönemi randevuları için yerinizi şimdi ayırtın.');
  const [annStart, setAnnStart] = useState('');
  const [annEnd, setAnnEnd] = useState('');

  // Add-item dialog state.
  const [addOpen, setAddOpen] = useState<null | 'top' | 'mobile' | 'footer'>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<LinkType>('internal');
  const [newUrl, setNewUrl] = useState('');

  const newError = validateUrl(newType, newUrl);
  const newLabelValid = newLabel.trim().length > 1;

  const allItems = [...topMenu, ...mobileMenu, ...footerLinks, ...legalItems];
  const hasErrors = allItems.some((it) => validateUrl(it.type, it.url) !== null);

  const resetAdd = () => {
    setAddOpen(null);
    setNewLabel('');
    setNewType('internal');
    setNewUrl('');
  };

  const submitAdd = () => {
    if (!newLabelValid || newError) return;
    const item: MenuItem = { id: nextId('item'), label: newLabel.trim(), type: newType, url: newUrl.trim() };
    if (addOpen === 'top') setTopMenu((p) => [...p, item]);
    else if (addOpen === 'mobile') setMobileMenu((p) => [...p, item]);
    else if (addOpen === 'footer') setFooterLinks((p) => [...p, item]);
    notify(`"${item.label}" bağlantısı eklendi. (Demo)`, 'success');
    resetAdd();
  };

  const guardSafe = (action: () => void) => {
    if (hasErrors) {
      notify('Güvenli olmayan veya geçersiz bağlantılar var. Lütfen önce düzeltin.', 'error');
      return;
    }
    action();
  };

  const onSave = () => guardSafe(() => notify('Navigasyon taslağı kaydedildi. (Demo)', 'success'));

  const onPublish = () => {
    if (!canPublish) {
      notify('Yayınlama yetkiniz yok. Lütfen bir yönetici ile iletişime geçin.', 'warning');
      return;
    }
    guardSafe(() => notify('Navigasyon yayınlandı ve yeni sürüm oluşturuldu. (Demo)', 'success'));
  };

  const AddButton = ({ target }: { target: 'top' | 'mobile' | 'footer' }) => (
    <button
      type="button"
      onClick={() => setAddOpen(target)}
      className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      Bağlantı Ekle
    </button>
  );

  const DeviceToggle = () => (
    <div className="inline-flex rounded-lg border border-line p-0.5" role="group" aria-label="Önizleme cihazı">
      {([
        { id: 'desktop', label: 'Masaüstü', Icon: Monitor },
        { id: 'mobile', label: 'Mobil', Icon: Smartphone },
      ] as const).map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setDevice(id)}
          aria-pressed={device === id}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold',
            device === id ? 'bg-navy text-white' : 'text-ink-soft hover:bg-surface',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );

  const lockNote = (
    <StatusAlert tone="info" title="Zorunlu yasal bağlantılar">
      KVKK, Açık Rıza, Gizlilik, Çerez ve diğer yasal bağlantılar kilitlidir; yeniden adlandırılamaz şekilde her
      zaman görünür kalır ve silinemez.
    </StatusAlert>
  );

  const tabs = [
    {
      id: 'top',
      label: 'Üst Menü',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">Masaüstü başlığında görünen birincil menü.</p>
            <AddButton target="top" />
          </div>
          <MenuEditor items={topMenu} onChange={setTopMenu} describedBy="top-help" />
          <div className="flex items-center justify-between gap-3">
            <DeviceToggle />
          </div>
          <MenuPreview items={topMenu} device={device} />
        </div>
      ),
      count: topMenu.length,
    },
    {
      id: 'mobile',
      label: 'Mobil Menü',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">Mobil çekmecede (drawer) görünen menü. Üst menüden bağımsız sıralanabilir.</p>
            <AddButton target="mobile" />
          </div>
          <MenuEditor items={mobileMenu} onChange={setMobileMenu} describedBy="mobile-help" />
          <MenuPreview items={mobileMenu} device="mobile" />
        </div>
      ),
      count: mobileMenu.length,
    },
    {
      id: 'footer',
      label: 'Footer',
      content: (
        <div className="space-y-5">
          <StatusAlert tone="info">
            Marka, iletişim (telefon/e-posta/WhatsApp), çalışma saatleri, sosyal medya, telif ve yasal uyarı metni{' '}
            <strong>Genel Ayarlar</strong> üzerinden yönetilir ve tek doğru kaynaktır. Burada yalnızca footer bağlantı
            sütunları düzenlenir.
          </StatusAlert>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-heading text-base font-semibold text-ink">Bağlantı Sütunu</h3>
              <AddButton target="footer" />
            </div>
            <MenuEditor items={footerLinks} onChange={setFooterLinks} describedBy="footer-help" />
          </section>

          <section>
            <h3 className="mb-3 font-heading text-base font-semibold text-ink">Yasal Bağlantılar</h3>
            {lockNote}
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {legalItems.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-2 rounded-lg border border-line-light bg-surface px-3 py-2 text-sm text-ink"
                >
                  <Lock className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  <span className="flex-1">{it.label}</span>
                  <code className="text-xs text-ink-muted">{it.url}</code>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-line-light bg-white p-4 shadow-card">
            <h3 className="font-heading text-base font-semibold text-ink">Marka & İletişim (salt okunur)</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Bu değerler Genel Ayarlar&apos;dan gelir. Değiştirmek için Genel Ayarlar &rarr; Marka / İletişim
              bölümünü kullanın.
            </p>
          </section>
        </div>
      ),
      count: footerLinks.length + legalItems.length,
    },
    {
      id: 'announcement',
      label: 'Duyuru Çubuğu',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-card border border-line-light bg-white p-4 shadow-card">
            <Megaphone className="h-5 w-5 text-gold" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-ink">Görünürlük</p>
              <p className="text-sm text-ink-soft">Site genelinde üstte gösterilen ince duyuru şeridi.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={annEnabled}
              onClick={() => setAnnEnabled((v) => !v)}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                annEnabled ? 'bg-success' : 'bg-line',
              )}
            >
              <span className="sr-only">Duyuru çubuğunu aç/kapat</span>
              <span
                className={cn(
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                  annEnabled ? 'translate-x-[22px]' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>

          <div>
            <label className="field-label" htmlFor="ann-text">
              Duyuru Metni
            </label>
            <input
              id="ann-text"
              type="text"
              value={annText}
              onChange={(e) => setAnnText(e.target.value)}
              maxLength={140}
              className="field-input !min-h-[44px] !text-sm"
            />
            <p className="mt-1 text-xs text-ink-muted">{annText.length}/140 karakter</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="ann-start">
                Başlangıç
              </label>
              <input
                id="ann-start"
                type="date"
                value={annStart}
                onChange={(e) => setAnnStart(e.target.value)}
                className="field-input !min-h-[44px] !text-sm"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="ann-end">
                Bitiş
              </label>
              <input
                id="ann-end"
                type="date"
                value={annEnd}
                onChange={(e) => setAnnEnd(e.target.value)}
                className="field-input !min-h-[44px] !text-sm"
              />
            </div>
          </div>

          {annEnabled ? (
            <div className="rounded-card bg-gold px-4 py-2 text-center text-sm font-semibold text-white">
              {annText || 'Duyuru metni girin…'}
            </div>
          ) : (
            <StatusAlert tone="info">Duyuru çubuğu şu anda kapalı; sitede gösterilmiyor.</StatusAlert>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Navigasyon & Footer"
        description="Menüleri, footer bağlantılarını ve duyuru çubuğunu yönetin."
        actions={
          <>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Taslağı Kaydet
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={!canPublish}
              title={canPublish ? undefined : 'Yayınlama yetkiniz yok'}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
              Yayınla
            </button>
          </>
        }
      />

      {hasErrors && (
        <StatusAlert tone="error" title="Geçersiz bağlantılar var">
          Bir veya daha fazla menü bağlantısı güvenli değil veya geçersiz. Kaydetme ve yayınlama, sorunlar
          giderilene kadar engellendi.
        </StatusAlert>
      )}

      <p id="top-help" className="sr-only">
        Bağlantıları yukarı/aşağı düğmeleriyle yeniden sıralayın. Zorunlu yasal bağlantılar kilitlidir.
      </p>
      <span id="mobile-help" className="sr-only">
        Mobil menü öğelerini düzenleyin.
      </span>
      <span id="footer-help" className="sr-only">
        Footer bağlantı sütununu düzenleyin.
      </span>

      <Tabs tabs={tabs} ariaLabel="Navigasyon bölümleri" />

      <StatusAlert tone="info" title="Sürümleme">
        Her yayınlama yeni bir sürüm oluşturur ve önceki sürüme geri dönülebilir. Değişiklikler yayınlanana kadar
        canlı sitede görünmez. (Demo)
      </StatusAlert>

      <Dialog
        open={addOpen !== null}
        onClose={resetAdd}
        title="Bağlantı Ekle"
        description="Yeni bir menü bağlantısı oluşturun."
        footer={
          <>
            <button
              type="button"
              onClick={resetAdd}
              className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={submitAdd}
              disabled={!newLabelValid || newError !== null}
              className="rounded-lg bg-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ekle
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="new-label">
              Etiket
            </label>
            <input
              id="new-label"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="field-input !min-h-[44px] !text-sm"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="new-type">
              Bağlantı Türü
            </label>
            <select
              id="new-type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as LinkType)}
              className="field-input !min-h-[44px] !text-sm"
            >
              {linkTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="new-url">
              Hedef ({linkTypeLabel(newType)})
            </label>
            <input
              id="new-url"
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={newType === 'external' ? 'https://…' : newType === 'phone' ? 'tel:+90…' : '/sayfa'}
              aria-invalid={newError ? true : undefined}
              className={cn('field-input !min-h-[44px] !text-sm', newError && newUrl && '!border-danger')}
            />
            {newUrl && newError && (
              <p className="field-error">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {newError}
              </p>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
