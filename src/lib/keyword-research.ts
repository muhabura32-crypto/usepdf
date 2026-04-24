/**
 * Keyword Research Automation System
 * Discovers, clusters, and scores keywords for programmatic SEO
 */

interface Keyword {
  term: string;
  searchVolume: number;
  competition: number;
  cpc: number;
  kd: number; // Keyword difficulty
  intent: KeywordIntent;
  modifiers: string[];
  relatedTerms: string[];
  longTailVariations: string[];
  priorityScore: number;
  clusterId: string;
  lastUpdated: string;
}

type KeywordIntent = 
  | 'informational'
  | 'transactional'
  | 'commercial'
  | 'navigational'
  | 'problem'
  | 'device'
  | 'industry'
  | 'location';

interface KeywordCluster {
  id: string;
  name: string;
  topic: string;
  intent: KeywordIntent;
  primaryKeywords: Keyword[];
  secondaryKeywords: Keyword[];
  longTailKeywords: Keyword[];
  semanticKeywords: Map<string, number>; // keyword -> relevance score
  totalSearchVolume: number;
  averageKD: number;
  contentGap: number;
  rankingDifficulty: number;
  pageOpportunity: number;
}

interface AutocompleteResult {
  suggestion: string;
  searchVolume: number;
  competition: number;
  source: 'google' | 'bing' | 'youtube' | 'amazon';
}

interface PeopleAlsoAsk {
  question: string;
  snippet: string;
  relatedSearches: string[];
  searchVolume: number;
}

interface KeywordResearchResult {
  primary: Keyword[];
  secondary: Keyword[];
  longTail: Keyword[];
  clusters: KeywordCluster[];
  suggestions: AutocompleteResult[];
  peopleAlsoAsk: PeopleAlsoAsk[];
  semanticExpansions: Map<string, string[]>;
  priorityKeywords: Keyword[];
}

class KeywordResearchSystem {
  private keywords: Map<string, Keyword> = new Map();
  private clusters: Map<string, KeywordCluster> = new Map();
  private semanticExpansions: Map<string, string[]> = new Map();
  private minPriorityScore = 70;

  constructor() {
    this.initializeSemanticDatabase();
  }

  /**
   * Initialize semantic expansion database
   */
  private initializeSemanticDatabase(): void {
    // Core PDF-related semantic expansions
    this.semanticExpansions.set('pdf', [
      'portable document format',
      'document',
      'file',
      'acrobat',
      'document format',
      'digital paper',
      'electronic document',
    ]);

    this.semanticExpansions.set('compress', [
      'reduce',
      'shrink',
      'minimize',
      'optimize',
      'decrease size',
      'make smaller',
      'lossless',
      'lossy',
    ]);

    this.semanticExpansions.set('merge', [
      'combine',
      'join',
      'unite',
      'concatenate',
      'assemble',
      'bring together',
    ]);

    this.semanticExpansions.set('split', [
      'divide',
      'separate',
      'extract',
      'break apart',
      'segment',
      'partition',
    ]);

    this.semanticExpansions.set('convert', [
      'transform',
      'change',
      'translate',
      'export',
      'to',
      'into',
    ]);

    this.semanticExpansions.set('rotate', [
      'turn',
      'spin',
      'flip',
      'orient',
      'twist',
      'pivot',
    ]);

    this.semanticExpansions.set('online', [
      'web',
      'internet',
      'digital',
      'cloud',
      'browser',
      'free',
      'tool',
    ]);

    this.semanticExpansions.set('tool', [
      'software',
      'application',
      'program',
      'utility',
      'service',
      'solution',
      'platform',
    ]);

    // Device semantic expansions
    this.semanticExpansions.set('mobile', [
      'smartphone',
      'phone',
      'android',
      'ios',
      'tablet',
      'ipad',
      'on the go',
    ]);

    // Industry semantic expansions
    this.semanticExpansions.set('student', [
      'college',
      'university',
      'school',
      'academic',
      'homework',
      'assignment',
      'education',
    ]);

    this.semanticExpansions.set('business', [
      'office',
      'professional',
      'corporate',
      'work',
      'company',
      'enterprise',
      'commercial',
    ]);
  }

