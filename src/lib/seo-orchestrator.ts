/**
 * SEO Orchestrator - Main coordinator for all SEO systems
 * Integrates all components into a unified SEO growth engine
 */

import { SitemapEngine, type SitemapUrl } from './sitemap-engine';
import { InternalLinkingGraph, type PageNode } from './internal-linking-graph';
import { ProgrammaticSEOEngine, type ProgrammaticPage } from './programmatic-seo';
import { BlogAutomationSystem, type BlogPost } from './blog-automation';
import { KeywordResearchSystem, type Keyword } from './keyword-research';
import { IndexingCrawlOptimizer, type CrawlBudget, type IndexingStats } from './indexing-crawl-optimizer';
import { UserBehaviorOptimizer, type BehaviorMetrics } from './user-behavior-optimizer';
import { SemanticExpansionSystem, type TopicCluster } from './semantic-expansion';

interface SEOOrchestratorConfig {
  baseUrl: string;
  googleApiKey?: string;
  bingApiKey?: string;
  autoUpdateInterval?: number; // in milliseconds
}

interface SEOStats {
  totalPages: number;
  indexedPages: number;
  crawlBudget: CrawlBudget;
  indexingStats: IndexingStats;
  behaviorMetrics: BehaviorMetrics;
  keywordMetrics: {
    totalKeywords: number;
    highPriorityKeywords: number;
    clusters: number;
  };
  contentMetrics: {
    blogPosts: number;
    programmaticPages: number;
    toolPages: number;
    categoryPages: number;
  };
  linkMetrics: {
    totalInternalLinks: number;
    orphanPages: number;
    averageClickDepth: number;
  };
  semanticMetrics: {
    topicClusters: number;
    contentGaps: number;
    authorityScore: number;
  };
}

class SEOOrchestrator {
  private config: SEOOrchestratorConfig;
  private sitemapEngine: SitemapEngine;
  private linkingGraph: InternalLinkingGraph;
  private programmaticSEO: ProgrammaticSEOEngine;
  private blogAutomation: BlogAutomationSystem;
  private keywordResearch: KeywordResearchSystem;
  private indexingOptimizer: IndexingCrawlOptimizer;
  private behaviorOptimizer: UserBehaviorOptimizer;
  private semanticExpansion: SemanticExpansionSystem;
  private updateInterval?: NodeJS.Timeout;
  private isInitialized: boolean = false;

  constructor(config: SEOOrchestratorConfig) {
    this.config = {
      autoUpdateInterval: 3600000, // 1 hour
      ...config,
    };

    this.sitemapEngine = new SitemapEngine({
      baseUrl: this.config.baseUrl,
      maxUrlsPerSitemap: 5000,
      autoUpdate: true,
      includeIndex: true,
    });

    this.linkingGraph = new InternalLinkingGraph();
    this.programmaticSEO = new ProgrammaticSEOEngine();
    this.blogAutomation = new BlogAutomationSystem();
    this.keywordResearch = new KeywordResearchSystem();
    this.indexingOptimizer = new IndexingCrawlOptimizer(
      config.googleApiKey || '',
      config.bingApiKey || ''
    );
    this.behaviorOptimizer = new UserBehaviorOptimizer();
    this.semanticExpansion = new SemanticExpansionSystem();
  }

  /**
   * Initialize the SEO orchestrator
   */
  async initialize(): Promise<void> {
    console.log('Initializing SEO Growth Engine...');

    // Phase 1: Keyword research
    console.log('Phase 1: Keyword research...');
    await this.initializeKeywords();

    // Phase 2: Generate programmatic pages
    console.log('Phase 2: Generating programmatic pages...');
    await this.initializeProgrammaticPages();

    // Phase 3: Generate blog posts
    console.log('Phase 3: Generating blog posts...');
    await this.initializeBlogPosts();

    // Phase 4: Build internal linking graph
    console.log('Phase 4: Building internal linking graph...');
    await this.initializeLinkingGraph();

    // Phase 5: Generate sitemaps
    console.log('Phase 5: Generating sitemaps...');
    await this.initializeSitemaps();

    // Phase 6: Submit to search engines
    console.log('Phase 6: Submitting to search engines...');
    await this.initializeIndexing();

    // Phase 7: Semantic expansion
    console.log('Phase 7: Building semantic clusters...');
    await this.initializeSemanticClusters();

    this.isInitialized = true;
    
    // Start auto-update interval
    this.startAutoUpdate();

    console.log('SEO Growth Engine initialized successfully!');
  }

