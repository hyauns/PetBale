import Script from 'next/script'

export function AnalyticsScripts() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const adsId2 = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_2
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  // gtag.js is a single shared library for GA4 + Google Ads. Load it once if
  // any ID is set, then `config` each product on the same gtag instance. A
  // second Ads account (adsId2) can be configured alongside the first — events
  // fired without an explicit send_to broadcast to every configured target.
  const gtagLoaderId = ga4Id || adsId || adsId2

  return (
    <>
      {gtagLoaderId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`}
            strategy="lazyOnload"
          />
          <Script id="gtag-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${ga4Id ? `gtag('config', '${ga4Id}', { send_page_view: true });` : ''}
              ${adsId ? `gtag('config', '${adsId}');` : ''}
              ${adsId2 ? `gtag('config', '${adsId2}');` : ''}
            `}
          </Script>
        </>
      )}

      {pixelId && (
        <>
          <Script id="meta-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  )
}