  /**
   * Discover keywords from multiple sources
   */
  discoverKeywords(
    seedKeywords: string[],
    options: {
      maxResults?: number;
      minVolume?: number;
      maxKD?: number;
      intents?: KeywordIntent[];
    } = {}
  ): KeywordResearchResult {
    const { maxResults = 500, minVolume = 100, maxKD = 70 } = options;
    const discovered: Keyword[] = [];

    // Phase 1: Generate from seed keywords
    for (const seed of seedKeywords) {
      const variations = this.generateKeywordVariations(seed);
      discovered.push(...variations);
    }

    // Phase 2: Expand with semantic variations
    const expanded = this.expandWithSemantics(discovered);
    discovered.push(...expanded);

    // Phase 3: Generate long-tail variations
    const longTails = this.generateLongTailKeywords(discovered);
    discovered.push(...longTails);

    // Phase 4: Add device-specific keywords
    const deviceKeywords = this.generateDeviceKeywords(discovered);
    discovered.push(...deviceKeywords);

    // Phase 5: Add industry-specific keywords
    const industryKeywords = this.generateIndustryKeywords(discovered);
    discovered.push(...industryKeywords);

    // Phase 6: Add location-specific keywords
    const locationKeywords = this.generateLocationKeywords(discovered);
    discovered.push(...locationKeywords);

    // Phase 7: Filter and score
    const filtered = this.filterAndScoreKeywords(
      discovered,
      minVolume,
      maxKD,
      maxResults
    );

    // Phase 8: Cluster keywords
    const clusters = this.clusterKeywords(filtered);

    // Phase 9: Generate autocomplete suggestions
    const suggestions = this.generateAutocompleteSuggestions(filtered);

    // Phase 10: Generate People Also Ask questions
    const peopleAlsoAsk = this.generatePeopleAlsoAsk(filtered);

    // Store results
    filtered.forEach(k => this.keywords.set(k.term, k));
    clusters.forEach(c => this.clusters.set(c.id, c));

    return {
      primary: this.getPriorityKeywords(filtered),
      secondary: this.getSecondaryKeywords(filtered),
      longTail: this.getLongTailKeywords(filtered),
      clusters,
      suggestions,
      peopleAlsoAsk,
      semanticExpansions: this.semanticExpansions,
      priorityKeywords: this.getPriorityKeywords(filtered),
    };
  }

  /**
   * Generate keyword variations from seed
   */
  private generateKeywordVariations(seed: string): Keyword[] {
    const keywords: Keyword[] = [];
    const baseTerms = seed.toLowerCase().split(/[\s-]+/);
    const actions = ['compress', 'merge', 'split', 'convert', 'rotate', 'edit', 'create'];
    const objects = ['pdf', 'document', 'file', 'image'];
    const modifiers = [
      'online', 'free', 'fast', 'easy', 'quick', 'simple',
      'without software', 'no signup', 'no registration', 'web-based'
    ];
    const contexts = [
      'for email', 'for whatsapp', 'for mobile', 'for students',
      'for office', 'for work', 'for business'
    ];

    // Action + Object + Modifier + Context combinations (200-600 pages)
    for (const action of actions) {
      for (const obj of objects) {
        for (const mod of modifiers.slice(0, 3)) {
          for (const ctx of contexts.slice(0, 2)) {
            const term = `${action} ${obj} ${mod} ${ctx}`;
            keywords.push(this.createKeyword(
              term,
              'tool-intent',
              this.estimateVolume(action, obj, mod),
              this.estimateKD(action, obj)
            ));
          }
        }
      }
    }

    // Device-specific (100-200 pages)
    const devices = ['android', 'iphone', 'ios', 'mobile', 'tablet', 'mac', 'windows', 'linux'];
    for (const action of actions) {
      for (const obj of objects) {
        for (const device of devices) {
          const term = `${action} ${obj} on ${device}`;
          keywords.push(this.createKeyword(
            term,
            'device',
            this.estimateVolume(action, obj, 'mobile'),
            this.estimateKD(action, obj) - 5
          ));
        }
      }
    }

    // Industry-specific (50-150 pages)
    const industries = ['student', 'business', 'office', 'professional', 'academic', 'corporate'];
    for (const industry of industries) {
      const term = `pdf tools for ${industry}`;
      keywords.push(this.createKeyword(
        term,
        'industry',
        this.estimateVolume('pdf', 'tools', industry),
        40
      ));
    }

    // Country/Language-specific (100-300 pages)
    const countries = [
      'rwanda', 'africa', 'francais', 'india', 'usa', 'uk', 'canada',
      'australia', 'germany', 'france', 'brazil', 'philippines'
    ];
    for (const country of countries) {
      const term = `pdf tools in ${country}`;
      keywords.push(this.createKeyword(
        term,
        'location',
        this.estimateVolume('pdf', 'tools', country),
        35
      ));
    }

    // Problem-Solution (200+ pages)
    const problems = [
      'pdf too large', 'cannot edit pdf', 'scanned pdf', 'pdf password',
      'pdf corrupted', 'pdf slow', 'pdf email', 'pdf quality'
    ];
    const solutions = [
      'compress without losing quality', 'extract text', 'convert to word',
      'remove password', 'repair file', 'optimize for web', 'reduce file size',
      'improve quality'
    ];
    for (const prob of problems) {
      for (const sol of solutions.slice(0, 2)) {
        const term = `${prob} ${sol}`;
        keywords.push(this.createKeyword(
          term,
          'problem',
          this.estimateVolume(prob.split(' ')[0], 'solution'),
          50
        ));
      }
    }

    return keywords;
  }

  /**
   * Expand keywords with semantic variations
   */
  private expandWithSemantics(keywords: Keyword[]): Keyword[] {
    const expanded: Keyword[] = [];
    const seen = new Set(keywords.map(k => k.term));

    for (const keyword of keywords) {
      const terms = keyword.term.toLowerCase().split(/[\s-]+/);
      for (const term of terms) {
        const expansions = this.semanticExpansions.get(term) || [];
        for (const expansion of expansions) {
          const newTerm = keyword.term.replace(
            new RegExp(term, 'i'),
            expansion
          );
          if (!seen.has(newTerm.toLowerCase())) {
            seen.add(newTerm.toLowerCase());
            expanded.push(this.createKeyword(
              newTerm,
              keyword.intent,
              keyword.searchVolume * 0.8,
              keyword.kd
            ));
          }
        }
      }
    }

    return expanded;
  }

  /**
   * Generate long-tail keyword variations
   */
  private generateLongTailKeywords(keywords: Keyword[]): Keyword[] {
    const longTails: Keyword[] = [];
    const prefixes = [
      'how to', 'best way to', 'guide to', 'tutorial for',
      'tips for', 'tricks for', 'steps to', 'methods to'
    ];
    const suffixes = [
      'for beginners', 'fast and easy', 'like a pro',
      'in minutes', 'without software', 'online free',
      'step by step', 'quick guide'
    ];

    for (const keyword of keywords) {
      if (keyword.term.split(' ').length > 4) continue;

      // Add prefixes
      for (const prefix of prefixes.slice(0, 3)) {
        const term = `${prefix} ${keyword.term}`;
        longTails.push(this.createKeyword(
          term,
          'informational',
          Math.max(50, keyword.searchVolume * 0.6),
          Math.max(20, keyword.kd - 10)
        ));
      }

      // Add suffixes
      for (const suffix of suffixes.slice(0, 3)) {
        const term = `${keyword.term} ${suffix}`;
        longTails.push(this.createKeyword(
          term,
          'informational',
          Math.max(30, keyword.searchVolume * 0.5),
          Math.max(15, keyword.kd - 15)
        ));
      }

      // Combine prefix + suffix
      if (prefixes.length > 0 && suffixes.length > 0) {
        const term = `${prefixes[0]} ${keyword.term} ${suffixes[0]}`;
        longTails.push(this.createKeyword(
          term,
          'informational',
          Math.max(20, keyword.searchVolume * 0.4),
          Math.max(10, keyword.kd - 20)
        ));
      }
    }

    return longTails;
  }

  /**
   * Generate device-specific keywords
   */
  private generateDeviceKeywords(keywords: Keyword[]): Keyword[] {
    const deviceKeywords: Keyword[] = [];
    const devices = ['android', 'iphone', 'ipad', 'mobile', 'tablet'];
    const actions = ['compress', 'merge', 'split', 'convert', 'rotate'];

    for (const device of devices) {
      for (const action of actions) {
        const term = `${action} pdf on ${device}`;
        deviceKeywords.push(this.createKeyword(
          term,
          'device',
          500 + Math.random() * 2000,
          35 + Math.random() * 20
        ));
      }
    }

    return deviceKeywords;
  }