  /**
   * Initialize keywords
   */
  private async initializeKeywords(): Promise<void> {
    const seedKeywords = [
      'compress pdf',
      'merge pdf',
      'split pdf',
      'convert pdf',
      'rotate pdf',
      'pdf tool',
      'pdf online',
      'pdf free',
    ];

    const result = this.keywordResearch.discoverKeywords(seedKeywords, {
      maxResults: 500,
      minVolume: 100,
      maxKD: 70,
    });

    // Register high-priority keywords
    this.keywordResearch.registerKeywords(result.priorityKeywords);
  }

  /**
   * Initialize programmatic pages
   */
  private async initializeProgrammaticPages(): Promise<void> {
    const allPages = this.programmaticSEO.generateAllPages();

    // Register pages in linking graph
    [...allPages.toolIntentPages, ...allPages.devicePages, ...allPages.industryPages, 
     ...allPages.countryPages, ...allPages.problemSolutionPages].forEach(page => {
      this.linkingGraph.registerPage({
        url: page.slug,
        title: page.title,
        type: 'programmatic',
        keywords: page.keywords,
        topics: page.topics,
        priority: page.priority,
        outboundLinks: [],
        inboundLinks: [],
        lastUpdated: page.lastUpdated,
      });
    });

    // Add to sitemap
    const allProgrammaticPages = [
      ...allPages.toolIntentPages,
      ...allPages.devicePages,
      ...allPages.industryPages,
      ...allPages.countryPages,
      ...allPages.problemSolutionPages,
    ];

    allProgrammaticPages.forEach(page => {
      this.sitemapEngine.addUrl('programmatic', {
        loc: `${this.config.baseUrl}${page.slug}`,
        lastmod: page.lastUpdated,
        changefreq: 'monthly',
        priority: page.priority / 100,
      });
    });
  }

