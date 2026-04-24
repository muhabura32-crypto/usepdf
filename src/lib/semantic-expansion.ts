/**
 * Semantic Expansion and Topical Authority Clusters
 * Builds topical authority through semantic keyword clustering
 */

interface SemanticNode {
  term: string;
  type: 'core' | 'secondary' | 'longTail' | 'variation';
  weight: number;
  relatedTerms: Array<{ term: string; weight: number }>;
  searchVolume: number;
  competition: number;
  contentGap: number;
}

interface TopicCluster {
  id: string;
  name: string;
  coreTerm: string;
  semanticNodes: Map<string, SemanticNode>;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  pillarPage: string;
  contentCluster: string[];
  authorityScore: number;
  coverage: number;
  internalLinks: number;
  backlinks: number;
  rankingKeywords: number;
}

interface ContentGap {
  topic: string;
  searchVolume: number;
  competition: number;
  keywordGap: number;
  contentOpportunity: 'high' | 'medium' | 'low';
  suggestedContent: string[];
}

interface SemanticRelationship {
  source: string;
  target: string;
  strength: number;
  type: 'synonym' | 'hyponym' | 'hypernym' | 'related' | 'co-occurring';
}

class SemanticExpansionSystem {
  private semanticGraph: Map<string, SemanticNode> = new Map();
  private topicClusters: Map<string, TopicCluster> = new Map();
  private semanticRelationships: SemanticRelationship[] = [];
  private contentGaps: ContentGap[] = [];

  constructor() {
    this.initializeSemanticGraph();
    this.buildTopicClusters();
    this.calculateSemanticRelationships();
  }

  /**
   * Initialize semantic graph with core PDF terms
   */
  private initializeSemanticGraph(): void {
    // Core PDF terms
    const coreTerms = [
      { term: 'pdf', type: 'core', weight: 100, volume: 200000, competition: 85 },
      { term: 'compress', type: 'core', weight: 90, volume: 150000, competition: 75 },
      { term: 'merge', type: 'core', weight: 85, volume: 120000, competition: 70 },
      { term: 'split', type: 'core', weight: 85, volume: 100000, competition: 68 },
      { term: 'convert', type: 'core', weight: 90, volume: 180000, competition: 80 },
      { term: 'rotate', type: 'core', weight: 75, volume: 80000, competition: 60 },
      { term: 'edit', type: 'core', weight: 80, volume: 110000, competition: 72 },
      { term: 'document', type: 'core', weight: 85, volume: 250000, competition: 88 },
    ];

    // Secondary terms
    const secondaryTerms = [
      { term: 'file', type: 'secondary', weight: 70, volume: 500000, competition: 90 },
      { term: 'tool', type: 'secondary', weight: 65, volume: 300000, competition: 85 },
      { term: 'online', type: 'secondary', weight: 60, volume: 400000, competition: 82 },
      { term: 'free', type: 'secondary', weight: 55, volume: 350000, competition: 78 },
      { term: 'converter', type: 'secondary', weight: 75, volume: 90000, competition: 65 },
      { term: 'editor', type: 'secondary', weight: 80, volume: 70000, competition: 62 },
      { term: 'software', type: 'secondary', weight: 60, volume: 280000, competition: 80 },
      { term: 'digital', type: 'secondary', weight: 50, volume: 150000, competition: 70 },
    ];

    // Long-tail terms
    const longTailTerms = [
      { term: 'compress pdf without losing quality', type: 'longTail', weight: 45, volume: 12000, competition: 45 },
      { term: 'merge multiple pdf files online free', type: 'longTail', weight: 40, volume: 8000, competition: 40 },
      { term: 'split pdf into separate pages', type: 'longTail', weight: 40, volume: 6000, competition: 38 },
      { term: 'convert pdf to jpg high quality', type: 'longTail', weight: 42, volume: 15000, competition: 50 },
      { term: 'rotate pdf pages 90 degrees', type: 'longTail', weight: 38, volume: 5000, competition: 35 },
      { term: 'edit pdf text online free', type: 'longTail', weight: 44, volume: 10000, competition: 48 },
      { term: 'extract pages from pdf file', type: 'longTail', weight: 38, volume: 4000, competition: 36 },
      { term: 'combine pdf documents into one', type: 'longTail', weight: 40, volume: 7000, competition: 42 },
    ];

    // Add all terms to graph
    [...coreTerms, ...secondaryTerms, ...longTailTerms].forEach(term => {
      this.semanticGraph.set(term.term, {
        term: term.term,
        type: term.type,
        weight: term.weight,
        relatedTerms: [],
        searchVolume: term.volume,
        competition: term.competition,
        contentGap: this.calculateContentGap(term.volume, term.competition),
      });
    });

    // Add related terms
    this.addRelatedTerms();
  }

