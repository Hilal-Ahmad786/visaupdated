/**
 * Google Consent Mode v2 — DEFAULT state.
 *
 * Renders a plain, parser-blocking inline `<script>` at the very top of the
 * `<body>`. Because it executes during initial HTML parsing, the all-denied
 * default is in the dataLayer BEFORE the GTM container script (which loads with
 * `afterInteractive`) ever runs — so no GA4/Ads storage or ad signals fire until
 * the user opts in via the cookie banner (which later pushes a `consent update`
 * through the same `window.gtag` shim). This mirrors Google's recommended
 * placement and avoids `next/script`'s `beforeInteractive` App-Router caveat.
 *
 * Only rendered when GTM is configured — with no container there is nothing to
 * gate. The cookie banner + first-party gating (lib/consent, lib/analytics) work
 * independently of this script.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
`;

export function ConsentModeDefault() {
  if (!GTM_ID) return null;
  return <script id="consent-mode-default" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }} />;
}
