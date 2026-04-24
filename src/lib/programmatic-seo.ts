/**
 * Programmatic SEO System (1000+ Pages)
 * Generates pages using: action + object + modifier + context pattern
 */

interface Keyword {
  term: string;
  searchVolume: number;
  competition: number;
  cpc: number;
  intent: 'informational' | 'transactional' | 'problem' | 'device' | 'industry';
  modifiers: string[];
  relatedTerms: string[];
  priorityScore: number;
}

interface ProgrammaticPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  contentSections: ContentSection[];
  faqs: FAQ[];
  relatedTools: RelatedTool[];
  breadcrumbs: Breadcrumb[];
  schemaMarkup: any;
  lastUpdated: string;
  priority: number;
  topics: string[];
  keywords: string[];
}

interface ContentSection {
  heading: string;
  content: string;
  type: 'introduction' | 'steps' | 'benefits' | 'comparison' | 'troubleshooting';
}

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  name: string;
  slug: string;
  description: string;
}

interface Breadcrumb {
  name: string;
  url: string;
}

interface PageTemplate {
  type: 'tool-intent' | 'device' | 'industry' | 'country' | 'problem-solution';
  pattern: string;
  titleTemplate: string;
  descriptionTemplate: string;
  introTemplate: string;
  sections: SectionTemplate[];
  faqTemplates: FAQTemplate[];
}

interface SectionTemplate {
  type: ContentSection['type'];
  headingTemplate: string;
  contentTemplate: string;
}

interface FAQTemplate {
  questionTemplate: string;
  answerTemplate: string;
}

