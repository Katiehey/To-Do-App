import { Edit2, Trash2, Archive, BarChart3, Settings } from 'lucide-react'; // ✅ Added Settings icon

const ProjectCard = ({ project, onEdit, onDelete, onArchive, onClick, onSettings }) => { // ✅ Added onSettings prop
  const completionRate = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0;

  // Function to determine the background color for the project icon
  const getProjectColorClass = (color) => {
    return color && color.match(/^#[0-9A-F]{6}$/i)
      ? { backgroundColor: color, color: '#ffffff' }
      : { backgroundColor: '#3B82F6', color: '#ffffff' };
  };

  return (
    // Main Card Container, clickable to view project analytics
    <div
      onClick={() => onClick(project._id)}
      className={`bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 ${project.isArchived ? 'opacity-70' : ''}`}
    >
      
      {/* Top Section: Header, Description, Actions */}
      <div>
        <div className=" mb-3">
          
          {/* Project Info */}
          <div className="flex items-start space-x-3">
            {/* Project Icon/Initial */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
              style={getProjectColorClass(project.color)}
            >
              {project.icon ? project.icon : null}
            </div>
            
            <div className="min-w-0 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 break-words whitespace-normal">
                {project.name}
              </h3>
              
              {project.description && (
                <p className="text-sm text-gray-500 mt-0.5 break-words whitespace-normal">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions Group */}
          <div className="flex space-x-1 mt-3 justify-center">
            
            {/* ✅ NEW: Settings Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettings(project);
              }}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Quick Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            
            {/* Archive Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(project._id);
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
              title={project.isArchived ? "Unarchive project" : "Archive project"}
            >
              <Archive className="w-5 h-5" />
            </button>
            
            {/* Delete Button (Only if not default) */}
            {!project.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project._id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Stats, Progress, Badges */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div>
            <div className="text-xl font-bold text-gray-800">{project.taskCount || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          
          <div>
            <div className="text-xl font-bold text-green-600">{project.completedTaskCount || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Done</div>
          </div>
          
          <div>
            <div className="text-xl font-bold text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              {completionRate}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Progress</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        
        {/* Badges */}
        <div className="flex space-x-2">
          {project.isDefault && (
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Default
            </span>
          )}
          {project.isArchived && (
            <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;