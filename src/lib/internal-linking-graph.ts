/**
 * Internal Linking Graph System
 * Ensures every page links to 3 related tool pages, 5 related blog posts, 2 category/authority pages
 * Builds full SEO link graph with no orphan pages
 */

import type { SitemapUrl } from './sitemap-engine';

interface PageNode {
  url: string;
  title: string;
  type: 'tool' | 'blog' | 'category' | 'home' | 'programmatic';
  keywords: string[];
  topics: string[];
  priority: number;
  outboundLinks: string[]; // URLs this page links to
  inboundLinks: string[];  // URLs that link to this page
  lastUpdated: string;
}

interface LinkRecommendation {
  sourceUrl: string;
  targetUrl: string;
  reason: string;
  anchorText: string;
  priority: number;
}

class InternalLinkingGraph {
  private nodes: Map<string, PageNode> = new Map();
  private topics: Map<string, string[]> = new Map(); // topic -> related URLs
  private clusters: Map<string, string[]> = new Map(); // cluster -> related URLs

  constructor() {
    this.initializeTopicClusters();
  }

  /**
   * Initialize main topical authority clusters
   */
  private initializeTopicClusters(): void {
    // Compress PDF Cluster
    this.clusters.set('compress-pdf', [
      '/compress-pdf',
      '/blog/compress-pdf-without-losing-quality',
      '/blog/reduce-pdf-file-size-email',
      '/blog/pdf-compression-guide',
    ]);

    // Merge PDF Cluster
    this.clusters.set('merge-pdf', [
      '/merge-pdf',
      '/blog/how-to-merge-pdfs',
      '/blog/combine-pdf-files',
      '/blog/merge-pdf-tutorial',
    ]);

    // Convert PDF Cluster
    this.clusters.set('convert-pdf', [
      '/pdf-to-jpg',
      '/pdf-to-png',
      '/blog/convert-pdf-to-images',
      '/blog/pdf-conversion-guide',
    ]);

    // Split PDF Cluster
    this.clusters.set('split-pdf', [
      '/split-pdf',
      '/blog/split-pdf-pages',
      '/blog/extract-pdf-pages',
      '/blog/pdf-splitting-guide',
    ]);

    // Rotate PDF Cluster
    this.clusters.set('rotate-pdf', [
      '/rotate-pdf',
      '/blog/rotate-pdf-pages',
      '/blog/pdf-orientation-guide',
    ]);

    // Device-Specific Cluster
    this.clusters.set('device-pdf', [
      '/programmatic/compress-pdf-on-android',
      '/programmatic/compress-pdf-on-iphone',
      '/programmatic/pdf-tools-for-mobile',
      '/blog/pdf-tools-mobile-guide',
    ]);

    // Industry-Specific Cluster
    this.clusters.set('industry-pdf', [
      '/programmatic/pdf-tools-for-students',
      '/programmatic/pdf-tools-for-office',
      '/blog/pdf-for-students-guide',
      '/blog/office-pdf-productivity',
    ]);
  }

  /**
   * Register a page in the graph
   */
  registerPage(node: PageNode): void {
    this.nodes.set(node.url, node);
    
    // Add to topic index
    node.topics.forEach(topic => {
      if (!this.topics.has(topic)) {
        this.topics.set(topic, []);
      }
      this.topics.get(topic)!.push(node.url);
    });
  }

  /**
   * Generate link recommendations for a page
   * Ensures 3 tool links, 5 blog links, 2 category links
   */
  generateLinkRecommendations(url: string): LinkRecommendation[] {
    const page = this.nodes.get(url);
    if (!page) {
      return [];
    }

    const recommendations: LinkRecommendation[] = [];
    const existingLinks = new Set(page.outboundLinks);

    // Find related tools (3 links)
    const toolRecommendations = this.findRelatedTools(page, existingLinks, 3);
    recommendations.push(...toolRecommendations);

    // Find related blog posts (5 links)
    const blogRecommendations = this.findRelatedBlogs(page, existingLinks, 5);
    recommendations.push(...blogRecommendations);

    // Find category/authority pages (2 links)
    const categoryRecommendations = this.findCategoryPages(page, existingLinks, 2);
    recommendations.push(...categoryRecommendations);

    return recommendations;
  }

