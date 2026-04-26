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

// FAQ Schema Auto-generator
export function generateFAQSchema(faqs: Array<{question: string; answer: string}> | string[]) {
  if (typeof faqs[0] === 'string') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (faqs as string[]).map((q, index) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Answer to: ${q}`,
        },
      })),
    }
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs as Array<{question: string; answer: string}>).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: Array<{name: string; url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Tool Aggregate Rating Schema
export function generateToolRatingSchema(toolName: string, rating: number, reviewCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount: reviewCount,
    bestRating: 5,
    worstRating: 1,
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: toolName,
    },
  }
}

// How-to Schema Enhanced
export function generateHowToSchema(data: {
  title: string;
  description: string;
  steps: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
  timeRequired?: string;
  toolsRequired?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.title,
    description: data.description,
    timeRequired: data.timeRequired || 'PT15M',
    tool: data.toolsRequired || [],
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.description,
      ...(step.image && {
        image: step.image,
      }),
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

// Semantic keyword expansion
export function expandKeywordsSemantically(keyword: string): string[] {
  const expansions: Record<string, string[]> = {
    'compress': ['reduce', 'shrink', 'minimize', 'optimize', 'decrease size'],
    'merge': ['combine', 'join', 'unite', 'concatenate', 'assemble'],
    'split': ['divide', 'separate', 'extract', 'break apart', 'partition'],
    'convert': ['transform', 'change', 'translate', 'export', 'to'],
    'rotate': ['turn', 'spin', 'flip', 'orient', 'twist'],
    'pdf': ['portable document format', 'document', 'file', 'acrobat'],
    'online': ['web', 'internet', 'digital', 'cloud', 'browser'],
    'tool': ['software', 'application', 'program', 'utility', 'service'],
  }

  const result = [keyword]
  Object.entries(expansions).forEach(([key, values]) => {
    if (keyword.toLowerCase().includes(key)) {
      result.push(...values.map(v => keyword.toLowerCase().replace(key, v)))
    }
  })

   return [...new Set(result)].slice(0, 10)
}

