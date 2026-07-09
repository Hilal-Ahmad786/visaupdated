import Script from 'next/script';

/**
 * Google Tag Manager — the SINGLE tag manager for the whole site.
 *
 * GTM is the only place GA4 and Google Ads tags live; the app never loads
 * gtag.js directly (that would double-count conversions) and never hardcodes
 * measurement ids / conversion labels. The app only pushes structured
 * `vis_*` dataLayer events (see src/lib/tracking) which GTM listens to.
 *
 * - Renders nothing when NEXT_PUBLIC_GTM_ID is missing (dev/preview safe).
 * - Loads GTM once; `next/script` de-dupes by `id`.
 * - Includes the <noscript> iframe fallback.
 *
 * CONSENT MODE: to add Google Consent Mode later, push the default consent
 * state to dataLayer BEFORE this script runs (a small inline `beforeInteractive`
 * script setting gtag('consent','default', {...})), then update it from your
 * cookie-consent UI. GTM tags should be set to respect consent. Basic form
 * functionality must never depend on consent.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      {/* Initialize dataLayer + load GTM, once, after the page is interactive. */}
      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    </>
  );
}

/**
 * <noscript> GTM fallback. Rendered right after <body> opens. Kept separate so
 * it can be placed at the top of <body> per Google's guidance.
 */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="gtm"
      />
    </noscript>
  );
}
