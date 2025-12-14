import api from './api';

/**
 * Project API Service
 */
const projectService = {
  /**
   * Get all projects
   */
  getProjects: async (includeArchived = false) => {
    const response = await api.get(`/projects?includeArchived=${includeArchived}`);
    return response.data;
  },

  /**
   * Get single project by ID
   */
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create new project
   */
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  /**
   * Update project
   */
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  /**
   * Delete project
   */
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Get project statistics
   */
  getProjectStats: async (id) => {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  },

  /**
   * Toggle project archive status
   */
  toggleArchive: async (id) => {
    const response = await api.patch(`/projects/${id}/archive`);
    return response.data;
  },
};

export default projectService;