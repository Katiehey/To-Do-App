import { Edit2, Trash2 } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

const CompactTaskItem = ({ task, onToggle, onEdit, onDelete, isSelected, onSelect }) => {
  const priorityColor = getPriorityColor(task.priority);

  // Map statuses to colors
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';   // Pending = yellow
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';       // In-progress = blue
      case 'completed':
        return 'bg-green-100 text-green-700';     // Completed = green
      case 'archived':
        return 'bg-gray-100 text-gray-700';       // Archived = gray
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Cycle through statuses
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
      className={`p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-150 text-sm ${
        task.taskStatus === 'completed' ? 'opacity-70' : ''
      }`}
    >
      {/* Top row: selection + status + priority */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(task._id)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          />

          {/* Status Badge Button */}
          <button
            onClick={() => handleToggle(task._id)}
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClasses(task.taskStatus)}`}
            aria-label="Toggle task status"
          >
            {task.taskStatus}
          </button>
        </div>

        {/* Priority Badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-medium break-words ${
          task.taskStatus === 'completed'
            ? 'line-through text-gray-500'
            : 'text-gray-800'
        }`}
      >
        {task.title}
      </h3>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CompactTaskItem;
