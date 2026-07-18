'use client';

import { CONSENT_OPEN_EVENT } from '@/lib/consent';

/**
 * Footer link that re-opens the cookie preferences panel so users can withdraw
 * or change consent at any time (KVKK requirement). Styled to match the sibling
 * legal links in the footer.
 */
export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Çerez Tercihleri
    </button>
  );
}
