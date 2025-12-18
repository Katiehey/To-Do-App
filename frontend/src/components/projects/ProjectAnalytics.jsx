import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Calendar, BarChart2 } from 'lucide-react';
import projectService from '../../services/projectService';

const ProjectAnalytics = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log('ProjectAnalytics mounted with projectId:', projectId);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjectStats(projectId);
      console.log('Stats response:', JSON.stringify(response, null, 2));

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
      <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading analytics...</span>
      </div>
    );
  }

  if (!stats) return null;

  // Safeguard data structure
  const overall = stats.overall?.[0] || { total: 0, completed: 0, pending: 0 };
  const byPriority = stats.byPriority || [];
  const byStatus = stats.byStatus || [];
  const completionRate = overall.total > 0
    ? Math.round((overall.completed / overall.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Project Analytics</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800">{overall.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{overall.completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{overall.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-sm text-blue-600">Progress</p>
          <p className="text-2xl font-bold text-blue-700">{completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Priority */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Tasks by Priority
          </h3>
          <div className="space-y-4">
            {byPriority.map((item) => {
              const total = byPriority.reduce((sum, p) => sum + p.count, 0);
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              
              const colors = {
                high: { bg: 'bg-red-100', fill: 'bg-red-500', text: 'text-red-700' },
                medium: { bg: 'bg-yellow-100', fill: 'bg-yellow-500', text: 'text-yellow-700' },
                low: { bg: 'bg-green-100', fill: 'bg-green-500', text: 'text-green-700' },
              };
              const color = colors[item._id.toLowerCase()] || colors.low;

              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium capitalize ${color.text}`}>{item._id}</span>
                    <span className="text-gray-500">{item.count} ({percentage}%)</span>
                  </div>
                  <div className={`w-full ${color.bg} rounded-full h-2`}>
                    <div 
                      className={`${color.fill} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4 flex items-center">
            <BarChart2 className="w-4 h-4 mr-2" /> Tasks by Status
          </h3>
          <div className="space-y-2">
            {byStatus.map((item) => (
              <div 
                key={item._id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item._id.replace('-', ' ')}
                </span>
                <span className="bg-white px-3 py-1 rounded-md text-sm font-bold text-gray-800 border border-gray-100">
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