  /**
   * Generate industry-specific keywords
   */
  private generateIndustryKeywords(keywords: Keyword[]): Keyword[] {
    const industryKeywords: Keyword[] = [];
    const industries = [
      { name: 'students', volume: 3000 },
      { name: 'business', volume: 5000 },
      { name: 'office', volume: 2000 },
      { name: 'professional', volume: 1500 },
    ];

    for (const industry of industries) {
      const term = `pdf tools for ${industry.name}`;
      industryKeywords.push(this.createKeyword(
        term,
        'industry',
        industry.volume + Math.random() * 1000,
        40 + Math.random() * 15
      ));
    }

    return industryKeywords;
  }

  /**
   * Generate location-specific keywords
   */
  private generateLocationKeywords(keywords: Keyword[]): Keyword[] {
    const locationKeywords: Keyword[] = [];
    const locations = [
      { name: 'rwanda', volume: 800 },
      { name: 'africa', volume: 2000 },
      { name: 'francais', volume: 1500 },
      { name: 'india', volume: 8000 },
      { name: 'usa', volume: 10000 },
    ];

    for (const loc of locations) {
      const term = `pdf tools in ${loc.name}`;
      locationKeywords.push(this.createKeyword(
        term,
        'location',
        loc.volume + Math.random() * 500,
        35 + Math.random() * 15
      ));
    }

    return locationKeywords;
  }

  /**
   * Create a keyword object
   */
  private createKeyword(
    term: string,
    intent: KeywordIntent,
    searchVolume: number,
    kd: number
  ): Keyword {
    const modifiers = this.extractModifiers(term);
    const relatedTerms = this.findRelatedTerms(term);
    const longTailVariations = this.generateLongTailForTerm(term);

    return {
      term: term.toLowerCase().trim(),
      searchVolume: Math.round(searchVolume),
      competition: Math.round((kd / 100) * 100),
      cpc: this.estimateCPC(term),
      kd: Math.round(kd),
      intent,
      modifiers,
      relatedTerms,
      longTailVariations,
      priorityScore: this.calculatePriorityScore(term, searchVolume, kd, intent),
      clusterId: '',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Extract modifiers from term
   */
  private extractModifiers(term: string): string[] {
    const modifiers: string[] = [];
    const modifierKeywords = ['free', 'online', 'fast', 'easy', 'quick', 'simple', 'best', 'top'];

    for (const mod of modifierKeywords) {
      if (term.toLowerCase().includes(mod)) {
        modifiers.push(mod);
      }
    }

    return modifiers;
  }

  /**
   * Find related terms
   */
  private findRelatedTerms(term: string): string[] {
    const related: string[] = [];
    const parts = term.toLowerCase().split(/[\s-]+/);

    for (const [key, expansions] of this.semanticExpansions.entries()) {
      if (parts.includes(key)) {
        related.push(...expansions.slice(0, 3));
      }
    }

    return [...new Set(related)].slice(0, 10);
  }

  /**
   * Generate long-tail variations for a term
   */
  private generateLongTailForTerm(term: string): string[] {
    const variations: string[] = [];
    const prefixes = ['how to', 'tutorial', 'guide', 'tips for'];
    const suffixes = ['for beginners', 'step by step', 'fast and easy'];

    for (const prefix of prefixes) {
      variations.push(`${prefix} ${term}`);
    }
    for (const suffix of suffixes) {
      variations.push(`${term} ${suffix}`);
    }

    return variations.slice(0, 5);
  }

  /**
   * Estimate search volume
   */
  private estimateVolume(...parts: string[]): number {
    let volume = 100;
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (lower.includes('pdf')) volume += 5000;
      if (lower.includes('compress')) volume += 8000;
      if (lower.includes('merge')) volume += 6000;
      if (lower.includes('split')) volume += 4000;
      if (lower.includes('convert')) volume += 7000;
      if (lower.includes('free')) volume += 3000;
      if (lower.includes('online')) volume += 2000;
      if (lower.includes('student')) volume += 1000;
      if (lower.includes('business')) volume += 2500;
    }
    return volume + Math.random() * 1000;
  }

  /**
   * Estimate keyword difficulty
   */
  private estimateKD(...parts: string[]): number {
    let kd = 30;
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (lower.includes('pdf')) kd += 15;
      if (lower.includes('tool') || lower.includes('software')) kd += 10;
      if (lower.includes('free')) kd += 5;
      if (lower.includes('online')) kd += 5;
    }
    return Math.min(90, kd + Math.random() * 20);
  }

