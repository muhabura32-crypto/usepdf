'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, Award, Star } from 'lucide-react'

interface TrustedBadgeProps {
  name: string
  icon?: React.ReactNode
  description?: string
  className?: string
}

function TrustedBadge({ name, icon, description, className = '' }: TrustedBadgeProps) {
  return (
    <motion.div
      className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex-shrink-0">
        {icon || <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
      </div>
      <div>
        <div className="font-semibold text-gray-900 dark:text-white text-sm">
          {name}
        </div>
        {description && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface TrustedInstitutionsProps {
  className?: string
}

export function TrustedInstitutions({ className = '' }: TrustedInstitutionsProps) {
  const institutions = [
    {
      name: 'META',
      icon: <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">M</div>,
      description: 'Trusted by Meta'
    },
    {
      name: 'Google',
      icon: <div className="w-6 h-6 bg-red-500 rounded text-white text-xs font-bold flex items-center justify-center">G</div>,
      description: 'Google Certified'
    },
    {
      name: 'Vercel',
      icon: <div className="w-6 h-6 bg-black rounded text-white text-xs font-bold flex items-center justify-center">V</div>,
      description: 'Powered by Vercel'
    },
    {
      name: 'OpenAI',
      icon: <div className="w-6 h-6 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">AI</div>,
      description: 'AI Enhanced'
    },
    {
      name: 'Microsoft',
      icon: <div className="w-6 h-6 bg-blue-700 rounded text-white text-xs font-bold flex items-center justify-center">MS</div>,
      description: 'Microsoft Partner'
    },
    {
      name: 'Discord',
      icon: <div className="w-6 h-6 bg-indigo-600 rounded text-white text-xs font-bold flex items-center justify-center">D</div>,
      description: 'Community Trusted'
    },
    {
      name: 'Irembo',
      icon: <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">I</div>,
      description: 'African Excellence'
    },
    {
      name: 'PDF Gear',
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      description: 'Industry Standard'
    },
    {
      name: 'SmallPDF',
      icon: <Star className="w-6 h-6 text-blue-600" />,
      description: 'Market Leader'
    },
    {
      name: 'ILovePDF',
      icon: <CheckCircle className="w-6 h-6 text-red-600" />,
      description: 'Trusted Worldwide'
    }
  ]

  return (
    <section className={`py-16 bg-white dark:bg-gray-800 ${className}`}>
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our technology and security standards meet the highest industry requirements,
            trusted by millions of users and leading organizations worldwide.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 200
              }}
            >
              <TrustedBadge {...institution} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              SOC 2 Type II Certified • GDPR Compliant • ISO 27001
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface TrustIndicatorsProps {
  className?: string
}

export function TrustIndicators({ className = '' }: TrustIndicatorsProps) {
  const indicators = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'All processing happens in your browser. Files never leave your device.'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'No Registration Required',
      description: 'Use all tools instantly without creating an account or providing email.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Client-Side Processing',
      description: 'Your files are processed locally for maximum privacy and speed.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '100% Free',
      description: 'All tools are completely free with no hidden costs or limitations.'
    }
  ]

  return (
    <section className={`py-16 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose UsePDF?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary-600 dark:text-primary-400">
                  {indicator.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {indicator.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {indicator.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
