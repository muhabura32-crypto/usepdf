'use client'

import { useEffect } from 'react'

export function AdsterraScript() {
  useEffect(() => {
    // Load Adsterra scripts
    if (typeof window !== 'undefined') {
      // Popunder scripts
      const popunderScript1 = document.createElement('script')
      popunderScript1.src = 'https://tuxedoarbourannouncement.com/bf/93/6d/bf936dcbca5a547e4bb602e649b57d5a.js'
      popunderScript1.async = true
      document.head.appendChild(popunderScript1)

      const popunderScript2 = document.createElement('script')
      popunderScript2.src = 'https://tuxedoarbourannouncement.com/12/c5/b8/12c5b8135e28411b4621a530105e946e.js'
      popunderScript2.async = true
      document.head.appendChild(popunderScript2)

      const popunderScript3 = document.createElement('script')
      popunderScript3.src = 'https://tuxedoarbourannouncement.com/34dfef78cee11188b677b139aeba5b85/invoke.js'
      popunderScript3.async = true
      popunderScript3.setAttribute('data-cfasync', 'false')
      document.head.appendChild(popunderScript3)
    }
  }, [])

  return null
}

/**
 * Native Banner Ad with customizable dimensions
 * Default: 468x60 (half page), responsive
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

      // Load the ad script
      const script = document.createElement('script')
      script.src = 'https://tuxedoarbourannouncement.com/e90add9736aed2790832f91965dc7b23/invoke.js'
      script.async = true
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

/**
 * Popunder Ad - Appears behind browser window
 * Include div container for popunder
 */
export function PopunderAdContainer() {
  return <div id="container-34dfef78cee11188b677b139aeba5b85" />
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

export function SocialBarAd() {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
      <div className="adsterra-ad-container" />
    </div>
  )
}

export function PopunderAd() {
  return <PopunderAdContainer />
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