  /**
   * Estimate CPC
   */
  private estimateCPC(term: string): number {
    const lower = term.toLowerCase();
    if (lower.includes('business') || lower.includes('professional')) return 2.5 + Math.random() * 3;
    if (lower.includes('software') || lower.includes('tool')) return 1.5 + Math.random() * 2;
    return 0.5 + Math.random() * 1.5;
  }

  /**
   * Calculate priority score (0-100)
   */
  private calculatePriorityScore(
    term: string,
    searchVolume: number,
    kd: number,
    intent: KeywordIntent
  ): number {
    let score = 0;

    // Search volume factor (0-40 points)
    if (searchVolume > 10000) score += 40;
    else if (searchVolume > 5000) score += 30;
    else if (searchVolume > 1000) score += 20;
    else if (searchVolume > 500) score += 10;
    else score += 5;

    // Keyword difficulty factor (0-30 points - easier is better)
    if (kd < 30) score += 30;
    else if (kd < 40) score += 25;
    else if (kd < 50) score += 20;
    else if (kd < 60) score += 15;
    else if (kd < 70) score += 10;
    else score += 5;

    // Intent factor (0-20 points)
    const intentScores: Record<KeywordIntent, number> = {
      'transactional': 20,
      'commercial': 18,
      'problem': 16,
      'device': 15,
      'industry': 14,
      'location': 12,
      'informational': 10,
      'navigational': 5,
    };
    score += intentScores[intent] || 5;

    // Term length factor (0-10 points - longer tails often better)
    const wordCount = term.split(/[\s-]+/).length;
    if (wordCount >= 5) score += 10;
    else if (wordCount === 4) score += 8;
    else if (wordCount === 3) score += 6;
    else if (wordCount === 2) score += 4;
    else score += 2;

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Filter and score keywords
   */
  private filterAndScoreKeywords(
    keywords: Keyword[],
    minVolume: number,
    maxKD: number,
    maxResults: number
  ): Keyword[] {
    return keywords
      .filter(k => k.searchVolume >= minVolume)
      .filter(k => k.kd <= maxKD)
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, maxResults);
  }

