/**
 * SSR/SSG Rendering Strategy for SEO
 * Defines rendering strategy per page type for optimal SEO
 */

interface PageConfig {
  path: string;
  type: 'ssr' | 'ssg' | 'isr' | 'client';
  revalidate?: number;
  priority: 'high' | 'medium' | 'low';
  seoCritical: boolean;
}

interface RenderingStrategy {
  toolPages: PageConfig[];
  blogPages: PageConfig[];
  programmaticPages: PageConfig[];
  staticPages: PageConfig[];
}

class RenderingStrategyManager {
  private strategy: RenderingStrategy;

  constructor() {
    this.strategy = this.initializeStrategy();
  }

  /**
   * Initialize rendering strategy
   */
  private initializeStrategy(): RenderingStrategy {
    return {
      // Tool pages: ISR with dynamic revalidation
      toolPages: [
        { path: '/merge-pdf', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/split-pdf', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/compress-pdf', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/pdf-to-jpg', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/pdf-to-png', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/rotate-pdf', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/word-to-pdf', type: 'isr', revalidate: 3600, priority: 'medium', seoCritical: true },
        { path: '/jpg-to-pdf', type: 'isr', revalidate: 3600, priority: 'medium', seoCritical: true },
        { path: '/png-to-pdf', type: 'isr', revalidate: 3600, priority: 'medium', seoCritical: true },
      ],

      // Blog pages: Pre-rendered SSG for SEO
      blogPages: [
        { path: '/blog', type: 'isr', revalidate: 900, priority: 'high', seoCritical: true },
      ],

      // Programmatic pages: Pre-generated SSG
      programmaticPages: [
        // These would be generated at build time
        // Format: /{action}-{object}-{modifier}-{context}
      ],

      // Static pages: SSG with longer revalidation
      staticPages: [
        { path: '/', type: 'isr', revalidate: 3600, priority: 'high', seoCritical: true },
        { path: '/about', type: 'ssg', revalidate: 86400, priority: 'medium', seoCritical: false },
        { path: '/contact', type: 'ssg', revalidate: 86400, priority: 'medium', seoCritical: false },
        { path: '/privacy', type: 'ssg', revalidate: 86400, priority: 'low', seoCritical: false },
        { path: '/terms', type: 'ssg', revalidate: 86400, priority: 'low', seoCritical: false },
        { path: '/cookies', type: 'ssg', revalidate: 86400, priority: 'low', seoCritical: false },
      ],
    };
  }

  /**
   * Get rendering strategy for a specific path
   */
  getStrategyForPath(path: string): PageConfig | undefined {
    const allPages = [
      ...this.strategy.toolPages,
      ...this.strategy.blogPages,
      ...this.strategy.programmaticPages,
      ...this.strategy.staticPages,
    ];

    return allPages.find(page => this.matchPath(page.path, path));
  }

  /**
   * Match path with pattern
   */
  private matchPath(pattern: string, path: string): boolean {
    if (pattern === path) return true;

    // Handle programmatic page patterns
    if (pattern.includes('{')) {
      const regex = new RegExp('^' + pattern.replace(/\{[^}]+\}/g, '[^/]+') + '$');
      return regex.test(path);
    }

    return false;
  }

  /**
   * Get all paths that need pre-rendering
   */
  getStaticPaths(): Array<{ params: { slug: string[] }; locale?: string }> {
    const paths: Array<{ params: { slug: string[] }; locale?: string }> = [];

    // Tool pages
    this.strategy.toolPages.forEach(page => {
      if (page.type === 'ssg' || page.type === 'isr') {
        paths.push({
          params: { slug: page.path.substring(1).split('/') },
        });
      }
    });

    // Static pages
    this.strategy.staticPages.forEach(page => {
      if (page.type === 'ssg' || page.type === 'isr') {
        paths.push({
          params: { slug: page.path.substring(1).split('/') },
        });
      }
    });

    return paths;
  }

  /**
   * Get revalidation time for a page
   */
  getRevalidate(path: string): number | undefined {
    const strategy = this.getStrategyForPath(path);
    return strategy?.revalidate;
  }

  /**
   * Check if page should be server-side rendered
   */
  shouldSSR(path: string): boolean {
    const strategy = this.getStrategyForPath(path);
    return strategy?.type === 'ssr';
  }

  /**
   * Check if page should be statically generated
   */
  shouldSSG(path: string): boolean {
    const strategy = this.getStrategyForPath(path);
    return strategy?.type === 'ssg';
  }

  /**
   * Check if page should use ISR
   */
  shouldISR(path: string): boolean {
    const strategy = this.getStrategyForPath(path);
    return strategy?.type === 'isr';
  }

  /**
   * Get SEO critical pages
   */
  getSEOCriticalPages(): PageConfig[] {
    const allPages = [
      ...this.strategy.toolPages,
      ...this.strategy.blogPages,
      ...this.strategy.programmaticPages,
      ...this.strategy.staticPages,
    ];

    return allPages.filter(page => page.seoCritical);
  }

  /**
   * Generate programmatic page paths
   */
  generateProgrammaticPaths(keywords: Array<{ term: string; priority: number }>): PageConfig[] {
    const paths: PageConfig[] = [];

    keywords.slice(0, 1000).forEach(keyword => {
      const slug = `/programmatic/${keyword.term.replace(/\s+/g, '-').toLowerCase()}`;
      paths.push({
        path: slug,
        type: 'ssg',
        revalidate: 86400, // 24 hours
        priority: keyword.priority >= 70 ? 'high' : 'medium',
        seoCritical: keyword.priority >= 70,
      });
    });

    return paths;
  }

  /**
   * Update blog page strategies
   */
  updateBlogStrategies(posts: Array<{ slug: string; priority: number }>): void {
    posts.forEach(post => {
      this.strategy.blogPages.push({
        path: `/blog/${post.slug}`,
        type: 'ssg',
        revalidate: 3600,
        priority: post.priority >= 70 ? 'high' : 'medium',
        seoCritical: post.priority >= 70,
      });
    });
  }

  /**
   * Get all rendering strategies
   */
  getStrategies(): RenderingStrategy {
    return this.strategy;
  }
}

export { RenderingStrategyManager };
export type { PageConfig, RenderingStrategy };