class ProgrammaticSEOEngine {
  private keywords: Keyword[] = [];
  private pageTemplates: PageTemplate[] = [];
  private generatedPages: Map<string, ProgrammaticPage> = new Map();
  private maxPriorityScore = 100;

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize page templates for different page types
   */
  private initializeTemplates(): void {
    // Tool Intent Pages (300-600 pages)
    this.pageTemplates.push({
      type: 'tool-intent',
      pattern: '{action}-{object}-{modifier}-{context}',
      titleTemplate: '{action} {object} {modifier} | {context} | UsePDF',
      descriptionTemplate: '{action} {object} {modifier} {context} with our free online tool. No signup required. Fast, secure, and 100% client-side processing.',
      introTemplate: `Learn how to ${'{action} {object} {modifier} {context}'} with our easy-to-use tool. Perfect for {context} scenarios, this guide will walk you through the entire process step by step.`,
      sections: [
        {
          type: 'introduction',
          headingTemplate: 'Why You Need to {action} {object} {modifier} for {context}',
          contentTemplate: `{action} {object} {modifier} is essential for {context} workflows. Our free online tool makes it easy to {action.toLowerCase()} {object.toLowerCase()} without any technical knowledge. Whether you're working on {context} projects or managing everyday tasks, our tool delivers professional results every time.`,
        },
        {
          type: 'steps',
          headingTemplate: 'How to {action} {object} {modifier} in 4 Simple Steps',
          contentTemplate: `Follow these simple steps to {action.toLowerCase()} {object.toLowerCase()} {modifier.toLowerCase()} for {context}:\n\n1. Upload your {object.toLowerCase()} to our secure tool\n2. Configure the {modifier.toLowerCase()} settings for optimal results\n3. Process your file with our advanced algorithm\n4. Download your perfectly formatted {object.toLowerCase()} instantly`,
        },
        {
          type: 'benefits',
          headingTemplate: 'Benefits of Using Our {object} Tool for {context}',
          contentTemplate: `Our {object} {modifier} tool offers numerous advantages for {context} users:\n\n• Completely free - no hidden charges or premium tiers\n• 100% secure - all processing happens in your browser\n• Fast processing - optimized for speed and efficiency\n• Professional quality - maintains document integrity\n• No file size limits - handle large files with ease\n• Works everywhere - accessible from any device`,
        },
      ],
      faqTemplates: [
        {
          questionTemplate: 'How do I {action} {object} {modifier} for {context}?',
          answerTemplate: `Simply upload your {object.toLowerCase()} to our tool, configure the {modifier.toLowerCase()} settings based on your {context} requirements, and click process. Your {object.toLowerCase()} will be ready for download in seconds. No technical skills required.`,
        },
        {
          questionTemplate: 'Is the {object} {modifier} tool free for {context} use?',
          answerTemplate: `Yes! Our {object} {modifier} tool is completely free for all {context} use cases. No registration, no credit card, no hidden fees. Process unlimited {object.toLowerCase()} files at no cost.`,
        },
        {
          questionTemplate: 'Will my {object} quality be preserved when processing for {context}?',
          answerTemplate: `Absolutely. Our algorithm preserves the original quality of your {object.toLowerCase()} while applying the {modifier.toLowerCase()} settings. Your {context} documents will look professional and maintain their intended appearance.`,
        },
        {
          questionTemplate: 'What file sizes can I {action} for {context} projects?',
          answerTemplate: `There are no file size restrictions. You can {action.toLowerCase()} {object.toLowerCase()} files of any size for your {context} needs. Our tool handles small files and large documents with equal efficiency.`,
        },
      ],
    });

    // Device Pages (100-200 pages)
    this.pageTemplates.push({
      type: 'device',
      pattern: '{action}-{object}-on-{device}',
      titleTemplate: '{action} {object} on {device} | Free Online Tool | UsePDF',
      descriptionTemplate: 'Free online {action} tool for {device}. {action} {object} on your {device} with our browser-based tool. No app download required. Works on iOS, Android, and tablets.',
      introTemplate: `Need to {action} {object} on your {device}? Our mobile-friendly tool works perfectly in your {device} browser. No installation required, and your files stay private on your device.`,
      sections: [
        {
          type: 'introduction',
          headingTemplate: '{action} {object} on {device} - Made Simple',
          contentTemplate: `{action} {object} on {device} has never been easier. Our responsive tool adapts to your screen size and provides the same powerful features as our desktop version. Perfect for {device} users who need to process documents on the go.`,
        },
        {
          type: 'steps',
          headingTemplate: 'How to {action} {object} on {device} in 3 Steps',
          contentTemplate: `Open our tool in your {device} browser -> Upload your {object.toLowerCase()} -> Process and download. That's it! Our mobile-optimized interface makes {action.toLowerCase()} {object.toLowerCase()} on {device} straightforward and fast.`,
        },
        {
          type: 'benefits',
          headingTemplate: 'Why Choose Our {device} Tool for {action} {object}',
          contentTemplate: `Our {device}-optimized {action} tool offers:\n\n• Responsive design - works on any screen size\n• Touch-friendly interface - optimized for mobile use\n• Offline capable - process without constant connection\n• Battery efficient - optimized for {device} battery life\n• Secure processing - files never leave your {device}`,
        },
      ],
      faqTemplates: [
        {
          questionTemplate: 'Can I really {action} {object} on {device} without an app?',
          answerTemplate: `Yes! Our tool runs entirely in your {device} browser using HTML5 and modern web technologies. No app download, no storage space required, and you get the latest features automatically.`,
        },
        {
          questionTemplate: 'Is {action} {object} on {device} as fast as on desktop?',
          answerTemplate: `Our mobile-optimized algorithms ensure fast {action.toLowerCase()} {object.toLowerCase()} on {device}. Performance depends on your {device} model and file size, but we've optimized every aspect for mobile efficiency.`,
        },
      ],
    });

    // Industry Pages (50-150 pages)
    this.pageTemplates.push({
      type: 'industry',
      pattern: 'pdf-tools-for-{industry}',
      titleTemplate: 'PDF Tools for {industry} | Free Online Solutions | UsePDF',
      descriptionTemplate: 'Free PDF tools designed specifically for {industry} professionals. Merge, compress, split, convert PDFs for {industry} workflows. No signup required.',
      introTemplate: `Professionals in {industry} need reliable PDF tools that integrate seamlessly into their workflow. Our free online tools are tailored for {industry} use cases, providing the features you need without complexity.`,
      sections: [
        {
          type: 'introduction',
          headingTemplate: 'Essential PDF Tools for {industry} Professionals',
          contentTemplate: `In {industry}, managing documents efficiently is crucial. Our suite of PDF tools helps {industry} professionals merge contracts, compress reports, split documents, and convert files - all without leaving the browser. No software installation, no licensing fees, just powerful tools that work.`,
        },
        {
          type: 'benefits',
          headingTemplate: 'Why {industry} Teams Choose UsePDF',
          contentTemplate: `Benefits for {industry} use:\n\n• Workflow integration - tools that fit your existing processes\n• Security first - client-side processing keeps sensitive documents private\n• Cost effective - completely free, no per-user licensing\n• Time saving - process documents in seconds, not hours\n• Accessibility - work from any device, anywhere`,
        },
        {
          type: 'comparison',
          headingTemplate: 'UsePDF vs Traditional Software for {industry}',
          contentTemplate: `Traditional PDF software for {industry} often requires expensive licenses, IT support, and training. Our free online tools eliminate these barriers:\n\n• No installation - start using immediately\n• No training - intuitive interface\n• No costs - free for unlimited use\n• No maintenance - we handle updates\n• No compatibility issues - works on all systems`,
        },
      ],
      faqTemplates: [
        {
          questionTemplate: 'How can {industry} professionals benefit from your PDF tools?',
          answerTemplate: `Our tools are designed for {industry} workflows. Whether you're merging contracts, compressing reports for email, or splitting large documents, our tools integrate into your daily routine without disrupting your processes.`,
        },
        {
          questionTemplate: 'Is using online PDF tools secure for {industry} documents?',
          answerTemplate: `Yes. All processing happens in your browser on your device. Documents are never uploaded to servers. This client-side approach ensures maximum security for sensitive {industry} information.`,
        },
      ],
    });

    // Country/Language Pages (100-300 pages)
    this.pageTemplates.push({
      type: 'country',
      pattern: 'pdf-tools-in-{country}',
      titleTemplate: 'PDF Tools in {country} | Free Online | UsePDF',
      descriptionTemplate: 'Free online PDF tools for users in {country}. Merge, compress, split, and convert PDFs. Fast, secure, and accessible from anywhere in {country}.',
      introTemplate: `Users in {country} need reliable, fast PDF tools that work locally. Our browser-based tools are perfect for {country} users who want to process documents without installing software.`,
      sections: [
        {
          type: 'introduction',
          headingTemplate: 'PDF Tools for Users in {country}',
          contentTemplate: `Whether you're in {country} working on business documents, academic papers, or personal files, our free PDF tools provide everything you need. Process documents instantly without downloads or subscriptions.`,
        },
        {
          type: 'benefits',
          headingTemplate: 'Benefits for {country} Users',
          contentTemplate: `• Works with local internet connections in {country}\n• No regional restrictions or blocks\n• Fast processing on local servers\n• Available in multiple languages\n• Compliant with local data preferences`,
        },
      ],
      faqTemplates: [
        {
          questionTemplate: 'Can users in {country} access your PDF tools?',
          answerTemplate: `Yes! Our tools are web-based and accessible from anywhere in {country}. All you need is a browser and internet connection. No VPN or special software required.`,
        },
      ],
    });

    // Problem-Solution Pages (200+ pages)
    this.pageTemplates.push({
      type: 'problem-solution',
      pattern: '{problem}-{solution}',
      titleTemplate: '{problem} | {solution} | UsePDF',
      descriptionTemplate: 'Free solution for {problem}. {solution} with our online tool. No signup, no fees, instant results. Process your documents securely in your browser.',
      introTemplate: `Facing {problem}? Our {solution} tool provides a fast, free way to resolve this issue. Process your documents online without installing software or creating accounts.`,
      sections: [
        {
          type: 'introduction',
          headingTemplate: 'Solving {problem} with Our {solution}',
          contentTemplate: `{problem} is a common challenge for many users. Our {solution} tool addresses this by providing a simple, effective way to process your documents online. No technical expertise required.`,
        },
        {
          type: 'steps',
          headingTemplate: 'How Our {solution} Fixes {problem}',
          contentTemplate: `1. Upload your document to our tool\n2. Apply the {solution} settings\n3. Process and review the results\n4. Download your fixed document\n\nIt's that simple to solve {problem}.`,
        },
      ],
      faqTemplates: [
        {
          questionTemplate: 'How does your tool solve {problem}?',
          answerTemplate: `Our {solution} tool applies advanced processing to fix {problem}. The algorithm handles the technical details while you get perfect results every time.`,
        },
      ],
    });
  }

