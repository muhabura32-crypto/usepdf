/**
 * XML Sitemap Engine - Dynamic Sitemap Generation System
 * Generates multiple dynamic sitemaps with auto-update and splitting capability
 * Max 5,000 URLs per sitemap file
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: Array<{ loc: string; title?: string; caption?: string }>;
  video?: Array<{ loc: string; title: string; description?: string; thumbnail_loc?: string }>;
}

interface SitemapConfig {
  baseUrl: string;
  maxUrlsPerSitemap: number;
  autoUpdate: boolean;
  includeIndex: boolean;
}

class SitemapEngine {
  private baseUrl: string;
  private maxUrlsPerSitemap: number;
  private autoUpdate: boolean;
  private includeIndex: boolean;
  private urlCollections: Map<string, SitemapUrl[]> = new Map();

  constructor(config: SitemapConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.maxUrlsPerSitemap = config.maxUrlsPerSitemap;
    this.autoUpdate = config.autoUpdate;
    this.includeIndex = config.includeIndex;
  }

  /**
   * Register a URL collection for a specific sitemap file
   */
  registerCollection(name: string, urls: SitemapUrl[]): void {
    this.urlCollections.set(name, urls);
  }

  /**
   * Generate sitemap index (sitemap-index.xml)
   */
  generateSitemapIndex(): string {
    const sitemaps: string[] = [];
    
    for (const [name, urls] of this.urlCollections.entries()) {
      const pageCount = Math.ceil(urls.length / this.maxUrlsPerSitemap);
      
      if (pageCount === 1) {
        sitemaps.push({
          loc: `${this.baseUrl}/sitemap-${name}.xml`,
          lastmod: new Date().toISOString().split('T')[0],
        });
      } else {
        for (let i = 1; i <= pageCount; i++) {
          sitemaps.push({
            loc: `${this.baseUrl}/sitemap-${name}-${i}.xml`,
            lastmod: new Date().toISOString().split('T')[0],
          });
        }
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;
  }

  /**
   * Generate individual sitemap file content
   */
  generateSitemap(name: string, pageNumber?: number): string {
    const urls = this.urlCollections.get(name);
    if (!urls || urls.length === 0) {
      return this.generateEmptySitemap();
    }

    const startIdx = pageNumber ? (pageNumber - 1) * this.maxUrlsPerSitemap : 0;
    const endIdx = pageNumber ? Math.min(startIdx + this.maxUrlsPerSitemap, urls.length) : urls.length;
    const pageUrls = urls.slice(startIdx, endIdx);

    const xmlUrls = pageUrls.map(url => {
      let imageXml = '';
      if (url.images && url.images.length > 0) {
        imageXml = url.images.map(img => `
    <image:image>
      <image:loc>${this.escapeXml(img.loc)}</image:loc>
      ${img.title ? `      <image:title>${this.escapeXml(img.title)}</image:title>` : ''}
      ${img.caption ? `      <image:caption>${this.escapeXml(img.caption)}</image:caption>` : ''}
    </image:image>`).join('');
      }

      return `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq || 'monthly'}</changefreq>
    <priority>${url.priority?.toFixed(1) || '0.5'}</priority>
    ${imageXml ? `    ${imageXml.trim()}` : ''}
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${xmlUrls}
</urlset>`;
  }

  /**
   * Get all sitemap names and their metadata
   */
  getSitemapMetadata(): Array<{
    name: string;
    totalUrls: number;
    pageCount: number;
    files: string[];
  }> {
    const metadata: Array<{
      name: string;
      totalUrls: number;
      pageCount: number;
      files: string[];
    }> = [];

    for (const [name, urls] of this.urlCollections.entries()) {
      const pageCount = Math.ceil(urls.length / this.maxUrlsPerSitemap);
      const files: string[] = [];
      
      if (pageCount === 1) {
        files.push(`sitemap-${name}.xml`);
      } else {
        for (let i = 1; i <= pageCount; i++) {
          files.push(`sitemap-${name}-${i}.xml`);
        }
      }

      metadata.push({
        name,
        totalUrls: urls.length,
        pageCount,
        files,
      });
    }

    return metadata;
  }

  /**
   * Add URL to a collection (supports auto-update)
   */
  addUrl(name: string, url: SitemapUrl): void {
    const urls = this.urlCollections.get(name) || [];
    urls.push(url);
    this.urlCollections.set(name, urls);
  }

  /**
   * Generate empty sitemap
   */
  private generateEmptySitemap(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

export { SitemapEngine };
export type { SitemapUrl, SitemapConfig };