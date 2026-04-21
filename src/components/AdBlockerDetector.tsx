'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    atOptions?: unknown
  }
}

export const AdBlockerDetector = () => {
  const [detected, setDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let signals = 0

    const runChecks = async () => {
      // 1️⃣ BAIT ELEMENT CHECK
      const bait = document.createElement('div')
      bait.className = 'adsbox ad-banner ad-container'
      bait.style.position = 'absolute'
      bait.style.height = '10px'
      bait.style.width = '10px'
      bait.style.left = '-9999px'

      document.body.appendChild(bait)

      const blocked =
        bait.offsetHeight === 0 ||
        getComputedStyle(bait).display === 'none' ||
        getComputedStyle(bait).visibility === 'hidden'

      if (blocked) signals++

      bait.remove()

      // 2️⃣ SCRIPT LOAD CHECK (real ad script test)
      const scriptBlocked = await new Promise<boolean>((resolve) => {
        const script = document.createElement('script')

        script.src =
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

        script.onload = () => resolve(false)
        script.onerror = () => resolve(true)

        document.body.appendChild(script)

        setTimeout(() => resolve(false), 3000)
      })

      if (scriptBlocked) signals++

      // 3️⃣ GLOBAL ADS OBJECT CHECK
      if (typeof window.atOptions === 'undefined') {
        signals++
      }

      // 🎯 FINAL DECISION (threshold)
      if (signals >= 2) {
        setDetected(true)
      }
    }

    const timer = setTimeout(runChecks, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!detected || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg">
      <div className="container-custom py-3 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-1" />
          <div>
            <p className="font-semibold">Ad Blocker Detected</p>
            <p className="text-sm text-white/90">
              Please disable your ad blocker to support our free PDF tools.
            </p>
            <p className="text-xs text-white/70 mt-1">
              Supporting ads keeps this platform free ⚡
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="hover:opacity-70 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}