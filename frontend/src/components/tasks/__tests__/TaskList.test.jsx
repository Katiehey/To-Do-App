import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
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
  it('renders a drag handle per task when reordering is enabled', () => {
    renderWithProviders(
      <TaskList {...baseProps} reorderEnabled onReorder={vi.fn()} />
    );

    const handles = screen.getAllByLabelText(/drag to reorder/i);
    expect(handles).toHaveLength(2);
    // Tasks still render alongside the handles.
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  it('renders no drag handles when reordering is disabled', () => {
    renderWithProviders(
      <TaskList {...baseProps} reorderEnabled={false} />
    );

    expect(screen.queryByLabelText(/drag to reorder/i)).not.toBeInTheDocument();
    expect(screen.getByText('First task')).toBeInTheDocument();
  });
});
