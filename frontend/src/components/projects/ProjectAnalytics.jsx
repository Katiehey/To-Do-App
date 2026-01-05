import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Calendar, BarChart2, Loader } from 'lucide-react';
import projectService from '../../services/projectService';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const ProjectAnalytics = ({ projectId, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjectStats(projectId);
        if (response.data?.stats) {
          setStats(response.data.stats);
        } else if (response.stats) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchStats();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className={darkClass(cardClasses, "flex items-center justify-center p-12 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors")}>
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className={`ml-3 ${subtextClasses}`}>Loading analytics...</span>
      </div>
    );
  }

  if (!stats) return null;

  const overall = stats.overall?.[0] || { total: 0, completed: 0, pending: 0 };
  const byPriority = stats.byPriority || [];
  const byStatus = stats.byStatus || [];
  const completionRate = overall.total > 0
    ? Math.round((overall.completed / overall.total) * 100)
    : 0;

  return (
    <div className="relative space-y-6">
      <div className="flex items-center space-x-2 mb-2">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className={darkClass("text-xl font-bold", textClasses)}>Project Analytics</h2>
        
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={darkClass(cardClasses, "p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm")}>
          <p className={subtextClasses}>Total</p>
          <p className={darkClass("text-2xl font-bold", textClasses)}>{overall.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{overall.completed}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{overall.pending}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Progress</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Priority */}
        <div className={darkClass(cardClasses, "p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm")}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center ${subtextClasses}`}>
            <AlertCircle className="w-4 h-4 mr-2" /> Tasks by Priority
          </h3>
          <div className="space-y-4">
            {byPriority.map((item) => {
              const total = byPriority.reduce((sum, p) => sum + p.count, 0);
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              
              const colors = {
                high: { bg: 'bg-red-100 dark:bg-red-900/30', fill: 'bg-red-500 dark:bg-red-500', text: 'text-red-700 dark:text-red-400' },
                medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', fill: 'bg-yellow-500 dark:bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-400' },
                low: { bg: 'bg-green-100 dark:bg-green-900/30', fill: 'bg-green-500 dark:bg-green-500', text: 'text-green-700 dark:text-green-400' },
              };
              const color = colors[item._id.toLowerCase()] || colors.low;

              return (
                <div key={item._id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={`font-bold capitalize ${color.text}`}>{item._id}</span>
                    <span className={subtextClasses}>{item.count} ({percentage}%)</span>
                  </div>
                  <div className={`w-full ${color.bg} rounded-full h-2`}>
                    <div 
                      className={`${color.fill} h-2 rounded-full transition-all duration-700 ease-out`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className={darkClass(cardClasses, "p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm")}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center ${subtextClasses}`}>
            <BarChart2 className="w-4 h-4 mr-2" /> Tasks by Status
          </h3>
          <div className="space-y-2">
            {byStatus.map((item) => (
              <div 
                key={item._id} 
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-transparent dark:border-slate-700 transition-colors"
              >
                <span className={`text-sm font-semibold capitalize ${darkClass("text-gray-700", textClasses)}`}>
                  {item._id.replace('-', ' ')}
                </span>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-md text-sm font-bold text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-slate-600 shadow-sm">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;