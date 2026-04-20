'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  FileText,
  Scissors,
  Archive,
  RotateCw,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const tools = [
  { name: 'mergePdf', href: '/merge-pdf', icon: FileText },
  { name: 'splitPdf', href: '/split-pdf', icon: Scissors },
  { name: 'compressPdf', href: '/compress-pdf', icon: Archive },
  { name: 'rotatePdf', href: '/rotate-pdf', icon: RotateCw },
  { name: 'pdfToJpg', href: '/pdf-to-jpg', icon: ImageIcon },
  { name: 'pdfToPng', href: '/pdf-to-png', icon: ImageIcon }
]

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: '#', icon: Youtube }
]

const pages = [
  { name: 'home', href: '/' },
  { name: 'blog', href: '/blog' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
  { name: 'privacy', href: '/privacy' },
  { name: 'terms', href: '/terms' },
  { name: 'cookies', href: '/cookies' }
]

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  const { t } = useLanguage()

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.webp"
                alt="UsePDF"
                width={32}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
              <span className="text-xl font-bold">UsePDF</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@usepdf.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('tools')}</h3>
            <ul className="space-y-3">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                      <Icon className="w-4 h-4 group-hover:text-primary-400 transition-colors" />
                      <span className="text-sm">{t(tool.name)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {pages.slice(0, 4).map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {t(page.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              {pages.slice(4).map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {t(page.name)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">{t('followUs')}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              {t('copyright')}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>🇺🇸 English</span>
              <span>🇫🇷 Français</span>
              <span>🇪🇸 Español</span>
              <span>🇩🇪 Deutsch</span>
              <span>🇵🇹 Português</span>
              <span>🇷🇼 Kinyarwanda</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
