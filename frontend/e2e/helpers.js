/**
 * Test user credentials
 */
export const testUser = {
  name: 'E2E Test User',
  email: 'e2e-test@example.com',
  password: 'TestPassword123!'
};

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Login helper
 */
export async function login(page, email = testUser.email, password = testUser.password) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/tasks');
  await waitForPageLoad(page);
}

/**
 * Logout helper
 */
export async function logout(page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('text=Logout');
  await page.waitForURL('/login');
}

/**
 * Register new user
 */
export async function register(page, userData = testUser) {
  await page.goto('/register');
  await page.fill('input[name="name"]', userData.name);
  await page.fill('input[type="email"]', userData.email);
  await page.fill('input[type="password"]', userData.password);
  await page.fill('input[name="confirmPassword"]', userData.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect
  await page.waitForURL('/tasks');
  await waitForPageLoad(page);
}

/**
 * Create a task
 */
export async function createTask(page, taskData) {
  // Open add task modal
  await page.click('button:has-text("Add Task")');
  await page.waitForSelector('[role="dialog"]');
  
  // Fill form
  await page.fill('input[name="title"]', taskData.title);
  
  if (taskData.description) {
    await page.fill('textarea[name="description"]', taskData.description);
  }
  
  if (taskData.priority) {
    await page.selectOption('select[name="priority"]', taskData.priority);
  }
  
  if (taskData.dueDate) {
    await page.fill('input[type="date"]', taskData.dueDate);
  }
  
  if (taskData.tags && taskData.tags.length > 0) {
    const tagInput = page.locator('input[placeholder*="tag"]');
    for (const tag of taskData.tags) {
      await tagInput.fill(tag);
      await tagInput.press('Enter');
    }
  }
  
  // Submit
  await page.click('button:has-text("Create")');
  
  // Wait for modal to close
  await page.waitForSelector('[role="dialog"]', { state: 'detached' });
  
  // Wait for task to appear
  await page.waitForSelector(`text=${taskData.title}`);
}

/**
 * Complete a task
 */
export async function completeTask(page, taskTitle) {
  const taskRow = page.locator(`text=${taskTitle}`).locator('..');
  const checkbox = taskRow.locator('input[type="checkbox"]').first();
  await checkbox.check();
  
  // Wait for completion animation
  await page.waitForTimeout(500);
}

/**
 * Delete a task
 */
export async function deleteTask(page, taskTitle) {
  const taskRow = page.locator(`text=${taskTitle}`).locator('..');
  await taskRow.hover();
  await taskRow.locator('button[aria-label*="delete"]').click();
  
  // Confirm deletion
  await page.click('button:has-text("Confirm")');
  
  // Wait for task to disappear
  await page.waitForSelector(`text=${taskTitle}`, { state: 'detached' });
}

/**
 * Create a project
 */
export async function createProject(page, projectData) {
  await page.click('button:has-text("New Project")');
  await page.waitForSelector('[role="dialog"]');
  
  await page.fill('input[name="name"]', projectData.name);
  
  if (projectData.description) {
    await page.fill('textarea[name="description"]', projectData.description);
  }
  
  if (projectData.color) {
    await page.fill('input[type="color"]', projectData.color);
  }
  
  await page.click('button:has-text("Create")');
  await page.waitForSelector('[role="dialog"]', { state: 'detached' });
}

/**
 * Navigate to page
 */
export async function navigateTo(page, path) {
  await page.click(`a[href="${path}"]`);
  await page.waitForURL(path);
  await waitForPageLoad(page);
}

/**
 * Search for tasks
 */
export async function searchTasks(page, query) {
  await page.fill('input[placeholder*="Search"]', query);
  await page.waitForTimeout(300); // Wait for debounce
}

/**
 * Filter tasks by priority
 */
export async function filterByPriority(page, priority) {
  await page.selectOption('select[name="priority-filter"]', priority);
  await page.waitForTimeout(100);
}

/**
 * Filter tasks by status
 */
export async function filterByStatus(page, status) {
  await page.selectOption('select[name="status-filter"]', status);
  await page.waitForTimeout(100);
}

/**
 * Take a screenshot with name
 */
export async function takeScreenshot(page, name) {
  await page.screenshot({ 
    path: `e2e/screenshots/${name}.png`,
    fullPage: true 
  });
}

/**
 * Check if element is visible
 */
export async function isVisible(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return await page.isVisible(selector);
  } catch {
    return false;
  }
}

/**
 * Wait for notification
 */
export async function waitForNotification(page, message) {
  await page.waitForSelector(`text=${message}`, { timeout: 5000 });
}

/**
 * Toggle dark mode
 */
export async function toggleDarkMode(page) {
  await page.click('[data-testid="theme-toggle"]');
  await page.waitForTimeout(300); // Wait for transition
}

/**
 * Check if dark mode is active
 */
export async function isDarkMode(page) {
  const html = page.locator('html');
  const classes = await html.getAttribute('class');
  return classes?.includes('dark') || false;
}

/**
 * Bulk select tasks
 */
export async function selectTasks(page, taskTitles) {
  for (const title of taskTitles) {
    const taskRow = page.locator(`text=${title}`).locator('..');
    const checkbox = taskRow.locator('input[type="checkbox"][data-testid="select-task"]');
    await checkbox.check();
  }
}

/**
 * Clear all selections
 */
export async function clearSelections(page) {
  await page.click('button:has-text("Clear Selection")');
}

/**
 * Get task count
 */
export async function getTaskCount(page) {
  const tasks = await page.locator('[data-testid="task-item"]').count();
  return tasks;
}

/**
 * Get project count
 */
export async function getProjectCount(page) {
  const projects = await page.locator('[data-testid="project-card"]').count();
  return projects;
}

/**
 * Wait for loading to finish
 */
export async function waitForLoading(page) {
  await page.waitForSelector('[data-testid="loading"]', { state: 'detached' });
}

/**
 * Check for error message
 */
export async function hasError(page) {
  return await isVisible(page, '[role="alert"]');
}

/**
 * Get error message
 */
export async function getErrorMessage(page) {
  const error = page.locator('[role="alert"]');
  return await error.textContent();
}
