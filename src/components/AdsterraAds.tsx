'use client'

import { useEffect } from 'react'

/**
 * Native Banner Ad - Lightweight banner ad
 * Default: 468x60 (half page), responsive
 * Loads lazily to not impact page speed
 */
export function NativeBannerAd({ width = 468, height = 60 }: { width?: number; height?: number } = {}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set Adsterra options for native banner
      ;(window as any).atOptions = {
        key: 'e90add9736aed2790832f91965dc7b23',
        format: 'iframe',
        height: height,
        width: width,
        params: {}
      }

      // Load the ad script lazily
      const script = document.createElement('script')
      script.src = 'https://tuxedoarbourannouncement.com/e90add9736aed2790832f91965dc7b23/invoke.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [width, height])

  return (
    <div className="w-full flex justify-center my-4">
      <div className="adsterra-ad-container" style={{ minHeight: `${height}px`, minWidth: `${width}px` }} />
    </div>
  )
}

/**
 * Mobile Responsive Banner (320x50)
 */
export function MobileBannerAd() {
  return <NativeBannerAd width={320} height={50} />
}

/**
 * Leaderboard Banner (728x90)
 */
export function LeaderboardBannerAd() {
  return <NativeBannerAd width={728} height={90} />
}

/**
 * Medium Rectangle (300x250)
 */
export function MediumRectangleAd() {
  return <NativeBannerAd width={300} height={250} />
}

/**
 * Half Page Banner (468x60)
 */
export function HalfPageBannerAd() {
  return <NativeBannerAd width={468} height={60} />
}

// Legacy components for backwards compatibility
export function LeaderboardBanner() {
  return <LeaderboardBannerAd />
}

export function MobileBanner() {
  return (
    <div className="flex justify-center my-2 md:hidden">
      <MobileBannerAd />
    </div>
  )
}

export function Banner468x60() {
  return (
    <div className="flex justify-center my-4">
      <HalfPageBannerAd />
    </div>
  )
}

export function MediumRectangle() {
  return (
    <div className="flex justify-center my-4">
      <MediumRectangleAd />
    </div>
  )
}

// Generic ad container (legacy)
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