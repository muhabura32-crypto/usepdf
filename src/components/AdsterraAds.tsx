'use client'

import { useEffect } from 'react'

export function AdsterraScript() {
  useEffect(() => {
    // Initialize Adsterra ads after component mounts
    if (typeof window !== 'undefined') {
      // Adsterra script will auto-load via next script tag
      // This ensures ads are properly initialized on page load
      const script = document.createElement('script')
      script.src = 'https://a.magsrv.com/ad-provider.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  return null
}

/**
 * Adsterra Ad Container Component
 * Place this component where you want ads to appear
 * Usage: <AdContainer type="popunder" id="Popunder_1" />
 */
export function AdContainer({ id, className = '' }: { id: string; className?: string }) {
  return (
    <div
      id={id}
      className={`adsterra-ad-container ${className}`}
      data-ad-slot={id}
      style={{ minHeight: '100px' }}
    />
  )
}

/**
 * Native Banner Ad - Best for header/footer placement
 */
export function NativeBannerAd() {
  return (
    <div className="w-full my-4">
      <AdContainer id="NativeBanner_1" className="mx-auto max-w-full" />
    </div>
  )
}

/**
 * Social Bar Ad - Best for sidebar or vertical placement
 * Automatically displays as vertical social media bar
 */
export function SocialBarAd() {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
      <AdContainer id="SocialBar_1" />
    </div>
  )
}

/**
 * Popunder Ad - Appears as popup behind current window
 * Automatically handled by Adsterra script
 */
export function PopunderAd() {
  return <AdContainer id="Popunder_1" style={{ display: 'none' }} />
}