  /**
   * Add semantic relationships between terms
   */
  private addRelatedTerms(): void {
    const relationships: Array<[string, string, number, SemanticRelationship['type']]> = [
      // PDF core relationships
      ['pdf', 'document', 95, 'synonym'],
      ['pdf', 'file', 80, 'hyponym'],
      ['pdf', 'converter', 60, 'related'],
      ['pdf', 'editor', 55, 'related'],
      
      // Action relationships
      ['compress', 'reduce', 85, 'synonym'],
      ['compress', 'shrink', 80, 'synonym'],
      ['compress', 'minimize', 75, 'synonym'],
      ['merge', 'combine', 90, 'synonym'],
      ['merge', 'join', 85, 'synonym'],
      ['merge', 'unite', 75, 'synonym'],
      ['split', 'divide', 85, 'synonym'],
      ['split', 'separate', 80, 'synonym'],
      ['split', 'extract', 70, 'related'],
      ['convert', 'transform', 90, 'synonym'],
      ['convert', 'change', 75, 'synonym'],
      ['convert', 'export', 65, 'related'],
      ['rotate', 'turn', 85, 'synonym'],
      ['rotate', 'flip', 70, 'related'],
      ['rotate', 'orient', 60, 'related'],
      
      // Format relationships
      ['pdf', 'jpg', 70, 'co-occurring'],
      ['pdf', 'png', 70, 'co-occurring'],
      ['pdf', 'word', 80, 'co-occurring'],
      ['pdf', 'excel', 60, 'co-occurring'],
      ['jpg', 'jpeg', 95, 'synonym'],
      ['png', 'image', 85, 'hypernym'],
      
      // Tool relationships
      ['tool', 'software', 85, 'synonym'],
      ['tool', 'application', 80, 'synonym'],
      ['tool', 'program', 75, 'synonym'],
      
      // Quality relationships
      ['quality', 'resolution', 80, 'related'],
      ['quality', 'clarity', 75, 'related'],
      ['compress', 'quality', 70, 'co-occurring'],
      
      // Usage contexts
      ['online', 'web', 90, 'synonym'],
      ['online', 'internet', 85, 'synonym'],
      ['free', 'no cost', 85, 'synonym'],
      ['free', 'gratis', 70, 'synonym'],
    ];

    for (const [source, target, strength, type] of relationships) {
      if (this.semanticGraph.has(source) && this.semanticGraph.has(target)) {
        this.semanticRelationships.push({
          source,
          target,
          strength,
          type,
        });

        // Add to related terms
        const sourceNode = this.semanticGraph.get(source)!;
        const targetNode = this.semanticGraph.get(target)!;
        
        sourceNode.relatedTerms.push({
          term: target,
          weight: strength / 100,
        });

        targetNode.relatedTerms.push({
          term: source,
          weight: strength / 100,
        });
      }
    }
  }

