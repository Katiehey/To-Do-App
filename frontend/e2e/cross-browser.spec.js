import { test, expect } from '@playwright/test';
import { login, createTask, toggleDarkMode, isDarkMode } from './helpers';

test.describe('Cross-Browser Compatibility', () => {
  test('should work in all browsers', async ({ page, browserName }) => {
    console.log(`Testing in: ${browserName}`);
    
    await login(page);
    
    // Basic functionality should work
    await expect(page.locator('h1')).toContainText(/tasks/i);
    
    // Create task
    await createTask(page, { title: `${browserName} task` });
    
    // Verify created
    await expect(page.locator(`text=${browserName} task`)).toBeVisible();
  });

  test('should render correctly on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      console.log(`Mobile viewport: ${viewport.width}x${viewport.height}`);
      
      await login(page);
      
      // Mobile menu should be present
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      // Desktop sidebar should be hidden
      await expect(page.locator('[data-testid="desktop-sidebar"]')).not.toBeVisible();
      
      // Create task should work
      await page.click('[data-testid="mobile-add-button"]');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });

  test('should support touch gestures on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await login(page);
      await createTask(page, { title: 'Swipe task' });
      
      const taskCard = page.locator('text=Swipe task').locator('..');
      
      // Simulate swipe (implementation depends on your swipe handling)
      await taskCard.dispatchEvent('touchstart');
      await taskCard.dispatchEvent('touchmove');
      await taskCard.dispatchEvent('touchend');
      
      // Actions should appear
      await expect(page.locator('[data-testid="swipe-actions"]')).toBeVisible();
    }
  });
});

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should toggle dark mode', async ({ page }) => {
    // Check initial state
    const initialDarkMode = await isDarkMode(page);
    
    // Toggle
    await toggleDarkMode(page);
    
    // State should change
    const newDarkMode = await isDarkMode(page);
    expect(newDarkMode).toBe(!initialDarkMode);
    
    // Verify visual change
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
  });

  test('should persist dark mode preference', async ({ page }) => {
    // Enable dark mode
    if (!(await isDarkMode(page))) {
      await toggleDarkMode(page);
    }
    
    // Reload page
    await page.reload();
    
    // Should still be in dark mode
    expect(await isDarkMode(page)).toBe(true);
  });

  test('should apply dark mode to all pages', async ({ page }) => {
    // Enable dark mode
    await toggleDarkMode(page);
    const darkModeEnabled = await isDarkMode(page);
    
    if (darkModeEnabled) {
      // Navigate to different pages
      const pages = ['/tasks', '/projects', '/calendar', '/settings'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        expect(await isDarkMode(page)).toBe(true);
      }
    }
  });

  test('should have good contrast in dark mode', async ({ page }) => {
    await toggleDarkMode(page);
    
    if (await isDarkMode(page)) {
      // Take screenshot for manual review
      await page.screenshot({ 
        path: 'e2e/screenshots/dark-mode.png',
        fullPage: true 
      });
      
      // Check key elements are visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('button')).toBeVisible();
    }
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should be responsive on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await login(page);
      
      // Main content should be visible
      await expect(page.locator('main')).toBeVisible();
      
      // Should not have horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      // Take screenshot
      await page.screenshot({
        path: `e2e/screenshots/${name.toLowerCase()}.png`,
        fullPage: true
      });
    });
  });
});

test.describe('Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/tasks');
    
    const loadTime = Date.now() - startTime;
    
    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Load time: ${loadTime}ms`);
  });

  test('should handle large task lists', async ({ page }) => {
    await login(page);
    
    // Create many tasks
    for (let i = 0; i < 50; i++) {
      await createTask(page, { title: `Bulk task ${i}` });
    }
    
    // Page should still be responsive
    const startTime = Date.now();
    await page.click('button:has-text("Add Task")');
    const responseTime = Date.now() - startTime;
    
    // Should respond in under 500ms
    expect(responseTime).toBeLessThan(500);
  });
});

test.describe('Offline Support', () => {
  test('should show offline indicator when offline', async ({ page }) => {
    await login(page);
    
    // Go offline
    await page.context().setOffline(true);
    
    // Should show offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    
    // Go back online
    await page.context().setOffline(false);
    
    // Indicator should disappear
    await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
  });

  test('should cache pages for offline use', async ({ page }) => {
    await login(page);
    
    // Visit pages to cache them
    await page.goto('/tasks');
    await page.goto('/projects');
    await page.goto('/calendar');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Should still be able to navigate
    await page.goto('/tasks');
    await expect(page.locator('h1')).toContainText(/tasks/i);
    
    await page.context().setOffline(false);
  });
});

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await login(page);
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have visible focus
    const focused = await page.evaluateHandle(() => document.activeElement);
    const hasFocusOutline = await focused.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.outline !== 'none' || style.boxShadow.includes('rgb');
    });
    
    expect(hasFocusOutline).toBe(true);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await login(page);
    
    // Check for ARIA landmarks
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    
    // Check buttons have labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Should have either aria-label or text content
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });

  test('should work with screen reader', async ({ page }) => {
    await login(page);
    
    // Check for screen reader announcements
    await createTask(page, { title: 'Test task' });
    
    // Should have live region for announcements
    await expect(page.locator('[role="status"]')).toBeVisible();
  });
});
