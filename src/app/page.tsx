'use client'

import Link from 'next/link'
import React from 'react'
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
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { NativeBannerAd } from '@/components/AdsterraAds'

const tools = [
  {
    name: 'mergePdf',
    icon: Combine,
    href: '/merge-pdf',
    desc: 'Combine multiple PDFs into one seamless document',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    name: 'compressPdf',
    icon: Minimize2,
    href: '/compress-pdf',
    desc: 'Reduce PDF file size while maintaining quality',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    name: 'splitPdf',
    icon: Scissors,
    href: '/split-pdf',
    desc: 'Extract specific pages or divide PDF into parts',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    name: 'pdfToJpg',
    icon: LucideImage,
    href: '/pdf-to-jpg',
    desc: 'Convert PDF pages to high-quality JPG images',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    name: 'pdfToPng',
    icon: FileImage,
    href: '/pdf-to-png',
    desc: 'Convert PDF pages to PNG images instantly',
    color: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    name: 'rotatePdf',
    icon: RotateCw,
    href: '/rotate-pdf',
    desc: 'Rotate PDF pages by 90, 180, or 270 degrees',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    name: 'jpgToPdf',
    icon: FileImage,
    href: '/jpg-to-pdf',
    desc: 'Convert JPG images to PDF documents',
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    name: 'pngToPdf',
    icon: FileImage,
    href: '/png-to-pdf',
    desc: 'Convert PNG images to PDF format',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    name: 'imageToPdf',
    icon: LucideImage,
    href: '/image-to-pdf',
    desc: 'Convert any image format to PDF',
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
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
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merge-pdf"
                className="btn-primary px-6 py-3 text-lg"
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

      {/* Ad Section - Only one, at bottom */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <NativeBannerAd />
        </div>
      </section>
    </div>
  )
}