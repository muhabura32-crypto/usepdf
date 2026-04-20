'use client'

import { motion } from 'framer-motion'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto prose dark:prose-invert prose-sm sm:prose-base"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            Cookie Policy
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, understand how you use our service, and provide you with a better experience.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Preference Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We use these cookies to remember your language preference, theme selection (light/dark mode), and other user preferences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  These cookies help us understand how visitors interact with our website, which pages are most popular, and how we can improve our service.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Your Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All PDF processing on UsePDF happens 100% on your device. We never store, transmit, or process your files on our servers. Your cookies contain no personal data from your uploaded files.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Managing Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking some cookies may affect your experience on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about our cookie policy, please contact us at privacy@usepdf.com
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            Last updated: April 2024
          </p>
        </motion.div>
      </div>
    </div>
  )
}