  /**
   * Initialize blog posts
   */
  private async initializeBlogPosts(): Promise<void> {
    const keywordData = this.getBlogKeywords();
    
    const howToPosts = this.blogAutomation.generatePostsFromKeywords(
      keywordData,
      'how-to',
      50
    );

    const problemSolutionPosts = this.blogAutomation.generatePostsFromKeywords(
      keywordData,
      'problem-solution',
      30
    );

    const comparisonPosts = this.blogAutomation.generatePostsFromKeywords(
      keywordData,
      'comparison',
      20
    );

    const allPosts = [...howToPosts, ...problemSolutionPosts, ...comparisonPosts];

    // Register posts in linking graph
    allPosts.forEach(post => {
      this.linkingGraph.registerPage({
        url: `/blog/${post.slug}`,
        title: post.title,
        type: 'blog',
        keywords: post.keywords,
        topics: post.topics,
        priority: post.seoScore,
        outboundLinks: [],
        inboundLinks: [],
        lastUpdated: post.dateModified,
      });

      // Add to sitemap
      this.sitemapEngine.addUrl('blogs', {
        loc: `${this.config.baseUrl}/blog/${post.slug}`,
        lastmod: post.dateModified,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    // Update internal linking
    this.blogAutomation.updateInternalLinking(this.linkingGraph);
  }

  /**
   * Get blog keywords
   */
  private getBlogKeywords(): Array<{
    primary: string;
    secondary: string[];
    longTail: string[];
    searchVolume: number;
    competition: number;
    intent: string;
  }> {
    const keywords = this.keywordResearch.getAllKeywords().slice(0, 50);
    return keywords.map(k => ({
      primary: k.term,
      secondary: k.relatedTerms.slice(0, 3),
      longTail: k.longTailVariations.slice(0, 2),
      searchVolume: k.searchVolume,
      competition: k.competition,
      intent: k.intent,
    }));
  }

  /**
   * Initialize linking graph
   */
  private async initializeLinkingGraph(): Promise<void> {
    const pages = this.linkingGraph['nodes'];

    // Generate link recommendations for each page
    for (const [url, node] of pages.entries()) {
      const recommendations = this.linkingGraph.generateLinkRecommendations(url);

      // Apply top recommendations
      const applied = recommendations
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 10)
        .map(rec => rec.targetUrl);

      node.outboundLinks = applied;

      // Update inbound links
      applied.forEach(targetUrl => {
        const target = pages.get(targetUrl);
        if (target && !target.inboundLinks.includes(url)) {
          target.inboundLinks.push(url);
        }
      });
    }
  }

  /**
   * Initialize sitemaps
   */
  private async initializeSitemaps(): Promise<void> {
    // Register tool pages
    const toolPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/merge-pdf', priority: 0.9, changefreq: 'monthly' },
      { path: '/split-pdf', priority: 0.9, changefreq: 'monthly' },
      { path: '/compress-pdf', priority: 0.9, changefreq: 'monthly' },
      { path: '/pdf-to-jpg', priority: 0.8, changefreq: 'monthly' },
      { path: '/pdf-to-png', priority: 0.8, changefreq: 'monthly' },
      { path: '/rotate-pdf', priority: 0.8, changefreq: 'monthly' },
      { path: '/blog', priority: 0.8, changefreq: 'weekly' },
      { path: '/about', priority: 0.6, changefreq: 'yearly' },
      { path: '/contact', priority: 0.5, changefreq: 'yearly' },
    ];

    toolPages.forEach(page => {
      this.sitemapEngine.addUrl('tools', {
        loc: `${this.config.baseUrl}${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });
  }

  /**
   * Initialize indexing
   */
  private async initializeIndexing(): Promise<void> {
    // Submit main sitemaps
    await this.indexingOptimizer.submitSitemap(`${this.config.baseUrl}/sitemap-tools.xml`);
    await this.indexingOptimizer.submitSitemap(`${this.config.baseUrl}/sitemap-blogs.xml`);
    await this.indexingOptimizer.submitSitemap(`${this.config.baseUrl}/sitemap-programmatic.xml`);

    // Submit high-priority URLs individually
    const highPriorityUrls = [
      `${this.config.baseUrl}/`,
      `${this.config.baseUrl}/merge-pdf`,
      `${this.config.baseUrl}/compress-pdf`,
      `${this.config.baseUrl}/blog`,
    ];

    for (const url of highPriorityUrls) {
      await this.indexingOptimizer.submitToGoogleIndexing(url, 'URL_UPDATED', 'high');
    }

    // Process queue
    await this.indexingOptimizer.processGoogleQueue();
  }

  /**
   * Initialize semantic clusters
   */
  private async initializeSemanticClusters(): Promise<void> {
    const clusters = this.semanticExpansion.getAllClusters();
    
    // Update cluster metrics with current data
    clusters.forEach(cluster => {
      const linkingData = this.linkingGraph.getStats();
      this.semanticExpansion.updateClusterMetrics(cluster.id, {
        internalLinks: linkingData.totalLinks,
        backlinks: 0, // Would come from external source
        rankingKeywords: cluster.semanticNodes.size,
      });
    });
  }

  /**
   * Start auto-update interval
   */
  private startAutoUpdate(): void {
    this.updateInterval = setInterval(() => {
      this.autoUpdate().catch(console.error);
    }, this.config.autoUpdateInterval);
  }

  /**
   * Auto-update SEO data
   */
  private async autoUpdate(): Promise<void> {
    if (!this.isInitialized) return;

    console.log('Running SEO auto-update...');

    // Refresh keywords
    this.keywordResearch.refreshKeywords();

    // Update behavior metrics
    this.behaviorOptimizer.updateMetrics();

    // Re-generate sitemaps if needed
    await this.updateSitemaps();

    // Process indexing queue
    await this.indexingOptimizer.processGoogleQueue();

    // Check for new content gaps
    this.semanticExpansion.calculateContentGaps();

    console.log('SEO auto-update completed.');
  }

  /**
   * Update sitemaps
   */
  private async updateSitemaps(): Promise<void> {
    // Check for new pages
    const stats = this.getStats();
    
    // Re-generate if significant changes
    if (stats.contentMetrics.blogPosts > 0 || stats.contentMetrics.programmaticPages > 0) {
      console.log('Updating sitemaps...');
      // Sitemaps are updated automatically by the engines
    }
  }

  /**
   * Track page view
   */
  trackPageView(
    sessionId: string,
    url: string,
    performanceMetrics: {
      pageLoadTime: number;
      domReadyTime: number;
      firstPaintTime: number;
      timeToInteractive: number;
    }
  ): void {
    this.behaviorOptimizer.trackPageVisit(sessionId, url, performanceMetrics);
  }

  /**
   * Track user event
   */
  trackEvent(
    sessionId: string,
    type: any,
    target: string,
    value?: any,
    metadata?: Record<string, any>
  ): void {
    this.behaviorOptimizer.trackEvent(sessionId, type, target, value, metadata);
  }

  /**
   * Update scroll depth
   */
  updateScrollDepth(sessionId: string, url: string, depth: number): void {
    this.behaviorOptimizer.updateScrollDepth(sessionId, url, depth);
  }

  /**
   * Get recommendations
   */
  getRecommendations(): {
    seo: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      description: string;
      metric: string;
      currentValue: number;
      targetValue: number;
      suggestedActions: string[];
      estimatedImpact: number;
    }>;
    content: Array<{
      topic: string;
      searchVolume: number;
      competition: number;
      contentOpportunity: 'high' | 'medium' | 'low';
      suggestedContent: string[];
    }>;
    technical: string[];
  } {
    return {
      seo: this.behaviorOptimizer.generateRecommendations(),
      content: this.semanticExpansion.getContentGaps(5),
      technical: this.getTechnicalRecommendations(),
    };
  }

  /**
   * Get technical recommendations
   */
  private getTechnicalRecommendations(): string[] {
    const recs: string[] = [];
    const stats = this.getStats();

    if (stats.crawlBudget.dailyUsagePercentage > 90) {
      recs.push('Increase crawl budget allocation in Google Search Console');
    }

    if (stats.indexingStats.successRate < 90) {
      recs.push('Review indexing API errors and fix URL issues');
    }

    if (stats.linkMetrics.orphanPages > 0) {
      recs.push(`Fix ${stats.linkMetrics.orphanPages} orphan pages with internal links`);
    }

    if (stats.behaviorMetrics.bounceRate > 50) {
      recs.push('Improve page load speed and above-the-fold content');
    }

    return recs;
  }

  /**
   * Get comprehensive stats
   */
  getStats(): SEOStats {
    const linkingStats = this.linkingGraph.getStats();
    const crawlStats = this.indexingOptimizer.getCrawlStats();
    const indexingStats = this.indexingOptimizer.getIndexingStats();
    const behaviorMetrics = this.behaviorOptimizer.getMetrics();
    const allKeywords = this.keywordResearch.getAllKeywords();
    const clusters = this.semanticExpansion.getAllClusters();

    return {
      totalPages: linkingStats.totalPages,
      indexedPages: indexingStats.indexedUrls,
      crawlBudget: crawlStats,
      indexingStats,
      behaviorMetrics,
      keywordMetrics: {
        totalKeywords: allKeywords.length,
        highPriorityKeywords: allKeywords.filter(k => k.priorityScore >= 70).length,
        clusters: clusters.length,
      },
      contentMetrics: {
        blogPosts: this.blogAutomation.getAllPosts().length,
        programmaticPages: this.programmaticSEO.getAllPages().length,
        toolPages: 8, // Known tool pages
        categoryPages: 3, // About, Contact, Blog
      },
      linkMetrics: {
        totalInternalLinks: linkingStats.totalLinks,
        orphanPages: linkingStats.orphanPages,
        averageClickDepth: linkingStats.averageClickDepth,
      },
      semanticMetrics: {
        topicClusters: clusters.length,
        contentGaps: this.semanticExpansion.getContentGaps().length,
        authorityScore: clusters.reduce((sum, c) => sum + c.authorityScore, 0) / clusters.length || 0,
      },
    };
  }

  /**
   * Generate programmatic page
   */
  generateProgrammaticPage(data: {
    action: string;
    object: string;
    modifier: string;
    context: string;
  }): ProgrammaticPage {
    const page = this.programmaticSEO.generatePage(
      this.programmaticSEO['pageTemplates'].find(t => t.type === 'tool-intent')!,
      data
    );

    // Register in systems
    this.linkingGraph.registerPage({
      url: page.slug,
      title: page.title,
      type: 'programmatic',
      keywords: page.keywords,
      topics: page.topics,
      priority: page.priority,
      outboundLinks: [],
      inboundLinks: [],
      lastUpdated: page.lastUpdated,
    });

    this.sitemapEngine.addUrl('programmatic', {
      loc: `${this.config.baseUrl}${page.slug}`,
      lastmod: page.lastUpdated,
      changefreq: 'monthly',
      priority: page.priority / 100,
    });

    return page;
  }

  /**
   * Generate blog post
   */
  generateBlogPost(data: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    topic: string;
    audience: string;
    category?: string;
    author?: string;
  }): BlogPost {
    const post = this.blogAutomation.generatePost(
      this.blogAutomation['templates'].find(t => t.type === 'how-to')!,
      {
        ...data,
        action: this.keywordResearch.extractAction(data.primaryKeyword),
        benefit: 'better results',
      }
    );

    // Register in systems
    this.linkingGraph.registerPage({
      url: `/blog/${post.slug}`,
      title: post.title,
      type: 'blog',
      keywords: post.keywords,
      topics: post.topics,
      priority: post.seoScore,
      outboundLinks: [],
      inboundLinks: [],
      lastUpdated: post.dateModified,
    });

    this.sitemapEngine.addUrl('blogs', {
      loc: `${this.config.baseUrl}/blog/${post.slug}`,
      lastmod: post.dateModified,
      changefreq: 'weekly',
      priority: 0.8,
    });

    this.blogAutomation.updateInternalLinking(this.linkingGraph);

    return post;
  }

  /**
   * Submit URL for indexing
   */
  async submitForIndexing(url: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<boolean> {
    return this.indexingOptimizer.submitToGoogleIndexing(url, 'URL_ADDED', priority);
  }

  /**
   * Get sitemap XML
   */
  getSitemap(type: 'index' | 'tools' | 'blogs' | 'programmatic'): string {
    switch (type) {
      case 'index':
        return this.sitemapEngine.generateSitemapIndex();
      case 'tools':
        return this.sitemapEngine.generateSitemap('tools');
      case 'blogs':
        return this.sitemapEngine.generateSitemap('blogs');
      case 'programmatic':
        return this.sitemapEngine.generateSitemap('programmatic');
      default:
        return this.sitemapEngine.generateSitemapIndex();
    }
  }

  /**
   * Get related content for a page
   */
  getRelatedContent(url: string): {
    tools: Array<{ url: string; title: string; relevance: number }>;
    blogs: Array<{ url: string; title: string; relevance: number }>;
    categories: Array<{ url: string; title: string; relevance: number }>;
  } {
    const recommendations = this.linkingGraph.generateLinkRecommendations(url);

    const tools = recommendations
      .filter(r => r.targetUrl.includes('/merge') || r.targetUrl.includes('/split') || r.targetUrl.includes('/compress'))
      .slice(0, 3)
      .map(r => ({ url: r.targetUrl, title: r.targetUrl.split('/').pop() || '', relevance: r.priority }));

    const blogs = recommendations
      .filter(r => r.targetUrl.includes('/blog'))
      .slice(0, 5)
      .map(r => ({ url: r.targetUrl, title: r.targetUrl.split('/').pop() || '', relevance: r.priority }));

    const categories = recommendations
      .filter(r => !r.targetUrl.includes('/blog') && !r.targetUrl.includes('/merge') && !r.targetUrl.includes('/split') && !r.targetUrl.includes('/compress'))
      .slice(0, 2)
      .map(r => ({ url: r.targetUrl, title: r.targetUrl.split('/').pop() || '', relevance: r.priority }));

    return { tools, blogs, categories };
  }

  /**
   * Shutdown the orchestrator
   */
  shutdown(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.isInitialized = false;
    console.log('SEO Growth Engine shutdown complete.');
  }
}

export { SEOOrchestrator };
export type { SEOStats, SEOOrchestratorConfig };