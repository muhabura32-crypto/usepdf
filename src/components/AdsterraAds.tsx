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
export function AdContainer({ 
  id, 
  className = '',
  style 
}: { 
  id: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      id={id}
      className={`adsterra-ad-container ${className}`}
      data-ad-slot={id}
      style={{ minHeight: '100px', ...style }}
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
 * Leaderboard Banner (728x90) - Best for header/footer
 */
export function LeaderboardBanner() {
  return (
    <div className="flex justify-center my-4">
      <AdContainer id="728x90_1" className="w-full max-w-full" />
    </div>
  )
}

/**
 * Medium Rectangle (300x250) - Best for sidebar
 */
export function MediumRectangle() {
  return (
    <div className="flex justify-center my-4">
      <AdContainer id="300x250_1" className="w-full" />
    </div>
  )
}

/**
 * Mobile Banner (320x50) - Best for mobile devices
 */
export function MobileBanner() {
  return (
    <div className="flex justify-center my-2 md:hidden">
      <AdContainer id="320x50_1" className="w-full" />
    </div>
  )
}

/**
 * Banner 468x60 - Half page width banner
 */
export function Banner468x60() {
  return (
    <div className="flex justify-center my-4">
      <AdContainer id="468x60_1" className="w-full" />
    </div>
  )
}

/**
 * Skyscraper (160x600) - Best for sidebars
 */
export function SkyscraperAd() {
  return (
    <div className="hidden lg:flex justify-end my-4">
      <AdContainer id="160x600_1" />
    </div>
  )
}

/**
 * Wide Skyscraper (160x300) - Best for sidebars
 */
export function WideSkyscraper() {
  return (
    <div className="flex justify-center my-4 hidden md:block">
      <AdContainer id="160x300_1" />
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
