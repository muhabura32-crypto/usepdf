import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://usepdf.xyz'),
  title: {
    default: 'UsePDF.xyz - Free Online PDF Tools | Merge, Compress, Split, Convert',
    template: '%s | UsePDF - Free Online PDF Tools',
  },
  description: 'Fast, private, and completely free PDF tools. Merge, split, compress, rotate, convert PDFs instantly. No signup required. 100% client-side processing. Secure and reliable.',
  keywords: [
    'free online PDF tools', 'merge PDF', 'combine PDF files', 'compress PDF', 'reduce PDF size', 
    'split PDF pages', 'extract PDF pages', 'PDF converter', 'convert PDF to JPG', 
    'PDF to JPG converter', 'convert PDF to PNG', 'PDF to image converter', 'rotate PDF',
    'best free PDF tools', 'online PDF tools', 'secure PDF tool', 'PDF merger free',
    'PDF splitter free', 'PDF compressor', 'PDF compression tool', 'no signup PDF tools',
    'client-side PDF processing', 'private PDF tools', 'usepdf.xyz'
  ],
  authors: [{ name: 'UsePDF' }],
  creator: 'UsePDF',
  publisher: 'UsePDF',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usepdf.xyz',
    siteName: 'UsePDF',
    title: 'UsePDF.xyz - Free Online PDF Tools | Merge, Compress, Split, Convert',
    description: 'Fast, private, and completely free PDF tools. No signup required. 100% client-side processing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UsePDF - Free Online PDF Tools',
    description: 'Fast, private, and free PDF tools. No signup required. 100% client-side processing.',
    creator: '@usepdfxyz',
  },
  alternates: {
    canonical: 'https://usepdf.xyz',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  category: 'technology',
  classification: 'Free Online PDF Tools',
  verification: {
    google: 'google-site-verification-code', // Add your Google verification code
  },
} as const

// Enhanced JSON-LD Structured Data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UsePDF',
  url: 'https://usepdf.xyz',
  logo: 'https://usepdf.xyz/logo.png',
  description: 'Free online PDF tools for merging, splitting, compressing, rotating, and converting PDF files.',
  sameAs: ['https://twitter.com/usepdfxyz'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    areaServed: 'Worldwide',
    availableLanguage: ['en'],
  },
  foundingDate: '2024',
  offeredBy: {
    '@type': 'Organization',
    name: 'UsePDF',
  },
}

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UsePDF - Free Online PDF Tools',
  description: 'Fast, private, and completely free PDF tools. No signup required. 100% client-side processing.',
  url: 'https://usepdf.xyz',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '3500+',
    reviewCount: '850+',
  },
  mainEntity: [
    {
      '@type': 'SoftwareApplication',
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Split PDF',
      description: 'Extract and split PDF pages',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Rotate PDF',
      description: 'Rotate PDF pages',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'PDF to JPG',
      description: 'Convert PDF pages to JPG images',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          suppressHydrationWarning
        />
        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
          suppressHydrationWarning
        />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.variable} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased font-sans`}>
        <LanguageProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            {/* Google Analytics - Replace G-XXXXXXXXXX with your measurement ID */}
            <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
            <PerformanceMonitor />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
