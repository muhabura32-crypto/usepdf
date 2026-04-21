'use client'

import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Combine,
  Minimize2,
  Scissors,
  Image as LucideImage,
  RotateCw,
  FileImage,
  ArrowRight,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Smartphone,
  Users,
  Award,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { sampleReviews } from '@/components/RatingSystem'
import { NativeBannerAd, LeaderboardBannerAd, MobileBannerAd, MediumRectangleAd } from '@/components/AdsterraAds'
import dynamic from 'next/dynamic'

// Dynamically import heavy components for better performance
const LiveStats = dynamic(() => import('@/components/AnimatedCounter').then(mod => ({ default: mod.LiveStats })), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
})

const TrustedInstitutions = dynamic(() => import('@/components/TrustedInstitutions').then(mod => ({ default: mod.TrustedInstitutions })), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
})

const TrustIndicators = dynamic(() => import('@/components/TrustedInstitutions').then(mod => ({ default: mod.TrustIndicators })), {
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
})

const ReviewSection = dynamic(() => import('@/components/RatingSystem').then(mod => ({ default: mod.ReviewSection })), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
})

// All 6 professional tools with enhanced SEO data
const tools = [
  {
    name: 'mergePdf',
    icon: Combine,
    href: '/merge-pdf',
    desc: 'Combine multiple PDFs into one seamless document. Merge, join, and combine PDF files online for free.',
    shortDesc: 'Combine multiple PDFs into one',
    longTail: 'merge PDF files online free, combine PDFs without software, best free PDF merger, merge PDFs on Mac and Windows, combine PDF documents online secure',
    rating: 4.9,
    reviews: 1240,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    working: true,
    popular: true,
  },
  {
    name: 'compressPdf',
    icon: Minimize2,
    href: '/compress-pdf',
    desc: 'Reduce PDF file size while maintaining quality. Compress, shrink, and optimize PDF files instantly.',
    shortDesc: 'Reduce PDF file size',
    longTail: 'compress PDF online free, reduce PDF file size, PDF compression tool, shrink PDF without losing quality, best PDF compressor 2025',
    rating: 4.8,
    reviews: 980,
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    working: true,
    popular: true,
  },
  {
    name: 'splitPdf',
    icon: Scissors,
    href: '/split-pdf',
    desc: 'Extract specific pages or divide PDF into parts. Split, extract, and separate PDF pages easily.',
    shortDesc: 'Extract pages from PDF',
    longTail: 'split PDF pages online, extract pages from PDF, PDF splitter tool, separate PDF files, how to split PDF into multiple files',
    rating: 4.7,
    reviews: 850,
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    working: true,
    popular: true,
  },
  {
    name: 'pdfToJpg',
    icon: LucideImage,
    href: '/pdf-to-jpg',
    desc: 'Convert PDF pages to high-quality JPG images. Extract images from PDF quickly and easily.',
    shortDesc: 'Convert PDF to JPG images',
    longTail: 'convert PDF to JPG online free, PDF to image converter, extract images from PDF, best PDF to JPG tool, batch PDF to image conversion',
    rating: 4.9,
    reviews: 1120,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    working: true,
    popular: true,
  },
  {
    name: 'pdfToPng',
    icon: FileImage,
    href: '/pdf-to-png',
    desc: 'Convert PDF pages to PNG images instantly. Get high-resolution PNG files from your PDFs.',
    shortDesc: 'Convert PDF to PNG',
    longTail: 'convert PDF to PNG online, PDF to PNG converter free, extract PNG from PDF, transparent PNG from PDF, batch convert PDF to PNG',
    rating: 4.8,
    reviews: 650,
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    working: true,
    popular: false,
  },
  {
    name: 'rotatePdf',
    icon: RotateCw,
    href: '/rotate-pdf',
    desc: 'Rotate PDF pages by 90, 180, or 270 degrees. Fix orientation issues in seconds.',
    shortDesc: 'Rotate PDF pages',
    longTail: 'rotate PDF pages online, fix PDF orientation, PDF rotation tool, rotate all pages in PDF, best PDF rotator free',
    rating: 4.6,
    reviews: 420,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    working: true,
    popular: false,
  },
  {
    name: 'jpgToPdf',
    icon: FileImage,
    href: '/jpg-to-pdf',
    desc: 'Convert JPG images to PDF documents. Transform photos and images into professional PDFs.',
    shortDesc: 'Convert JPG to PDF',
    longTail: 'convert JPG to PDF online free, JPG to PDF converter, image to PDF, photo to PDF, best JPG to PDF tool',
    rating: 4.8,
    reviews: 890,
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    working: true,
    popular: false,
  },
  {
    name: 'pngToPdf',
    icon: FileImage,
    href: '/png-to-pdf',
    desc: 'Convert PNG images to PDF while preserving transparency. Perfect for logos and graphics.',
    shortDesc: 'Convert PNG to PDF',
    longTail: 'convert PNG to PDF online, PNG to PDF converter free, transparent PNG to PDF, image to PDF with transparency',
    rating: 4.7,
    reviews: 720,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    working: true,
    popular: false,
  },
  {
    name: 'wordToPdf',
    icon: FileText,
    href: '/word-to-pdf',
    desc: 'Convert Word documents to PDF format. Preserve formatting, fonts, and layout perfectly.',
    shortDesc: 'Convert Word to PDF',
    longTail: 'convert Word to PDF online, DOC to PDF converter, DOCX to PDF, Word document to PDF free, best Word to PDF tool',
    rating: 4.9,
    reviews: 1050,
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    working: false,
    popular: false,
  },
  {
    name: 'imageToPdf',
    icon: LucideImage,
    href: '/image-to-pdf',
    desc: 'Convert any image format to PDF. Supports JPG, PNG, GIF, WebP, BMP, TIFF and more.',
    shortDesc: 'Convert Images to PDF',
    longTail: 'convert image to PDF online, multiple images to PDF, photo to PDF converter, any image format to PDF',
    rating: 4.8,
    reviews: 680,
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    working: true,
    popular: false,
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process PDFs in milliseconds with our advanced client-side processing engine',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your files never leave your device. 100% private, encrypted, and secure.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Desktop, tablet, or phone - perfect experience on any device',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: CheckCircle,
    title: 'No Signup Required',
    description: 'Just drop your file and go. No account, no waiting, no limits.',
    color: 'from-purple-400 to-pink-500',
  },
]

