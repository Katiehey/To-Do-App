import { CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';
import { darkClass } from '../utils/darkMode';

const QuickFilters = ({ onFilterChange }) => {
  const quickFilters = [
    {
      label: 'All Tasks',
      icon: AlertCircle,
      filters: { completed: undefined, priority: undefined },
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    },
    {
      label: 'Active',
      icon: Clock,
      filters: { completed: false, priority: undefined },
      className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    },
    {
      label: 'Completed',
      icon: CheckCircle,
      filters: { completed: true, priority: undefined },
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    },
    {
      label: 'High Priority',
      icon: Star,
      filters: { completed: undefined, priority: 'high' },
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.label}
            onClick={() => onFilterChange(filter.filters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border text-sm font-medium hover:scale-105 active:scale-95 ${filter.className}`}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;