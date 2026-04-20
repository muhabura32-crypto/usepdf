'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  page: string
  navigationTiming: {
    domContentLoaded: number
    loadComplete: number
  }
  coreWebVitals: {
    lcp?: number
    fid?: number
    cls?: number
    ttfb?: number
  }
  customMetrics: {
    toolExecutionTime?: number
    fileProcessingTime?: number
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined') {
      // LCP (Largest Contentful Paint)
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if ((window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
              metric_name: 'LCP',
              metric_value: lastEntry.startTime,
            })
          }
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.log('LCP monitoring not supported')
      }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              if ((window as any).gtag) {
                (window as any).gtag('event', 'page_view', {
                  metric_name: 'CLS',
                  metric_value: clsValue,
                })
              }
            }
          }
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.log('CLS monitoring not supported')
      }

      // FID (First Input Delay) / INP (Interaction to Next Paint)
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          for (const entry of entries) {
            if ((window as any).gtag) {
              (window as any).gtag('event', 'page_view', {
                metric_name: (entry as any).name === 'first-input' ? 'FID' : 'INP',
                metric_value: (entry as any).processingDuration,
              })
            }
          }
        })
        observer.observe({ entryTypes: ['first-input', 'interaction'] })
      } catch (e) {
        console.log('FID/INP monitoring not supported')
      }

      // TTFB (Time to First Byte)
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationTiming) {
        const ttfb = navigationTiming.responseStart - navigationTiming.requestStart
        if ((window as any).gtag) {
          (window as any).gtag('event', 'page_view', {
            metric_name: 'TTFB',
            metric_value: ttfb,
          })
        }
      }

      // Monitor page visibility for bounce rate
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          const sessionDuration = performance.now()
          if ((window as any).gtag) {
            (window as any).gtag('event', 'session_end', {
              session_duration_ms: sessionDuration,
            })
          }
        }
      })
    }
  }, [])

  return null
}

// Utility function to report custom metrics
export function reportCustomMetric(
  metricName: string,
  metricValue: number,
  additionalData?: Record<string, any>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'custom_metric', {
      metric_name: metricName,
      metric_value: metricValue,
      ...additionalData,
    })
  }
}
