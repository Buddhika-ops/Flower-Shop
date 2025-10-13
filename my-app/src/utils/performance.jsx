// 🚀 Advanced Caching and Performance Optimization System

// Service Worker Registration for Offline Support
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// 🎯 Browser Cache Management
export class BrowserCacheManager {
  constructor() {
    this.cacheName = 'flower-shop-cache-v1';
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Clear old caches
  async clearOldCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('flower-shop-cache-') && name !== this.cacheName
      );
      
      await Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  // Cache API responses
  async cacheResponse(url, response) {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      await cache.put(url, response.clone());
    }
  }

  // Get cached response
  async getCachedResponse(url) {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(url);
      
      if (response) {
        const cachedTime = response.headers.get('cached-time');
        if (cachedTime && Date.now() - parseInt(cachedTime) < this.maxAge) {
          return response;
        }
      }
    }
    return null;
  }

  // Clear all caches
  async clearAllCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }
}

// 🚀 Image Optimization Utilities
export class ImageOptimizer {
  constructor() {
    this.lazyLoadObserver = null;
    this.initLazyLoading();
  }

  // Initialize lazy loading
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              this.lazyLoadObserver.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
    }
  }

  // Optimize image URL
  optimizeImageUrl(url, width = 400, height = 400, quality = 80) {
    if (!url) return 'https://via.placeholder.com/400x400?text=No+Image';
    
    // If using a CDN service like Cloudinary, add optimization parameters
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},q_${quality},f_auto/`);
    }
    
    return url;
  }

  // Lazy load image
  lazyLoadImage(img) {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = img.dataset.src;
    }
  }

  // Preload critical images
  async preloadCriticalImages(urls) {
    const promises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.warn('Some critical images failed to preload:', error);
    }
  }
}

// 🎯 Database Query Optimization
export class QueryOptimizer {
  constructor() {
    this.queryCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Optimize Supabase query
  optimizeQuery(query, options = {}) {
    const {
      limit = 50,
      select = '*',
      orderBy = 'created_at',
      orderDirection = 'desc',
      cache = true
    } = options;

    let optimizedQuery = query;

    // Add select fields
    if (select !== '*') {
      optimizedQuery = optimizedQuery.select(select);
    }

    // Add ordering
    if (orderBy) {
      optimizedQuery = optimizedQuery.order(orderBy, { ascending: orderDirection === 'asc' });
    }

    // Add limit
    if (limit) {
      optimizedQuery = optimizedQuery.limit(limit);
    }

    return optimizedQuery;
  }

  // Cache query result
  cacheQueryResult(key, data) {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get cached query result
  getCachedQueryResult(key) {
    const cached = this.queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Clear expired cache
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.queryCache.delete(key);
      }
    }
  }
}

// 🚀 Performance Monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };
    this.initMonitoring();
  }

  // Initialize performance monitoring
  initMonitoring() {
    if ('performance' in window) {
      this.measurePageLoad();
      this.measureWebVitals();
    }
  }

  // Measure page load time
  measurePageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
    });
  }

  // Measure Web Vitals
  measureWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          this.metrics.cumulativeLayoutShift += entry.value;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  // Get performance metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Log performance metrics
  logMetrics() {
    console.group('🚀 Performance Metrics');
    console.log('Page Load Time:', this.metrics.pageLoadTime.toFixed(2), 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint.toFixed(2), 'ms');
    console.log('Largest Contentful Paint:', this.metrics.largestContentfulPaint.toFixed(2), 'ms');
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift.toFixed(4));
    console.log('First Input Delay:', this.metrics.firstInputDelay.toFixed(2), 'ms');
    console.groupEnd();
  }
}

// 🎯 Bundle Size Optimization
export class BundleOptimizer {
  constructor() {
    this.loadedChunks = new Set();
    this.preloadQueue = [];
  }

  // Preload critical chunks
  preloadChunk(chunkName) {
    if (this.loadedChunks.has(chunkName)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = `/assets/${chunkName}.js`;
    document.head.appendChild(link);
    
    this.loadedChunks.add(chunkName);
  }

  // Prefetch non-critical chunks
  prefetchChunk(chunkName) {
    if (this.loadedChunks.has(chunkName)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = `/assets/${chunkName}.js`;
    document.head.appendChild(link);
  }

  // Optimize imports
  optimizeImport(importFunc, fallback = null) {
    return React.lazy(() => 
      importFunc().catch(() => ({
        default: fallback || (() => React.createElement('div', null, 'Failed to load'))
      }))
    );
  }
}

// 🚀 Global Performance Instances
export const browserCacheManager = new BrowserCacheManager();
export const imageOptimizer = new ImageOptimizer();
export const queryOptimizer = new QueryOptimizer();
export const performanceMonitor = new PerformanceMonitor();
export const bundleOptimizer = new BundleOptimizer();

// 🎯 Utility Functions
export const optimizeForProduction = () => {
  // Clear old caches
  browserCacheManager.clearOldCaches();
  
  // Clear expired query cache
  queryOptimizer.clearExpiredCache();
  
  // Log performance metrics
  performanceMonitor.logMetrics();
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Register service worker
  registerServiceWorker();
  
  // Clear old caches on app start
  browserCacheManager.clearOldCaches();
  
  // Set up periodic cache cleanup
  setInterval(() => {
    queryOptimizer.clearExpiredCache();
  }, 5 * 60 * 1000); // Every 5 minutes
};
