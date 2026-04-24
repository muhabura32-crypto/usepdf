/**
 * User Behavior Optimization System
 * Dwell time, click depth, bounce rate optimization
 */

interface UserSession {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime: number;
  pages: PageVisit[];
  events: UserEvent[];
  device: DeviceInfo;
  referrer: string;
  bounce: boolean;
  conversion: boolean;
}

interface PageVisit {
  url: string;
  entryTime: number;
  exitTime: number;
  dwellTime: number;
  scrollDepth: number;
  interactions: number;
  clickDepth: number;
  pageLoadTime: number;
  domReadyTime: number;
  firstPaintTime: number;
  timeToInteractive: number;
}

interface UserEvent {
  type: 'click' | 'scroll' | 'form_input' | 'tool_usage' | 'download' | 'share';
  timestamp: number;
  target: string;
  value?: any;
  metadata?: Record<string, any>;
}

interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  connection: '4g' | '3g' | '2g' | 'slow-2g' | 'wifi' | 'unknown';
}

interface BehaviorMetrics {
  averageDwellTime: number;
  averageClickDepth: number;
  bounceRate: number;
  conversionRate: number;
  pagesPerSession: number;
  returnVisitorRate: number;
  scrollDepthAverage: number;
  timeToFirstInteraction: number;
  exitRateByPage: Map<string, number>;
  popularContent: Array<{ url: string; visits: number; avgDwellTime: number }>;
}

interface OptimizationRecommendation {
  type: 'dwell' | 'click_depth' | 'bounce' | 'conversion' | 'performance';
  priority: 'high' | 'medium' | 'low';
  description: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  suggestedActions: string[];
  estimatedImpact: number;
}

interface ContentEngagementScore {
  url: string;
  score: number;
  factors: {
    dwellTime: number;
    scrollDepth: number;
    interactions: number;
    returnVisits: number;
    socialShares: number;
  };
}

class UserBehaviorOptimizer {
  private sessions: Map<string, UserSession> = new Map();
  private pageMetrics: Map<string, PageVisit[]> = new Map();
  private behaviorMetrics: BehaviorMetrics;
  private userSegments: Map<string, string[]> = new Map();

  constructor() {
    this.behaviorMetrics = this.initializeMetrics();
    this.initializeDefaultSegments();
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): BehaviorMetrics {
    return {
      averageDwellTime: 0,
      averageClickDepth: 0,
      bounceRate: 0,
      conversionRate: 0,
      pagesPerSession: 0,
      returnVisitorRate: 0,
      scrollDepthAverage: 0,
      timeToFirstInteraction: 0,
      exitRateByPage: new Map(),
      popularContent: [],
    };
  }

  /**
   * Initialize user segments
   */
  private initializeDefaultSegments(): void {
    this.userSegments.set('new_visitors', []);
    this.userSegments.set('returning_visitors', []);
    this.userSegments.set('high_engagement', []);
    this.userSegments.set('mobile_users', []);
    this.userSegments.set('desktop_users', []);
    this.userSegments.set('converters', []);
    this.userSegments.set('bounced', []);
    this.userSegments.set('power_users', []);
  }

  /**
   * Start a new user session
   */
  startSession(userId: string, device: DeviceInfo, referrer?: string): string {
    const sessionId = this.generateSessionId();
    const session: UserSession = {
      sessionId,
      userId,
      startTime: Date.now(),
      endTime: 0,
      pages: [],
      events: [],
      device,
      referrer: referrer || '',
      bounce: true,
      conversion: false,
    };

    this.sessions.set(sessionId, session);
    this.assignUserSegment(userId, session);
    return sessionId;
  }

  /**
   * Track page visit
   */
  trackPageVisit(
    sessionId: string,
    url: string,
    performanceMetrics: {
      pageLoadTime: number;
      domReadyTime: number;
      firstPaintTime: number;
      timeToInteractive: number;
    }
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const pageVisit: PageVisit = {
      url,
      entryTime: Date.now(),
      exitTime: 0,
      dwellTime: 0,
      scrollDepth: 0,
      interactions: 0,
      clickDepth: this.calculateClickDepth(session, url),
      ...performanceMetrics,
    };

    session.pages.push(pageVisit);
    this.updatePageMetrics(url, pageVisit);

    // Update bounce status
    if (session.pages.length > 1) {
      session.bounce = false;
    }
  }

