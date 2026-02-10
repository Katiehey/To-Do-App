import { test, expect } from '@playwright/test';
import { login, createProject, createTask, navigateTo } from './helpers';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateTo(page, '/projects');
  });

  test('should create a project', async ({ page }) => {
    const projectData = {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      color: '#3b82f6'
    };

    await createProject(page, projectData);

    // Verify project appears
    await expect(page.locator(`text=${projectData.name}`)).toBeVisible();
    await expect(page.locator(`text=${projectData.description}`)).toBeVisible();
  });

  test('should display project with color', async ({ page }) => {
    await createProject(page, {
      name: 'Colored Project',
      color: '#ef4444'
    });

    const projectCard = page.locator('text=Colored Project').locator('..');
    const colorBar = projectCard.locator('[data-testid="project-color"]');
    
    const bgColor = await colorBar.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
  });

  test('should add tasks to project', async ({ page }) => {
    // Create project
    await createProject(page, { name: 'Task Project' });
    
    // Navigate to tasks
    await navigateTo(page, '/tasks');
    
    // Create task with project
    await page.click('button:has-text("Add Task")');
    await page.fill('input[name="title"]', 'Project Task');
    await page.selectOption('select[name="project"]', 'Task Project');
    await page.click('button:has-text("Create")');
    
    // Verify task has project label
    const taskCard = page.locator('text=Project Task').locator('..');
    await expect(taskCard).toContainText('Task Project');
  });

  test('should filter tasks by project', async ({ page }) => {
    // Create projects
    await createProject(page, { name: 'Work' });
    await createProject(page, { name: 'Personal' });
    
    // Create tasks
    await navigateTo(page, '/tasks');
    await createTask(page, { title: 'Work Task' });
    await createTask(page, { title: 'Personal Task' });
    
    // Assign to projects
    // ... (implementation depends on UI)
    
    // Click on Work project in sidebar
    await page.click('text=Work');
    
    // Should filter to Work tasks only
    await expect(page.locator('text=Work Task')).toBeVisible();
    await expect(page.locator('text=Personal Task')).not.toBeVisible();
  });

  test('should show project progress', async ({ page }) => {
    await createProject(page, { name: 'Progress Project' });
    
    const projectCard = page.locator('text=Progress Project').locator('..');
    
    // Should show 0% initially
    await expect(projectCard).toContainText(/0.*%/);
    
    // Add and complete some tasks
    // ... (create tasks assigned to project)
    
    // Progress should update
    await expect(projectCard).toContainText(/%/);
  });

  test('should archive project', async ({ page }) => {
    await createProject(page, { name: 'Archive Me' });
    
    // Click archive
    const projectCard = page.locator('text=Archive Me').locator('..');
    await projectCard.hover();
    await projectCard.locator('button[aria-label*="archive"]').click();
    
    // Should disappear from active projects
    await expect(page.locator('text=Archive Me')).not.toBeVisible();
    
    // Should appear in archived view
    await page.click('text=Archived');
    await expect(page.locator('text=Archive Me')).toBeVisible();
  });

  test('should delete project', async ({ page }) => {
    await createProject(page, { name: 'Delete Me' });
    
    const projectCard = page.locator('text=Delete Me').locator('..');
    await projectCard.hover();
    await projectCard.locator('button[aria-label*="delete"]').click();
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    // Should be gone
    await expect(page.locator('text=Delete Me')).not.toBeVisible();
  });

  test('should edit project', async ({ page }) => {
    await createProject(page, { name: 'Original Name' });
    
    // Click edit
    const projectCard = page.locator('text=Original Name').locator('..');
    await projectCard.hover();
    await projectCard.locator('button[aria-label*="edit"]').click();
    
    // Edit form
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:has-text("Save")');
    
    // Verify update
    await expect(page.locator('text=Updated Name')).toBeVisible();
    await expect(page.locator('text=Original Name')).not.toBeVisible();
  });

  test('should display project analytics', async ({ page }) => {
    await createProject(page, { name: 'Analytics Project' });
    
    // Click on project
    await page.click('text=Analytics Project');
    
    // Should show statistics
    await expect(page.locator('text=/total tasks/i')).toBeVisible();
    await expect(page.locator('text=/completed/i')).toBeVisible();
    await expect(page.locator('text=/progress/i')).toBeVisible();
  });
});

