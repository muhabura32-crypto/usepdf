'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Zap, Shield, User } from 'lucide-react'

interface ToolDescriptionProps {
  title: string
  description: string
  features: string[]
  howTo: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export function ToolDescription({
  title,
  description,
  features,
  howTo,
  faqs,
}: ToolDescriptionProps) {
  return (
    <div className="space-y-12">
      {/* Main Description */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-8 px-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Key Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <p className="text-gray-700 dark:text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How To */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          How to Use
        </h3>
        <div className="space-y-4">
          {howTo.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FAQs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <summary className="flex items-center justify-between font-semibold text-gray-900 dark:text-white">
                {faq.question}
                <span className="text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Process your files instantly with our optimized algorithms
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">100% Secure</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your files never leave your device - client-side processing
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <User className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Always Free</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No registration, no limits, no hidden charges ever
          </p>
        </div>
      </motion.section>
    </div>
  )
}
