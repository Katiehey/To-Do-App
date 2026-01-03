import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Plus, Loader, X } from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ProjectAnalytics from './ProjectAnalytics';
import ProjectSettings from './ProjectSettings'; // ✅ Added specific import
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

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

  // Existing Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectForAnalytics, setSelectedProjectForAnalytics] = useState(null);
  
  // ✅ Added settings state per your request
  const [settingsProject, setSettingsProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // --- Existing Handlers ---
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
    if (result.success) await fetchProjects();
    return result;
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleUpdateProject = async (projectData) => {
    const result = await updateProject(editingProject._id, projectData);
    if (result.success) await fetchProjects();
    return result;
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure? Tasks will be moved to the default project.')) {
      await deleteProject(id);
    }
  };

  const handleToggleArchive = async (id) => {
    await toggleArchive(id);
  };

  // --- ✅ New Settings Handlers per your request ---
  const handleOpenSettings = (project) => {
    setSettingsProject(project);
  };

  const handleUpdateSettings = async (settings) => {
    const result = await updateProject(settingsProject._id, settings);
    if (result.success) {
      await fetchProjects();
    }
    return result;
  };

  const handleArchiveFromSettings = async () => {
    await toggleArchive(settingsProject._id);
    await fetchProjects();
  };

  const handleDeleteFromSettings = async () => {
    return await deleteProject(settingsProject._id);
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
      
      {/* Header */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onArchive={handleToggleArchive}
            onClick={() => setSelectedProjectForAnalytics(project._id)}
            onSettings={handleOpenSettings} // ✅ Added prop
          />
        ))}
      </div>

      {/* ✅ Settings Modal */}
      {settingsProject && (
        <ProjectSettings
          project={settingsProject}
          onClose={() => setSettingsProject(null)}
          onUpdate={handleUpdateSettings}
          onArchive={handleArchiveFromSettings}
          onDelete={handleDeleteFromSettings}
        />
      )}

      {/* Analytics Modal */}
      {selectedProjectForAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Project Analytics</h2>
              <button
                onClick={() => setSelectedProjectForAnalytics(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className={darkClass(cardClasses, "rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-slate-700 transition-colors")}>
              <ProjectAnalytics projectId={selectedProjectForAnalytics} />
            </div>
          </div>
        </div>
      )}
      
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