  /**
   * Find related tool pages to link to
   */
  private findRelatedTools(page: PageNode, exclude: Set<string>, count: number): LinkRecommendation[] {
    const recommendations: LinkRecommendation[] = [];
    const toolNodes = Array.from(this.nodes.values()).filter(n => n.type === 'tool' && n.url !== page.url);

    // Sort by relevance (shared topics, cluster membership)
    const scoredTools = toolNodes.map(tool => {
      let score = 0;
      
      // Shared topics
      const sharedTopics = page.topics.filter(t => tool.topics.includes(t));
      score += sharedTopics.length * 10;

      // Cluster membership
      for (const [cluster, urls] of this.clusters.entries()) {
        if (urls.includes(page.url) && urls.includes(tool.url)) {
          score += 20;
        }
      }

      // Keyword overlap
      const sharedKeywords = page.keywords.filter(k => tool.keywords.includes(k));
      score += sharedKeywords.length * 5;

      return { tool, score };
    }).sort((a, b) => b.score - a.score);

    // Take top N that aren't already linked
    for (const { tool, score } of scoredTools) {
      if (recommendations.length >= count) break;
      if (!exclude.has(tool.url)) {
        recommendations.push({
          sourceUrl: page.url,
          targetUrl: tool.url,
          reason: this.generateLinkReason(page, tool, 'tool'),
          anchorText: this.generateAnchorText(tool.title, page.type),
          priority: Math.min(100, score),
        });
      }
    }

    return recommendations;
  }

  /**
   * Find related blog posts to link to
   */
  private findRelatedBlogs(page: PageNode, exclude: Set<string>, count: number): LinkRecommendation[] {
    const recommendations: LinkRecommendation[] = [];
    const blogNodes = Array.from(this.nodes.values()).filter(n => n.type === 'blog' && n.url !== page.url);

    const scoredBlogs = blogNodes.map(blog => {
      let score = 0;

      // Shared topics (higher weight)
      const sharedTopics = page.topics.filter(t => blog.topics.includes(t));
      score += sharedTopics.length * 15;

      // Cluster membership
      for (const [cluster, urls] of this.clusters.entries()) {
        if (urls.includes(page.url) && urls.includes(blog.url)) {
          score += 25;
        }
      }

      // Keyword overlap
      const sharedKeywords = page.keywords.filter(k => blog.keywords.includes(k));
      score += sharedKeywords.length * 8;

      // Fresh content bonus
      const daysOld = this.getDaysSinceUpdate(blog.lastUpdated);
      if (daysOld < 30) score += 10;

      return { blog, score };
    }).sort((a, b) => b.score - a.score);

    for (const { blog, score } of scoredBlogs) {
      if (recommendations.length >= count) break;
      if (!exclude.has(blog.url)) {
        recommendations.push({
          sourceUrl: page.url,
          targetUrl: blog.url,
          reason: this.generateLinkReason(page, blog, 'blog'),
          anchorText: this.generateAnchorText(blog.title, page.type),
          priority: Math.min(100, score),
        });
      }
    }

    return recommendations;
  }

