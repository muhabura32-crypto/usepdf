/**
 * Core Web Vitals Optimization System
 * LCP, FID, CLS optimization with lazy loading and performance monitoring
 */

interface CoreWebVitals {
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  FCP: number | null; // First Contentful Paint
  TTI: number | null; // Time to Interactive
  TBT: number | null; // Total Blocking Time
}

interface PerformanceMetrics {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

interface ResourceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  size?: number;
  transferSize?: number;
}

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  skip?: boolean;
}

class CoreWebVitalsOptimizer {
  private vitals: CoreWebVitals;
  private metrics: PerformanceMetrics[];
  private observers: Map<string, PerformanceObserver>;
  private lazyLoadInstances: Map<string, IntersectionObserver>;
  private googleTagManagerLoaded: boolean;
  private scriptLoadQueue: Array<() => void>;

  constructor() {
    this.vitals = {
      LCP: null,
      FID: null,
      CLS: null,
      FCP: null,
      TTI: null,
      TBT: null,
    };
    this.metrics = [];
    this.observers = new Map();
    this.lazyLoadInstances = new Map();
    this.googleTagManagerLoaded = false;
    this.scriptLoadQueue = [];
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined') return;

    console.log('Initializing Core Web Vitals optimization...');

    // Use web-vital library if available
    this.initializeWebVitalMonitoring();

    // Set up performance observers
    this.setupPerformanceObservers();

    // Lazy load non-critical resources
    this.lazyLoadNonCriticalResources();

    // Optimize Google Tag Manager
    this.optimizeGTM();

    // Monitor long tasks
    this.monitorLongTasks();

    // Optimize images
    this.optimizeImages();

    // Font loading optimization
    this.optimizeFontLoading();
  }

