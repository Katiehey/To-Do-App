import { Folder, BarChart3 } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const ProjectQuickStats = ({ project, stats }) => {
  const getProjectColorStyle = (color) => {
    return color && color.match(/^#[0-9A-F]{6}$/i)
      ? { backgroundColor: color, color: '#ffffff' }
      : { backgroundColor: '#6366F1', color: '#ffffff' };
  };

  const statBoxBase = "p-3 rounded-lg border transition-all duration-300";

  if (!project) {
    return (
      <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 mb-6 transition-colors duration-300")}>
        <div className="flex items-center space-x-3 mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
          <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className={darkClass("text-xl font-semibold", textClasses)}>All Tasks</h3>
          <p className={`${subtextClasses} ml-2`}>Viewing all your tasks</p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <div className={darkClass("text-2xl font-bold", textClasses)}>{stats.total}</div>
            <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold tracking-wider`}>Total</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold tracking-wider`}>Completed</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold tracking-wider`}>Pending</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 mb-6 transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-800 group-hover:shadow-blue-500/10")}>
      <div className="flex items-start justify-between mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
        <div className="flex items-start space-x-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm"
            style={getProjectColorStyle(project.color)}
          >
            {project.icon || project.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-grow">
            <h3 className={darkClass("text-2xl font-semibold truncate", textClasses)}>{project.name}</h3>
            {project.description && (
              <p className={`${subtextClasses} mt-0.5 truncate`}>{project.description}</p>
            )}
          </div>
        </div>

        {/* Analytics Badge Trigger */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold uppercase transition-all group-hover:bg-blue-600 group-hover:text-white">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
        <div className={`${statBoxBase} bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700`}>
          <div className={darkClass("text-2xl font-bold", textClasses)}>{stats.total}</div>
          <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold`}>Total</div>
        </div>
        <div className={`${statBoxBase} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/40`}>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold text-green-700/70`}>Done</div>
        </div>
        <div className={`${statBoxBase} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/40`}>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold text-yellow-700/70`}>Pending</div>
        </div>
        <div className={`${statBoxBase} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/40`}>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {stats.progress}%
          </div>
          <div className={`${subtextClasses} mt-1 text-[10px] uppercase font-bold text-blue-700/70`}>Progress</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectQuickStats;