import { useState, useEffect } from 'react'; // ✅ Added useEffect
import { Folder, Plus, ChevronDown, ChevronRight, Archive, Menu, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useProject } from '../../context/ProjectContext';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';
import { throttle } from '../../utils/performance'; // ✅ Added performance import

const ProjectSidebar = ({ activeProjectId, onProjectSelect, onCreateProject, className = '' }) => {
  const { tasks } = useTask();
  const { projects } = useProject();
  const [showArchived, setShowArchived] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarScrolled, setSidebarScrolled] = useState(false); // ✅ Local scroll state

  // ✅ Integrated Throttled Scroll Logic
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Useful for adding a header shadow inside the sidebar
      const sidebarElement = document.getElementById('project-sidebar-content');
      if (sidebarElement && sidebarElement.scrollTop > 10) {
        setSidebarScrolled(true);
      } else {
        setSidebarScrolled(false);
      }
    }, 100);

    // Attach to the specific sidebar container if it exists
    const sidebarElement = document.getElementById('project-sidebar-content');
    if (sidebarElement) {
      sidebarElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (sidebarElement) sidebarElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const activeProjects = Array.isArray(projects) ? projects.filter(p => !p.isArchived) : [];
  const archivedProjects = Array.isArray(projects) ? projects.filter(p => p.isArchived) : [];
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;

  const getPendingCount = (projectId) => {
    if (!projectId || !Array.isArray(tasks)) return 0;
    return tasks.filter(t => 
      t.project && 
      (t.project._id === projectId || t.project === projectId) && 
      t.taskStatus !== 'completed'
    ).length;
  };

  const ProjectItem = ({ project, isActive }) => {
    const projectId = project?._id || project?.id;
    const pendingTasks = getPendingCount(projectId);

    return (
      <button
        onClick={() => { 
          if (typeof onProjectSelect === 'function') {
            onProjectSelect(projectId); 
            setIsMobileOpen(false); 
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-medium group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <div className="flex items-center space-x-3 truncate">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm"
            style={{ 
              backgroundColor: project.color || '#3B82F6', 
              color: '#ffffff' 
            }}
          >
            {project.icon || project.name.charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{project.name}</span>
        </div>
        {pendingTasks > 0 && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
            isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200'
          }`}>
            {pendingTasks}
          </span>
        )}
      </button>
    );
  };

  const SidebarContent = () => (
    <div 
      id="project-sidebar-content" 
      className="h-full overflow-y-auto p-4 space-y-4"
    >
      {/* Dynamic Header Shadow based on scroll */}
      <div className={`sticky top-0 bg-inherit z-10 flex justify-between items-center pb-2 mb-2 border-b transition-shadow ${
        sidebarScrolled ? 'shadow-sm border-blue-100 dark:border-blue-900/30' : 'border-gray-100 dark:border-dark-border'
      }`}>
        <h2 className={darkClass("text-xl font-bold", textClasses)}>Projects</h2>
        <button 
          onClick={() => { onCreateProject(); setIsMobileOpen(false); }} 
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => { onProjectSelect(null); setIsMobileOpen(false); }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-bold ${
          !activeProjectId ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Folder className="w-5 h-5 flex-shrink-0" />
          <span>All Tasks</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${!activeProjectId ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200'}`}>
          {totalTasks}
        </span>
      </button>

      <div className="space-y-1">
        <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2 px-3">Active</h3>
        {activeProjects.map(p => (
          <ProjectItem 
            key={p._id || p.id} 
            project={p} 
            isActive={activeProjectId === (p._id || p.id)} 
          />
        ))}
      </div>

      {archivedProjects.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
          <button onClick={() => setShowArchived(!showArchived)} className="w-full flex items-center justify-between px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition text-sm font-medium">
            <div className="flex items-center space-x-3"><Archive className="w-5 h-5" /><span>Archived</span></div>
            {showArchived ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {showArchived && (
            <div className="mt-2 space-y-1 pl-4">
              {archivedProjects.map(p => (
                <ProjectItem 
                  key={p._id || p.id} 
                  project={p} 
                  isActive={activeProjectId === (p._id || p.id)} 
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
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95">
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className={`hidden lg:block lg:w-64 flex-shrink-0 ${className}`}>
        <div className={darkClass(cardClasses, "h-full rounded-xl shadow-lg transition-colors overflow-hidden")}>
          <SidebarContent />
        </div>
      </div>

      {isMobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
          <div className={darkClass(cardClasses, "lg:hidden fixed inset-y-0 left-0 w-72 z-50 shadow-2xl overflow-hidden")}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectSidebar;