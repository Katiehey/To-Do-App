import { test, expect } from '@playwright/test';
import { 
  login, 
  createTask, 
  completeTask, 
  deleteTask,
  searchTasks,
  filterByPriority,
  selectTasks,
  getTaskCount,
  waitForPageLoad
} from './helpers';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Creating Tasks', () => {
    test('should create a basic task', async ({ page }) => {
      const taskData = {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        priority: 'medium'
      };

      await createTask(page, taskData);

      // Verify task appears
      await expect(page.locator(`text=${taskData.title}`)).toBeVisible();
      
      // Verify priority badge
      await expect(page.locator(`text=${taskData.title}`).locator('..')).toContainText(/medium/i);
    });

    test('should create task with all fields', async ({ page }) => {
      const taskData = {
        title: 'Complete project proposal',
        description: 'Include budget and timeline',
        priority: 'high',
        dueDate: '2026-12-31',
        tags: ['work', 'important']
      };

      await createTask(page, taskData);

      // Verify all details
      const taskCard = page.locator(`text=${taskData.title}`).locator('..');
      
      await expect(taskCard).toContainText(taskData.title);
      await expect(taskCard).toContainText(/high/i);
      await expect(taskCard).toContainText('2026');
      await expect(taskCard).toContainText('work');
      await expect(taskCard).toContainText('important');
    });

    test('should validate required fields', async ({ page }) => {
      // Open modal
      await page.click('button:has-text("Add Task")');
      
      // Try to submit without title
      await page.click('button:has-text("Create")');
      
      // Should show validation error
      await expect(page.locator('text=/title.*required/i')).toBeVisible();
      
      // Modal should stay open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test('should add tags with Enter key', async ({ page }) => {
      await page.click('button:has-text("Add Task")');
      
      await page.fill('input[name="title"]', 'Tagged Task');
      
      // Add tags
      const tagInput = page.locator('input[placeholder*="tag"]');
      await tagInput.fill('urgent');
      await tagInput.press('Enter');
      
      await tagInput.fill('review');
      await tagInput.press('Enter');
      
      // Verify tags appear
      await expect(page.locator('text=urgent')).toBeVisible();
      await expect(page.locator('text=review')).toBeVisible();
      
      await page.click('button:has-text("Create")');
      
      // Verify tags on task card
      const taskCard = page.locator('text=Tagged Task').locator('..');
      await expect(taskCard).toContainText('urgent');
      await expect(taskCard).toContainText('review');
    });

    test('should create recurring task', async ({ page }) => {
      await page.click('button:has-text("Add Task")');
      
      await page.fill('input[name="title"]', 'Daily standup');
      
      // Enable recurring
      await page.check('input[name="recurring"]');
      
      // Set frequency
      await page.selectOption('select[name="frequency"]', 'daily');
      
      await page.click('button:has-text("Create")');
      
      // Verify recurring badge
      const taskCard = page.locator('text=Daily standup').locator('..');
      await expect(taskCard).toContainText(/daily|recurring/i);
    });
  });

  test.describe('Completing Tasks', () => {
    test('should complete a task', async ({ page }) => {
      // Create task first
      await createTask(page, { title: 'Task to complete' });
      
      // Complete it
      await completeTask(page, 'Task to complete');
      
      // Verify completion styling
      const taskTitle = page.locator('text=Task to complete');
      await expect(taskTitle).toHaveClass(/line-through/);
      
      // Verify checkbox is checked
      const taskCard = taskTitle.locator('..');
      const checkbox = taskCard.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeChecked();
    });

    test('should show success animation on completion', async ({ page }) => {
      await createTask(page, { title: 'Animated task' });
      
      // Complete task
      await completeTask(page, 'Animated task');
      
      // Success animation should appear briefly
      await expect(page.locator('[data-testid="success-animation"]')).toBeVisible({ timeout: 2000 });
    });

    test('should uncomplete a task', async ({ page }) => {
      await createTask(page, { title: 'Toggle task' });
      
      // Complete
      await completeTask(page, 'Toggle task');
      await expect(page.locator('text=Toggle task')).toHaveClass(/line-through/);
      
      // Uncomplete
      const taskCard = page.locator('text=Toggle task').locator('..');
      const checkbox = taskCard.locator('input[type="checkbox"]').first();
      await checkbox.uncheck();
      
      // Should not be strikethrough
      await expect(page.locator('text=Toggle task')).not.toHaveClass(/line-through/);
    });

    test('should filter completed tasks', async ({ page }) => {
      // Create and complete some tasks
      await createTask(page, { title: 'Completed 1' });
      await createTask(page, { title: 'Incomplete 1' });
      await completeTask(page, 'Completed 1');
      
      // Filter to show only completed
      await page.selectOption('select[name="status-filter"]', 'completed');
      
      // Should show only completed
      await expect(page.locator('text=Completed 1')).toBeVisible();
      await expect(page.locator('text=Incomplete 1')).not.toBeVisible();
    });
  });

  test.describe('Editing Tasks', () => {
    test('should edit task details', async ({ page }) => {
      await createTask(page, { title: 'Original title', priority: 'low' });
      
      // Click edit button
      const taskCard = page.locator('text=Original title').locator('..');
      await taskCard.hover();
      await taskCard.locator('button[aria-label*="edit"]').click();
      
      // Edit form should open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Change title and priority
      await page.fill('input[name="title"]', 'Updated title');
      await page.selectOption('select[name="priority"]', 'high');
      
      await page.click('button:has-text("Save")');
      
      // Verify changes
      await expect(page.locator('text=Updated title')).toBeVisible();
      await expect(page.locator('text=Original title')).not.toBeVisible();
      
      const updatedCard = page.locator('text=Updated title').locator('..');
      await expect(updatedCard).toContainText(/high/i);
    });

    test('should expand task to see details', async ({ page }) => {
      await createTask(page, {
        title: 'Expandable task',
        description: 'Hidden description'
      });
      
      // Description should not be visible initially
      await expect(page.locator('text=Hidden description')).not.toBeVisible();
      
      // Click expand button
      const taskCard = page.locator('text=Expandable task').locator('..');
      await taskCard.locator('button[aria-label*="expand"]').click();
      
      // Description should now be visible
      await expect(page.locator('text=Hidden description')).toBeVisible();
    });
  });

  test.describe('Deleting Tasks', () => {
    test('should delete task with confirmation', async ({ page }) => {
      await createTask(page, { title: 'Task to delete' });
      
      await deleteTask(page, 'Task to delete');
      
      // Task should be gone
      await expect(page.locator('text=Task to delete')).not.toBeVisible();
    });

    test('should cancel deletion', async ({ page }) => {
      await createTask(page, { title: 'Keep this task' });
      
      // Click delete
      const taskCard = page.locator('text=Keep this task').locator('..');
      await taskCard.hover();
      await taskCard.locator('button[aria-label*="delete"]').click();
      
      // Cancel confirmation
      await page.click('button:has-text("Cancel")');
      
      // Task should still exist
      await expect(page.locator('text=Keep this task')).toBeVisible();
    });
  });

  test.describe('Bulk Operations', () => {
    test('should select multiple tasks', async ({ page }) => {
      // Create multiple tasks
      await createTask(page, { title: 'Task 1' });
      await createTask(page, { title: 'Task 2' });
      await createTask(page, { title: 'Task 3' });
      
      // Select tasks
      await selectTasks(page, ['Task 1', 'Task 2']);
      
      // Bulk action bar should appear
      await expect(page.locator('text=/2.*selected/i')).toBeVisible();
    });

    test('should bulk delete tasks', async ({ page }) => {
      await createTask(page, { title: 'Bulk 1' });
      await createTask(page, { title: 'Bulk 2' });
      await createTask(page, { title: 'Keep' });
      
      await selectTasks(page, ['Bulk 1', 'Bulk 2']);
      
      // Click bulk delete
      await page.click('button:has-text(/delete.*2/i)');
      await page.click('button:has-text("Confirm")');
      
      // Selected tasks should be gone
      await expect(page.locator('text=Bulk 1')).not.toBeVisible();
      await expect(page.locator('text=Bulk 2')).not.toBeVisible();
      
      // Other task should remain
      await expect(page.locator('text=Keep')).toBeVisible();
    });

    test('should clear selection', async ({ page }) => {
      await createTask(page, { title: 'Select me' });
      
      await selectTasks(page, ['Select me']);
      await expect(page.locator('text=/1.*selected/i')).toBeVisible();
      
      // Clear selection
      await page.click('button:has-text("Clear")');
      
      // Selection bar should disappear
      await expect(page.locator('text=/selected/i')).not.toBeVisible();
    });
  });

  test.describe('Filtering and Searching', () => {
    test.beforeEach(async ({ page }) => {
      // Create diverse set of tasks
      await createTask(page, { title: 'High priority work', priority: 'high' });
      await createTask(page, { title: 'Medium priority work', priority: 'medium' });
      await createTask(page, { title: 'Low priority play', priority: 'low' });
    });

    test('should filter by priority', async ({ page }) => {
      await filterByPriority(page, 'high');
      
      await expect(page.locator('text=High priority work')).toBeVisible();
      await expect(page.locator('text=Medium priority work')).not.toBeVisible();
      await expect(page.locator('text=Low priority play')).not.toBeVisible();
    });

    test('should search tasks', async ({ page }) => {
      await searchTasks(page, 'work');
      
      await expect(page.locator('text=High priority work')).toBeVisible();
      await expect(page.locator('text=Medium priority work')).toBeVisible();
      await expect(page.locator('text=Low priority play')).not.toBeVisible();
    });

    test('should combine search and filter', async ({ page }) => {
      await filterByPriority(page, 'high');
      await searchTasks(page, 'work');
      
      // Only one task matches both
      await expect(page.locator('text=High priority work')).toBeVisible();
      await expect(page.locator('text=Medium priority work')).not.toBeVisible();
      await expect(page.locator('text=Low priority play')).not.toBeVisible();
    });

    test('should show no results message', async ({ page }) => {
      await searchTasks(page, 'nonexistent');
      
      await expect(page.locator('text=/no.*found|no results/i')).toBeVisible();
    });

    test('should clear filters', async ({ page }) => {
      await filterByPriority(page, 'high');
      
      // Only high priority visible
      const highCount = await getTaskCount(page);
      expect(highCount).toBe(1);
      
      // Clear filter
      await filterByPriority(page, 'all');
      
      // All tasks visible
      const allCount = await getTaskCount(page);
      expect(allCount).toBe(3);
    });
  });

  test.describe('Sorting', () => {
    test('should sort by priority', async ({ page }) => {
      await createTask(page, { title: 'Low task', priority: 'low' });
      await createTask(page, { title: 'High task', priority: 'high' });
      await createTask(page, { title: 'Medium task', priority: 'medium' });
      
      // Sort by priority
      await page.selectOption('select[name="sort"]', 'priority');
      
      // Get task order
      const tasks = await page.locator('[data-testid="task-item"]').allTextContents();
      
      // High should be first
      expect(tasks[0]).toContain('High task');
    });

    test('should sort by due date', async ({ page }) => {
      await createTask(page, { title: 'Far future', dueDate: '2026-12-31' });
      await createTask(page, { title: 'Near future', dueDate: '2026-06-01' });
      
      await page.selectOption('select[name="sort"]', 'dueDate');
      
      const tasks = await page.locator('[data-testid="task-item"]').allTextContents();
      
      // Near future should be first
      expect(tasks[0]).toContain('Near future');
    });
  });

  test.describe('Pagination', () => {
    test('should paginate tasks', async ({ page }) => {
      // Create many tasks
      for (let i = 1; i <= 25; i++) {
        await createTask(page, { title: `Task ${i}` });
      }
      
      // Should show pagination
      await expect(page.locator('text=/page.*of/i')).toBeVisible();
      
      // Should have next button
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();
      
      // Go to next page
      await page.click('button:has-text("Next")');
      
      // Should show different tasks
      await expect(page.locator('text=Task 21')).toBeVisible();
    });
  });
});
