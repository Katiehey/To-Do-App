import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import TasksPage from '../../../pages/Tasks';
import * as taskService from '../../../services/taskService';
import * as projectService from '../../../services/projectService';

vi.mock('../../../services/taskService');
vi.mock('../../../services/projectService');

describe('Task Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    taskService.getTasks.mockResolvedValue({
      success: true,
      data: []
    });
    
    projectService.getProjects.mockResolvedValue({
      success: true,
      data: []
    });
  });

  describe('Complete Task Creation Flow', () => {
    it('creates task and updates list', async () => {
      const user = userEvent.setup();
      
      const newTask = {
        _id: '1',
        title: 'New Task',
        completed: false,
        priority: 'high'
      };

      taskService.createTask.mockResolvedValue({
        success: true,
        data: newTask
      });

      renderWithProviders(<TasksPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Open add task modal
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      // Fill form
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Task');

      const prioritySelect = screen.getByLabelText(/priority/i);
      await user.selectOptions(prioritySelect, 'high');

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);

      // Verify task appears in list
      await waitFor(() => {
        expect(screen.getByText('New Task')).toBeInTheDocument();
      });

      // Verify high priority styling
      const taskCard = screen.getByText('New Task').closest('div');
      expect(taskCard).toHaveStyle({ borderLeftColor: expect.any(String) });
    });
  });

  describe('Task Completion Flow', () => {
    it('completes task and updates UI', async () => {
      const user = userEvent.setup();
      
      const task = {
        _id: '1',
        title: 'Complete Me',
        completed: false
      };

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: [task]
      });

      taskService.toggleTaskComplete.mockResolvedValue({
        success: true,
        data: { ...task, completed: true }
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Complete Me')).toBeInTheDocument();
      });

      // Click checkbox
      const checkbox = screen.getAllByRole('button')[0];
      await user.click(checkbox);

      // Verify completion
      await waitFor(() => {
        const title = screen.getByText('Complete Me');
        expect(title).toHaveClass('line-through');
      });
    });

    it('shows success animation on completion', async () => {
      const user = userEvent.setup();
      
      const task = {
        _id: '1',
        title: 'Task',
        completed: false
      };

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: [task]
      });

      taskService.toggleTaskComplete.mockResolvedValue({
        success: true,
        data: { ...task, completed: true }
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Task')).toBeInTheDocument();
      });

      const checkbox = screen.getAllByRole('button')[0];
      await user.click(checkbox);

      // Success animation should appear
      await waitFor(() => {
        expect(screen.getByTestId('success-animation')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Task Deletion Flow', () => {
    it('deletes task with confirmation', async () => {
      const user = userEvent.setup();
      
      const task = {
        _id: '1',
        title: 'Delete Me',
        completed: false
      };

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: [task]
      });

      taskService.deleteTask.mockResolvedValue({
        success: true
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Delete Me')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      // Task should be removed
      await waitFor(() => {
        expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
      });
    });
  });

  describe('Bulk Operations Flow', () => {
    it('selects and deletes multiple tasks', async () => {
      const user = userEvent.setup();
      
      const tasks = [
        { _id: '1', title: 'Task 1', completed: false },
        { _id: '2', title: 'Task 2', completed: false },
        { _id: '3', title: 'Task 3', completed: false }
      ];

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      taskService.bulkDelete.mockResolvedValue({
        success: true,
        deleted: 2
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      // Select multiple tasks
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Task 1
      await user.click(checkboxes[1]); // Task 2

      // Bulk delete should appear
      const bulkDeleteButton = screen.getByRole('button', { name: /delete.*2.*selected/i });
      expect(bulkDeleteButton).toBeInTheDocument();

      await user.click(bulkDeleteButton);

      // Confirm
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      // Tasks should be removed
      await waitFor(() => {
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
      });
    });

    it('moves multiple tasks to project', async () => {
      const user = userEvent.setup();
      
      const tasks = [
        { _id: '1', title: 'Task 1', project: null },
        { _id: '2', title: 'Task 2', project: null }
      ];

      const project = {
        _id: 'project-1',
        name: 'Work Project'
      };

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      projectService.getProjects.mockResolvedValue({
        success: true,
        data: [project]
      });

      taskService.bulkMove.mockResolvedValue({
        success: true,
        data: tasks.map(t => ({ ...t, project: 'project-1' }))
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      // Select tasks
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);

      // Open move menu
      const moveButton = screen.getByRole('button', { name: /move to project/i });
      await user.click(moveButton);

      // Select project
      const projectOption = screen.getByText('Work Project');
      await user.click(projectOption);

      // Verify tasks updated
      await waitFor(() => {
        expect(taskService.bulkMove).toHaveBeenCalledWith(
          ['1', '2'],
          'project-1'
        );
      });
    });
  });

  describe('Filter and Search Flow', () => {
    it('filters tasks by priority', async () => {
      const user = userEvent.setup();
      
      const tasks = [
        { _id: '1', title: 'High Task', priority: 'high' },
        { _id: '2', title: 'Low Task', priority: 'low' }
      ];

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('High Task')).toBeInTheDocument();
        expect(screen.getByText('Low Task')).toBeInTheDocument();
      });

      // Apply priority filter
      const priorityFilter = screen.getByLabelText(/priority/i);
      await user.selectOptions(priorityFilter, 'high');

      // Only high priority task should show
      await waitFor(() => {
        expect(screen.getByText('High Task')).toBeInTheDocument();
        expect(screen.queryByText('Low Task')).not.toBeInTheDocument();
      });
    });

    it('searches tasks by title', async () => {
      const user = userEvent.setup();
      
      const tasks = [
        { _id: '1', title: 'Buy groceries' },
        { _id: '2', title: 'Write code' }
      ];

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      });

      // Search
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'code');

      // Only matching task should show
      await waitFor(() => {
        expect(screen.getByText('Write code')).toBeInTheDocument();
        expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
      });
    });

    it('combines filters and search', async () => {
      const user = userEvent.setup();
      
      const tasks = [
        { _id: '1', title: 'High priority work', priority: 'high' },
        { _id: '2', title: 'High priority play', priority: 'high' },
        { _id: '3', title: 'Low priority work', priority: 'low' }
      ];

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/priority/i)).toHaveLength(3);
      });

      // Filter by priority
      const priorityFilter = screen.getByLabelText(/priority/i);
      await user.selectOptions(priorityFilter, 'high');

      // Search
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'work');

      // Only one task matches both
      await waitFor(() => {
        expect(screen.getByText('High priority work')).toBeInTheDocument();
        expect(screen.queryByText('High priority play')).not.toBeInTheDocument();
        expect(screen.queryByText('Low priority work')).not.toBeInTheDocument();
      });
    });
  });

  describe('Project Context Integration', () => {
    it('filters tasks by selected project', async () => {
      const user = userEvent.setup();
      
      const project = {
        _id: 'project-1',
        name: 'Work'
      };

      const tasks = [
        { _id: '1', title: 'Work Task', project: 'project-1' },
        { _id: '2', title: 'Personal Task', project: null }
      ];

      taskService.getTasks.mockResolvedValue({
        success: true,
        data: tasks
      });

      projectService.getProjects.mockResolvedValue({
        success: true,
        data: [project]
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Work Task')).toBeInTheDocument();
        expect(screen.getByText('Personal Task')).toBeInTheDocument();
      });

      // Select project from sidebar
      const projectLink = screen.getByText('Work');
      await user.click(projectLink);

      // Only work tasks should show
      await waitFor(() => {
        expect(screen.getByText('Work Task')).toBeInTheDocument();
        expect(screen.queryByText('Personal Task')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message when task creation fails', async () => {
      const user = userEvent.setup();
      
      taskService.createTask.mockResolvedValue({
        success: false,
        error: 'Network error'
      });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      await user.type(screen.getByLabelText(/title/i), 'New Task');
      await user.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('recovers from error on retry', async () => {
      const user = userEvent.setup();
      
      taskService.createTask
        .mockResolvedValueOnce({ success: false, error: 'Error' })
        .mockResolvedValueOnce({ success: true, data: { _id: '1', title: 'Task' } });

      renderWithProviders(<TasksPage />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // First attempt fails
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);
      await user.type(screen.getByLabelText(/title/i), 'Task');
      await user.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Retry succeeds
      await user.click(screen.getByRole('button', { name: /retry|create/i }));

      await waitFor(() => {
        expect(screen.getByText('Task')).toBeInTheDocument();
      });
    });
  });
});
