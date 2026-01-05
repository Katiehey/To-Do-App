import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  prefersReducedMotion,
  getAnimationDuration,
  memoize,
  isMobile,
  formatFileSize
} from '../performance';

describe('Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delays function execution', () => {
    const func = vi.fn();
    const debounced = debounce(func, 300);

    debounced();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('resets timer on subsequent calls', () => {
    const func = vi.fn();
    const debounced = debounce(func, 300);

    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to function', () => {
    const func = vi.fn();
    const debounced = debounce(func, 300);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(300);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('Throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('executes immediately on first call', () => {
    const func = vi.fn();
    const throttled = throttle(func, 300);

    throttled();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('limits execution rate', () => {
    const func = vi.fn();
    const throttled = throttle(func, 300);

    throttled();
    throttled();
    throttled();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    throttled();

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('passes latest arguments', () => {
    const func = vi.fn();
    const throttled = throttle(func, 300);

    throttled('first');
    throttled('second');
    throttled('third');

    expect(func).toHaveBeenCalledWith('first');

    vi.advanceTimersByTime(299);
    throttled('fourth');
    vi.advanceTimersByTime(1);

    expect(func).toHaveBeenCalledWith('fourth');
  });
});

describe('Prefers Reduced Motion', () => {
  it('detects reduced motion preference', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when no preference', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('Get Animation Duration', () => {
  it('returns 0 when reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    expect(getAnimationDuration(300)).toBe(0);
  });

  it('returns default duration when no preference', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    expect(getAnimationDuration(300)).toBe(300);
  });
});

describe('Memoize', () => {
  it('caches function results', () => {
    const expensiveFunc = vi.fn((a, b) => a + b);
    const memoized = memoize(expensiveFunc);

    const result1 = memoized(2, 3);
    const result2 = memoized(2, 3);

    expect(result1).toBe(5);
    expect(result2).toBe(5);
    expect(expensiveFunc).toHaveBeenCalledTimes(1);
  });

  it('recalculates for different arguments', () => {
    const expensiveFunc = vi.fn((a, b) => a + b);
    const memoized = memoize(expensiveFunc);

    memoized(2, 3);
    memoized(4, 5);

    expect(expensiveFunc).toHaveBeenCalledTimes(2);
  });

  it('handles complex arguments', () => {
    const func = vi.fn((obj) => obj.value * 2);
    const memoized = memoize(func);

    memoized({ value: 5 });
    memoized({ value: 5 });

    expect(func).toHaveBeenCalledTimes(1);
  });
});

describe('Is Mobile', () => {
  it('detects mobile devices', () => {
    const originalNavigator = window.navigator;
    
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'iPhone' },
      writable: true
    });

    expect(isMobile()).toBe(true);

    window.navigator = originalNavigator;
  });

  it('returns false for desktop', () => {
    const originalNavigator = window.navigator;
    
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      writable: true
    });

    expect(isMobile()).toBe(false);

    window.navigator = originalNavigator;
  });
});

describe('Format File Size', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(5242880)).toBe('5 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('handles decimal places', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(2621440)).toBe('2.5 MB');
  });
});
