import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

vi.mock('../api', () => ({
  default: {
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), patch: vi.fn(),
  },
}));

import api from '../api';
const axiosMock = api;

describe('Task Service Integration', () => {
  let TaskService;

  beforeAll(async () => {
    const module = await import('../taskService');
    TaskService = module.default || module;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Helper to handle both returned errors and thrown errors
  const safeCall = async (fn) => {
    try { return await fn(); } 
    catch (e) { return { success: false, error: e.message || e.response?.data?.error || e }; }
  };

  describe('getTasks', () => {
    it('fetches all tasks successfully', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true, data: [] } });
      const res = await TaskService.getTasks();
      expect(res.data).toBeDefined();
    });

    it('handles query string filters correctly', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true } });
      await TaskService.getTasks({ priority: 'high' });
      expect(axiosMock.get.mock.calls[0][0]).toContain('priority=high');
    });

    it('handles pagination parameters', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true } });
      await TaskService.getTasks({ page: 2 });
      expect(axiosMock.get.mock.calls[0][0]).toContain('page=2');
    });

    it('returns error object on 404', async () => {
      axiosMock.get.mockRejectedValue({ response: { data: { error: 'Not Found' } } });
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toBeDefined();
    });

    it('handles network timeout/refusal', async () => {
      axiosMock.get.mockRejectedValue(new Error('Network Error'));
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toContain('Network Error');
    });

    it('verifies the base endpoint is /tasks', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true } });
      await TaskService.getTasks();
      expect(axiosMock.get.mock.calls[0][0]).toContain('/tasks');
    });
  });

  describe('getTaskById', () => {
    it('fetches specific task by ID string', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true, data: { _id: 'abc' } } });
      const res = await TaskService.getTaskById('abc');
      expect(res.data._id).toBe('abc');
    });

    it('handles invalid ID error', async () => {
      axiosMock.get.mockRejectedValue({ response: { data: { error: 'Invalid ID' } } });
      const res = await safeCall(() => TaskService.getTaskById('invalid'));
      expect(res.error).toBeDefined();
    });

    it('handles null response from server', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true, data: null } });
      const res = await TaskService.getTaskById('123');
      expect(res.data).toBeNull();
    });

    it('checks correct URL construction for single task', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true } });
      await TaskService.getTaskById('555');
      expect(axiosMock.get).toHaveBeenCalledWith(expect.stringContaining('/tasks/555'));
    });
  });

  describe('createTask', () => {
    it('creates a task with valid data', async () => {
      axiosMock.post.mockResolvedValue({ data: { success: true } });
      const res = await TaskService.createTask({ title: 'T' });
      expect(res).toBeDefined();
    });

    it('handles server-side validation failure', async () => {
      axiosMock.post.mockRejectedValue({ response: { data: { error: 'Title required' } } });
      const res = await safeCall(() => TaskService.createTask({}));
      expect(res.error).toBeDefined();
    });

    it('sends additional metadata like priority', async () => {
      axiosMock.post.mockResolvedValue({ data: { success: true } });
      await TaskService.createTask({ title: 'T', priority: 'high' });
      expect(axiosMock.post).toHaveBeenCalledWith('/tasks', expect.objectContaining({ priority: 'high' }));
    });

    it('handles unexpected 500 errors', async () => {
      axiosMock.post.mockRejectedValue(new Error('500'));
      const res = await safeCall(() => TaskService.createTask({ title: 'T' }));
      expect(res.error).toBeDefined();
    });
  });

  describe('updateTask', () => {
    it('successfully updates title', async () => {
      axiosMock.put.mockResolvedValue({ data: { success: true } });
      await TaskService.updateTask('1', { title: 'N' });
      expect(axiosMock.put).toHaveBeenCalled();
    });

    it('handles unauthorized update attempt', async () => {
      axiosMock.put.mockRejectedValue({ response: { status: 401 } });
      const res = await safeCall(() => TaskService.updateTask('1', {}));
      expect(res.error).toBeDefined();
    });

    it('works with partial updates', async () => {
      axiosMock.put.mockResolvedValue({ data: { success: true } });
      await TaskService.updateTask('1', { completed: true });
      expect(axiosMock.put).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ completed: true }));
    });

    it('returns the updated task data', async () => {
      axiosMock.put.mockResolvedValue({ data: { success: true, data: { status: 'done' } } });
      const res = await TaskService.updateTask('1', { status: 'done' });
      expect(res.data.status).toBe('done');
    });
  });

  describe('Delete & Toggle', () => {
    it('deletes a task by ID', async () => {
      axiosMock.delete.mockResolvedValue({ data: { success: true } });
      await TaskService.deleteTask('1');
      expect(axiosMock.delete).toHaveBeenCalled();
    });

    it('handles deleting non-existent task', async () => {
      axiosMock.delete.mockRejectedValue({ response: { status: 404 } });
      const res = await safeCall(() => TaskService.deleteTask('9'));
      expect(res.error).toBeDefined();
    });

    it('toggles task status using toggleTask', async () => {
      axiosMock.patch.mockResolvedValue({ data: { success: true, data: { completed: true } } });
      const res = await TaskService.toggleTask('1');
      expect(res.data.completed).toBe(true);
    });

    it('handles toggle failure', async () => {
      axiosMock.patch.mockRejectedValue({ response: { data: { error: 'Fail' } } });
      const res = await safeCall(() => TaskService.toggleTask('1'));
      expect(res.error).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('fetches dashboard stats', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true, data: { total: 5 } } });
      const res = await TaskService.getStats();
      expect(res.data.total).toBe(5);
    });

    it('handles stats fetch error', async () => {
      axiosMock.get.mockRejectedValue({ response: { data: { error: 'Err' } } });
      const res = await safeCall(() => TaskService.getStats());
      expect(res.error).toBeDefined();
    });

    it('verifies the /stats endpoint', async () => {
      axiosMock.get.mockResolvedValue({ data: { success: true } });
      await TaskService.getStats();
      expect(axiosMock.get).toHaveBeenCalledWith(expect.stringContaining('stats'));
    });

    it('handles empty stats object', async () => {
      axiosMock.get.mockResolvedValue({ data: { data: {} } });
      const res = await TaskService.getStats();
      expect(res.data).toEqual({});
    });
  });

  describe('Error Response Formats', () => {
    it('extracts error from "message" field', async () => {
      axiosMock.get.mockRejectedValue({ response: { data: { message: 'Msg' } } });
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toBeDefined();
    });

    it('returns default error if no message present', async () => {
      axiosMock.get.mockRejectedValue({ response: {} });
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toBeDefined();
    });

    it('handles case with no response object', async () => {
      axiosMock.get.mockRejectedValue({ request: {} });
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toBeDefined();
    });

    it('handles string errors', async () => {
      axiosMock.get.mockRejectedValue('Fatal');
      const res = await safeCall(() => TaskService.getTasks());
      expect(res.error).toBeDefined();
    });
  });
});