# 🎯 Adsterra Ad Units Deployment Map - UsePDF.xyz

**Total Ad Units:** 9 Active  
**Deployment Status:** ✅ Live  
**Last Updated:** April 21, 2026

---

## 📍 Homepage Ad Placements

### Section 1: Hero to Tools Transition
```
┌─────────────────────────────────────┐
│     HERO SECTION (White space)      │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  🎯 LEADERBOARD BANNER (728x90)     │  ← Desktop only
│     ID: 728x90_1 (29108694)         │
├─────────────────────────────────────┤
│  📱 MOBILE BANNER (320x50)          │  ← Mobile only (hidden md:)
│     ID: 320x50_1 (29108693)         │
└─────────────────────────────────────┘
         ↓
    TOOLS SECTION
```

### Section 2: Features to Trust Indicators
```
    FEATURES SECTION
         ↓
┌─────────────────────────────────────┐
│  ⬜ MEDIUM RECTANGLE (300x250)      │
│     ID: 300x250_1 (29108690)        │  ← Centered, responsive
│     Common ad type, high CTR        │
└─────────────────────────────────────┘
         ↓
  TRUST INDICATORS (Desktop only)
```

### Section 3: Footer Area
```
  REVIEW SECTION (Desktop only)
         ↓
┌─────────────────────────────────────┐
│  🎯 NATIVE BANNER                   │
│     ID: NativeBanner_1 (29053362)   │  ← Full width, before footer
└─────────────────────────────────────┘
```

### Global Placements
```
┌─────────────────────────────────────┐
│  🎭 POPUNDER                        │  ← Auto-triggers on user action
│     ID: Popunder_1 (29053361)       │  ← Behind browser window
├─────────────────────────────────────┤
│  📊 SOCIAL BAR (fixed right side)   │  ← Sticky vertical bar
│     ID: SocialBar_1 (29053363)      │  ← Right sidebar
└─────────────────────────────────────┘
```

---

## 📊 All 9 Ad Units Configuration

| # | Ad Type | ID | Component | Size | Placement | Active |
|---|---------|--|-----------|----|-----------|--------|
| 1 | Popunder | 29053361 | `PopunderAd` | N/A | Global (auto-trigger) | ✅ |
| 2 | Native Banner | 29053362 | `NativeBannerAd` | Responsive | Footer section | ✅ |
| 3 | Social Bar | 29053363 | `SocialBarAd` | Vertical | Fixed right sidebar | ✅ |
| 4 | Leaderboard | 29108694 | `LeaderboardBanner` | 728x90 | After hero (desktop) | ✅ |
| 5 | Half-Page Banner | 29108689 | `Banner468x60` | 468x60 | Available for tool pages | ✅ |
| 6 | Medium Rectangle | 29108690 | `MediumRectangle` | 300x250 | Between features & trust | ✅ |
| 7 | Wide Skyscraper | 29108691 | `WideSkyscraper` | 160x300 | Available (desktop only) | ✅ |
| 8 | Skyscraper | 29108692 | `SkyscraperAd` | 160x600 | Available (lg: only) | ✅ |
| 9 | Mobile Banner | 29108693 | `MobileBanner` | 320x50 | After hero (mobile) | ✅ |

---

## 🛠 Component Usage Guide

### Already Deployed (Homepage)

```typescript
// Import
import { 
  LeaderboardBanner, 
  MobileBanner, 
  MediumRectangle, 
  NativeBannerAd 
} from '@/components/AdsterraAds'

// After hero section
<LeaderboardBanner />  {/* Desktop: 728x90 */}
<MobileBanner />       {/* Mobile: 320x50 */}

// Between features and trust
<MediumRectangle />    {/* Center: 300x250 */}

// Before footer
<NativeBannerAd />     {/* Full width: Native */}
```

### Add to Tool Pages

```typescript
// In any tool page (e.g., /merge-pdf/page.tsx)
import { Banner468x60, SkyscraperAd, MediumRectangle } from '@/components/AdsterraAds'

export default function MergePdfPage() {
  return (
    <div>
      {/* Tool content */}
      
      {/* Add ads strategically */}
      <Banner468x60 />          {/* 468x60 banner */}
      <MediumRectangle />       {/* 300x250 sidebar */}
      <SkyscraperAd />          {/* 160x600 sidebar */}
    </div>
  )
}
```

### All Available Components

