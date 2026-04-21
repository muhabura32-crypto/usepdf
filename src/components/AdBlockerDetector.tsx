'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

export function AdBlockerDetector() {
  const [adBlockerDetected, setAdBlockerDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if ads are blocked by trying to create an ad element
    const checkAdBlocker = async () => {
      try {
        // Try to fetch a test ad script
        const response = await fetch('https://tuxedoarbourannouncement.com/bf/93/6d/bf936dcbca5a547e4bb602e649b57d5a.js', {
          mode: 'no-cors'
        })
        
        // Alternative: Check if common ad libraries are blocked
        const adElements = document.querySelectorAll('[id^="container-"]')
        if (adElements.length === 0 && !window.atOptions) {
          setAdBlockerDetected(true)
        }
      } catch (error) {
        // If fetch fails, ad blocker might be active
        setAdBlockerDetected(true)
      }
    }

    // Run check after a delay to allow scripts to load
    const timer = setTimeout(checkAdBlocker, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!adBlockerDetected || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="container-custom py-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Ad Blocker Detected</p>
            <p className="text-sm text-white/90 mt-1">
              Please disable your ad blocker to support our free PDF tools. Your support helps us keep UsePDF.xyz completely free for everyone.
            </p>
            <p className="text-xs text-white/80 mt-2">
              💡 Tip: Add usepdf.xyz to your ad blocker's whitelist
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-white hover:text-white/80 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
