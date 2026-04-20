'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Shield, Zap, Users, Award, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your data is your own. We use 100% client-side processing, meaning your files never leave your device.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Advanced algorithms process PDFs in milliseconds, not seconds. Experience the fastest PDF tools available.',
    },
    {
      icon: Users,
      title: 'User Focused',
      description: 'Every feature is designed around what users actually need. Simple, intuitive, and powerful.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every tool undergoes rigorous testing to ensure consistent, reliable, professional-grade results.',
    },
    {
      icon: Globe,
      title: 'Globally Accessible',
      description: 'Available in 6 languages and works on all devices, anywhere in the world.',
    },
    {
      icon: Heart,
      title: 'Forever Free',
      description: 'No hidden fees, no subscriptions, no ads. Always free for everyone, everywhere.',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About UsePDF
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We're on a mission to make PDF processing simple, fast, and secure for everyone. Built by developers, for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                UsePDF was born from frustration. We were tired of complicated, slow, and expensive PDF tools. We wanted something better — something that actually worked the way users expected.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                So we built it ourselves. Starting with a simple vision: free, fast, and secure PDF tools that respect user privacy.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, millions of users trust UsePDF for their PDF needs. We're proud to have helped process over 1 billion files while maintaining 100% privacy.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-3xl shadow-2xl opacity-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1B+', label: 'Files Processed' },
              { value: '85K+', label: 'Daily Active Users' },
              { value: '6', label: 'Languages Supported' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
