/**
 * Performance Monitoring Script
 *
 * This script monitors Core Web Vitals and other performance metrics
 * for the website. It can be integrated with analytics platforms
 * to track performance over time.
 *
 * Features:
 * - Core Web Vitals monitoring (LCP, FID, CLS)
 * - Custom performance metrics
 * - Performance budget alerts
 * - Analytics integration ready
 *
 * @fileoverview Performance monitoring and analytics
 */

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
  // Core Web Vitals thresholds
  LCP_THRESHOLD: 2500, // 2.5 seconds
  FID_THRESHOLD: 100, // 100 milliseconds
  CLS_THRESHOLD: 0.1, // 0.1

  // Custom metrics thresholds
  TTFB_THRESHOLD: 200, // 200 milliseconds
  TTI_THRESHOLD: 3500, // 3.5 seconds

  // Analytics configuration
  ANALYTICS_ENABLED: false, // Set to true to enable analytics
  ANALYTICS_ENDPOINT: '/api/analytics', // Analytics endpoint
};

/**
 * Performance monitoring class
 */
class PerformanceMonitor {
  constructor(config = PERFORMANCE_CONFIG) {
    this.config = config;
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    this.setupCoreWebVitals();
    this.setupCustomMetrics();
    this.setupPerformanceObserver();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  setupCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.checkThreshold('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkThreshold('fid', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.checkThreshold('cls', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  /**
   * Setup custom performance metrics
   */
  setupCustomMetrics() {
    // Time to First Byte (TTFB)
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.checkThreshold('ttfb', this.metrics.ttfb);
      }
    });

    // Time to Interactive (TTI) - simplified calculation
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.tti = navigation.loadEventEnd - navigation.navigationStart;
        this.checkThreshold('tti', this.metrics.tti);
      }
    });

    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fcp = entry.startTime;
          this.checkThreshold('fcp', entry.startTime);
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    }
  }

  /**
   * Setup general performance observer
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Log long tasks
          if (entry.entryType === 'longtask') {
            console.warn('Long task detected:', entry.duration);
            this.trackEvent('long_task', { duration: entry.duration });
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  /**
   * Check if metric exceeds threshold
   */
  checkThreshold(metric, value) {
    const threshold = this.config[`${metric.toUpperCase()}_THRESHOLD`];
    if (threshold && value > threshold) {
      console.warn(
        `Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`
      );
      this.trackEvent('performance_threshold_exceeded', {
        metric,
        value,
        threshold,
      });
    }
  }

  /**
   * Track performance event
   */
  trackEvent(eventName, data) {
    if (this.config.ANALYTICS_ENABLED) {
      // Send to analytics endpoint
      fetch(this.config.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data,
          timestamp: Date.now(),
          url: window.location.href,
        }),
      }).catch((error) => {
        console.error('Analytics error:', error);
      });
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get performance score based on Core Web Vitals
   */
  getPerformanceScore() {
    const scores = {
      lcp: this.getScore('lcp', this.metrics.lcp, this.config.LCP_THRESHOLD),
      fid: this.getScore('fid', this.metrics.fid, this.config.FID_THRESHOLD),
      cls: this.getScore('cls', this.metrics.cls, this.config.CLS_THRESHOLD),
    };

    const overallScore =
      Object.values(scores).reduce((sum, score) => sum + score, 0) /
      Object.keys(scores).length;
    return {
      overall: Math.round(overallScore),
      breakdown: scores,
    };
  }

  /**
   * Calculate score for a metric (0-100)
   */
  getScore(metric, value, threshold) {
    if (!value) return 0;

    switch (metric) {
      case 'lcp':
        return value <= threshold
          ? 100
          : Math.max(0, 100 - ((value - threshold) / threshold) * 50);
      case 'fid':
        return value <= threshold
          ? 100
          : Math.max(0, 100 - ((value - threshold) / threshold) * 50);
      case 'cls':
        return value <= threshold
          ? 100
          : Math.max(0, 100 - ((value - threshold) / threshold) * 50);
      default:
        return value <= threshold ? 100 : 0;
    }
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  window.performanceMonitor = new PerformanceMonitor();

  // Expose metrics globally for debugging
  window.getPerformanceMetrics = () => window.performanceMonitor.getMetrics();
  window.getPerformanceScore = () =>
    window.performanceMonitor.getPerformanceScore();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}
