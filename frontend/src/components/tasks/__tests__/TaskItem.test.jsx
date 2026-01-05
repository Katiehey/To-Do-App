import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockTask } from '../../../tests/testUtils';
import TaskItem from '../TaskItem';

// Standard mocks
window.scrollTo = vi.fn();
window.confirm = vi.fn(() => true);

describe('TaskItem Component', () => {
  const safeMockTask = {
    ...mockTask,
    _id: 'task-1',
    title: 'Complete Unit Tests',
    taskStatus: 'pending', // Alignment with your JSX
    tags: ['WORK', 'URGENT'],
    dueDate: '2026-01-14T00:00:00.000Z'
  };

  const defaultProps = {
    task: safeMockTask,
    onUpdateStatus: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onSelectTask: vi.fn(), // Fixed prop name
    isSelected: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. FIX: Test onSelectTask because that's what your checkbox calls
  it('calls onSelectTask when checkbox clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    
    expect(defaultProps.onSelectTask).toHaveBeenCalledWith('task-1');
  });

  // 2. SUCCESS: This passed previously, keeping the robust selector
  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskItem {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    const deleteBtn = buttons.find(btn => btn.innerHTML.includes('lucide-trash2'));
    
    await user.click(deleteBtn);
    
    // Wrapped in waitFor because your component has a 400ms timeout before calling onDelete
    await waitFor(() => {
      expect(defaultProps.onDelete).toHaveBeenCalledWith('task-1');
    }, { timeout: 2000 });
  });

  // 3. FIX: Check taskStatus specifically
  it('shows completed state with line-through', () => {
    const completedTask = { ...safeMockTask, taskStatus: 'completed' };
    renderWithProviders(<TaskItem {...defaultProps} task={completedTask} />);
    
    const heading = screen.getByRole('heading', { name: /Complete Unit Tests/i });
    expect(heading).toHaveClass('line-through');
  });

  // 4. SUCCESS: Already passing
  it('shows overdue styling (red text) for past dates', () => {
    const overdueTask = {
      ...safeMockTask,
      dueDate: '2019-12-31T00:00:00.000Z',
      taskStatus: 'pending'
    };
    renderWithProviders(<TaskItem {...defaultProps} task={overdueTask} />);
    
    const dateText = screen.getByText(/2019/i);
    const container = dateText.closest('span');
    expect(container).toHaveClass('text-red-600');
  });

  // 5. SUCCESS: Already passing
  it('expands to show description on chevron click', async () => {
    const user = userEvent.setup();
    const taskWithDesc = { ...safeMockTask, description: 'Detailed Info' };
    renderWithProviders(<TaskItem {...defaultProps} task={taskWithDesc} />);

    const expandBtn = screen.getByLabelText(/chevron-down/i);
    await user.click(expandBtn);

    const desc = await screen.findByText(/Detailed Info/i);
    expect(desc).toBeInTheDocument();
  });
});