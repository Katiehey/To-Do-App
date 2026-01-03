import { Edit2, Trash2 } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';
import { cardClasses, textClasses, darkClass } from '../../utils/darkMode';

const CompactTaskItem = ({ task, onToggle, onEdit, onDelete, isSelected, onSelect }) => {
  const priorityColor = getPriorityColor(task.priority);

  // Map statuses to colors - Updated with dark mode variants for readability
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400';
    }
  };

  // Logic remains identical to your original code
  const handleToggle = (id) => {
    const nextStatusMap = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'archived',
      archived: 'pending',
    };
    const nextStatus = nextStatusMap[task.taskStatus] || 'pending';
    onToggle(id, nextStatus);
  };

  return (
    <div
      className={darkClass(cardClasses, `p-3 rounded-lg shadow-sm border transition duration-150 text-sm ${
        task.taskStatus === 'completed' ? 'opacity-70' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-100 dark:border-dark-border'}`)}
    >
      {/* Top row: selection + status + priority */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(task._id);
            }}
            className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          />

          {/* Status Badge Button */}
          <button
            onClick={() => handleToggle(task._id)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${getStatusClasses(task.taskStatus)}`}
            aria-label="Toggle task status"
          >
            {task.taskStatus}
          </button>
        </div>

        {/* Priority Badge */}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityColor}`}>
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-medium break-words transition-colors ${
          task.taskStatus === 'completed'
            ? 'line-through text-gray-400 dark:text-gray-500'
            : darkClass('', textClasses)
        }`}
      >
        {task.title}
      </h3>

      {/* Actions */}
      <div className="flex justify-end space-x-1 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CompactTaskItem;