/**
 * First-party marketing attribution helpers (client-side only).
 *
 * Captures Google Ads / UTM parameters from the landing URL and preserves them
 * for the rest of the session, so a lead submitted several page-views later
 * still carries the original campaign context. NEVER stores PII — only the
 * non-identifying campaign parameters below.
 */

import type { CampaignParams } from '@/types/lead';

const STORAGE_KEY = 'vv_attribution';

const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
] as const;

type CampaignKey = (typeof CAMPAIGN_KEYS)[number];

function fromStorage(): CampaignParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CampaignParams) : {};
  } catch {
    return {};
  }
}

/**
 * Read campaign params from the current URL, merge them over anything already
 * persisted this session, and persist the result. URL values win over stored
 * ones so a fresh ad click always refreshes attribution.
 */
export function captureCampaignParams(): CampaignParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const stored = fromStorage();
  const merged: CampaignParams = { ...stored };

  let changed = false;
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value && value.trim().length > 0) {
      merged[key as CampaignKey] = value.trim();
      changed = true;
    }
  }

  if (changed) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* storage unavailable — attribution is best-effort */
    }
  }
  return merged;
}

/** Return the best-known campaign params (URL first, then session storage). */
export function readCampaignParams(): CampaignParams {
  if (typeof window === 'undefined') return {};
  return captureCampaignParams();
}