  /**
   * Initialize web-vital library monitoring
   */
  private initializeWebVitalMonitoring(): void {
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      try {
        // @ts-ignore - web-vital types
        const { getLCP, getFID, getCLS, getFCP, getTTI, getTBT } = window['web-vital'];

        if (getLCP) {
          getLCP((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
        if (getFID) {
          getFID((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
        if (getCLS) {
          getCLS((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
        if (getFCP) {
          getFCP((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
        if (getTTI) {
          getTTI((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
        if (getTBT) {
          getTBT((metric: PerformanceMetrics) => this.handleMetric(metric));
        }
      } catch (error) {
        console.warn('web-vital library not available, using native APIs');
        this.useNativeAPIs();
      }
    } else {
      this.useNativeAPIs();
    }
  }

  /**
   * Use native Performance APIs
   */
  private useNativeAPIs(): void {
    // LCP - Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.vitals.LCP = lastEntry.startTime;
          this.addMetric('LCP', this.vitals.LCP, this.getRating(this.vitals.LCP, 2500, 4000));
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observation failed');
      }
    }

    // CLS - Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          let cls = 0;
          entryList.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          });
          this.vitals.CLS = cls;
          this.addMetric('CLS', cls, this.getRating(cls, 0.1, 0.25));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observation failed');
      }
    }

    // FCP - First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            this.vitals.FCP = entries[0].startTime;
            this.addMetric('FCP', this.vitals.FCP, this.getRating(this.vitals.FCP, 1800, 3000));
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
        this.observers.set('fcp', fcpObserver);
      } catch (e) {
        console.warn('FCP observation failed');
      }
    }

    // FID - First Input Delay (requires user interaction)
    this.setupFIDMonitoring();
  }

  /**
   * Set up FID monitoring
   */
  private setupFIDMonitoring(): void {
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          if (firstEntry) {
            this.vitals.FID = firstEntry.processingStart - firstEntry.startTime;
            this.addMetric('FID', this.vitals.FID, this.getRating(this.vitals.FID, 100, 300));
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observation failed');
      }
    }
  }

  /**
   * Set up performance observers
   */
  private setupPerformanceObservers(): void {
    // Resource timing observer
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          this.processResourceEntries(entries as ResourceEntry[]);
        });
        resourceObserver.observe({ type: 'resource', buffered: true });
      } catch (e) {
        console.warn('Resource timing observation failed');
      }
    }
  }

  /**
   * Process resource entries
   */
  private processResourceEntries(entries: ResourceEntry[]): void {
    entries.forEach(entry => {
      // Identify large resources
      if (entry.transferSize && entry.transferSize > 100000) { // > 100KB
        console.warn(`Large resource detected: ${entry.name} (${(entry.transferSize / 1024).toFixed(2)} KB)`);
      }

      // Identify slow resources
      if (entry.duration > 1000) { // > 1 second
        console.warn(`Slow resource detected: ${entry.name} (${entry.duration.toFixed(0)}ms)`);
      }
    });
  }

  /**
   * Lazy load non-critical resources
   */
  private lazyLoadNonCriticalResources(): void {
    // Lazy load images
    this.lazyLoadImages();

    // Lazy load iframes
    this.lazyLoadIframes();

    // Defer non-critical JavaScript
    this.deferNonCriticalJS();
  }

  /**
   * Lazy load images with IntersectionObserver
   */
  private lazyLoadImages(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.01,
        }
      );

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      this.lazyLoadInstances.set('images', imageObserver);
    }
  }

  /**
   * Lazy load iframes
   */
  private lazyLoadIframes(): void {
    if ('IntersectionObserver' in window) {
      const iframeObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const iframe = entry.target as HTMLIFrameElement;
              const src = iframe.getAttribute('data-src');
              if (src) {
                iframe.src = src;
                iframeObserver.unobserve(iframe);
              }
            }
          });
        },
        {
          rootMargin: '100px',
        }
      );

      document.querySelectorAll('iframe[data-src]').forEach(iframe => {
        iframeObserver.observe(iframe);
      });
    }
  }

  /**
   * Defer non-critical JavaScript
   */
  private deferNonCriticalJS(): void {
    // Defer non-critical scripts
    document.querySelectorAll('script[defer]').forEach(script => {
      if (!script.src.includes('analytics') && !script.src.includes('gtag')) {
        script.setAttribute('defer', 'true');
      }
    });

    // Preconnect to important origins
    this.addPreconnect('https://fonts.googleapis.com');
    this.addPreconnect('https://fonts.gstatic.com', true);
    this.addPreconnect('https://cdn.jsdelivr.net');
  }

  /**
   * Add preconnect link
   */
  private addPreconnect(url: string, crossOrigin?: boolean): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (crossOrigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }

  /**
   * Optimize Google Tag Manager (lazy load)
   */
  private optimizeGTM(): void {
    // Only load GTM after user interaction or idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.loadGTM();
      });
    } else {
      // Fallback: load after 3 seconds
      setTimeout(() => this.loadGTM(), 3000);
    }

    // Or load on first user interaction
    const loadOnInteraction = () => {
      if (!this.googleTagManagerLoaded) {
        this.loadGTM();
        document.removeEventListener('click', loadOnInteraction);
        document.removeEventListener('scroll', loadOnInteraction);
      }
    };

    document.addEventListener('click', loadOnInteraction);
    document.addEventListener('scroll', loadOnInteraction, { passive: true });
  }

  /**
   * Load Google Tag Manager
   */
  private loadGTM(): void {
    if (this.googleTagManagerLoaded) return;

    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    if (!gtmId) return;

    // Create GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;

    document.head.appendChild(script);
    this.googleTagManagerLoaded = true;
  }

  /**
   * Optimize image loading
   */
  private optimizeImages(): void {
    // Use modern image formats
    if ('HTMLImageElement' in window) {
      const supportsWebP = this.supportsWebP();
      const supportsAVIF = this.supportsAVIF();

      // Convert images to modern formats if possible
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          // Add loading="lazy" to non-critical images
          if (!img.closest('header') && !img.closest('.hero')) {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
          }
        }
      });
    }

    // Preload critical images
    this.preloadCriticalImages();
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  /**
   * Check AVIF support
   */
  private supportsAVIF(): boolean {
    const img = new Image();
    img.onload = () => img.height > 0;
    img.onerror = () => false;
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABoAAAAoaWluZgAAAAAAAQAAABlpbm9lAgAAAAABAABhdjAxQ29tbWVudAAAAAElFTkSuQmCC';
    return true;
  }

  /**
   * Preload critical images
   */
  private preloadCriticalImages(): void {
    const criticalImages = document.querySelectorAll('img[preload], .hero img');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.getAttribute('src') || '';
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize font loading
   */
  private optimizeFontLoading(): void {
    // Add font-display: swap to fonts
    const fontFaceStyle = document.createElement('style');
    fontFaceStyle.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }
    `;
    document.head.appendChild(fontFaceStyle);

    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  /**
   * Monitor long tasks
   */
  private monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.warn('Long task detected:', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task observation not supported');
      }
    }
  }

  /**
   * Handle metric
   */
  private handleMetric(metric: PerformanceMetrics): void {
    this.vitals[metric.name as keyof CoreWebVitals] = metric.value;
    this.addMetric(metric.name, metric.value, metric.rating);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
    }

    // Report to analytics
    this.reportToAnalytics(metric);
  }

  /**
   * Add metric
   */
  private addMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    this.metrics.push({
      metric: name,
      value,
      rating,
      delta: 0,
    });
  }

  /**
   * Get rating based on value and thresholds
   */
  private getRating(value: number, goodThreshold: number, poorThreshold: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= goodThreshold) return 'good';
    if (value <= poorThreshold) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Report to analytics
   */
  private reportToAnalytics(metric: PerformanceMetrics): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        page_path: window.location.pathname,
      });
    }
  }

  /**
   * Get Core Web Vitals
   */
  getVitals(): CoreWebVitals {
    return { ...this.vitals };
  }

  /**
   * Get metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Check if Google Tag Manager is loaded
   */
  isGTMLoaded(): boolean {
    return this.googleTagManagerLoaded;
  }

  /**
   * Lazy load component
   */
  lazyLoadComponent(componentName: string, importFn: () => Promise<any>): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              importFn().then(() => {
                console.log(`Component ${componentName} loaded`);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' }
      );

      const element = document.getElementById(`lazy-${componentName}`);
      if (element) {
        observer.observe(element);
      }
    }
  }

  /**
   * Clean up observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.lazyLoadInstances.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.lazyLoadInstances.clear();
  }

  /**
   * Get performance score
   */
  getPerformanceScore(): number {
    const weights = {
      LCP: 0.25,
      FID: 0.3,
      CLS: 0.15,
      FCP: 0.1,
      TTI: 0.1,
      TBT: 0.1,
    };

    let score = 100;

    if (this.vitals.LCP !== null) {
      if (this.vitals.LCP > 4000) score -= 25;
      else if (this.vitals.LCP > 2500) score -= 15;
    }

    if (this.vitals.FID !== null) {
      if (this.vitals.FID > 300) score -= 30;
      else if (this.vitals.FID > 100) score -= 15;
    }

    if (this.vitals.CLS !== null) {
      if (this.vitals.CLS > 0.25) score -= 15;
      else if (this.vitals.CLS > 0.1) score -= 7;
    }

    return Math.max(0, score);
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.vitals.LCP !== null && this.vitals.LCP > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by preloading critical resources and reducing server response time');
    }

    if (this.vitals.FID !== null && this.vitals.FID > 100) {
      recommendations.push('Reduce JavaScript execution time to improve First Input Delay');
    }

    if (this.vitals.CLS !== null && this.vitals.CLS > 0.1) {
      recommendations.push('Fix layout shifts by reserving space for images and ads, and avoiding dynamic content insertion');
    }

    if (this.metrics.filter(m => m.rating === 'poor').length > 0) {
      recommendations.push('Address poor performance metrics to improve user experience and SEO rankings');
    }

    return recommendations;
  }
}

export { CoreWebVitalsOptimizer };
export type { CoreWebVitals, PerformanceMetrics, ResourceEntry, LazyLoadOptions };