  /**
   * Register keywords for programmatic page generation
   */
  registerKeywords(keywords: Keyword[]): void {
    this.keywords.push(...keywords);
    this.keywords.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Generate a programmatic page from template and data
   */
  generatePage(
    template: PageTemplate,
    data: Record<string, string>
  ): ProgrammaticPage {
    const slug = this.generateSlug(template.pattern, data);
    const title = this.applyTemplate(template.titleTemplate, data);
    const metaDescription = this.applyTemplate(template.descriptionTemplate, data);
    const h1 = this.generateH1(template.type, data);
    const intro = this.applyTemplate(template.introTemplate, data);
    
    const contentSections = template.sections.map(section => ({
      type: section.type,
      heading: this.applyTemplate(section.headingTemplate, data),
      content: this.applyTemplate(section.contentTemplate, data),
    }));

    const faqs = template.faqTemplates.map(faq => ({
      question: this.applyTemplate(faq.questionTemplate, data),
      answer: this.applyTemplate(faq.answerTemplate, data),
    }));

    const relatedTools = this.findRelatedTools(data, template.type);
    const breadcrumbs = this.generateBreadcrumbs(template.type, data);
    const schemaMarkup = this.generateSchemaMarkup(template.type, data, title, metaDescription);

    const page: ProgrammaticPage = {
      slug,
      title,
      metaDescription,
      h1,
      intro,
      contentSections,
      faqs,
      relatedTools,
      breadcrumbs,
      schemaMarkup,
      lastUpdated: new Date().toISOString().split('T')[0],
      priority: this.calculatePriority(data, template.type),
      topics: this.extractTopics(data, template.type),
      keywords: this.extractKeywords(data),
    };

    this.generatedPages.set(slug, page);
    return page;
  }

  /**
   * Generate multiple pages from keyword combinations
   */
  generatePagesFromKeywords(
    template: PageTemplate,
    minPriority: number = 70,
    limit: number = 1000
  ): ProgrammaticPage[] {
    const pages: ProgrammaticPage[] = [];
    const highPriorityKeywords = this.keywords.filter(k => k.priorityScore >= minPriority);

    let count = 0;
    for (const keyword of highPriorityKeywords) {
      if (count >= limit) break;

      // Generate pages based on template type
      const data = this.buildDataFromKeyword(keyword, template.type);
      const page = this.generatePage(template, data);
      pages.push(page);
      count++;

      // Generate variations with modifiers
      for (const modifier of keyword.modifiers) {
        if (count >= limit) break;
        const variationData = { ...data, modifier };
        const variationPage = this.generatePage(template, variationData);
        pages.push(variationPage);
        count++;
      }
    }

    return pages;
  }

  /**
   * Generate slug from pattern and data
   */
  private generateSlug(pattern: string, data: Record<string, string>): string {
    let slug = pattern;
    for (const [key, value] of Object.entries(data)) {
      slug = slug.replace(new RegExp(`{${key}}`, 'g'), value.toLowerCase().replace(/\s+/g, '-'));
    }
    return slug.replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-');
  }

  /**
   * Apply template with data
   */
  private applyTemplate(template: string, data: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }

  /**
   * Generate H1 based on type
   */
  private generateH1(type: string, data: Record<string, string>): string {
    const h1Templates: Record<string, (d: Record<string, string>) => string> = {
      'tool-intent': (d) => `Free ${d.action || 'Online'} ${d.object || 'Tool'} for ${d.context || 'You'}`,
      'device': (d) => `${d.action || 'Process'} ${d.object || 'Files'} on ${d.device || 'Any Device'}`,
      'industry': (d) => `PDF Tools for ${d.industry || 'Professionals'}`,
      'country': (d) => `Free PDF Tools in ${d.country || 'Your Region'}`,
      'problem-solution': (d) => `Solve: ${d.problem || 'Your Problem'}`,
    };

    const template = h1Templates[type] || h1Templates['tool-intent'];
    return template(data);
  }

  /**
   * Build data object from keyword
   */
  private buildDataFromKeyword(keyword: Keyword, type: string): Record<string, string> {
    const parts = keyword.term.split(/[\s-]+/);
    
    const baseData: Record<string, string> = {
      action: parts[0] || 'process',
      object: parts[1] || 'pdf',
      modifier: keyword.modifiers[0] || 'online',
      context: keyword.relatedTerms[0] || 'general use',
      device: keyword.relatedTerms.find(t => /mobile|android|iphone|tablet/i.test(t))?.replace('pdf on ', '') || 'mobile',
      industry: keyword.relatedTerms.find(t => /student|office|business|professional/i.test(t)) || 'business',
      country: keyword.relatedTerms.find(t => /rwanda|africa|francais|india|usa|uk/i.test(t)) || 'worldwide',
      problem: keyword.term,
      solution: this.generateSolution(keyword.term),
    };

    return baseData;
  }

  /**
   * Generate solution from problem term
   */
  private generateSolution(term: string): string {
    const solutions = {
      'compress': 'compress your files',
      'merge': 'combine multiple files',
      'split': 'extract specific pages',
      'convert': 'transform to different format',
      'rotate': 'adjust page orientation',
      'large': 'reduce file size significantly',
      'email': 'prepare for easy sharing',
    };

    for (const [key, value] of Object.entries(solutions)) {
      if (term.toLowerCase().includes(key)) {
        return value;
      }
    }

    return 'process your documents';
  }

  /**
   * Find related tools for cross-linking
   */
  private findRelatedTools(data: Record<string, string>, type: string): RelatedTool[] {
    const allTools = ['merge-pdf', 'split-pdf', 'compress-pdf', 'rotate-pdf', 'pdf-to-jpg', 'pdf-to-png', 'jpg-to-pdf', 'png-to-pdf', 'word-to-pdf'];
    const related = allTools.filter(tool => !data.slug?.includes(tool)).slice(0, 3);
    
    return related.map(slug => ({
      name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: `/${slug}`,
      description: `Free online ${slug.replace('-', ' ')} tool`,
    }));
  }

  /**
   * Generate breadcrumb navigation
   */
  private generateBreadcrumbs(type: string, data: Record<string, string>): Breadcrumb[] {
    return [
      { name: 'Home', url: 'https://usepdf.xyz' },
      { name: 'Tools', url: 'https://usepdf.xyz/tools' },
      { 
        name: type === 'tool-intent' ? data.object || 'Tool' : 
             type === 'device' ? `${data.device || 'Device'} Tools` :
             type === 'industry' ? data.industry || 'Industry' :
             type === 'country' ? data.country || 'Region' :
             'Solutions',
        url: `https://usepdf.xyz/${type === 'tool-intent' ? data.object?.toLowerCase() || 'tools' : type}s`
      },
    ];
  }

  /**
   * Generate schema markup
   */
  private generateSchemaMarkup(type: string, data: Record<string, string>, title: string, description: string): any {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description: description,
      url: `https://usepdf.xyz/${data.slug || ''}`,
      applicationCategory: 'Utility',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };

    if (type === 'tool-intent') {
      return {
        ...baseSchema,
        featureList: [
          'Free to use online',
          'No registration required',
          '100% client-side processing',
          'Secure and private',
        ],
      };
    }

    return baseSchema;
  }