  /**
   * Find category/authority pages to link to
   */
  private findCategoryPages(page: PageNode, exclude: Set<string>, count: number): LinkRecommendation[] {
    const recommendations: LinkRecommendation[] = [];
    const categoryNodes = Array.from(this.nodes.values()).filter(n => n.type === 'category' && n.url !== page.url);

    const scoredCategories = categoryNodes.map(cat => {
      let score = cat.priority * 20; // Base score on category priority

      // Topic relevance
      const sharedTopics = page.topics.filter(t => cat.topics.includes(t));
      score += sharedTopics.length * 5;

      return { category: cat, score };
    }).sort((a, b) => b.score - a.score);

    for (const { category, score } of scoredCategories) {
      if (recommendations.length >= count) break;
      if (!exclude.has(category.url)) {
        recommendations.push({
          sourceUrl: page.url,
          targetUrl: category.url,
          reason: 'Topical authority page in same domain',
          anchorText: this.generateAnchorText(category.title, page.type),
          priority: Math.min(100, score),
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate link reason for anchor text variation
   */
  private generateLinkReason(source: PageNode, target: PageNode, type: string): string {
    const reasons: Record<string, string[]> = {
      tool: [
        'Related tool for enhanced workflow',
        'Complementary PDF functionality',
        'Alternative tool option',
        'Part of same PDF workflow',
      ],
      blog: [
        'Related tutorial and guide',
        'Deep dive into related topic',
        'Best practices and tips',
        'Step-by-step guide for related task',
      ],
    };

    const typeReasons = reasons[type] || reasons.tool;
    return typeReasons[Math.floor(Math.random() * typeReasons.length)];
  }

  /**
   * Generate varied anchor text to avoid over-optimization
   */
  private generateAnchorText(targetTitle: string, sourceType: string): string {
    const variations = {
      tool: [
        targetTitle,
        targetTitle.split(' ')[0],
        `Free ${targetTitle.toLowerCase()}`,
        `${targetTitle} tool`,
        `Online ${targetTitle.toLowerCase()}`,
      ],
      blog: [
        targetTitle,
        `Read: ${targetTitle}`,
        `Guide: ${targetTitle.split(':')[0]}`,
        `Learn more about ${targetTitle.split(':')[0].toLowerCase()}`,
        targetTitle.split(':')[0],
      ],
      category: [
        targetTitle,
        `All ${targetTitle.toLowerCase()}`,
        `${targetTitle} resources`,
      ],
    };

    const typeVariations = variations.tool;
    const options = typeVariations.filter(v => v.length < 60);
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Check for orphan pages (no inbound links)
   */
  findOrphanPages(): string[] {
    const orphans: string[] = [];
    for (const [url, node] of this.nodes.entries()) {
      if (node.inboundLinks.length === 0 && node.type !== 'home') {
        orphans.push(url);
      }
    }
    return orphans;
  }

  /**
   * Calculate link equity distribution
   */
  calculateLinkEquity(url: string): number {
    const node = this.nodes.get(url);
    if (!node) return 0;

    let equity = node.priority * 10;

    // Add equity from inbound links
    node.inboundLinks.forEach(inboundUrl => {
      const source = this.nodes.get(inboundUrl);
      if (source) {
        equity += source.priority * 5;
      }
    });

    return Math.min(100, equity);
  }

  /**
   * Get click depth from homepage
   */
  getClickDepth(url: string): number {
    const visited = new Set<string>();
    const queue: Array<[string, number]> = [['/', 0]];

    while (queue.length > 0) {
      const [current, depth] = queue.shift()!;
      
      if (current === url) {
        return depth;
      }

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      const node = this.nodes.get(current);
      if (node) {
        node.outboundLinks.forEach(link => {
          if (!visited.has(link)) {
            queue.push([link, depth + 1]);
          }
        });
      }
    }

    return -1; // Unreachable
  }

  /**
   * Get days since last update
   */
  private getDaysSinceUpdate(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get all sitemap URLs for the sitemap engine
   */
  getSitemapUrls(): SitemapUrl[] {
    const urls: SitemapUrl[] = [];

    for (const [url, node] of this.nodes.entries()) {
      const priority = node.priority / 100;
      const changefreq = this.getChangeFreq(node);

      urls.push({
        loc: `https://usepdf.xyz${node.url}`,
        lastmod: node.lastUpdated,
        changefreq,
        priority,
      });
    }

    return urls;
  }

  /**
   * Determine changefreq based on page type
   */
  private getChangeFreq(node: PageNode): SitemapUrl['changefreq'] {
    if (node.type === 'blog') return 'weekly';
    if (node.type === 'programmatic') return 'monthly';
    if (node.type === 'tool') return 'monthly';
    return 'yearly';
  }

  /**
   * Get graph statistics
   */
  getStats(): {
    totalPages: number;
    totalLinks: number;
    orphanPages: number;
    averageClickDepth: number;
    pagesByType: Record<string, number>;
  } {
    const orphanPages = this.findOrphanPages();
    const depths: number[] = [];
    const pagesByType: Record<string, number> = {};
    let totalLinks = 0;

    for (const [url, node] of this.nodes.entries()) {
      totalLinks += node.outboundLinks.length;
      pagesByType[node.type] = (pagesByType[node.type] || 0) + 1;

      const depth = this.getClickDepth(url);
      if (depth >= 0) {
        depths.push(depth);
      }
    }

    const averageClickDepth = depths.length > 0 
      ? depths.reduce((a, b) => a + b, 0) / depths.length 
      : 0;

    return {
      totalPages: this.nodes.size,
      totalLinks,
      orphanPages: orphanPages.length,
      averageClickDepth,
      pagesByType,
    };
  }
}

export type { PageNode, LinkRecommendation };
export { InternalLinkingGraph };