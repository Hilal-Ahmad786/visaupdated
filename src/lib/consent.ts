/**
 * Cookie-consent store + Google Consent Mode v2 bridge.
 *
 * KVKK-safe design:
 *  - Only the *choice* is persisted (three booleans + a timestamp). NO personal
 *    data, ids, name/phone/email is ever written here.
 *  - Before any choice, every non-essential signal is DENIED. The all-denied
 *    default is set by `ConsentModeDefault` (a `beforeInteractive` script) so it
 *    is in place before GTM loads. This module only ever *upgrades* consent via
 *    `gtag('consent','update', …)` once the user opts in.
 *  - Both the Google side (GA4/Ads via GTM) and our own first-party click
 *    beacons (`beaconClick` in lib/analytics) respect `analyticsAllowed()`.
 *
 * Consent categories → signals:
 *  - analytics  → analytics_storage  + first-party click/visit tracking
 *  - marketing  → ad_storage, ad_user_data, ad_personalization
 *  - necessary  → always on (not stored as a choice; here for completeness)
 */

export const CONSENT_STORAGE_KEY = 'vis_cookie_consent';
const CONSENT_VERSION = 1;

/** Fired on `window` whenever the stored consent choice changes. */
export const CONSENT_CHANGE_EVENT = 'vis-consent-change';
/** Fired on `window` to (re)open the preferences UI (e.g. from a footer link). */
export const CONSENT_OPEN_EVENT = 'vis-open-consent';

export interface ConsentChoice {
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent extends ConsentChoice {
  v: number;
  necessary: true;
  ts: string;
}

const isBrowser = () => typeof window !== 'undefined';

/** Read the persisted choice, or null when the user has not decided yet. */
export function readConsent(): StoredConsent | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      ts: typeof parsed.ts === 'string' ? parsed.ts : '',
    };
  } catch {
    return null;
  }
}

/** True once the user has made any explicit choice. */
export function hasConsentDecision(): boolean {
  return readConsent() !== null;
}

/** May we run analytics (GA4 via GTM + our first-party click/visit beacons)? */
export function analyticsAllowed(): boolean {
  return readConsent()?.analytics === true;
}

/** May we run advertising/marketing signals (Google Ads via GTM)? */
export function marketingAllowed(): boolean {
  return readConsent()?.marketing === true;
}

/**
 * Push a Consent Mode v2 `update` to the dataLayer via the gtag shim installed
 * by `ConsentModeDefault`. GTM reads these commands and gates its Google tags.
 * No-ops safely if the shim is not present (e.g. GTM id unset).
 */
export function applyConsentToGoogle(choice: ConsentChoice): void {
  if (!isBrowser()) return;
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  gtag('consent', 'update', {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: choice.marketing ? 'granted' : 'denied',
    ad_user_data: choice.marketing ? 'granted' : 'denied',
    ad_personalization: choice.marketing ? 'granted' : 'denied',
  });
}

/** Persist a choice, sync it to Google, and notify listeners. */
export function saveConsent(choice: ConsentChoice): void {
  if (!isBrowser()) return;
  const record: StoredConsent = {
    v: CONSENT_VERSION,
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    ts: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable (private mode) — consent stays denied for the session */
  }
  applyConsentToGoogle(choice);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: choice }));
}

/**
 * On load, re-apply an already-stored choice to Google (defaults start denied,
 * so returning visitors who previously opted in need an `update`). No-op when no
 * decision has been made yet — the banner will collect one.
 */
export function applyStoredConsentOnLoad(): void {
  const stored = readConsent();
  if (stored) applyConsentToGoogle({ analytics: stored.analytics, marketing: stored.marketing });
}
