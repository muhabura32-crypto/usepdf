'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By using UsePDF, you agree to these terms of service. If you do not agree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              UsePDF provides free online PDF tools including merging, compressing, splitting, rotating, and converting PDFs. All processing is done on your device in your browser.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Ensuring you have the right to use your files</li>
              <li>Not using our service for illegal purposes</li>
              <li>Not uploading malicious files</li>
              <li>Complying with all applicable laws</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              UsePDF and its content are protected by copyright and other intellectual property laws. You may use our service for personal, non-commercial purposes only.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              UsePDF is provided "as is" without warranties. We are not liable for any damages resulting from the use of our service. We do not guarantee that our tools will be error-free or uninterrupted.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Changes to Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify or discontinue our service at any time. We will provide notice of significant changes when possible.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Prohibited Activities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Attempt to hack or disrupt our service</li>
              <li>Use our service to process copyrighted material illegally</li>
              <li>Upload files with malware or viruses</li>
              <li>Engage in any illegal or fraudulent activity</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Termination
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to terminate access to our service for users who violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions about these terms, please contact us at legal@usepdf.com
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