  /**
   * Cluster keywords by topic and intent
   */
  private clusterKeywords(keywords: Keyword[]): KeywordCluster[] {
    const clusters: Map<string, KeywordCluster> = new Map();
    const clusterDefinitions = [
      { id: 'compress-pdf', name: 'PDF Compression', topic: 'compress PDF', intent: 'problem' as KeywordIntent },
      { id: 'merge-pdf', name: 'PDF Merging', topic: 'merge PDF', intent: 'problem' as KeywordIntent },
      { id: 'split-pdf', name: 'PDF Splitting', topic: 'split PDF', intent: 'problem' as KeywordIntent },
      { id: 'convert-pdf', name: 'PDF Conversion', topic: 'convert PDF', intent: 'problem' as KeywordIntent },
      { id: 'rotate-pdf', name: 'PDF Rotation', topic: 'rotate PDF', intent: 'problem' as KeywordIntent },
      { id: 'mobile-pdf', name: 'Mobile PDF Tools', topic: 'mobile PDF', intent: 'device' as KeywordIntent },
      { id: 'student-pdf', name: 'Student PDF Tools', topic: 'student PDF', intent: 'industry' as KeywordIntent },
      { id: 'business-pdf', name: 'Business PDF Tools', topic: 'business PDF', intent: 'industry' as KeywordIntent },
      { id: 'location-pdf', name: 'Regional PDF Tools', topic: 'regional PDF', intent: 'location' as KeywordIntent },
    ];

    // Initialize clusters
    for (const def of clusterDefinitions) {
      clusters.set(def.id, {
        id: def.id,
        name: def.name,
        topic: def.topic,
        intent: def.intent,
        primaryKeywords: [],
        secondaryKeywords: [],
        longTailKeywords: [],
        semanticKeywords: new Map(),
        totalSearchVolume: 0,
        averageKD: 0,
        contentGap: 0,
        rankingDifficulty: 0,
        pageOpportunity: 0,
      });
    }

    // Assign keywords to clusters
    for (const keyword of keywords) {
      const cluster = this.findBestClusterMatch(keyword, clusterDefinitions);
      if (cluster) {
        keyword.clusterId = cluster.id;
        const clusterData = clusters.get(cluster.id)!;

        if (keyword.priorityScore >= 80) {
          clusterData.primaryKeywords.push(keyword);
        } else if (keyword.priorityScore >= 60) {
          clusterData.secondaryKeywords.push(keyword);
        } else {
          clusterData.longTailKeywords.push(keyword);
        }

        // Update semantic keywords
        const relatedTerms = [...keyword.relatedTerms, ...keyword.longTailVariations];
        for (const term of relatedTerms) {
          clusterData.semanticKeywords.set(
            term,
            (clusterData.semanticKeywords.get(term) || 0) + keyword.priorityScore
          );
        }
      }
    }

    // Calculate cluster metrics
    for (const [id, cluster] of clusters.entries()) {
      const allKeywords = [
        ...cluster.primaryKeywords,
        ...cluster.secondaryKeywords,
        ...cluster.longTailKeywords,
      ];

      if (allKeywords.length === 0) continue;

      cluster.totalSearchVolume = allKeywords.reduce((sum, k) => sum + k.searchVolume, 0);
      cluster.averageKD = Math.round(
        allKeywords.reduce((sum, k) => sum + k.kd, 0) / allKeywords.length
      );
      cluster.pageOpportunity = Math.round(
        (cluster.primaryKeywords.length * 100 +
         cluster.secondaryKeywords.length * 60 +
         cluster.longTailKeywords.length * 30) / 190
      );
      cluster.contentGap = Math.max(0, 100 - cluster.pageOpportunity);
      cluster.rankingDifficulty = cluster.averageKD;

      clusters.set(id, cluster);
    }

    return Array.from(clusters.values()).filter(c => c.primaryKeywords.length > 0);
  }

  /**
   * Find best cluster match for a keyword
   */
  private findBestClusterMatch(
    keyword: Keyword,
    clusters: Array<{ id: string; topic: string; intent: KeywordIntent }>
  ): { id: string; topic: string; intent: KeywordIntent } | null {
    let bestMatch: { id: string; topic: string; intent: KeywordIntent } | null = null;
    let bestScore = 0;

    for (const cluster of clusters) {
      let score = 0;

      // Intent match
      if (keyword.intent === cluster.intent) score += 40;

      // Topic match
      const topicWords = cluster.topic.toLowerCase().split(/[\s-]+/);
      const keywordWords = keyword.term.toLowerCase().split(/[\s-]+/);
      const matches = topicWords.filter(w => keywordWords.includes(w)).length;
      score += matches * 20;

      // Related terms match
      const relatedMatches = keyword.relatedTerms.filter(t =>
        cluster.topic.toLowerCase().includes(t)
      ).length;
      score += relatedMatches * 15;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = cluster;
      }
    }

