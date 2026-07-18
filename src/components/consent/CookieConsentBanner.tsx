'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  CONSENT_OPEN_EVENT,
  applyStoredConsentOnLoad,
  hasConsentDecision,
  readConsent,
  saveConsent,
} from '@/lib/consent';

/**
 * KVKK / çerez consent banner (Turkish). Collects the user's choice, drives
 * Google Consent Mode v2 (via lib/consent → gtag update) and gates our
 * first-party analytics. Only the choice is stored (localStorage), never PII.
 *
 * Buttons: Tümünü Kabul Et · Reddet · Tercihleri Yönet (expands category toggles).
 * Re-openable later by dispatching `CONSENT_OPEN_EVENT` on window (e.g. a footer
 * "Çerez Tercihleri" link).
 */
export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Re-apply a previously stored choice to Google (defaults start denied).
    applyStoredConsentOnLoad();
    if (!hasConsentDecision()) setOpen(true);

    const reopen = () => {
      const stored = readConsent();
      setAnalytics(stored ? stored.analytics : true);
      setMarketing(stored ? stored.marketing : true);
      setManaging(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setOpen(false);
  };
  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
    setOpen(false);
  };
  const savePreferences = () => {
    saveConsent({ analytics, marketing });
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="container-content !px-0">
        <div className="mx-auto max-w-3xl rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
          <p className="font-heading text-base font-semibold text-navy">Çerez Tercihleriniz</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Web sitemizde deneyiminizi iyileştirmek, trafiği analiz etmek ve reklam performansını
            ölçmek için çerezler kullanıyoruz. Zorunlu çerezler sitenin çalışması için gereklidir.
            Analitik ve reklam çerezleri yalnızca onayınızla etkinleştirilir. Ayrıntılar için{' '}
            <Link href="/yasal/cerez" className="font-semibold text-navy underline hover:text-gold">
              Çerez Politikası
            </Link>{' '}
            sayfamızı inceleyebilirsiniz.
          </p>

          {managing && (
            <div className="mt-4 space-y-3 rounded-card border border-line bg-page p-4">
              <CategoryRow
                title="Zorunlu Çerezler"
                description="Sitenin temel işlevleri için gereklidir. Her zaman etkindir."
                checked
                disabled
              />
              <CategoryRow
                title="Analitik Çerezleri"
                description="Ziyaretçi davranışını anonim olarak ölçerek siteyi geliştirmemize yardımcı olur."
                checked={analytics}
                onChange={setAnalytics}
              />
              <CategoryRow
                title="Reklam ve Pazarlama Çerezleri"
                description="Reklam performansını ölçmek ve kampanyaları iyileştirmek için kullanılır."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" onClick={acceptAll} className="btn-primary">
              Tümünü Kabul Et
            </button>
            <button type="button" onClick={rejectAll} className="btn-outline">
              Reddet
            </button>
            {managing ? (
              <button
                type="button"
                onClick={savePreferences}
                className="btn-outline sm:ml-auto"
              >
                Seçimleri Kaydet
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setManaging(true)}
                className="text-sm font-semibold text-navy underline hover:text-gold sm:ml-auto"
              >
                Tercihleri Yönet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-navy disabled:opacity-60"
      />
      <span className="text-sm">
        <span className="font-heading font-semibold text-ink">{title}</span>
        <span className="block text-ink-soft">{description}</span>
      </span>
    </label>
  );
}
