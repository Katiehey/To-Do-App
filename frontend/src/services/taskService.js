import api from './api';

/**
 * Task API Service
 */
const taskService = {
  /**
   * Get all tasks with optional filters
   */
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (Array.isArray(filters[key])) {
          filters[key].forEach(val => params.append(key, val));
        } else {
          params.append(key, filters[key]);
        }
      }
    });

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single task by ID
   */
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create new task
   */
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update task
   */
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete task
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Toggle task completion
   */
  toggleTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  /**
   * Get task statistics
   */
  getStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;
