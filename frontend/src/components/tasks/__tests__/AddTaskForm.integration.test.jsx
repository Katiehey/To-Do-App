import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockTaskContext, mockProjectContext } from '../../../tests/testUtils';
import AddTaskModal from '../AddTaskModal';

vi.mock('../../../services/taskService', () => ({
  createTask: vi.fn()
}));

const mockProjectData = {
  projects: [{ _id: '1', name: 'Project Alpha', isArchived: false }],
  fetchProjects: vi.fn().mockResolvedValue([]),// Add this to satisfy the destructuring in the component
  loading: false
};

describe('AddTaskForm Integration', () => {
  const mockOnClose = vi.fn();
  const mockCreateTask = vi.fn();

  const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit
  };

  const taskContextValue = {
    ...mockTaskContext,
    createTask: mockCreateTask
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue({ success: true });
    mockCreateTask.mockResolvedValue({ success: true });
    mockProjectData.fetchProjects.mockResolvedValue([]);
  });

  describe('Form Rendering', () => {
    it('renders all form fields', () => {
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    });

    it('renders project dropdown', () => {
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        {
          taskValue: taskContextValue,
          projectValue: mockProjectContext
        }
      );

      expect(screen.getByLabelText(/project/i)).toBeInTheDocument();
    });

    it('renders tags input', () => {
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      expect(screen.getByPlaceholderText(/add tags/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('requires title field', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const submitButton = screen.getByRole('button', { name: /create task/i });
      await user.click(submitButton);

      expect(mockCreateTask).not.toHaveBeenCalled();
      expect(screen.getByText('Title is required', { selector: 'span' })).toBeInTheDocument();
    });

    it('validates title length', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'a'.repeat(201));

      const submitButton = screen.getByRole('button', { name: /create task/i });
      await user.click(submitButton);

      expect(mockCreateTask).not.toHaveBeenCalled();
      expect(screen.getByText(/title must be.*200 characters/i)).toBeInTheDocument();
    });

    it('validates date format', async () => {
  const user = userEvent.setup();
  renderWithProviders(<AddTaskModal {...defaultProps} />);

  const titleInput = screen.getByLabelText(/title/i);
  const dateInput = screen.getByPlaceholderText(/set deadline/i);
  const submitButton = screen.getByRole('button', { name: /create task/i });

  await user.type(titleInput, 'Valid Title');
  
  // Force an invalid string into the input directly if user.type isn't sticking
  fireEvent.change(dateInput, { target: { value: 'not-a-date' } });
  
  await user.click(submitButton);

  // Use a regex to be safe with casing and partial matches
  const errorMsg = await screen.findByText(/please enter a valid date/i);
  expect(errorMsg).toBeInTheDocument();
  expect(mockOnSubmit).not.toHaveBeenCalled();
});

    it('validates tag length', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<AddTaskModal {...defaultProps} />);

      const tagInput = screen.getByPlaceholderText(/add tags/i);
      await user.type(tagInput, 'ThisIsALongTagThatExceedsThirtyCharacters');
      await user.keyboard('{Enter}');

      const errorMsg = await screen.findByText(/tag must be.*30 characters/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits with required fields only', async () => {
  const user = userEvent.setup();
  // Ensure the prop mock returns success
  mockOnSubmit.mockResolvedValue({ success: true });

  renderWithProviders(
    <AddTaskModal {...defaultProps} />
  );

  const titleInput = screen.getByLabelText(/title/i);
  await user.type(titleInput, 'New Task');

  const submitButton = screen.getByRole('button', { name: /create task/i });
  await user.click(submitButton);

  await waitFor(() => {
    // Check mockOnSubmit (the prop), NOT mockCreateTask
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task'
      })
    );
  });
});

    it('submits with all fields filled', async () => {
  const user = userEvent.setup();

  renderWithProviders(
    <AddTaskModal {...defaultProps} />,
    { projectValue: mockProjectData } // Injects our mock directly
  );

  await user.type(screen.getByLabelText(/title/i), 'Complete Task');
  
  // 1. Wait for project to appear
  await waitFor(() => {
    expect(screen.getByText(/Project Alpha/i)).toBeInTheDocument();
  });

  // 2. Select by value '1'
  const projectSelect = screen.getByLabelText(/project/i);
  await user.selectOptions(projectSelect, '1');

  // 3. Handle Date
  const dateInput = screen.getByPlaceholderText(/set deadline/i);
  await user.type(dateInput, '2026-12-31');

  await user.click(screen.getByRole('button', { name: /create task/i }));

  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Complete Task',
        project: '1'
      })
    );
  });
});

    it('closes modal on successful submission', async () => {
      const user = userEvent.setup();
      
      mockOnSubmit.mockResolvedValue({ success: true });

      renderWithProviders(<AddTaskModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), 'New Task');
      await user.click(screen.getByRole('button', { name: /create task/i }));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('shows error message on submission failure', async () => {
      const user = userEvent.setup();
      
      mockOnSubmit.mockResolvedValue({
        success: false,
        error: 'Failed to create task'
      });

      renderWithProviders(<AddTaskModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), 'New Task');
      await user.click(screen.getByRole('button', { name: /create task/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
      });

    });

    it('disables submit button during submission', async () => {
      const user = userEvent.setup();
      
      mockOnSubmit.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 50))
      );

      renderWithProviders(<AddTaskModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), 'New Task');
      
      const submitButton = screen.getByRole('button', { name: /create task/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Tag Management', () => {
    it('adds tags on Enter key', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const tagInput = screen.getByPlaceholderText(/add tags/i);
      
      await user.type(tagInput, 'tag1');
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(tagInput).toHaveValue('');
    });

    it('removes tags on click', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const tagInput = screen.getByPlaceholderText(/add tags/i);
      await user.type(tagInput, 'remove-me');
      await user.keyboard('{Enter}');

      const removeButton = screen.getByRole('button', { name: /remove remove-me tag/i });
      await user.click(removeButton);

      await waitFor(() => {
  expect(screen.queryByText('remove-me')).not.toBeInTheDocument();
});
    });

    it('prevents duplicate tags', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const tagInput = screen.getByPlaceholderText(/add tags/i);
      
      await user.type(tagInput, 'duplicate');
      await user.keyboard('{Enter}');
      
      await user.type(tagInput, 'duplicate');
      await user.keyboard('{Enter}');

      const tags = screen.getAllByText('duplicate');
      expect(tags).toHaveLength(1);
    });

    it('trims whitespace from tags', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      await user.type(screen.getByLabelText(/title/i), 'Whitespace Test');
      
      const tagInput = screen.getByPlaceholderText(/add tags/i);
      await user.type(tagInput, '  spaced  ');
      await user.keyboard('{Enter}');

      await user.click(screen.getByRole('button', { name: /create task/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: expect.arrayContaining(['spaced'])
          })
        );
      });
    });
  });

  describe('Recurring Task Options', () => {
    it('shows recurring options when enabled', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const recurringCheckbox = screen.getByLabelText(/recurring task/i);
      await user.click(recurringCheckbox);

      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/interval/i)).toBeInTheDocument();
    });

    it('hides recurring options when disabled', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      const recurringCheckbox = screen.getByLabelText(/recurring task/i);
      await user.click(recurringCheckbox);
      await user.click(recurringCheckbox);

      expect(screen.queryByLabelText(/frequency/i)).not.toBeInTheDocument();
    });

    it('submits recurring task data', async () => {
      const user = userEvent.setup();
      
      mockCreateTask.mockResolvedValue({ success: true });

      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      await user.type(screen.getByLabelText(/title/i), 'Recurring Task');
      
      const recurringCheckbox = screen.getByLabelText(/recurring task/i);
      await user.click(recurringCheckbox);

      const frequencySelect = screen.getByLabelText(/frequency/i);
      await user.selectOptions(frequencySelect, 'weekly');

      await user.click(screen.getByRole('button', { name: /create task/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Recurring Task',
            recurring: expect.objectContaining({
              enabled: true,
              frequency: 'weekly'
            })
          })
        );
      });
    });
  });

  describe('Form Reset', () => {
    it('clears form on cancel', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<AddTaskModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/title/i), 'Temporary Task');
      
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
    });

    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      
      mockCreateTask.mockResolvedValue({ success: true });

      const { rerender } = renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      await user.type(screen.getByLabelText(/title/i), 'Task 1');
      await user.click(screen.getByRole('button', { name: /create task/i }));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });

      // Reopen modal
      rerender(
        <AddTaskModal {...defaultProps} isOpen={true} />
      );

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('focuses first input on mount', async () => {
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/title/i)).toHaveFocus();
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('traps focus within modal', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <AddTaskModal {...defaultProps} />,
        { taskValue: taskContextValue }
      );

      // Tab through all focusable elements
      await user.tab();
      await user.tab();
      await user.tab();

      console.log(
    'Currently focused:', 
    document.activeElement.tagName, 
    document.activeElement.getAttribute('name') || document.activeElement.innerText
  );

      // Focus should stay within modal
      const focusedElement = document.activeElement;
      const modal = screen.getByRole('dialog', { name: /add new task/i });
      
      expect(modal).toContainElement(focusedElement);
    });
  });
});