  /**
   * Build topic clusters
   */
  private buildTopicClusters(): void {
    const clusters = [
      {
        id: 'compress-pdf',
        name: 'PDF Compression',
        coreTerm: 'compress',
        intent: 'transactional' as const,
        pillarPage: '/compress-pdf',
        contentCluster: [
          '/compress-pdf',
          '/blog/compress-pdf-without-losing-quality',
          '/blog/reduce-pdf-file-size',
          '/blog/pdf-compression-guide',
        ],
      },
      {
        id: 'merge-pdf',
        name: 'PDF Merging',
        coreTerm: 'merge',
        intent: 'transactional' as const,
        pillarPage: '/merge-pdf',
        contentCluster: [
          '/merge-pdf',
          '/blog/how-to-merge-pdfs',
          '/blog/combine-pdf-files',
          '/blog/pdf-merger-guide',
        ],
      },
      {
        id: 'split-pdf',
        name: 'PDF Splitting',
        coreTerm: 'split',
        intent: 'transactional' as const,
        pillarPage: '/split-pdf',
        contentCluster: [
          '/split-pdf',
          '/blog/split-pdf-pages',
          '/blog/extract-pdf-pages',
          '/blog/pdf-splitting-guide',
        ],
      },
      {
        id: 'convert-pdf',
        name: 'PDF Conversion',
        coreTerm: 'convert',
        intent: 'transactional' as const,
        pillarPage: '/pdf-to-jpg',
        contentCluster: [
          '/pdf-to-jpg',
          '/pdf-to-png',
          '/blog/convert-pdf-to-images',
          '/blog/pdf-conversion-guide',
        ],
      },
      {
        id: 'rotate-pdf',
        name: 'PDF Rotation',
        coreTerm: 'rotate',
        intent: 'transactional' as const,
        pillarPage: '/rotate-pdf',
        contentCluster: [
          '/rotate-pdf',
          '/blog/rotate-pdf-pages',
          '/blog/pdf-orientation-guide',
        ],
      },
      {
        id: 'mobile-pdf',
        name: 'Mobile PDF Tools',
        coreTerm: 'pdf',
        intent: 'commercial' as const,
        pillarPage: '/',
        contentCluster: [
          '/',
          '/blog/pdf-tools-mobile',
          '/blog/pdf-on-android',
          '/blog/pdf-on-iphone',
        ],
      },
      {
        id: 'student-pdf',
        name: 'Student PDF Tools',
        coreTerm: 'pdf',
        intent: 'informational' as const,
        pillarPage: '/',
        contentCluster: [
          '/',
          '/blog/pdf-for-students',
          '/blog/academic-pdf-guide',
        ],
      },
      {
        id: 'business-pdf',
        name: 'Business PDF Tools',
        coreTerm: 'document',
        intent: 'commercial' as const,
        pillarPage: '/',
        contentCluster: [
          '/',
          '/blog/pdf-for-business',
          '/blog/professional-pdf-tools',
        ],
      },
    ];

    for (const cluster of clusters) {
      const semanticNodes = new Map<string, SemanticNode>();
      const coreNode = this.semanticGraph.get(cluster.coreTerm);
      
      if (coreNode) {
        semanticNodes.set(coreNode.term, { ...coreNode });
        
        // Add related terms
        coreNode.relatedTerms.forEach(related => {
          const relatedNode = this.semanticGraph.get(related.term);
          if (relatedNode) {
            semanticNodes.set(relatedNode.term, { ...relatedNode });
          }
        });
      }

      const authorityScore = this.calculateAuthorityScore(semanticNodes);
      const coverage = this.calculateClusterCoverage(cluster.contentCluster);

      this.topicClusters.set(cluster.id, {
        ...cluster,
        semanticNodes,
        authorityScore,
        coverage,
        internalLinks: 0,
        backlinks: 0,
        rankingKeywords: 0,
      });
    }

    this.calculateContentGaps();
  }

  /**
   * Calculate semantic relationships
   */
  private calculateSemanticRelationships(): void {
    for (const [term1, node1] of this.semanticGraph.entries()) {
      for (const [term2, node2] of this.semanticGraph.entries()) {
        if (term1 !== term2) {
          const similarity = this.calculateTermSimilarity(term1, term2);
          if (similarity > 0.5) {
            this.semanticRelationships.push({
              source: term1,
              target: term2,
              strength: Math.round(similarity * 100),
              type: 'co-occurring',
            });
          }
        }
      }
    }
  }

