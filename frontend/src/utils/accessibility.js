/**
 * Trap focus within a modal or dialog
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstFocusable?.focus();
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority); // 'polite' | 'assertive'
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Get contrast ratio between two colors
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color contrast meets WCAG standards
 */
export const meetsWCAGStandards = (foreground, background, level = 'AA', size = 'normal') => {
  const ratio = getContrastRatio(foreground, background);
  
  const requirements = {
    'AA': { normal: 4.5, large: 3 },
    'AAA': { normal: 7, large: 4.5 }
  };
  
  const required = requirements[level][size];
  return ratio >= required;
};

/**
 * Generate skip link for keyboard navigation
 */
export const createSkipLink = (targetId, text = 'Skip to main content') => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
  skipLink.textContent = text;
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return skipLink;
};

/**
 * Add keyboard shortcuts with accessibility
 */
export const addKeyboardShortcut = (key, callback, description) => {
  const handleKeyPress = (e) => {
    // Check for modifier keys
    const modifiers = {
      ctrl: e.ctrlKey || e.metaKey,
      shift: e.shiftKey,
      alt: e.altKey
    };
    
    if (e.key.toLowerCase() === key.toLowerCase() && !e.repeat) {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }
      
      e.preventDefault();
      callback(e);
      
      // Announce shortcut activation
      announceToScreenReader(`Activated: ${description}`);
    }
  };
  
  document.addEventListener('keydown', handleKeyPress);
  
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
};

/**
 * Check if element is visible in viewport
 */
export const isElementVisible = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scroll element into view with smooth animation
 */
export const scrollIntoView = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  };
  
  element.scrollIntoView({ ...defaultOptions, ...options });
};

/**
 * Create accessible loading state
 */
export const createLoadingAnnouncement = (isLoading, loadingText = 'Loading...', completeText = 'Content loaded') => {
  const message = isLoading ? loadingText : completeText;
  announceToScreenReader(message, 'polite');
};

/**
 * Validate form accessibility
 */
export const validateFormAccessibility = (formElement) => {
  const issues = [];
  
  // Check for labels
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = input.labels && input.labels.length > 0;
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push(`Input missing label: ${input.name || input.id}`);
    }
  });
  
  // Check for required fields
  const requiredInputs = formElement.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
    if (!input.getAttribute('aria-required')) {
      issues.push(`Required input missing aria-required: ${input.name || input.id}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
};
