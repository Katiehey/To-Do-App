import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import TaskList from '../TaskList';

const tasks = [
  { _id: '1', title: 'First task', taskStatus: 'pending', tags: [] },
  { _id: '2', title: 'Second task', taskStatus: 'pending', tags: [] },
];

const baseProps = {
  tasks,
  loading: false,
  onUpdateStatus: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onSelectTask: vi.fn(),
  selectedTasks: [],
};

describe('TaskList drag-and-drop', () => {
  it('renders a reorder handle per task when reordering is enabled', () => {
    renderWithProviders(
      <TaskList {...baseProps} reorderEnabled onReorder={vi.fn()} />
    );

    const handles = screen.getAllByLabelText(/^reorder /i);
    expect(handles).toHaveLength(2);
    // Tasks still render alongside the handles.
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('renders no reorder handles when reordering is disabled', () => {
    renderWithProviders(
      <TaskList {...baseProps} reorderEnabled={false} />
    );

    expect(screen.queryByLabelText(/^reorder /i)).not.toBeInTheDocument();
    expect(screen.getByText('First task')).toBeInTheDocument();
  });

  it('opens the handle menu and moves a task to top / bottom', async () => {
    const user = userEvent.setup();
    const onMoveToTop = vi.fn();
    const onMoveToBottom = vi.fn();

    renderWithProviders(
      <TaskList
        {...baseProps}
        reorderEnabled
        onReorder={vi.fn()}
        onMoveToTop={onMoveToTop}
        onMoveToBottom={onMoveToBottom}
      />
    );

    // The menu is closed until the handle is clicked.
    expect(screen.queryByRole('menuitem', { name: /move to top/i })).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Reorder First task'));
    await user.click(screen.getByRole('menuitem', { name: /move to top/i }));
    expect(onMoveToTop).toHaveBeenCalledWith(tasks[0]);

    // Open the second row's menu and move it to the bottom.
    await user.click(screen.getByLabelText('Reorder Second task'));
    await user.click(screen.getByRole('menuitem', { name: /move to bottom/i }));
    expect(onMoveToBottom).toHaveBeenCalledWith(tasks[1]);
  });
});
