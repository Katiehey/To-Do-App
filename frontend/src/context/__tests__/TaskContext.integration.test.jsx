import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { TaskProvider, useTask } from '../TaskContext';
import { AuthContext } from '../AuthContext';
import * as taskServiceModule from '../../services/taskService';

// 1. Correct Mocking: We must return an object with a 'default' property
vi.mock('../../services/taskService', () => {
  const mockService = {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    reorderTasks: vi.fn(),
  };
  return {
    default: mockService,
    ...mockService // Also spread it for named import compatibility
  };
});

// Access the mocked service for setting expectations
const taskService = taskServiceModule.default;

describe('TaskContext Integration', () => {
  const mockAuthContext = {
    user: { _id: '123' },
    isAuthenticated: true,
    loading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <AuthContext.Provider value={mockAuthContext}>
      <TaskProvider>{children}</TaskProvider>
    </AuthContext.Provider>
  );

  describe('Fetching Tasks', () => {
    it('fetches tasks when fetchTasks is called', async () => {
      const mockTasks = [{ _id: '1', title: 'Task 1' }];
      
      taskService.getTasks.mockResolvedValue({
        data: { tasks: mockTasks },
        page: 1, pages: 1, total: 1, count: 1
      });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.tasks).toEqual(mockTasks);
    });

    it('handles fetch error gracefully', async () => {
      taskService.getTasks.mockRejectedValue({
        response: { data: { message: 'Failed to fetch tasks' } }
      });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(result.current.error).toBe('Failed to fetch tasks');
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('Creating Tasks', () => {
    it('adds new task to state', async () => {
      const newTask = { _id: '2', title: 'New Task' };
      
      taskService.createTask.mockResolvedValue({
        data: { task: newTask }
      });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => {
        await result.current.createTask({ title: 'New Task' });
      });

      expect(result.current.tasks).toContainEqual(newTask);
    });
  });

  describe('Bulk Operations', () => {
    it('selects multiple tasks', async () => {
      const mockTasks = [{ _id: '1' }, { _id: '2' }];
      taskService.getTasks.mockResolvedValue({
        data: { tasks: mockTasks }
      });

      const { result } = renderHook(() => useTask(), { wrapper });

      // We MUST fetch tasks first so the state has items to select
      await act(async () => {
        await result.current.fetchTasks();
      });

      act(() => {
        result.current.toggleSelectTask('1');
        result.current.toggleSelectTask('2');
      });

      expect(result.current.selectedTasks).toEqual(['1', '2']);
    });
  });

  describe('Updating Status', () => {
    it('updates status and triggers success animation', async () => {
      const initialTask = { _id: '1', title: 'Task 1', taskStatus: 'todo' };
      const updatedTask = { _id: '1', title: 'Task 1', taskStatus: 'completed' };

      taskService.getTasks.mockResolvedValue({ data: { tasks: [initialTask] } });
      taskService.updateTask.mockResolvedValue({ data: { task: updatedTask } });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => {
        await result.current.fetchTasks();
      });

      await act(async () => {
        await result.current.updateTaskStatus('1', 'completed');
      });

      expect(result.current.tasks[0].taskStatus).toBe('completed');
    });
  });
  
  describe('Bulk Operations', () => {
    it('successfully bulk deletes tasks', async () => {
      const initialTasks = [{ _id: '1' }, { _id: '2' }, { _id: '3' }];
      taskService.getTasks.mockResolvedValue({ data: { tasks: initialTasks } });
      taskService.deleteTask.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => { await result.current.fetchTasks(); });

      // Select two tasks
      act(() => {
        result.current.toggleSelectTask('1');
        result.current.toggleSelectTask('2');
      });

      await act(async () => {
        await result.current.bulkDeleteTasks(['1', '2']);
      });

      // State should only contain the unselected task
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]._id).toBe('3');
      expect(result.current.selectedTasks).toEqual([]);
    });

    it('successfully bulk updates tasks', async () => {
      const initialTasks = [{ _id: '1', priority: 'low' }, { _id: '2', priority: 'low' }];
      const updatedTasks = [{ _id: '1', priority: 'high' }, { _id: '2', priority: 'high' }];

      // Mock the initial fetch
      taskService.getTasks.mockResolvedValueOnce({ data: { tasks: initialTasks } });
      taskService.updateTask.mockResolvedValue({ success: true });
      // Mock the RE-FETCH that happens inside bulkUpdateTasks
      taskService.getTasks.mockResolvedValueOnce({ data: { tasks: updatedTasks } });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => { await result.current.fetchTasks(); });

      await act(async () => {
        await result.current.bulkUpdateTasks(['1', '2'], { priority: 'high' });
      });

      expect(result.current.tasks[0].priority).toBe('high');
      expect(taskService.getTasks).toHaveBeenCalledTimes(2);
    });

    it('clears selection when clearSelection is called', async () => {
        const { result } = renderHook(() => useTask(), { wrapper });
        act(() => {
          result.current.toggleSelectTask('1');
          result.current.toggleSelectTask('2');
        });
        expect(result.current.selectedTasks).toHaveLength(2);
        
        act(() => { result.current.clearSelection(); });
        expect(result.current.selectedTasks).toHaveLength(0);
    });
  });

  describe('Filtering and Pagination', () => {
    it('updates filters and calls fetchTasks', async () => {
      taskService.getTasks.mockResolvedValue({ data: { tasks: [] } });
      const { result } = renderHook(() => useTask(), { wrapper });

      act(() => {
        result.current.updateFilters({ priority: 'high', search: 'test' });
      });

      expect(result.current.filters.priority).toBe('high');
      expect(result.current.filters.search).toBe('test');
    });

    it('resets filters to default values', async () => {
      const { result } = renderHook(() => useTask(), { wrapper });
      
      act(() => {
        result.current.updateFilters({ priority: 'high' });
        result.current.clearFilters();
      });

      expect(result.current.filters.priority).toBeUndefined();
    });
  });

  describe('Task Status Updates', () => {
    it('handles nextTask correctly from server response', async () => {
      const currentTask = { _id: '1', taskStatus: 'todo' };
      const updatedTask = { _id: '1', taskStatus: 'completed' };
      const nextTask = { _id: 'new-99', title: 'Upcoming Task' };

      taskService.getTasks.mockResolvedValue({ data: { tasks: [currentTask] } });
      taskService.updateTask.mockResolvedValue({ 
        data: { task: updatedTask, nextTask: nextTask } 
      });

      const { result } = renderHook(() => useTask(), { wrapper });

      await act(async () => { await result.current.fetchTasks(); });

      await act(async () => {
        await result.current.updateTaskStatus('1', 'completed');
      });

      // Should have the updated task AND the new nextTask prepended
      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0]._id).toBe('new-99');
    });
  });

  describe('Reordering Tasks', () => {
    const initial = [{ _id: '1' }, { _id: '2' }, { _id: '3' }];

    it('updates local order immediately and persists after debounce', async () => {
      taskService.getTasks.mockResolvedValue({ data: { tasks: initial } });
      taskService.reorderTasks.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useTask(), { wrapper });
      await act(async () => { await result.current.fetchTasks(); });

      const reordered = [initial[2], initial[0], initial[1]]; // 3, 1, 2

      act(() => { result.current.reorderTasks(reordered); });

      // Local state changes right away — no waiting on the network.
      expect(result.current.tasks.map(t => t._id)).toEqual(['3', '1', '2']);
      expect(taskService.reorderTasks).not.toHaveBeenCalled();

      // Debounced save fires with the new id order and page-1 startIndex (0).
      await waitFor(() => {
        expect(taskService.reorderTasks).toHaveBeenCalledWith(['3', '1', '2'], 0);
      });
      expect(taskService.reorderTasks).toHaveBeenCalledTimes(1);
    });

    it('offsets startIndex by page for cross-page ordering', async () => {
      taskService.getTasks.mockResolvedValue({ data: { tasks: initial } });
      taskService.reorderTasks.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useTask(), { wrapper });
      await act(async () => { await result.current.fetchTasks(); });

      // Move to page 2 (default limit is 10) -> startIndex should be 10.
      act(() => { result.current.updateFilters({ page: 2 }); });

      act(() => { result.current.reorderTasks([initial[1], initial[0], initial[2]]); });

      await waitFor(() => {
        expect(taskService.reorderTasks).toHaveBeenCalledWith(['2', '1', '3'], 10);
      });
    });

    it('re-syncs from the server when the save fails', async () => {
      const serverTruth = [{ _id: '1' }, { _id: '2' }, { _id: '3' }];
      taskService.getTasks.mockResolvedValue({ data: { tasks: serverTruth } });
      taskService.reorderTasks.mockRejectedValue({
        response: { data: { message: 'Failed to save new order' } },
      });

      const { result } = renderHook(() => useTask(), { wrapper });
      await act(async () => { await result.current.fetchTasks(); });
      taskService.getTasks.mockClear();

      act(() => { result.current.reorderTasks([serverTruth[2], serverTruth[0], serverTruth[1]]); });

      // On failure it surfaces an error and refetches to reflect real order.
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to save new order');
      });
      expect(taskService.getTasks).toHaveBeenCalled();
    });
  });
});