  /**
   * Calculate page priority
   */
  private calculatePriority(data: Record<string, string>, type: string): number {
    let priority = 50;

    // Type-based priority
    const typePriorities: Record<string, number> = {
      'tool-intent': 80,
      'device': 70,
      'problem-solution': 75,
      'industry': 65,
      'country': 60,
    };

    priority = typePriorities[type] || 50;

    // Keyword-based adjustment
    const keywordMatch = this.keywords.find(k => 
      data.slug?.includes(k.term.replace(/\s+/g, '-').toLowerCase())
    );
    if (keywordMatch) {
      priority += keywordMatch.priorityScore * 0.2;
    }

    return Math.min(100, Math.max(10, priority));
  }

  /**
   * Extract topics from data
   */
  private extractTopics(data: Record<string, string>, type: string): string[] {
    const topics = new Set<string>();
    
    Object.values(data).forEach(value => {
      topics.add(value.toLowerCase());
    });

    topics.add(type);
    topics.add('pdf-tools');
    topics.add('usepdf');

    return Array.from(topics);
  }

  /**
   * Extract keywords
   */
  private extractKeywords(data: Record<string, string>): string[] {
    return Object.values(data).map(v => v.toLowerCase());
  }

  /**
   * Get generated page by slug
   */
  getPage(slug: string): ProgrammaticPage | undefined {
    return this.generatedPages.get(slug);
  }

