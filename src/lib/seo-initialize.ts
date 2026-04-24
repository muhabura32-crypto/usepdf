/**
 * SEO Growth Engine Initialization
 * Bootstraps all SEO systems
 */

import { SEOOrchestrator } from './seo-orchestrator';

let seoOrchestrator: SEOOrchestrator | null = null;

/**
 * Initialize SEO Growth Engine
 */
export async function initializeSEO(): Promise<SEOOrchestrator | null> {
  try {
    if (seoOrchestrator) {
      console.log('SEO engine already initialized');
      return seoOrchestrator;
    }

    seoOrchestrator = new SEOOrchestrator({
      baseUrl: 'https://usepdf.xyz',
      googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
      bingApiKey: process.env.NEXT_PUBLIC_BING_API_KEY || '',
      autoUpdateInterval: 3600000, // 1 hour
    });

    await seoOrchestrator.initialize();

    console.log('✅ SEO Growth Engine initialized successfully');
    
    // Log initial stats
    logSEOStats();

    return seoOrchestrator;
  } catch (error) {
    console.error('❌ Failed to initialize SEO engine:', error);
    return null;
  }
}

/**
 * Get SEO orchestrator instance
 */
export function getSEOOrchestrator(): SEOOrchestrator | null {
  return seoOrchestrator;
}

/**
 * Log SEO statistics
 */
export function logSEOStats(): void {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return;
  }

  const stats = seoOrchestrator.getStats();

  console.log('\n📊 SEO Growth Engine Statistics');
  console.log('================================\n');

  console.log('📄 Content Metrics:');
  console.log(`   Blog Posts: ${stats.contentMetrics.blogPosts}`);
  console.log(`   Programmatic Pages: ${stats.contentMetrics.programmaticPages}`);
  console.log(`   Tool Pages: ${stats.contentMetrics.toolPages}`);
  console.log(`   Category Pages: ${stats.contentMetrics.categoryPages}`);
  console.log(`   Total: ${stats.totalPages}\n`);

  console.log('🔍 Keyword Metrics:');
  console.log(`   Total Keywords: ${stats.keywordMetrics.totalKeywords}`);
  console.log(`   High Priority: ${stats.keywordMetrics.highPriorityKeywords}`);
  console.log(`   Clusters: ${stats.keywordMetrics.clusters}\n`);

  console.log('🔗 Link Metrics:');
  console.log(`   Internal Links: ${stats.linkMetrics.totalInternalLinks}`);
  console.log(`   Orphan Pages: ${stats.linkMetrics.orphanPages}`);
  console.log(`   Avg Click Depth: ${stats.linkMetrics.averageClickDepth.toFixed(2)}\n`);

  console.log('🎯 Semantic Metrics:');
  console.log(`   Topic Clusters: ${stats.semanticMetrics.topicClusters}`);
  console.log(`   Content Gaps: ${stats.semanticMetrics.contentGaps}`);
  console.log(`   Authority Score: ${stats.semanticMetrics.authorityScore.toFixed(1)}\n`);

  console.log('📈 Behavior Metrics:');
  console.log(`   Avg Dwell Time: ${(stats.behaviorMetrics.averageDwellTime / 1000).toFixed(1)}s`);
  console.log(`   Bounce Rate: ${stats.behaviorMetrics.bounceRate.toFixed(1)}%`);
  console.log(`   Conversion Rate: ${stats.behaviorMetrics.conversionRate.toFixed(1)}%`);
  console.log(`   Pages/Session: ${stats.behaviorMetrics.pagesPerSession.toFixed(2)}\n`);

  console.log('🚀 Indexing Stats:');
  console.log(`   Indexed Pages: ${stats.indexedPages}`);
  console.log(`   Success Rate: ${stats.indexingStats.successRate.toFixed(1)}%`);
  console.log(`   Pending: ${stats.indexingStats.pendingSubmissions}`);
  console.log(`   Failed: ${stats.indexingStats.failedSubmissions}\n`);

  console.log('⏱️  Crawl Budget:');
  console.log(`   Used: ${stats.crawlBudget.usedBudget}/${stats.crawlBudget.dailyLimit}`);
  console.log(`   Remaining: ${stats.crawlBudget.remainingBudget}`);
  console.log(`   Est. Days: ${stats.crawlBudget.estimatedDaysRemaining}\n`);

  console.log('================================\n');
}

/**
 * Get SEO recommendations
 */
export function getSEORecommendations() {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return null;
  }

  return seoOrchestrator.getRecommendations();
}

/**
 * Generate programmatic page
 */
export function generateProgrammaticPage(data: {
  action: string;
  object: string;
  modifier: string;
  context: string;
}) {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return null;
  }

  return seoOrchestrator.generateProgrammaticPage(data);
}

/**
 * Generate blog post
 */
export function generateBlogPost(data: {
  primaryKeyword: string;
  secondaryKeywords: string[];
  topic: string;
  audience: string;
  category?: string;
  author?: string;
}) {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return null;
  }

  return seoOrchestrator.generateBlogPost(data);
}

/**
 * Track user behavior
 */
export function trackUserBehavior(
  sessionId: string,
  url: string,
  performanceMetrics: {
    pageLoadTime: number;
    domReadyTime: number;
    firstPaintTime: number;
    timeToInteractive: number;
  }
) {
  if (!seoOrchestrator) return;
  seoOrchestrator.trackPageView(sessionId, url, performanceMetrics);
}

/**
 * Track event
 */
export function trackEvent(
  sessionId: string,
  type: any,
  target: string,
  value?: any,
  metadata?: Record<string, any>
) {
  if (!seoOrchestrator) return;
  seoOrchestrator.trackEvent(sessionId, type, target, value, metadata);
}

/**
 * Update scroll depth
 */
export function updateScrollDepth(sessionId: string, url: string, depth: number) {
  if (!seoOrchestrator) return;
  seoOrchestrator.updateScrollDepth(sessionId, url, depth);
}

/**
 * Submit page for indexing
 */
export async function submitForIndexing(url: string, priority: 'high' | 'normal' | 'low' = 'normal') {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return false;
  }

  return seoOrchestrator.submitForIndexing(url, priority);
}

/**
 * Get sitemap
 */
export function getSitemap(type: 'index' | 'tools' | 'blogs' | 'programmatic'): string {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return '';
  }

  return seoOrchestrator.getSitemap(type);
}

/**
 * Get related content
 */
export function getRelatedContent(url: string) {
  if (!seoOrchestrator) {
    console.warn('SEO engine not initialized');
    return {
      tools: [],
      blogs: [],
      categories: [],
    };
  }

  return seoOrchestrator.getRelatedContent(url);
}

/**
 * Shutdown SEO engine
 */
export function shutdownSEO() {
  if (!seoOrchestrator) return;
  seoOrchestrator.shutdown();
  seoOrchestrator = null;
}