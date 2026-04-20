'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId?: string
}

export function GoogleAnalytics({ measurementId = 'G-XXXXXXXXXX' }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            page_title: document.title,
            anonymize_ip: true,
            allow_google_signals: true,
            allow_ad_personalization: false,
          });
          
          // Track tool usage events
          window.addEventListener('tool-completed', (e) => {
            gtag('event', 'tool_usage', {
              tool_name: e.detail?.toolName || 'unknown',
              file_count: e.detail?.fileCount || 1,
              file_size: e.detail?.fileSize || 0,
            });
          });
          `,
        }}
      />
    </>
  )
}

// Event tracking utility
export function trackToolUsage(toolName: string, details?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('tool-completed', {
      detail: { toolName, ...details },
    })
    window.dispatchEvent(event)
  }
}

// Conversion tracking
export function trackConversion(conversionName: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      conversion_name: conversionName,
      conversion_value: value,
    })
  }
}