```typescript
import {
  AdsterraScript,        // Initialize script (in layout.tsx)
  PopunderAd,            // Global popunder
  NativeBannerAd,        // Native banner
  SocialBarAd,           // Right sidebar bar
  LeaderboardBanner,     // 728x90 (desktop)
  Banner468x60,          // 468x60 half-page
  MediumRectangle,       // 300x250 medium
  WideSkyscraper,        // 160x300 (desktop)
  SkyscraperAd,          // 160x600 (large)
  MobileBanner,          // 320x50 (mobile)
  AdContainer            // Custom ad container
} from '@/components/AdsterraAds'
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- ✅ Mobile Banner (320x50) - After hero
- ✅ Medium Rectangle (300x250) - Center
- ✅ Native Banner (full width) - Footer
- ✅ Popunder (auto)
- ❌ Leaderboard (hidden)
- ❌ Social Bar (right side, but non-intrusive)
- ❌ Skyscraper sizes (hidden)

### Tablet (768px - 1024px)
- ✅ All mobile ads
- ✅ Leaderboard (728x90)
- ✅ 468x60 banner
- ❌ Large skyscrapers (hidden)

### Desktop (> 1024px)
- ✅ All ads visible
- ✅ Leaderboard (728x90)
- ✅ Medium Rectangle (300x250)
- ✅ All banner sizes
- ✅ Skyscrapers (160x600)
- ✅ Social Bar (fixed right)

---

## 💰 Revenue Optimization Tips

### Expected RPM by Ad Type

| Ad Type | CPM Range | Best Placement |
|---------|-----------|---|
| Popunder | $10-50 | Global (auto) |
| Native Banner | $2-8 | Footer/content |
| Leaderboard (728x90) | $3-12 | Header/footer |
| Medium Rectangle (300x250) | $4-15 | Content middle |
| Skyscraper (160x600) | $5-20 | Right sidebar |
| Mobile Banner (320x50) | $2-6 | Between content |

### Placement Strategy

1. **High Traffic Area** (Hero to Tools): Leaderboard + Mobile
2. **Mid-Content**: Medium Rectangle (300x250)
3. **Footer**: Native Banner
4. **Always On**: Popunder + Social Bar

### Next Steps for More Revenue

1. ✅ Homepage: 4 ad placements active
2. 📋 Add to tool pages: +6 more placements
   - 10 tool pages × 1-2 ads each = 10-20 new placements
   - Expected additional: +$20-50/month

3. 📋 Add blog section (optional)
   - Blog posts with ads between sections
   - 300x250 Medium Rectangle performs best

---

## 🔍 Testing Checklist

- [ ] Visit homepage (disable ad blocker)
- [ ] Check Leaderboard appears after hero (desktop)
- [ ] Check Mobile Banner appears (mobile view)
- [ ] Check Medium Rectangle between features
- [ ] Check Native Banner before footer
- [ ] Check Social Bar on right side
- [ ] Check Popunder triggers (click anything on page)
- [ ] Check browser console for errors (F12)
- [ ] Verify all ads have correct IDs in DevTools

---

## 📊 Monitoring Dashboard

**Adsterra Dashboard:** https://adsterra.com/publisher/dashboard

Track daily:
- Impressions per ad unit
- RPM (Revenue Per Mille)
- CTR (Click-Through Rate)
- Total earnings

---

## 🚀 Next Actions

### Priority 1: Verify Homepage
1. Disable ad blocker on usepdf.xyz
2. Check all 4 homepage ad placements load
3. Monitor earnings in Adsterra dashboard

### Priority 2: Add to Tool Pages (2-3 hours)
Tools to update:
- /merge-pdf/page.tsx
- /compress-pdf/page.tsx
- /split-pdf/page.tsx
- /pdf-to-jpg/page.tsx
- /pdf-to-png/page.tsx
- /rotate-pdf/page.tsx
- /png-to-pdf/page.tsx
- /jpg-to-pdf/page.tsx
- /word-to-pdf/page.tsx
- /image-to-pdf/page.tsx

Example pattern for each tool page:
```typescript
// At top
import { Banner468x60, MediumRectangle } from '@/components/AdsterraAds'

// Before results
<Banner468x60 />
<MediumRectangle />
```

### Priority 3: Monitor & Optimize
- Check daily earnings (first week)
- Monitor which ads have highest CTR
- Adjust placement if needed
- Track keywords in Google Search Console

---

## ✅ Summary

**What's Live:**
- ✅ 9 Adsterra ad units configured
- ✅ 4 ad placements on homepage
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Popunder + Social Bar global

**Current Potential:**
- Estimated monthly: $100-300 (with current traffic)
- With tool page ads: $150-500/month possible
- With more traffic (SEO): $500+/month potential

**Files Updated:**
- src/components/AdsterraAds.tsx (8 components)
- src/app/page.tsx (3 ad sections)
- Deployment: ✅ Live on GitHub + Vercel

---

**Last Commit:** f860975  
**Status:** Ready for monitoring  
**Next Check:** Monitor Adsterra dashboard for first 24-48 hours

