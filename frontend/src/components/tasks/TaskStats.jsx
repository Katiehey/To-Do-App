import { useTaskStats } from '../../hooks/useTaskStats';
import { Clock, AlertCircle, Loader } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const TaskStats = () => {
  const { stats, loading, error } = useTaskStats();

  if (loading) return (
    <div className="flex items-center justify-center p-12 text-blue-600">
      <Loader className="animate-spin w-8 h-8 mr-3" />
      <span className="font-medium">Calculating statistics...</span>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-md">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p className="font-medium">Error loading stats: {error}</p>
      </div>
    </div>
  );

  const overall = stats?.overall?.[0] || { total: 0, pending: 0, "in-progress": 0, completed: 0, archived: 0 };
  const completionRate = overall.total > 0 ? Math.round((overall.completed / overall.total) * 100) : 0;

  const StatCard = ({ label, value, icon: Icon, colorClass, status }) => (
    <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-all duration-300")}>
      <div className="min-w-0">
        <p className={`text-xs font-bold uppercase tracking-widest ${subtextClasses}`}>{label}</p>
        <p className={darkClass("mt-1 text-3xl font-bold", textClasses)}>{value || 0}</p>
      </div>
      <div className="flex-shrink-0">
        {status ? (
          <StatusBadge status={status} />
        ) : (
          <div className={`${colorClass.replace('text', 'bg')} bg-opacity-10 dark:bg-opacity-20 p-2.5 rounded-full`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mb-8">
      {/* 5-Column Grid for main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Tasks" value={overall.total} icon={Clock} colorClass="text-blue-500" />
        <StatCard label="Pending" value={overall.pending} status="pending" />
        <StatCard label="In Progress" value={overall["in-progress"]} status="in-progress" />
        <StatCard label="Completed" value={overall.completed} status="completed" />
        <StatCard label="Archived" value={overall.archived} status="archived" />
      </div>
      
      {/* Full-width Rate Card */}
      <div className={darkClass(cardClasses, "p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-all duration-300")}>
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-widest ${subtextClasses}`}>Completion Productivity</p>
          <div className="flex items-end space-x-4 mt-1">
            <p className={`text-4xl font-black ${completionRate === 100 ? 'text-green-600' : 'text-blue-600 dark:text-blue-400'}`}>
              {completionRate}%
            </p>
            {/* Progress Bar for visual touch */}
            <div className="hidden sm:block w-full max-w-xs h-2 bg-gray-100 dark:bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>
        </div>
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default TaskStats;