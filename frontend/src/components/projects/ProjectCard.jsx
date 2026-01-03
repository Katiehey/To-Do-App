import { Edit2, Trash2, Archive, BarChart3, Settings } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode'; // ✅ Added

const ProjectCard = ({ project, onEdit, onDelete, onArchive, onClick, onSettings }) => {
  const completionRate = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  const getProjectColorClass = (color) => {
    return color && color.match(/^#[0-9A-F]{6}$/i)
      ? { backgroundColor: color, color: '#ffffff' }
      : { backgroundColor: '#3B82F6', color: '#ffffff' };
  };

  return (
    <div
      onClick={() => onClick(project._id)}
      className={darkClass(
        cardClasses,
        "p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 rounded-xl",
        "hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500",
        project.isArchived ? 'opacity-60' : 'opacity-100'
      )}
    >
      {/* Top Section */}
      <div>
        <div className="mb-3">
          <div className="flex items-start space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm"
              style={getProjectColorClass(project.color)}
            >
              {project.icon ? project.icon : null}
            </div>
            
            <div className="min-w-0 flex-grow">
              <h3 className={darkClass("text-lg font-semibold break-words transition-colors", textClasses)}>
                {project.name}
              </h3>
              
              {project.description && (
                <p className={darkClass("text-sm mt-0.5 break-words transition-colors", subtextClasses)}>
                  {project.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions Group */}
          <div className="flex space-x-1 mt-4 justify-center sm:justify-start">
            <button
              onClick={(e) => { e.stopPropagation(); onSettings(project); }}
              className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Quick Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(project._id); }}
              className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              title={project.isArchived ? "Unarchive project" : "Archive project"}
            >
              <Archive className="w-5 h-5" />
            </button>
            
            {!project.isDefault && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div>
            <div className={darkClass("text-xl font-bold transition-colors", textClasses)}>{project.taskCount || 0}</div>
            <div className={darkClass("text-xs transition-colors", subtextClasses)}>Total</div>
          </div>
          
          <div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{project.completedTaskCount || 0}</div>
            <div className={darkClass("text-xs transition-colors", subtextClasses)}>Done</div>
          </div>
          
          <div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              {completionRate}%
            </div>
            <div className={darkClass("text-xs transition-colors", subtextClasses)}>Progress</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-dark-border rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        
        {/* Badges */}
        <div className="flex space-x-2">
          {project.isDefault && (
            <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">
              Default
            </span>
          )}
          {project.isArchived && (
            <span className="px-2.5 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 rounded-full">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;