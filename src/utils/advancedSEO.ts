/**
 * Advanced SEO Enhancements
 * Structured data, performance metrics, and indexing optimization
 */

// Breadcrumb schema for navigation SEO
export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://usepdf.xyz',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Tools',
      item: 'https://usepdf.xyz/#tools',
    },
  ],
}

// FAQSchema for rich snippets in search results
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is UsePDF secure and private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! UsePDF processes all files 100% on your browser (client-side). No files are uploaded to any server. Your documents never leave your device, ensuring complete privacy and security.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use UsePDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No! UsePDF is completely free and requires no signup or registration. Simply visit our site and start using any of our PDF tools immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there file size limits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No! Since processing happens locally in your browser, there are no file size restrictions. You can merge, split, compress, and convert PDFs of any size.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is UsePDF really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All UsePDF tools are completely free. We do not charge any fees for any of our services. No hidden costs, no premium versions required.',
      },
    },
  ],
}

// Product schema - for each tool
export function createToolProductSchema(toolName: string, toolUrl: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: description,
    applicationCategory: 'UtilityApplication',
    url: toolUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'UsePDF',
      url: 'https://usepdf.xyz',
    },
  }
}

// How-to schema for tutorials/instructions
export function createHowToSchema(toolName: string, steps: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${toolName}`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: step,
    })),
  }
}

// Page speed optimization recommendations
export const performanceRecommendations = {
  targetLCP: 2500, // Largest Contentful Paint (ms)
  targetFID: 100, // First Input Delay (ms)
  targetCLS: 0.1, // Cumulative Layout Shift
}

// Core Web Vitals monitoring
export function trackCoreWebVitals() {
  if (typeof window !== 'undefined' && 'web-vital' in window) {
    const vitals = {
      LCP: null,
      FID: null,
      CLS: null,
    }
    return vitals
  }
}

// SEO checklist for monitoring
export const seoChecklist = {
  metadata: [
    'Meta title (50-60 chars)',
    'Meta description (150-160 chars)',
    'Target keywords in title and description',
    'H1 tag present and relevant',
    'Multiple H2/H3 hierarchy',
  ],
  technicalSEO: [
    'Mobile responsive design',
    'Page speed < 3s (FCP)',
    'HTTPS/SSL enabled',
    'XML sitemap submitted',
    'robots.txt configured',
    'Canonical tags in place',
    'Open Graph tags',
    'Schema markup (JSON-LD)',
  ],
  onPageSEO: [
    'Internal links to related pages',
    'Image alt text optimization',
    'Text content > 300 words',
    'Focus keyword in first 100 words',
    'Keyword density 1-2%',
  ],
  linkingSEO: [
    'Backlink profile quality',
    'No broken internal links',
    'Descriptive anchor text',
  ],
}
