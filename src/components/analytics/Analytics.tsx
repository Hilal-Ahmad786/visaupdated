'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    trackEvent({ name: 'page_view', category: 'navigation', page: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);
  return null;
}

/**
 * Loads GA4 / GTM only when configured AND uses `afterInteractive` so analytics
 * never blocks the page. In Part 2 these scripts will be gated behind cookie
 * consent; the abstraction (trackEvent) already centralizes that decision.
 */
export function Analytics() {
  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: false });`}
          </Script>
        </>
      )}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