  /**
   * Get all generated pages
   */
  getAllPages(): ProgrammaticPage[] {
    return Array.from(this.generatedPages.values()).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get pages by type
   */
  getPagesByType(type: string): ProgrammaticPage[] {
    return this.getAllPages().filter(page => {
      const slug = page.slug;
      return slug.includes(type.replace('-', '-'));
    });
  }

  /**
   * Get top N pages by priority
   */
  getTopPages(count: number): ProgrammaticPage[] {
    return this.getAllPages().slice(0, count);
  }

  /**
   * Get keyword suggestions
   */
  getKeywordSuggestions(term: string): Keyword[] {
    return this.keywords.filter(k => 
      k.term.toLowerCase().includes(term.toLowerCase()) ||
      k.relatedTerms.some(t => t.toLowerCase().includes(term.toLowerCase()))
    ).slice(0, 10);
  }

  /**
   * Generate all programmatic pages (1000+)
   */
  generateAllPages(): {
    toolIntentPages: ProgrammaticPage[];
    devicePages: ProgrammaticPage[];
    industryPages: ProgrammaticPage[];
    countryPages: ProgrammaticPage[];
    problemSolutionPages: ProgrammaticPage[];
    total: number;
  } {
    const toolIntentPages = this.generatePagesFromKeywords(
      this.pageTemplates.find(t => t.type === 'tool-intent')!,
      70,
      400
    );

    const devicePages = this.generatePagesFromKeywords(
      this.pageTemplates.find(t => t.type === 'device')!,
      60,
      150
    );

    const industryPages = this.generatePagesFromKeywords(
      this.pageTemplates.find(t => t.type === 'industry')!,
      55,
      100
    );

    const countryPages = this.generatePagesFromKeywords(
      this.pageTemplates.find(t => t.type === 'country')!,
      50,
      150
    );

    const problemSolutionPages = this.generatePagesFromKeywords(
      this.pageTemplates.find(t => t.type === 'problem-solution')!,
      65,
      300
    );

    return {
      toolIntentPages,
      devicePages,
      industryPages,
      countryPages,
      problemSolutionPages,
      total: toolIntentPages.length + devicePages.length + industryPages.length + 
             countryPages.length + problemSolutionPages.length,
    };
  }
}

export { ProgrammaticSEOEngine };
export type { ProgrammaticPage, Keyword, ContentSection, FAQ, RelatedTool, Breadcrumb, PageTemplate };