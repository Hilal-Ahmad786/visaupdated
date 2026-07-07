/**
 * UTM + ad-click-id capture for attribution.
 *
 * Reads the marketing parameters from the landing URL and persists them in
 * sessionStorage (NON-PII only) so they can be attached to every conversion
 * dataLayer event later in the session. Ad click IDs (gclid/gbraid/wbraid) are
 * what Google Ads needs to attribute a conversion back to a click.
 *
 * IMPORTANT: never store personal data (name/email/phone) here — only campaign
 * attribution values, which are not PII.
 */

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid'] as const;

export type AttributionKey = (typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = 'vis_attribution';
const ALL_KEYS: readonly AttributionKey[] = [...UTM_KEYS, ...CLICK_ID_KEYS];

function readStored(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function writeStored(value: Attribution): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode / quota) — attribution just isn't persisted */
  }
}

/**
 * Capture attribution from the current URL and merge it into sessionStorage.
 * First-touch wins for UTMs already stored; a fresh ad click id always updates
 * (a new gclid means a new click). Safe to call on every route change.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const stored = readStored();
  let changed = false;

  for (const key of ALL_KEYS) {
    const value = params.get(key);
    if (!value) continue;
    const isClickId = (CLICK_ID_KEYS as readonly string[]).includes(key);
    // First-touch for UTMs; latest-touch for click ids.
    if (isClickId || !stored[key]) {
      if (stored[key] !== value) {
        stored[key] = value;
        changed = true;
      }
    }
  }

  if (changed) writeStored(stored);
  return stored;
}

/** Read the persisted attribution (UTMs + click ids) for the session. */
export function getAttribution(): Attribution {
  return readStored();
}
