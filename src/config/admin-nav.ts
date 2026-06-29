import type { AdminModule } from '@/types/admin';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string; // lucide name resolved by AdminIcon
  module: AdminModule;
  badgeKey?: 'newLeads';
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

/** Sidebar grouping mirrors the Stitch dashboard design (TEMEL / İÇERİK / SİSTEM). */
export const adminNav: AdminNavGroup[] = [
  {
    title: 'Temel',
    items: [
      { label: 'Genel Bakış', href: '/admin', icon: 'layout-dashboard', module: 'dashboard' },
      { label: 'Başvurular', href: '/admin/leads', icon: 'inbox', module: 'leads', badgeKey: 'newLeads' },
      { label: 'Başvuru Süreci', href: '/admin/pipeline', icon: 'git-branch', module: 'pipeline' },
      { label: 'Tıklama Raporu', href: '/admin/tiklama-raporu', icon: 'mouse-pointer-click', module: 'leads' },
    ],
  },
  {
    title: 'İçerik',
    items: [
      { label: 'Ülkeler', href: '/admin/ulkeler', icon: 'flag', module: 'countries' },
      { label: 'Ülke Sayfaları', href: '/admin/ulke-sayfalari', icon: 'book-open', module: 'country_pages' },
      { label: 'Hizmetler', href: '/admin/hizmetler', icon: 'briefcase', module: 'services' },
      { label: 'Blog', href: '/admin/blog', icon: 'rss', module: 'blog' },
      { label: 'S.S.S.', href: '/admin/sss', icon: 'help-circle', module: 'faq' },
      { label: 'Ana Sayfa', href: '/admin/ana-sayfa', icon: 'home', module: 'homepage' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { label: 'Formlar', href: '/admin/formlar', icon: 'clipboard-list', module: 'forms' },
      { label: 'Menü & Footer', href: '/admin/navigasyon', icon: 'menu', module: 'navigation' },
      { label: 'Takip Ayarları', href: '/admin/takip-ayarlari', icon: 'line-chart', module: 'tracking' },
      { label: 'Genel Ayarlar', href: '/admin/genel-ayarlar', icon: 'settings', module: 'settings' },
      { label: 'Kullanıcılar & Roller', href: '/admin/kullanicilar', icon: 'users', module: 'users' },
      { label: 'Denetim Kayıtları', href: '/admin/denetim-kayitlari', icon: 'scroll-text', module: 'audit' },
    ],
  },
];