  /**
   * Update page exit
   */
  updatePageExit(sessionId: string, url: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const pageVisit = session.pages.find(p => p.url === url && p.exitTime === 0);
    if (pageVisit) {
      pageVisit.exitTime = Date.now();
      pageVisit.dwellTime = pageVisit.exitTime - pageVisit.entryTime;
      this.updateExitRate(url, session);
    }
  }

  /**
   * Track user event
   */
  trackEvent(
    sessionId: string,
    type: UserEvent['type'],
    target: string,
    value?: any,
    metadata?: Record<string, any>
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const event: UserEvent = {
      type,
      timestamp: Date.now(),
      target,
      value,
      metadata,
    };

    session.events.push(event);
    this.updatePageInteractions(sessionId, target);
    this.checkForConversion(session, event);
  }

  /**
   * Update scroll depth
   */
  updateScrollDepth(sessionId: string, url: string, depth: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const pageVisit = session.pages.find(p => p.url === url);
    if (pageVisit) {
      pageVisit.scrollDepth = Math.max(pageVisit.scrollDepth, depth);
    }
  }

  /**
   * End session
   */
  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.endTime = Date.now();

    // Close any open page visits
    session.pages.forEach(page => {
      if (page.exitTime === 0) {
        this.updatePageExit(sessionId, page.url);
      }
    });

