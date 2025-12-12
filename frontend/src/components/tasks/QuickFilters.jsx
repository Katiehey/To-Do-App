import { CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';

const QuickFilters = ({ onFilterChange }) => {
  
  const quickFilters = [
    {
      label: 'All Tasks',
      icon: AlertCircle,
      filters: { completed: undefined, priority: undefined },
      // Explicit classes for Tailwind safety
      className: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    {
      label: 'Active',
      icon: Clock,
      filters: { completed: false, priority: undefined },
      className: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
    },
    {
      label: 'Completed',
      icon: CheckCircle,
      filters: { completed: true, priority: undefined },
      className: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    },
    {
      label: 'High Priority',
      icon: Star,
      filters: { completed: undefined, priority: 'high' },
      className: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.label}
            onClick={() => onFilterChange(filter.filters)} // Correct use of () for function call, {} for arrow function body
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition border text-sm font-medium ${filter.className}`} // Correct use of `` and {}
          >
            <Icon className="w-4 h-4" /> {/* Correct self-closing component tag */}
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;