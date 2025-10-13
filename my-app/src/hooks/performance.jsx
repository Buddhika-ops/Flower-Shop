import React, { useState, useEffect, useRef, useCallback } from 'react';

// 🚀 Performance Optimization Hooks

// Debounce hook for search and input optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll and resize events
export const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay - (Date.now() - lastExecuted.current));

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return [ref, isIntersecting, hasIntersected];
};

// Local storage hook with performance optimization
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Session storage hook
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Media query hook for responsive design
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

// Previous value hook
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Click outside hook
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// 🚀 Performance Utilities

// Memoized selector for Redux-like state selection
export const createSelector = (selectors, resultFunc) => {
  let lastResult;
  let lastDeps;

  return (state) => {
    const deps = selectors.map(selector => selector(state));
    
    if (lastDeps && deps.every((dep, index) => dep === lastDeps[index])) {
      return lastResult;
    }
    
    lastDeps = deps;
    lastResult = resultFunc(...deps);
    return lastResult;
  };
};

// Image preloader utility
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (srcs) => {
  try {
    await Promise.all(srcs.map(src => preloadImage(src)));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// 🎯 Cache Management Utilities

// Simple in-memory cache
class MemoryCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Cache hook
export const useCache = (key, fetcher, dependencies = []) => {
  const [data, setData] = useState(() => memoryCache.get(key));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) return;

    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        
        if (!cancelled) {
          memoryCache.set(key, result);
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
};

// 🚀 Bundle Size Optimization

// Dynamic import with error handling
export const dynamicImport = async (importFunc) => {
  try {
    const module = await importFunc();
    return module.default || module;
  } catch (error) {
    console.error('Dynamic import failed:', error);
    throw error;
  }
};

// Code splitting utility
export const createAsyncComponent = (importFunc, fallback = null) => {
  return React.lazy(() => 
    importFunc().catch(() => ({
      default: () => fallback || React.createElement('div', null, 'Failed to load component')
    }))
  );
};