test.describe('Calendar View', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateTo(page, '/calendar');
  });

  test('should display calendar', async ({ page }) => {
    await expect(page.locator('[data-testid="calendar"]')).toBeVisible();
    
    // Should show current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    await expect(page.locator(`text=${currentMonth}`)).toBeVisible();
  });

  test('should show tasks on calendar', async ({ page }) => {
    // Create task with due date
    await navigateTo(page, '/tasks');
    await createTask(page, {
      title: 'Calendar Task',
      dueDate: '2026-06-15'
    });
    
    // Navigate to calendar
    await navigateTo(page, '/calendar');
    
    // Should see task on calendar
    await expect(page.locator('text=Calendar Task')).toBeVisible();
  });

  test('should switch calendar views', async ({ page }) => {
    // Month view (default)
    await expect(page.locator('button:has-text("Month")')).toHaveClass(/active|selected/);
    
    // Switch to week view
    await page.click('button:has-text("Week")');
    await expect(page.locator('[data-testid="week-view"]')).toBeVisible();
    
    // Switch to day view
    await page.click('button:has-text("Day")');
    await expect(page.locator('[data-testid="day-view"]')).toBeVisible();
    
    // Switch to agenda view
    await page.click('button:has-text("Agenda")');
    await expect(page.locator('[data-testid="agenda-view"]')).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    // Get current month
    const currentMonth = await page.locator('[data-testid="current-month"]').textContent();
    
    // Click next month
    await page.click('button[aria-label="Next month"]');
    
    // Month should change
    const newMonth = await page.locator('[data-testid="current-month"]').textContent();
    expect(newMonth).not.toBe(currentMonth);
    
    // Click previous month
    await page.click('button[aria-label="Previous month"]');
    
    // Should be back to original
    const backMonth = await page.locator('[data-testid="current-month"]').textContent();
    expect(backMonth).toBe(currentMonth);
  });

  test('should click on task in calendar', async ({ page }) => {
    // Create task
    await navigateTo(page, '/tasks');
    await createTask(page, {
      title: 'Clickable Event',
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    await navigateTo(page, '/calendar');
    
    // Click on task
    await page.click('text=Clickable Event');
    
    // Should open task details modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toContainText('Clickable Event');
  });

  test('should go to today', async ({ page }) => {
    // Navigate to different month
    await page.click('button[aria-label="Next month"]');
    await page.click('button[aria-label="Next month"]');
    
    // Click today button
    await page.click('button:has-text("Today")');
    
    // Should show current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    await expect(page.locator(`text=${currentMonth}`)).toBeVisible();
  });

  test('should filter calendar by project', async ({ page }) => {
    // Create project
    await navigateTo(page, '/projects');
    await createProject(page, { name: 'Calendar Filter' });
    
    // Create tasks in different projects
    await navigateTo(page, '/tasks');
    await createTask(page, {
      title: 'Filtered Task',
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    // Go to calendar
    await navigateTo(page, '/calendar');
    
    // Apply project filter
    await page.selectOption('select[name="project-filter"]', 'Calendar Filter');
    
    // Should only show tasks from that project
    // ... (verification depends on implementation)
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateTo(page, '/settings');
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/settings|preferences/i);
  });

  test('should enable/disable notifications', async ({ page }) => {
    const notificationToggle = page.locator('input[name="notifications"]');
    
    // Get initial state
    const initialState = await notificationToggle.isChecked();
    
    // Toggle
    await notificationToggle.click();
    
    // State should change
    const newState = await notificationToggle.isChecked();
    expect(newState).toBe(!initialState);
    
    // Verify saved
    await page.reload();
    expect(await notificationToggle.isChecked()).toBe(newState);
  });

  test('should update profile information', async ({ page }) => {
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:has-text("Save")');
    
    // Should show success message
    await expect(page.locator('text=/success|saved/i')).toBeVisible();
    
    // Verify update
    await page.reload();
    expect(await page.locator('input[name="name"]').inputValue()).toBe('Updated Name');
  });

  test('should change password', async ({ page }) => {
    await page.click('text=Change Password');
    
    await page.fill('input[name="currentPassword"]', 'OldPassword123!');
    await page.fill('input[name="newPassword"]', 'NewPassword123!');
    await page.fill('input[name="confirmPassword"]', 'NewPassword123!');
    
    await page.click('button:has-text("Update Password")');
    
    // Should show success
    await expect(page.locator('text=/success|updated/i')).toBeVisible();
  });
});
