/**
 * Debounce function - delays execution until after wait time
 * Perfect for search inputs, resize handlers
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per wait time
 * Updated to ensure the latest arguments are always used.
 */
export const throttle = (func, wait = 100) => {
  let timeout = null;
  let latestArgs = null;

  const updater = () => {
    if (latestArgs) {
      func.apply(null, latestArgs);
      latestArgs = null;
      timeout = setTimeout(updater, wait);
    } else {
      timeout = null;
    }
  };

  return function(...args) {
    if (!timeout) {
      func.apply(null, args);
      timeout = setTimeout(updater, wait);
    } else {
      latestArgs = args;
    }
  };
};
/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (imageElement) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(imageElement);
  } else {
    // Fallback for browsers without Intersection Observer
    imageElement.src = imageElement.dataset.src;
  }
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preference
 */
export const getAnimationDuration = (defaultDuration = 300) => {
  return prefersReducedMotion() ? 0 : defaultDuration;
};

/**
 * Memoize expensive computations
 */
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Virtual scrolling helper - only render visible items
 */
export const getVisibleItems = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  
  return {
    visibleItems: items.slice(startIndex, endIndex + 1),
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight
  };
};

/**
 * Request idle callback wrapper with fallback
 */
export const requestIdleCallback = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for Safari
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 50
    });
  }, 1);
};

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback = (id) => {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }
  clearTimeout(id);
};

/**
 * Preload important resources
 */
export const preloadResource = (href, as = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Check if device is mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get network speed estimation
 */
export const getNetworkSpeed = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection.effectiveType, // 'slow-2g', '2g', '3g', '4g'
      downlink: connection.downlink, // Mbps
      rtt: connection.rtt, // Round trip time in ms
      saveData: connection.saveData // Data saver enabled
    };
  }
  return null;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Web Vitals logging (for monitoring)
 */
export const logWebVitals = (metric) => {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    console.log(metric);
    // Example: sendToAnalytics(metric);
  }
};

/**
 * Detect if user is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Wait for element to be visible
 */
export const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};
