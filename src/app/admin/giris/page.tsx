import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/auth/LoginForm';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Yönetim Paneli Girişi',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  // Already signed in → go to dashboard.
  if (getCurrentUser()) redirect('/admin');

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-navy to-navy-deep p-12 text-white lg:flex">
        <Image
          src="/logo-dark.png"
          alt="VİS VİZE Yönetim Paneli"
          width={720}
          height={240}
          priority
          className="h-14 w-auto"
        />

        <div>
          <h1 className="text-h2 text-white">Operasyon Yönetim Paneli</h1>
          <p className="mt-3 max-w-md text-white/70">
            Başvuruları, içerikleri ve site ayarlarını tek bir güvenli panelden yönetin.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2.5"><ShieldCheck className="h-5 w-5 text-gold-soft" aria-hidden="true" /> Rol bazlı erişim ve denetim kayıtları</li>
            <li className="flex items-center gap-2.5"><ShieldCheck className="h-5 w-5 text-gold-soft" aria-hidden="true" /> Hassas verilerde maskeleme ve doğrulama</li>
            <li className="flex items-center gap-2.5"><ShieldCheck className="h-5 w-5 text-gold-soft" aria-hidden="true" /> KVKK uyumlu süreç yönetimi</li>
          </ul>
        </div>

        <p className="text-xs text-white/40">VİS VİZE özel bir danışmanlık hizmetidir. Resmî bir kurum değildir.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-admin px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/logo.png" alt="VİS VİZE" width={720} height={180} priority className="h-11 w-auto" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-ink">Tekrar hoş geldiniz</h2>
          <p className="mt-1 text-sm text-ink-soft">Devam etmek için hesabınıza giriş yapın.</p>

          <div className="mt-7">
            <LoginForm />
          </div>

          <p className="mt-6 rounded-card border border-line-light bg-white p-3 text-center text-xs text-ink-soft">
            Demo erişim bilgileri proje <span className="font-semibold text-ink">README</span> dosyasında belgelenmiştir.
          </p>
        </div>
      </div>
    </div>
  );
}