    this.updateMetrics();
  }

  /**
   * Calculate click depth
   */
  private calculateClickDepth(session: UserSession, url: string): number {
    if (session.pages.length === 0) return 0;
    const previousPage = session.pages[session.pages.length - 1];
    return previousPage.clickDepth + 1;
  }

  /**
   * Update page metrics
   */
  private updatePageMetrics(url: string, pageVisit: PageVisit): void {
    if (!this.pageMetrics.has(url)) {
      this.pageMetrics.set(url, []);
    }
    this.pageMetrics.get(url)!.push(pageVisit);
  }

  /**
   * Update exit rate
   */
  private updateExitRate(url: string, session: UserSession): void {
    const currentRate = this.behaviorMetrics.exitRateByPage.get(url) || 0;
    const exitCount = session.pages.filter(p => p.url === url && p.exitTime > 0).length;
    const visitCount = session.pages.filter(p => p.url === url).length;
    
    if (visitCount > 0) {
      const newRate = (exitCount / visitCount) * 100;
      this.behaviorMetrics.exitRateByPage.set(url, newRate);
    }
  }

  /**
   * Update page interactions
   */
  private updatePageInteractions(sessionId: string, target: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const currentPage = session.pages[session.pages.length - 1];
    if (currentPage) {
      currentPage.interactions++;
    }
  }

  /**
   * Check for conversion
   */
  private checkForConversion(session: UserSession, event: UserEvent): void {
    const conversionEvents = ['tool_usage', 'download', 'share'];
    if (conversionEvents.includes(event.type)) {
      session.conversion = true;
      this.assignUserSegment(session.userId, session);
    }
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    const allSessions = Array.from(this.sessions.values());
    const completedSessions = allSessions.filter(s => s.endTime > 0);

    if (completedSessions.length === 0) return;

    // Average dwell time
    const totalDwellTime = completedSessions.reduce((sum, s) =>
      sum + s.pages.reduce((pageSum, p) => pageSum + p.dwellTime, 0), 0
    );
    this.behaviorMetrics.averageDwellTime = totalDwellTime / completedSessions.length;

    // Average click depth
    const totalClickDepth = completedSessions.reduce((sum, s) =>
      sum + s.pages.reduce((pageSum, p) => pageSum + p.clickDepth, 0), 0
    );
    const totalPages = completedSessions.reduce((sum, s) => sum + s.pages.length, 0);
    this.behaviorMetrics.averageClickDepth = totalPages > 0 ? totalClickDepth / totalPages : 0;

    // Bounce rate
    const bouncedSessions = completedSessions.filter(s => s.bounce).length;
    this.behaviorMetrics.bounceRate = (bouncedSessions / completedSessions.length) * 100;

    // Conversion rate
    const convertedSessions = completedSessions.filter(s => s.conversion).length;
    this.behaviorMetrics.conversionRate = (convertedSessions / completedSessions.length) * 100;

    // Pages per session
    const totalPagesVisited = completedSessions.reduce((sum, s) => sum + s.pages.length, 0);
    this.behaviorMetrics.pagesPerSession = totalPagesVisited / completedSessions.length;

    // Return visitor rate
    const uniqueUsers = new Set(allSessions.map(s => s.userId));
    const returningUsers = Array.from(uniqueUsers).filter(userId =>
      allSessions.filter(s => s.userId === userId).length > 1
    ).length;
    this.behaviorMetrics.returnVisitorRate = (returningUsers / uniqueUsers.size) * 100;

    // Average scroll depth
    const allScrollDepths = completedSessions.flatMap(s =>
      s.pages.map(p => p.scrollDepth)
    );
    this.behaviorMetrics.scrollDepthAverage = allScrollDepths.reduce((sum, d) => sum + d, 0) /
      allScrollDepths.length || 0;

    // Update popular content
    this.updatePopularContent(completedSessions);
  }

  /**
   * Update popular content
   */
  private updatePopularContent(sessions: UserSession[]): void {
    const urlStats = new Map<string, { visits: number; totalDwellTime: number }>();

    sessions.forEach(session => {
      session.pages.forEach(page => {
        const stats = urlStats.get(page.url) || { visits: 0, totalDwellTime: 0 };
        stats.visits++;
        stats.totalDwellTime += page.dwellTime;
        urlStats.set(page.url, stats);
      });
    });

    this.behaviorMetrics.popularContent = Array.from(urlStats.entries())
      .map(([url, stats]) => ({
        url,
        visits: stats.visits,
        avgDwellTime: stats.totalDwellTime / stats.visits,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }

  /**
   * Calculate content engagement score
   */
  calculateContentEngagement(url: string): ContentEngagementScore {
    const pageVisits = this.pageMetrics.get(url) || [];
    if (pageVisits.length === 0) {
      return { url, score: 0, factors: { dwellTime: 0, scrollDepth: 0, interactions: 0, returnVisits: 0, socialShares: 0 } };
    }

    const avgDwellTime = pageVisits.reduce((sum, p) => sum + p.dwellTime, 0) / pageVisits.length;
    const avgScrollDepth = pageVisits.reduce((sum, p) => sum + p.scrollDepth, 0) / pageVisits.length;
    const avgInteractions = pageVisits.reduce((sum, p) => sum + p.interactions, 0) / pageVisits.length;

    // Count return visits
    const uniqueUsers = new Set(pageVisits.map(() => 'user')); // Simplified
    const returnVisits = pageVisits.length - uniqueUsers.size;

    // Calculate score (0-100)
    const dwellTimeScore = Math.min(100, (avgDwellTime / 300000) * 30); // 5 minutes = max score
    const scrollDepthScore = (avgScrollDepth / 100) * 30;
    const interactionScore = Math.min(30, avgInteractions * 2);
    const returnVisitScore = Math.min(10, returnVisits * 0.1);

    const score = Math.round(dwellTimeScore + scrollDepthScore + interactionScore + returnVisitScore);

    return {
      url,
      score,
      factors: {
        dwellTime: Math.round(avgDwellTime),
        scrollDepth: Math.round(avgScrollDepth),
        interactions: Math.round(avgInteractions),
        returnVisits,
        socialShares: 0, // Would need social share tracking
      },
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    const metrics = this.behaviorMetrics;

    // Dwell time recommendation
    if (metrics.averageDwellTime < 60000) {
      recommendations.push({
        type: 'dwell',
        priority: 'high',
        description: 'Increase average time on page',
        metric: 'Average Dwell Time',
        currentValue: metrics.averageDwellTime,
        targetValue: 120000,
        suggestedActions: [
          'Add more engaging content sections',
          'Include interactive elements (calculators, quizzes)',
          'Improve content readability with better formatting',
          'Add related content suggestions',
        ],
        estimatedImpact: 25,
      });
    }

    // Click depth recommendation
    if (metrics.averageClickDepth < 2) {
      recommendations.push({
        type: 'click_depth',
        priority: 'high',
        description: 'Improve navigation to increase page views',
        metric: 'Average Click Depth',
        currentValue: metrics.averageClickDepth,
        targetValue: 3,
        suggestedActions: [
          'Add more internal links in content',
          'Improve related content recommendations',
          'Create topic clusters with clear navigation',
          'Add breadcrumb navigation',
        ],
        estimatedImpact: 20,
      });
    }

    // Bounce rate recommendation
    if (metrics.bounceRate > 50) {
      recommendations.push({
        type: 'bounce',
        priority: 'high',
        description: 'Reduce bounce rate',
        metric: 'Bounce Rate',
        currentValue: metrics.bounceRate,
        targetValue: 30,
        suggestedActions: [
          'Improve page load speed',
          'Enhance above-the-fold content',
          'Add clear calls-to-action',
          'Improve mobile experience',
        ],
        estimatedImpact: 30,
      });
    }

    // Conversion rate recommendation
    if (metrics.conversionRate < 5) {
      recommendations.push({
        type: 'conversion',
        priority: 'medium',
        description: 'Increase conversion rate',
        metric: 'Conversion Rate',
        currentValue: metrics.conversionRate,
        targetValue: 10,
        suggestedActions: [
          'Optimize tool call-to-action buttons',
          'Add trust signals (testimonials, badges)',
          'Reduce friction in user flow',
          'A/B test different layouts',
        ],
        estimatedImpact: 15,
      });
    }

    // Performance recommendation
    if (metrics.timeToFirstInteraction > 3000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        description: 'Improve page performance',
        metric: 'Time to First Interaction',
        currentValue: metrics.timeToFirstInteraction,
        targetValue: 1000,
        suggestedActions: [
          'Defer non-critical JavaScript',
          'Optimize images and assets',
          'Implement code splitting',
          'Use browser caching',
        ],
        estimatedImpact: 35,
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get user segment
   */
  getUserSegment(userId: string): string[] {
    const segments: string[] = [];
    for (const [segment, users] of this.userSegments.entries()) {
      if (users.includes(userId)) {
        segments.push(segment);
      }
    }
    return segments;
  }

  /**
   * Assign user to segment
   */
  private assignUserSegment(userId: string, session: UserSession): void {
    // New vs returning
    const userSessions = Array.from(this.sessions.values()).filter(s => s.userId === userId);
    if (userSessions.length === 1) {
      this.addToSegment('new_visitors', userId);
    } else {
      this.addToSegment('returning_visitors', userId);
    }

    // Device segment
    this.addToSegment(`${session.device.type}_users`, userId);

    // Engagement-based segments
    if (session.conversion) {
      this.addToSegment('converters', userId);
    }
    if (session.bounce) {
      this.addToSegment('bounced', userId);
    }

    const sessionCount = userSessions.length;
    const totalEvents = session.events.length;
    if (sessionCount > 5 && totalEvents > 20) {
      this.addToSegment('power_users', userId);
    }

    if (session.pages.length > 3 || totalEvents > 5) {
      this.addToSegment('high_engagement', userId);
    }
  }

  /**
   * Add user to segment
   */
  private addToSegment(segment: string, userId: string): void {
    if (!this.userSegments.has(segment)) {
      this.userSegments.set(segment, []);
    }
    const users = this.userSegments.get(segment)!;
    if (!users.includes(userId)) {
      users.push(userId);
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session
   */
  getSession(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get metrics
   */
  getMetrics(): BehaviorMetrics {
    this.updateMetrics();
    return { ...this.behaviorMetrics };
  }

  /**
   * Get page metrics
   */
  getPageMetrics(url: string): PageVisit[] {
    return this.pageMetrics.get(url) || [];
  }

  /**
   * Get user segments
   */
  getUserSegments(): Map<string, string[]> {
    return new Map(this.userSegments);
  }

  /**
   * Get content engagement scores
   */
  getContentEngagementScores(): ContentEngagementScore[] {
    const scores: ContentEngagementScore[] = [];
    for (const url of this.pageMetrics.keys()) {
      scores.push(this.calculateContentEngagement(url));
    }
    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): UserSession[] {
    return Array.from(this.sessions.values()).filter(s => s.endTime === 0);
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.sessions.size;
  }
}

export { UserBehaviorOptimizer };
export type { 
  UserSession, 
  PageVisit, 
  UserEvent, 
  DeviceInfo, 
  BehaviorMetrics, 
  OptimizationRecommendation,
  ContentEngagementScore 
};