import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskItem from "../tasks/TaskItem";

describe('TaskItem', () => {
  it('renders with minimal props', () => {
    render(
      <TaskItem
        task={{ _id: '1', title: 'Test Task', taskStatus: 'pending' }}
        onUpdateStatus={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isSelected={false}
        onSelectTask={() => {}}
      />
    );
    // simple assertion
    expect(true).toBe(true);
  });
});
