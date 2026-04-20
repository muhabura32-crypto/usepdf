# SEO and Analytics Configuration Guide for UsePDF.xyz

## 1. Environment Variables Setup

Create a `.env.local` file in the project root:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console (Verification)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code-here

# Optional: Domain Configuration
NEXT_PUBLIC_DOMAIN=usepdf.xyz
NEXT_PUBLIC_BASE_URL=https://usepdf.xyz
```

## 2. Google Search Console Setup

### Step 1: Create GSC Account
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Start now"
3. Sign in with Google Account
4. Choose property type: **Domain**
5. Enter: `usepdf.xyz`

### Step 2: Verify Domain Ownership

#### Option A: DNS TXT Record (Recommended)
1. Copy the verification code from GSC
2. Add TXT record to your domain registrar
   - Registrar: (wherever you registered usepdf.xyz)
   - Record Type: TXT
   - Name: @ (or root)
   - Value: `google-site-verification=your-code`
3. Wait for DNS propagation (up to 48 hours)
4. Click "Verify" in GSC

#### Option B: HTML File Upload (via Vercel)
1. Download HTML file from GSC
2. Place in `public/` folder
3. Verify in GSC

#### Option C: HTML Tag (Easiest for Next.js)
1. Update `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  verification: {
    google: 'your-verification-code-here',
  },
}
```

### Step 3: Submit Sitemap
1. In GSC, go to "Sitemaps"
2. Enter: `https://usepdf.xyz/sitemap.xml`
3. Click "Submit"

## 3. Google Analytics 4 Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Create"
3. Property name: `UsePDF.xyz`
4. Select: **Web**
5. Website URL: `https://usepdf.xyz`
6. Accept terms and create

### Step 2: Get Measurement ID
1. After property creation, go to "Admin"
2. Under "Property", click "Data Streams"
3. Select your web stream
4. Copy the **Measurement ID** (starts with G-)

### Step 3: Add to Environment
Update `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Verify Tracking
1. Update `src/app/layout.tsx`:
```typescript
<GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
```

2. Deploy to production
3. Wait 1-2 hours
4. Check GA dashboard → Real-time → Active users
5. Visit your website, you should see yourself in real-time

## 4. Custom Events for Tool Tracking

### Setup in Google Analytics

1. Go to **Admin** → **Events**
2. Create custom events:

#### Event: tool_usage
- **Parameter 1**: tool_name (string) - e.g., "merge_pdf"
- **Parameter 2**: file_count (number) - e.g., 5
- **Parameter 3**: file_size (number) - e.g., 25.5

#### Event: conversion
- **Parameter 1**: conversion_name (string) - e.g., "pdf_merged"
- **Parameter 2**: conversion_value (number) - e.g., 1

## 5. Monitoring Performance

### Weekly Checklist
- [ ] Check Google Search Console for indexing errors
- [ ] Review Core Web Vitals in GSC
- [ ] Check real-time visitors in GA4
- [ ] Monitor top pages and traffic sources

### Monthly Checklist
- [ ] Review keyword rankings (use Ahrefs/Semrush)
- [ ] Analyze user behavior (GA4 - Pages & Screens)
- [ ] Check bounce rate trends
- [ ] Review conversion events
- [ ] Analyze traffic by device/browser

### Quarterly Checklist
- [ ] Full site audit with Lighthouse
- [ ] Review top performing content
- [ ] Update/refresh top pages
- [ ] Plan new content
- [ ] Backlink profile review

## 6. Performance Baseline (Current)

Run these commands to establish baseline:

```bash
# Build the site
npm run build

# Check bundle size
npm run analyze  # (if configured)

# Local lighthouse audit
npm install -g lighthouse
lighthouse https://usepdf.xyz --view
```

Target Lighthouse Scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+
- **PWA**: 90+

## 7. Core Web Vitals Target Metrics

Track in Google Search Console:

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

## 8. Keyword Tracking Setup

### Using Ahrefs
1. Create account at [Ahrefs](https://ahrefs.com)
2. Add project: `usepdf.xyz`
3. Go to "Rank Tracker"
4. Add keywords from `src/utils/seoMetadata.ts`
5. Monitor weekly

### Key Keywords to Track
```
Primary:
- merge PDF free
- compress PDF online
- split PDF pages
- convert PDF to JPG
- rotate PDF online

