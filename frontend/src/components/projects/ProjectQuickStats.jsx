import { Folder, BarChart3 } from 'lucide-react';

const ProjectQuickStats = ({ project, stats }) => {
  // Style for the project icon/initials
  const getProjectColorStyle = (color) => {
    return color && color.match(/^#[0-9A-F]{6}$/i)
      ? { backgroundColor: color, color: '#ffffff' }
      : { backgroundColor: '#6366F1', color: '#ffffff' }; // Default color
  };

  // --- Rendering for ALL TASKS (project is null) ---
  if (!project) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b pb-3">
          <Folder className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">All Tasks</h3>
          <p className="text-sm text-gray-500 ml-2">Viewing all your tasks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500 mt-1">Completed</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-500 mt-1">Pending</div>
          </div>
        </div>
      </div>
    );
  }

  // --- Rendering for SPECIFIC PROJECT ---
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4 border-b pb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
          style={getProjectColorStyle(project.color)}
        >
          {project.icon || project.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="text-2xl font-semibold text-gray-800 truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">{project.description}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 text-center">
        <div className="p-3 border rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1">Total</div>
        </div>
        <div className="p-3 border rounded-lg bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500 mt-1">Done</div>
        </div>
        <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500 mt-1">Pending</div>
        </div>
        <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
          <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            {stats.progress}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Progress</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectQuickStats;
