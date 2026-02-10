import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, fireEvent, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import TasksPage from '../../../pages/Tasks';
import taskService from '../../../services/taskService';
import * as projectService from '../../../services/projectService';
import { NoTasksState } from '../../../components/common/EmptyState';
import BulkActionsBar from '../../../components/tasks/BulkActionsBar';
import AddTaskModal from '../../../components/tasks/AddTaskModal';

// Utility: wait until tasks are loaded
const waitForTasks = async () => {
  await screen.findByText('Integration Test Task'); // ensures mock task is rendered
};


// Mock Services
vi.mock('../../../services/taskService', () => ({
  default: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    bulkDeleteTasks: vi.fn(),
    bulkUpdateTasks: vi.fn(),
    toggleTask: vi.fn(),
  }
}));

vi.mock('../../../services/projectService', () => ({
  getProjects: vi.fn(),
  createProject: vi.fn(),
}));

describe('Task Workflow Integration - Complete Suite', () => {
  const TASK_ID = '123';
  const PROJECT_ID = 'proj_abc';

  const mockApiResponse = (data) => ({
    success: true,
    data: data,
    pagination: { total: 1, pages: 1, currentPage: 1 }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Default Success Mocks
    projectService.getProjects.mockResolvedValue({
  data: {
    projects: [{ _id: PROJECT_ID, name: 'Work Project', color: '#3B82F6' }]
  }
});

    taskService.getTasks.mockResolvedValue({
  data: {
    tasks: [{ _id: TASK_ID, title: 'Integration Test Task', taskStatus: 'todo', priority: 'medium' }]
  }
});


    taskService.createTask.mockResolvedValue(mockApiResponse({ _id: 'new_id', title: 'New Task' }));
    taskService.updateTask.mockResolvedValue({ success: true });
    taskService.deleteTask.mockResolvedValue({ success: true });
    taskService.bulkDeleteTasks.mockResolvedValue({ success: true });
    taskService.bulkUpdateTasks.mockResolvedValue({ success: true });
    taskService.toggleTask.mockResolvedValue({ success: true });

    console.log('Mocked tasks:', taskService.getTasks.mock.results);
    console.log('Mocked projects:', projectService.getProjects.mock.results);

  });

  afterEach(() => {
    cleanup();
  });

  // --- TEST 1: INITIAL LOAD ---
  it('renders tasks and projects correctly on load', async () => {
    renderWithProviders(<TasksPage />);
    expect(await screen.findByText('Integration Test Task')).toBeInTheDocument();
    expect(await screen.findByText(/Work Project/i)).toBeInTheDocument();
  });

  // --- TEST 2: CREATE ---
  it('successfully creates a new task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    screen.debug();

    const addBtn = await screen.findByRole('button', { name: /add task/i });
    await user.click(addBtn);

    const input = await screen.findByLabelText(/title/i);
    await user.type(input, 'New Automated Task');
    
    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Automated Task'
      }));
    });
  });

  // --- TEST 3: UPDATE (INLINE) ---
  it('updates task status/completion', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    const statusBtn = await screen.findByTestId(`task-status-${TASK_ID}`);
    await user.click(statusBtn);

    await waitFor(() => {
  expect(taskService.updateTask).toHaveBeenCalledWith(
    TASK_ID,
    expect.objectContaining({ taskStatus: expect.any(String) })
  );
});
  });

  // --- TEST 4: DELETE ---
  it('deletes a single task', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    screen.debug();

    const deleteBtn = await screen.findByTestId(`task-delete-${TASK_ID}`);
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(TASK_ID);
    });
  });

  // --- TEST 5: BULK MOVE ---
it('moves multiple tasks to a project via bulk actions', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TasksPage />);
  console.log('Mocked tasks:', taskService.getTasks.mock.results);
console.log('Mocked projects:', projectService.getProjects.mock.results);
screen.debug();


  // Ensure the task is loaded
  await waitForTasks();

  // Select the task using the exact aria-label
  const checkbox = await screen.findByLabelText(/Select task: Integration Test Task/i);
  await user.click(checkbox);
  await waitFor(() => expect(checkbox).toBeChecked());

  // Wait for BulkActionsBar to appear
  await waitFor(() => {
    expect(screen.getByTestId('bulk-actions-bar')).toBeInTheDocument();
  });

  // Now query the project select
  const projectSelect = screen.getByTestId('bulk-project-select');
  await act(async () => {
    fireEvent.change(projectSelect, { target: { value: PROJECT_ID } });
  });

  await waitFor(() => {
    expect(taskService.bulkUpdateTasks).toHaveBeenCalledWith(
      [TASK_ID],
      expect.objectContaining({ project: PROJECT_ID })
    );
  });
});

// --- TEST 6: BULK DELETE ---
it('deletes multiple tasks via bulk selection', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TasksPage />);
  console.log('Mocked tasks:', taskService.getTasks.mock.results);
console.log('Mocked projects:', projectService.getProjects.mock.results);
screen.debug();


  // Ensure the task is loaded
  await waitForTasks();

  // Select the task using the exact aria-label
  const checkbox = await screen.findByLabelText(/Select task: Integration Test Task/i);
  await user.click(checkbox);
  await waitFor(() => expect(checkbox).toBeChecked());

  // Wait for BulkActionsBar to appear
  await waitFor(() => {
    expect(screen.getByTestId('bulk-actions-bar')).toBeInTheDocument();
  });

  // Click the bulk delete button
  const bulkDeleteBtn = await screen.findByRole('button', { name: /delete/i });
  await user.click(bulkDeleteBtn);

  await waitFor(() => {
    expect(taskService.bulkDeleteTasks).toHaveBeenCalledWith([TASK_ID]);
  });
});

  // --- TEST 7: FILTERING ---
  it('filters tasks based on search input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    screen.debug();

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'Filter Query');

    await waitFor(() => {
      expect(taskService.getTasks).toHaveBeenCalledWith(expect.objectContaining({
        search: 'Filter Query'
      }));
    });
  });

  // --- TEST 8: ERROR RECOVERY ---
  it('displays error message on failed creation and allows retry', async () => {
    const user = userEvent.setup();
    taskService.createTask.mockRejectedValueOnce(new Error('Server Error'));
    
    renderWithProviders(<TasksPage />);
    
    await user.click(await screen.findByRole('button', { name: /add task/i }));
    await user.type(screen.getByLabelText(/title/i), 'Fail Task');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(taskService.createTask).toHaveBeenCalled());

    taskService.createTask.mockResolvedValue(mockApiResponse({ _id: 'retry_id', title: 'Fail Task' }));
    
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledTimes(2);
    });
  });

  // --- EXTRA INLINE ICON TESTS ---
  it('renders ListTodo icon in NoTasksState', () => {
    renderWithProviders(<NoTasksState onAddTask={() => {}} />);
    expect(screen.getByTestId('icon-listtodo')).toBeInTheDocument();
  });

  it('renders Trash2 icon in BulkActionsBar', () => {
    renderWithProviders(<BulkActionsBar selectedCount={1} totalCount={1} onDelete={() => {}} />);
    expect(screen.getByTestId('icon-trash2')).toBeInTheDocument();
  });

  it('renders Tag icon in AddTaskModal', () => {
    renderWithProviders(<AddTaskModal isOpen={true} onClose={() => {}} onSubmit={() => ({ success: true })} />);
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
  });
});
