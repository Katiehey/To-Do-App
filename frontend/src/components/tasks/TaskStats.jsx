import { useTaskStats } from '../../hooks/useTaskStats';
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';

const TaskStats = () => {
  const { stats, loading, error } = useTaskStats();

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-blue-600">
        <Loader className="animate-spin w-6 h-6 mr-3" />
        Loading statistics...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p className="font-medium">Error loading stats: {error}</p>
        </div>
      </div>
    );
  }

  // Handle case where stats data is missing or empty
  if (!stats || !stats.overall || stats.overall.length === 0) {
    // If no stats are available but no error, return a placeholder or null
    return (
      <div className="p-4 text-gray-500 text-center border rounded-md">
        No task data available to calculate statistics.
      </div>
    );
  }

  // Destructure and calculate statistics
  const overall = stats.overall[0] || { total: 0, completed: 0, pending: 0 };
  
  const completionRate = overall.total > 0
    ? Math.round((overall.completed / overall.total) * 100)
    : 0;

  // Render Stats Cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Total Tasks */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">
            Total Tasks
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {overall.total || 0}
          </p>
        </div>
        <Clock className="w-8 h-8 text-blue-500 p-1.5 bg-blue-100 rounded-full" />
      </div>

      {/* 2. Completed */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">
            Completed
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {overall.completed || 0}
          </p>
        </div>
        <CheckCircle className="w-8 h-8 text-green-500 p-1.5 bg-green-100 rounded-full" />
      </div>

      {/* 3. Pending */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">
            Pending
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {overall.pending || 0}
          </p>
        </div>
        <AlertCircle className="w-8 h-8 text-yellow-500 p-1.5 bg-yellow-100 rounded-full" />
      </div>

      {/* 4. Completion Rate */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">
            Completion Rate
          </p>
          <p className={`mt-1 text-3xl font-semibold ${completionRate === 100 ? 'text-green-600' : 'text-blue-600'}`}>
            {completionRate}%
          </p>
        </div>
        {/* Placeholder Icon for Rate */}
        <Clock className="w-8 h-8 text-purple-500 p-1.5 bg-purple-100 rounded-full" />
      </div>
    </div>
  );
};

export default TaskStats;