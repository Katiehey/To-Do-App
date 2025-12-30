import { useState } from 'react';
import { Folder, Plus, ChevronDown, ChevronRight, Archive, Menu, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useProject } from '../../context/ProjectContext';


const ProjectSidebar = ({
  //projects = [],        // default to empty array to avoid crashes
  //tasks = [],           // 👈 new prop: live tasks array
  activeProjectId,
  onProjectSelect,
  onCreateProject,
  className = ''
}) => {
  const { tasks } = useTask();
  const { projects } = useProject();

  console.log("projects:", projects);
  console.log("tasks:", tasks);
  
  const [showArchived, setShowArchived] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Split projects
  const activeProjects = Array.isArray(projects) ? projects.filter(p => !p.isArchived) : [];
    const archivedProjects = Array.isArray(projects) ? projects.filter(p => p.isArchived) : [];

  // Calculate total tasks live from tasks array
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;

  // Helper: count pending tasks for a project
  const getPendingCount = (projectId) => {
    if (!projectId || !Array.isArray(tasks)) return 0;
    const projectTasks = tasks.filter(t => t.project && (t.project._id === projectId || t.project.id === projectId));
    return projectTasks.filter(t => t.taskStatus !== 'completed').length;
};

  // --- Helper Component: ProjectItem ---
  const ProjectItem = ({ project, isActive }) => {
    console.log("projects:", projects);
    console.log("tasks:", tasks);
    const projectId = project?._id || project?.id;
const pendingTasks = projectId ? getPendingCount(projectId) : 0;


    const getProjectColorStyle = (color) => {
      return color && color.match(/^#[0-9A-F]{6}$/i)
        ? { backgroundColor: color, color: '#ffffff' }
        : { backgroundColor: '#3B82F6', color: '#ffffff' };
    };

    return (
      <button
        onClick={() => {
          onProjectSelect(project._id);
          setIsMobileOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
        title={project.name}
      >
        <div className="flex items-center space-x-3 truncate">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={getProjectColorStyle(project.color)}
          >
            {project.icon || project.name.charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{project.name}</span>
        </div>

        {pendingTasks > 0 && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">
            {pendingTasks}
          </span>
        )}
      </button>
    );
  };

  // --- Helper Component: SidebarContent ---
  const SidebarContent = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={() => {
            onCreateProject();
            setIsMobileOpen(false);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Create new project"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* All Tasks */}
      <button
        onClick={() => {
          onProjectSelect(null);
          setIsMobileOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm font-semibold mb-2 ${
          !activeProjectId ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Folder className="w-5 h-5 flex-shrink-0" />
          <span>All Tasks</span>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            !activeProjectId ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {totalTasks}
        </span>
      </button>

      {/* Active Projects */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1 px-3">Active</h3>
        {activeProjects.map(project => (
          <ProjectItem
            key={project._id || project.id}
      project={project}
      isActive={activeProjectId === (project._id || project.id)}
          />
        ) , null
        )}
      </div>

      {/* Archived Projects */}
      {archivedProjects.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
          >
            <div className="flex items-center space-x-3">
              <Archive className="w-5 h-5 flex-shrink-0" />
              <span>Archived</span>
            </div>
            {showArchived ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {showArchived && (
            <div className="mt-2 space-y-1 pl-4">
              {archivedProjects.map(project => (
                <ProjectItem
                  key={project._id}
                  project={project}
                  isActive={activeProjectId === project._id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block lg:w-64 flex-shrink-0 ${className}`}>
        <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-2xl overflow-y-auto">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectSidebar;
