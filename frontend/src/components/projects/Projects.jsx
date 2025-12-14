import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Plus, Loader } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const Projects = () => {
  const {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleArchive,
  } = useProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    // Fetch projects on component mount
    fetchProjects();
  }, [fetchProjects]); // Dependency includes fetchProjects for safety, though it's assumed stable from context

  const handleOpenModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProject(null);
    setIsModalOpen(false);
  };

  const handleAddProject = async (projectData) => {
    const result = await createProject(projectData);
    if (result.success) {
      // Re-fetch to update the list, especially if new task is out of current view
      await fetchProjects();
    }
    return result;
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleUpdateProject = async (projectData) => {
    const result = await updateProject(editingProject._id, projectData);
    if (result.success) {
      // Re-fetch to update the list
      await fetchProjects();
    }
    return result;
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? Tasks associated with it will be moved to the default project.')) {
      // No need to fetch, as deleteProject updates local state
      await deleteProject(id);
    }
  };

  const handleToggleArchive = async (id) => {
    // No need to fetch, as toggleArchive updates local state
    await toggleArchive(id);
  };
  
  const handleProjectClick = (projectId) => {
      // TODO: Implement navigation to the project's task list (e.g., /tasks?projectId=XXX)
      console.log(`Navigating to tasks for project ID: ${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader className="w-8 h-8 animate-spin mr-3" />
        <span>Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-lg text-gray-300 font-medium">Organize your tasks into projects</p>
        </div>
        
        <button
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800">No Projects Found</h3>
          <p className="text-gray-500 mt-2">Click "New Project" to get started organizing your tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onArchive={handleToggleArchive}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}
      
      {/* Project Modal (Add/Edit) */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingProject ? handleUpdateProject : handleAddProject}
        initialProject={editingProject}
      />
    </div>
  );
};

export default Projects;