  /**
   * Calculate term similarity
   */
  private calculateTermSimilarity(term1: string, term2: string): number {
    const words1 = new Set(term1.toLowerCase().split(/[\s-]+/));
    const words2 = new Set(term2.toLowerCase().split(/[\s-]+/));
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  /**
   * Calculate content gap
   */
  private calculateContentGap(volume: number, competition: number): number {
    return Math.round((volume / 1000) * ((100 - competition) / 100));
  }

  /**
   * Calculate authority score
   */
  private calculateAuthorityScore(nodes: Map<string, SemanticNode>): number {
    let totalWeight = 0;
    let totalVolume = 0;

    for (const node of nodes.values()) {
      totalWeight += node.weight;
      totalVolume += node.searchVolume;
    }

    const nodeCount = nodes.size;
    const avgWeight = nodeCount > 0 ? totalWeight / nodeCount : 0;
    const volumeScore = Math.min(100, totalVolume / 1000);

    return Math.round((avgWeight * 0.6 + volumeScore * 0.4));
  }

  /**
   * Calculate cluster coverage
   */
  private calculateClusterCoverage(contentCluster: string[]): number {
    const totalPages = contentCluster.length;
    const coveredPages = contentCluster.filter(url => 
      url.startsWith('/blog/') || url === '/'
    ).length;
    return Math.round((coveredPages / totalPages) * 100);
  }

  /**
   * Calculate content gaps
   */
  private calculateContentGaps(): void {
    for (const cluster of this.topicClusters.values()) {
      const totalVolume = Array.from(cluster.semanticNodes.values())
        .reduce((sum, node) => sum + node.searchVolume, 0);
      const avgCompetition = Array.from(cluster.semanticNodes.values())
        .reduce((sum, node) => sum + node.competition, 0) / cluster.semanticNodes.size;

      const gapScore = this.calculateContentGap(totalVolume, avgCompetition);
      const keywordGap = 50 - cluster.rankingKeywords;

      if (gapScore > 20 && keywordGap > 10) {
        this.contentGaps.push({
          topic: cluster.name,
          searchVolume: totalVolume,
          competition: avgCompetition,
          keywordGap,
          contentOpportunity: gapScore > 50 ? 'high' : gapScore > 25 ? 'medium' : 'low',
          suggestedContent: this.generateContentSuggestions(cluster),
        });
      }
    }

    this.contentGaps.sort((a, b) => b.searchVolume - a.searchVolume);
  }

  /**
   * Generate content suggestions
   */
  private generateContentSuggestions(cluster: TopicCluster): string[] {
    const suggestions: string[] = [];
    const coreNode = cluster.semanticNodes.get(cluster.coreTerm);

    if (coreNode) {
      suggestions.push(
        `Complete guide to ${coreNode.term} PDF documents`,
        `Advanced ${coreNode.term} techniques for professionals`,
        `Common ${coreNode.term} mistakes and how to avoid them`,
        `Best practices for ${coreNode.term} PDF files`,
        `Tools and software for ${coreNode.term} PDF`,
      );
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Expand keywords semantically
   */
  expandKeywords(keywords: string[]): string[] {
    const expanded = new Set<string>(keywords);

    for (const keyword of keywords) {
      const node = this.semanticGraph.get(keyword.toLowerCase());
      if (node) {
        expanded.add(node.term);
        node.relatedTerms.forEach(related => {
          expanded.add(related.term);
        });

        // Add variations
        const variations = this.generateVariations(node.term);
        variations.forEach(v => expanded.add(v));
      }
    }

    return Array.from(expanded);
  }

  /**
   * Generate term variations
   */
  private generateVariations(term: string): string[] {
    const variations: string[] = [];
    const words = term.split(/[\s-]+/);

    // Add with common modifiers
    const modifiers = ['online', 'free', 'fast', 'easy', 'best'];
    for (const mod of modifiers) {
      variations.push(`${mod} ${term}`);
      variations.push(`${term} ${mod}`);
    }

    // Add how-to variations
    variations.push(`how to ${term}`);
    variations.push(`${term} tutorial`);
    variations.push(`guide to ${term}`);

    return variations;
  }

  /**
   * Get semantic cluster for a topic
   */
  getClusterForTopic(topic: string): TopicCluster | undefined {
    for (const cluster of this.topicClusters.values()) {
      if (cluster.coreTerm === topic || cluster.name.toLowerCase().includes(topic.toLowerCase())) {
        return cluster;
      }
    }
    return undefined;
  }

  /**
   * Get related terms
   */
  getRelatedTerms(term: string, limit: number = 10): Array<{ term: string; weight: number }> {
    const node = this.semanticGraph.get(term.toLowerCase());
    if (!node) return [];

    return node.relatedTerms
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);
  }

  /**
   * Get all topic clusters
   */
  getAllClusters(): TopicCluster[] {
    return Array.from(this.topicClusters.values())
      .sort((a, b) => b.authorityScore - a.authorityScore);
  }

  /**
   * Get content gaps
   */
  getContentGaps(limit: number = 10): ContentGap[] {
    return this.contentGaps.slice(0, limit);
  }

  /**
   * Get high opportunity content
   */
  getHighOpportunityContent(): ContentGap[] {
    return this.contentGaps.filter(gap => gap.contentOpportunity === 'high');
  }

  /**
   * Update cluster metrics
   */
  updateClusterMetrics(
    clusterId: string,
    metrics: {
      internalLinks?: number;
      backlinks?: number;
      rankingKeywords?: number;
    }
  ): void {
    const cluster = this.topicClusters.get(clusterId);
    if (cluster) {
      if (metrics.internalLinks !== undefined) cluster.internalLinks = metrics.internalLinks;
      if (metrics.backlinks !== undefined) cluster.backlinks = metrics.backlinks;
      if (metrics.rankingKeywords !== undefined) cluster.rankingKeywords = metrics.rankingKeywords;
      
      // Recalculate authority score
      const newAuthorityScore = this.calculateAuthorityScore(cluster.semanticNodes);
      cluster.authorityScore = Math.round(
        cluster.authorityScore * 0.7 + newAuthorityScore * 0.3
      );
    }
  }

  /**
   * Get semantic graph
   */
  getSemanticGraph(): Map<string, SemanticNode> {
    return new Map(this.semanticGraph);
  }

  /**
   * Get semantic relationships
   */
  getSemanticRelationships(): SemanticRelationship[] {
    return [...this.semanticRelationships];
  }
}

export { SemanticExpansionSystem };
export type { SemanticNode, TopicCluster, ContentGap, SemanticRelationship };