// Tool Card with Ratings and Long-tail Keywords
function ToolCard({ tool, index }: { tool: typeof tools[0], index: number }) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Link
        href={tool.href}
        className={`relative ${tool.bg} rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full ${!tool.working ? 'opacity-75' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-transparent" />
        </div>

        {/* Popular Badge */}
        {tool.popular && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Popular</span>
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {tool.rating && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {tool.rating} ({tool.reviews.toLocaleString()})
              </span>
            </div>
          </div>
        )}

        {/* Icon */}
        <div className={`relative w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 hidden sm:flex`}>
          <tool.icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-grow hidden sm:block">
          {t(tool.name)}
        </h3>

        {/* Mobile: Show name smaller */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 sm:hidden">
          {t(tool.name)}
        </h3>

        {/* Description - Always visible on desktop, hidden on mobile */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm flex-grow hidden sm:block">
          {t(tool.name + 'Desc')}
        </p>

        {/* Long-tail Keywords - Show on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-4"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2 pb-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="font-semibold">SEO: </span>{tool.longTail}
          </p>
        </motion.div>

        {/* CTA */}
        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors mt-auto">
          {t('useTool') || 'Use Tool'}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
        </div>

        {/* Hover Effect */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
      </Link>
    </motion.div>
  )
}

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section with simpler gradient background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-slate-950/90" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Animated Background Elements - hidden on small screens */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-20 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 text-white drop-shadow-lg">
              Free PDF Tools
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Fast, private, and completely free PDF tools. No signup required. Process your files instantly with professional-grade quality.
            </p>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-10"
            >
              <LiveStats className="justify-center" />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
            >
              <Link
                href="/merge-pdf"
                className="btn-primary text-base sm:text-lg px-5 sm:px-7 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-xl inline-flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
              <Link
                href="#tools"
                className="btn-secondary text-base sm:text-lg px-5 sm:px-7 py-3 sm:py-4 border-2 border-white/30 hover:border-white/50 hover:bg-white/10 inline-flex items-center justify-center"
              >
                View All Tools
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Advertisement Banner Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container-custom">
          {/* Leaderboard Banner (728x90) - Desktop */}
          <div className="hidden sm:block mb-3">
            <LeaderboardBannerAd />
          </div>
          {/* Mobile Banner (320x50) - Mobile */}
          <div className="flex justify-center my-2 md:hidden">
            <MobileBannerAd />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Professional PDF Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to work with PDF files. Fast, secure, and completely free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <ToolCard key={tool.href} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose UsePDF?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Built for professionals who demand the best in speed, security, and quality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Section - Medium Rectangle */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 flex justify-center">
        <div className="w-full max-w-fit">
          <MediumRectangleAd />
        </div>
      </section>

      {/* Trust Indicators */}
      <div className="hidden lg:block">
        <TrustIndicators />
      </div>

      {/* Trusted Institutions */}
      <div className="hidden lg:block">
        <TrustedInstitutions />
      </div>

      {/* Reviews Section */}
      <div className="hidden lg:block">
        <ReviewSection
          averageRating={4.9}
          totalReviews={1250}
          reviews={sampleReviews}
        />
      </div>

      {/* Adsterra Native Banner Ad */}
      <section className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <NativeBannerAd />
        </div>
      </section>
    </div>
  )
}