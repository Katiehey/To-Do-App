import { createContext, useState, useContext, useCallback } from 'react';
import projectService from '../services/projectService';

export const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all projects
   */
  const fetchProjects = useCallback(async (includeArchived = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects(includeArchived);
      setProjects(response.data.projects);
      return { success: true, data: response.data.projects };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new project
   */
  const createProject = async (projectData) => {
    try {
      setError(null);
      const response = await projectService.createProject(projectData);
      setProjects(prev => [response.data.project, ...prev]);
      return { success: true, data: response.data.project };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Update project
   */
  const updateProject = async (id, projectData) => {
    try {
      setError(null);
      const response = await projectService.updateProject(id, projectData);
      setProjects(prev =>
        prev.map(project =>
          project._id === id ? response.data.project : project
        )
      );
      return { success: true, data: response.data.project };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update project';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Delete project
   */
  const deleteProject = async (id) => {
    try {
      setError(null);
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete project';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Toggle archive status
   */
  const toggleArchive = async (id) => {
    try {
      setError(null);
      const response = await projectService.toggleArchive(id);
      setProjects(prev =>
        prev.map(project =>
          project._id === id ? response.data.project : project
        )
      );
      return { success: true, data: response.data.project };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to toggle archive';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Get default project
   */
  const getDefaultProject = () => {
    return projects.find(p => p.isDefault);
  };

  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleArchive,
    getDefaultProject,
  };

    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>  ;
};