Long-tail:
- merge multiple PDF files free online
- best free PDF compressor no registration
- how to split PDF pages
- convert PDF to image quality
- rotate PDF pages online free
```

## 9. Robots.txt Verification

Check that robots.txt is served:
```bash
curl https://usepdf.xyz/robots.txt
```

Expected output:
```
User-agent: *
Allow: /
Disallow: /api/
```

## 10. Schema Markup Validation

Test all schema markup at:
[Google Rich Results Test](https://search.google.com/test/rich-results)

Or use:
[Schema.org Validator](https://validator.schema.org/)

Paste the source of your pages to validate.

## 11. Deployment Checklist

Before going live:

- [ ] HTTPS enabled (✅ Vercel default)
- [ ] Security headers configured (✅ Done)
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] GA4 measurement ID added
- [ ] Google verification meta tag added
- [ ] Core Web Vitals score 90+
- [ ] Mobile responsiveness tested
- [ ] All internal links working
- [ ] Open Graph images ready (optional)

## 12. Deployment with Vercel

### Current Setup
- **Environment**: Vercel (free tier)
- **Domain**: usepdf.xyz
- **HTTPS**: Automatic
- **CDN**: Automatic
- **Analytics**: Built-in (Vercel Analytics)

### Add Vercel Analytics (Optional)
```bash
npm install @vercel/analytics
```

Then in `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// In RootLayout component:
<Analytics />
```

## 13. Monitoring with Vercel Dashboard

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select `usepdf.xyz` project
- Monitor:
  - **Real-time analytics**
  - **Core Web Vitals**
  - **Response times**
  - **Build logs**

## 14. SEO Monitoring Tools Summary

| Tool | Purpose | Free Tier | Priority |
|------|---------|-----------|----------|
| Google Search Console | Indexing, keywords, errors | Yes | **Critical** |
| Google Analytics 4 | User behavior, conversions | Yes | **Critical** |
| Lighthouse | Performance audits | Yes | High |
| PageSpeed Insights | Performance optimization | Yes | High |
| Google Rich Results Test | Schema validation | Yes | Medium |
| Ahrefs | Keyword tracking, backlinks | Limited | Medium |
| Google Keyword Planner | Keyword research | Free | Medium |

## 15. Content Optimization Guidelines

### Blog Post Template
```markdown
---
title: [Primary Keyword + Action + Benefit]
slug: [keyword-with-dashes]
date: [YYYY-MM-DD]
updated: [YYYY-MM-DD]
author: UsePDF Team
readTime: [X min read]
category: [Guide/Tutorial/Tips/Workflow]
---

## How to [Action] - [Result] (H2)
[Introductory paragraph with primary keyword]

## Step 1: [Specific Action] (H2)
[200-300 words with detailed instructions]

## Step 2: [Specific Action] (H2)
[200-300 words with detailed instructions]

## Best Practices (H2)
[Tips and tricks]

## Common Mistakes (H2)
[What to avoid]

## FAQ (H2)
[Answer common questions about the topic]

## Conclusion (H2)
[Summarize and link to related tools]

---
Internal Links:
- Link to merge-pdf tool
- Link to compress-pdf tool
- Link to other related blog posts
```

## 16. Content Calendar

**Month 1** (April 2024):
- [ ] How to Merge PDFs (1500 words)
- [ ] Compress PDF without Quality Loss (1500 words)
- [ ] Best PDF Tools Comparison (2000 words)

**Month 2** (May 2024):
- [ ] PDF Workflow Optimization (1800 words)
- [ ] Batch PDF Processing Tips (1500 words)
- [ ] PDF Security & Privacy Guide (2000 words)

**Month 3** (June 2024):
- [ ] Advanced PDF Techniques (2000 words)
- [ ] PDF Tool Reviews (2500 words)
- [ ] Troubleshooting Guide (1500 words)

## 17. Quick Reference URLs

- **Website**: https://usepdf.xyz
- **Sitemap**: https://usepdf.xyz/sitemap.xml
- **Robots.txt**: https://usepdf.xyz/robots.txt
- **GSC**: https://search.google.com/search-console?resource_id=https://usepdf.xyz/
- **GA4**: https://analytics.google.com/
- **Vercel**: https://vercel.com/dashboard

## 18. Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Google Search Central: https://developers.google.com/search
- GA4 Help: https://support.google.com/analytics
- Schema.org: https://schema.org/
- MDN Web Docs: https://developer.mozilla.org/

---

**Document Version**: 1.0
**Last Updated**: 2024-04-19
**Next Review**: 2024-05-01

For questions about specific implementation details, refer to the SEO-IMPLEMENTATION-GUIDE.md
