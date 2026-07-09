'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Third-party analytics that are NOT GA4/Google Ads.
 *
 * GA4 and Google Ads are loaded and fired EXCLUSIVELY through Google Tag
 * Manager (see components/GoogleTagManager.tsx). We intentionally do NOT load
 * gtag.js here — doing so would double-count conversions against GTM. This
 * component only handles Microsoft Clarity and emits SPA page-view events to
 * the dataLayer for GTM to consume on client-side route changes.
 */
function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    // Pushes a `page_view` event to dataLayer (GTM can map it to GA4).
    trackEvent({ name: 'page_view', category: 'navigation', page: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);
  return null;
}

export function Analytics() {
  return (
    <>
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      )}
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
