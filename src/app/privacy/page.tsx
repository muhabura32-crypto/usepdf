'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Your Privacy is Our Priority
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At UsePDF, we take your privacy seriously. We are committed to being transparent about how we collect, use, and protect your data. All PDF processing happens 100% on your device—your files never leave your browser.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. What Data We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you use UsePDF, we collect minimal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Browser type and version</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent</li>
              <li>Language preference</li>
              <li>Theme preference (light/dark mode)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. What We DO NOT Do
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>We do NOT store your PDF files on our servers</li>
              <li>We do NOT track or monitor your files</li>
              <li>We do NOT share your data with third parties</li>
              <li>We do NOT use your data for advertising</li>
              <li>We do NOT require registration or login</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. How We Use Your Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The minimal data we collect is used solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Improve our service and user experience</li>
              <li>Understand how our tools are used</li>
              <li>Ensure website security and performance</li>
              <li>Provide you with better features</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. If you're concerned about security, all processing happens on your device—not on our servers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Third-Party Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our website uses Google Analytics to understand user behavior. We've configured it with privacy-friendly settings to minimize data collection and have anonymized your IP address.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Access your data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics</li>
              <li>Know exactly what data we have on you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any privacy concerns or questions, please contact us at privacy@usepdf.com
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
