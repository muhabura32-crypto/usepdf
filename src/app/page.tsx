'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Combine,
  Minimize2,
  Scissors,
  Image as LucideImage,
  RotateCw,
  FileImage,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Search,
  ChevronRight,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { NativeBannerAd, LeaderboardBannerAd, MobileBannerAd } from '@/components/AdsterraAds'
import { trackEvent } from '@/lib/seo-initialize'

// Track session for behavioral analysis
const sessionId = `home_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`

// Enhanced tools data with SEO metadata
const tools = [
  {
    name: 'mergePdf',
    icon: Combine,
    href: '/merge-pdf',
    desc: 'Combine multiple PDFs into one seamless document',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    keywords: ['merge', 'combine', 'pdf', 'join'],
  },
  {
    name: 'compressPdf',
    icon: Minimize2,
    href: '/compress-pdf',
    desc: 'Reduce PDF file size while maintaining quality',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    keywords: ['compress', 'reduce', 'size', 'pdf'],
  },
  {
    name: 'splitPdf',
    icon: Scissors,
    href: '/split-pdf',
    desc: 'Extract specific pages or divide PDF into parts',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    keywords: ['split', 'extract', 'divide', 'pdf'],
  },
  {
    name: 'pdfToJpg',
    icon: LucideImage,
    href: '/pdf-to-jpg',
    desc: 'Convert PDF pages to high-quality JPG images',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    keywords: ['convert', 'pdf', 'jpg', 'image'],
  },
  {
    name: 'pdfToPng',
    icon: FileImage,
    href: '/pdf-to-png',
    desc: 'Convert PDF pages to PNG images instantly',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    keywords: ['convert', 'pdf', 'png', 'image'],
  },
  {
    name: 'rotatePdf',
    icon: RotateCw,
    href: '/rotate-pdf',
    desc: 'Rotate PDF pages by 90, 180, or 270 degrees',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    keywords: ['rotate', 'pdf', 'orientation', 'flip'],
  },
  {
    name: 'jpgToPdf',
    icon: FileImage,
    href: '/jpg-to-pdf',
    desc: 'Convert JPG images to PDF documents',
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    keywords: ['convert', 'jpg', 'pdf', 'image'],
  },
  {
    name: 'pngToPdf',
    icon: FileImage,
    href: '/png-to-pdf',
    desc: 'Convert PNG images to PDF format',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    keywords: ['convert', 'png', 'pdf', 'image'],
  },
  {
    name: 'imageToPdf',
    icon: LucideImage,
    href: '/image-to-pdf',
    desc: 'Convert any image format to PDF',
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    keywords: ['convert', 'image', 'pdf', 'any'],
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process PDFs in milliseconds with client-side processing',
  },
  {
    icon: Shield,
    title: '100% Private',
    description: 'Your files never leave your device. Bank-level security.',
  },
  {
    icon: CheckCircle,
    title: 'No Signup Required',
    description: 'Just drop your file and go. No account needed.',
  },
]

// Searchable tools including programmatic pages
const allSearchableTools = [
  ...tools,
  // Programmatic page templates
  { name: 'programmatic/compress-online', href: '/compress-pdf-online-for-email', desc: 'Compress PDF for email', keywords: ['compress', 'online', 'email'] },
  { name: 'programmatic/merge-pdfs', href: '/merge-pdfs-online-free', desc: 'Merge PDFs online free', keywords: ['merge', 'online', 'free'] },
  { name: 'programmatic/pdf-mobile', href: '/pdf-tools-on-android', desc: 'PDF tools for Android', keywords: ['pdf', 'android', 'mobile'] },
]

function ToolCard({ tool, index }: { tool: typeof tools[0], index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        href={tool.href}
        className={`${tool.bg} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-200 dark:border-gray-700 flex items-center gap-4 group`}
        onClick={() => {
          trackEvent(sessionId, 'tool_click', tool.name, {
            href: tool.href,
            position: index,
            location: 'homepage_tools_grid'
          })
        }}
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <tool.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {t(tool.name)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {t(tool.name + 'Desc')}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<typeof allSearchableTools[0]>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 2) {
      const query = searchQuery.toLowerCase()
      const results = allSearchableTools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.keywords?.some(k => k.includes(query))
      ).slice(0, 8)
      setSearchResults(results)
      setShowSearchResults(true)
      
      trackEvent(sessionId, 'search_query', query, { 
        location: 'homepage_search',
        resultCount: results.length 
      })
    } else {
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Track page view
  useEffect(() => {
    trackEvent(sessionId, 'page_view', 'homepage', { path: '/' })
  }, [])

  const handleSearchResultClick = (tool: typeof allSearchableTools[0]) => {
    trackEvent(sessionId, 'search_result_click', tool.name, {
      query: searchQuery,
      position: allSearchableTools.indexOf(tool)
    })
    setShowSearchResults(false)
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen pb-20">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'UsePDF - Free PDF Tools',
            description: 'Fast, secure, and free online PDF tools. Merge, split, compress, convert, and rotate PDFs instantly. No signup required.',
            url: 'https://usepdf.xyz',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '10000+',
            },
            featureList: [
              'Free to use online',
              'No registration required',
              '100% client-side processing',
              'Secure and private',
              'Fast processing',
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Free PDF Tools
              <span className="block text-primary-400">Online & Secure</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Fast, private, and completely free PDF tools. Merge, compress, split, convert PDFs instantly. No signup required.
            </p>
            
            {/* Smart Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="✨ Search 1000+ PDF tools... (e.g., 'compress pdf for email')"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
              </div>

              {/* Search Results Dropdown */}
               {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      onClick={() => handleSearchResultClick(tool)}
                    >
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {tool.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}

              {/* SEO Badges */}
              {searchQuery && (
                <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    1000+ tools
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    Instant results
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merge-pdf"
                className="btn-primary px-6 py-3 text-lg"
                onClick={() => trackEvent(sessionId, 'cta_click', 'get_started', { location: 'hero' })}
              >
                Get Started Free
              </Link>
              <Link
                href="#tools"
                className="btn-secondary px-6 py-3 text-lg"
              >
                View All Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🔝 Top Ad - Soft Entry */}
      <section className="py-6 bg-gray-100 dark:bg-gray-900">
        <div className="container-custom">
          <LeaderboardBannerAd />
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All PDF Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Professional-grade PDF tools, completely free. No signup, no limits.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <ToolCard key={tool.href} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 💰 Middle Ad - Money Zone */}
      <section className="py-6 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <NativeBannerAd />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📱 Bottom Ad - Before Footer */}
      <section className="py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <MobileBannerAd />
        </div>
      </section>

      {/* Sticky Bottom Ad - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-2 md:hidden z-40">
        <NativeBannerAd height={50} />
      </div>
    </div>
  )
}