    return bestScore >= 30 ? bestMatch : null;
  }

  /**
   * Generate autocomplete suggestions
   */
  private generateAutocompleteSuggestions(keywords: Keyword[]): AutocompleteResult[] {
    const suggestions: AutocompleteResult[] = [];
    const sources: AutocompleteResult['source'][] = ['google', 'bing', 'youtube', 'amazon'];

    for (const keyword of keywords.slice(0, 50)) {
      const term = keyword.term;
      const baseVolume = keyword.searchVolume;

      // Generate partial matches
      const parts = term.split(' ');
      for (let i = 1; i < parts.length; i++) {
        const partial = parts.slice(0, i).join(' ');
        suggestions.push({
          suggestion: partial,
          searchVolume: Math.round(baseVolume * 0.3),
          competition: keyword.competition,
          source: sources[Math.floor(Math.random() * sources.length)],
        });
      }

      // Full term
      suggestions.push({
        suggestion: term,
        searchVolume: baseVolume,
        competition: keyword.competition,
        source: 'google',
      });
    }

    return suggestions.slice(0, 200);
  }

  /**
   * Generate People Also Ask questions
   */
  private generatePeopleAlsoAsk(keywords: Keyword[]): PeopleAlsoAsk[] {
    const questions: PeopleAlsoAsk[] = [];
    const questionTemplates = [
      'How do I {term}?',
      'What is the best way to {term}?',
      'Can I {term} for free?',
      'Is it safe to {term} online?',
      'How long does it take to {term}?',
      'What are the benefits of {term}?',
      'Are there any limitations when {term}?',
      'Do I need to install software to {term}?',
    ];

    for (const keyword of keywords.slice(0, 30)) {
      const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
      questions.push({
        question: template.replace('{term}', keyword.term),
        snippet: `Learn how to ${keyword.term} with our step-by-step guide. It's free, fast, and works directly in your browser.`,
        relatedSearches: keyword.relatedTerms.slice(0, 5),
        searchVolume: Math.round(keyword.searchVolume * 0.4),
      });
    }

    return questions;
  }

  /**
   * Get priority keywords (score >= minPriorityScore)
   */
  private getPriorityKeywords(keywords: Keyword[]): Keyword[] {
    return keywords.filter(k => k.priorityScore >= this.minPriorityScore);
  }

  /**
   * Get secondary keywords (score 50-69)
   */
  private getSecondaryKeywords(keywords: Keyword[]): Keyword[] {
    return keywords.filter(k => k.priorityScore >= 50 && k.priorityScore < this.minPriorityScore);
  }

  /**
   * Get long-tail keywords (3+ words, score >= 40)
   */
  private getLongTailKeywords(keywords: Keyword[]): Keyword[] {
    return keywords.filter(
      k => k.term.split(/[\s-]+/).length >= 3 && k.priorityScore >= 40
    );
  }

  /**
   * Get keyword by term
   */
  getKeyword(term: string): Keyword | undefined {
    return this.keywords.get(term.toLowerCase());
  }

  /**
   * Get all keywords
   */
  getAllKeywords(): Keyword[] {
    return Array.from(this.keywords.values()).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Get keywords by intent
   */
  getKeywordsByIntent(intent: KeywordIntent): Keyword[] {
    return this.getAllKeywords().filter(k => k.intent === intent);
  }

  /**
   * Get cluster by ID
   */
  getCluster(id: string): KeywordCluster | undefined {
    return this.clusters.get(id);
  }

  /**
   * Get all clusters
   */
  getAllClusters(): KeywordCluster[] {
    return Array.from(this.clusters.values()).sort(
      (a, b) => b.totalSearchVolume - a.totalSearchVolume
    );
  }

  /**
   * Get keyword expansion suggestions
   */
  getKeywordExpansions(term: string): string[] {
    const expansions: string[] = [];
    const parts = term.toLowerCase().split(/[\s-]+/);

    for (const part of parts) {
      const partExpansions = this.semanticExpansions.get(part) || [];
      expansions.push(...partExpansions);
    }

    return [...new Set(expansions)].slice(0, 10);
  }

  /**
   * Refresh keyword data (simulates API updates)
   */
  refreshKeywords(): void {
    const keywords = this.getAllKeywords();
    const now = new Date().toISOString().split('T')[0];

    keywords.forEach(k => {
      // Simulate volume fluctuations (-10% to +15%)
      k.searchVolume = Math.round(k.searchVolume * (0.9 + Math.random() * 0.25));

      // Simulate KD fluctuations (-5 to +5)
      k.kd = Math.max(1, Math.min(100, k.kd + Math.floor(Math.random() * 11) - 5));
      k.competition = Math.round((k.kd / 100) * 100);

      // Recalculate priority
      k.priorityScore = this.calculatePriorityScore(k.term, k.searchVolume, k.kd, k.intent);
      k.lastUpdated = now;

      this.keywords.set(k.term, k);
    });
  }
}

export { KeywordResearchSystem };
export type { Keyword, KeywordCluster, AutocompleteResult, PeopleAlsoAsk, KeywordResearchResult, KeywordIntent };