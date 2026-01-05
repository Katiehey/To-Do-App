import { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Plus, Loader } from 'lucide-react';
import { ProjectsPageSEO } from '../common/SEO'; // ✅ Added SEO Import
import PageTransition from '../common/PageTransition';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ProjectSettings from './ProjectSettings';
import ProjectAnalytics from './ProjectAnalytics';
import { NoProjectsState } from '../common/EmptyState';   
import { textClasses } from '../../utils/darkMode';

const Projects = () => {
  const { projects, loading, fetchProjects, createProject, updateProject } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [settingsProject, setSettingsProject] = useState(null);
  const [analyticsProjectId, setAnalyticsProjectId] = useState(null);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const onOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <ProjectsPageSEO /> {/* ✅ Integrated SEO component */}
      
      <PageTransition>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={textClasses + " text-3xl font-bold"}>Projects</h1>
              <p className="mt-1 text-gray-400 font-medium">Organize your tasks into projects</p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 mr-2" /> New Project
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="animate-spin text-blue-500" />
            </div>
          ) : !projects || projects.length === 0 ? (
            <NoProjectsState onAddProject={onOpenCreateModal} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={(p) => { setEditingProject(p); setIsModalOpen(true); }}
                  onSettings={setSettingsProject}
                  onClick={(id) => setAnalyticsProjectId(id)}
                />
              ))}
            </div>
          )}

          {/* Project creation/edit modal */}
          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingProject ? updateProject : createProject}
            initialProject={editingProject}
          />

          {/* Project settings modal */}
          {settingsProject && (
            <ProjectSettings
              project={settingsProject}
              onClose={() => setSettingsProject(null)}
            />
          )}

          {/* Project analytics modal */}
          {analyticsProjectId && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setAnalyticsProjectId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors z-10"
                >
                  ✕
                </button>
                <ProjectAnalytics
                  projectId={analyticsProjectId}
                  onClose={() => setAnalyticsProjectId(null)}
                />
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default Projects;