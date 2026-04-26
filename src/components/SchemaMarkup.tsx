interface SchemaMarkupProps {
  schema: Record<string, any>
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  )
}

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UsePDF',
    url: 'https://usepdf.xyz',
    logo: 'https://usepdf.xyz/logo.png',
    description: 'Free online PDF tools for merging, splitting, compressing, and converting PDF files.',
    sameAs: [
      'https://twitter.com/usepdf',
      'https://github.com/usepdf',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-xxx-xxx-xxxx',
      contactType: 'Customer Support',
      areaServed: 'Worldwide',
      availableLanguage: ['en'],
    },
    foundingDate: '2024',
  }
  return <SchemaMarkup schema={schema} />
}

// WebApplication Schema
export function WebApplicationSchema({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'Utility',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2500',
    },
  }
  return <SchemaMarkup schema={schema} />
}

// FAQSchema
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  return <SchemaMarkup schema={schema} />
}

// BreadcrumbSchema
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <SchemaMarkup schema={schema} />
}

// BlogPosting Schema
export function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
}: {
  title: string
  description: string
  datePublished: string
  dateModified: string
  author: string
  url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
  return <SchemaMarkup schema={schema} />
}

// AggregateOffer Schema for tools
export function AggregateOfferSchema({
  toolName,
  features,
}: {
  toolName: string
  features: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    applicationCategory: 'Utility',
    description: `Free online ${toolName} tool - No registration required`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      price: '0',
      priceSortOrder: 'Ascending',
    },
    featureList: features,
    operatingSystem: 'Any',
  }
  return <SchemaMarkup schema={schema} />
}
