'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  from,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(from)
  const count = useMotionValue(from)

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => setDisplayValue(Math.round(value))
    })

    return controls.stop
  }, [count, to, duration])

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

interface LiveStatsProps {
  className?: string
}

export function LiveStats({ className = '' }: LiveStatsProps) {
  const [filesProcessed, setFilesProcessed] = useState(1250000)
  const [trustedUsers, setTrustedUsers] = useState(85000)

  useEffect(() => {
    // Simulate live updates every 3-8 seconds
    const interval = setInterval(() => {
      setFilesProcessed(prev => prev + Math.floor(Math.random() * 10) + 1)
      setTrustedUsers(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, Math.random() * 5000 + 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex flex-col sm:flex-row gap-8 ${className}`}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          <AnimatedCounter from={1200000} to={filesProcessed} duration={2} />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Files Processed
        </div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
          <AnimatedCounter from={80000} to={trustedUsers} duration={2} />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Trusted Users
        </div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
          4.9
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Average Rating
        </div>
      </motion.div>
    </div>
  )
}
