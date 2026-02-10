import { test, expect } from '@playwright/test';
import { testUser, login, register, logout, waitForPageLoad } from './helpers';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    expect(await page.title()).toContain('TaskMaster Pro');
    await expect(page.locator('h1')).toContainText(/login|sign in/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to tasks page
    await page.waitForURL('/tasks');
    await expect(page.locator('h1')).toContainText(/tasks|my tasks/i);
    
    // Should show user name
    await expect(page.locator('[data-testid="user-menu"]')).toContainText(testUser.name);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page.locator('[role="alert"]')).toContainText(/invalid|incorrect|failed/i);
    
    // Should stay on login page
    expect(page.url()).toContain('/login');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should require password', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', testUser.email);
    // Leave password empty
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=/password.*required/i')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]');
    
    await passwordInput.fill('secret123');
    
    // Initially hidden
    expect(await passwordInput.getAttribute('type')).toBe('password');
    
    // Click toggle
    await toggleButton.click();
    
    // Now visible
    expect(await passwordInput.getAttribute('type')).toBe('text');
    
    // Click again to hide
    await toggleButton.click();
    expect(await passwordInput.getAttribute('type')).toBe('password');
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('should display registration page', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('h1')).toContainText(/register|sign up|create account/i);
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    const newUser = {
      name: 'New Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'NewPassword123!'
    };
    
    await page.goto('/register');
    
    await page.fill('input[name="name"]', newUser.name);
    await page.fill('input[type="email"]', newUser.email);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="confirmPassword"]', newUser.password);
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL('/tasks');
    await expect(page.locator('[data-testid="user-menu"]')).toContainText(newUser.name);
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    
    // Should show password requirements
    await expect(page.locator('text=/password must/i')).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Should show mismatch error
    await expect(page.locator('text=/passwords.*match/i')).toBeVisible();
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', testUser.email); // Existing email
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('[role="alert"]')).toContainText(/email.*exists|already registered/i);
  });

  test('should navigate to login from registration', async ({ page }) => {
    await page.goto('/register');
    
    await page.click('text=/already have.*account|sign in/i');
    
    await page.waitForURL('/login');
    await expect(page.locator('h1')).toContainText(/login|sign in/i);
  });
});

test.describe('Logout Flow', () => {
  test('should logout successfully', async ({ page }) => {
    await login(page);
    
    // Click user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click logout
    await page.click('text=Logout');
    
    // Should redirect to login
    await page.waitForURL('/login');
    await expect(page.locator('h1')).toContainText(/login/i);
    
    // Should clear local storage
    const storage = await page.evaluate(() => localStorage.getItem('user'));
    expect(storage).toBeNull();
  });

  test('should not access protected routes after logout', async ({ page }) => {
    await login(page);
    await logout(page);
    
    // Try to access tasks page
    await page.goto('/tasks');
    
    // Should redirect to login
    await page.waitForURL('/login');
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/tasks');
    
    // Should redirect to login
    await page.waitForURL('/login');
    await expect(page.locator('h1')).toContainText(/login/i);
  });

  test('should redirect to login for all protected routes', async ({ page }) => {
    const protectedRoutes = ['/tasks', '/projects', '/calendar', '/settings'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForURL('/login');
      expect(page.url()).toContain('/login');
    }
  });

  test('should preserve redirect URL after login', async ({ page }) => {
    // Try to access tasks page while not logged in
    await page.goto('/tasks');
    await page.waitForURL('/login');
    
    // Login
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should redirect back to tasks
    await page.waitForURL('/tasks');
  });
});

test.describe('Session Persistence', () => {
  test('should persist session across page reloads', async ({ page }) => {
    await login(page);
    
    // Reload page
    await page.reload();
    await waitForPageLoad(page);
    
    // Should still be logged in
    expect(page.url()).toContain('/tasks');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should persist session in new tab', async ({ context, page }) => {
    await login(page);
    
    // Open new tab
    const newPage = await context.newPage();
    await newPage.goto('/tasks');
    
    // Should be logged in automatically
    await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible();
    
    await newPage.close();
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);
    
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should show network error
    await expect(page.locator('[role="alert"]')).toContainText(/network|connection|offline/i);
    
    // Restore connection
    await page.context().setOffline(false);
  });

  test('should handle server errors', async ({ page }) => {
    // This would need API mocking in a real scenario
    await page.goto('/login');
    
    // Fill with valid data
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Intercept and fail the request
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
