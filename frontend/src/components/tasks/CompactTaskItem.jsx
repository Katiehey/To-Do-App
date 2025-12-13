import { CheckCircle, Circle, Edit2, Trash2 } from 'lucide-react';
import { getPriorityColor } from '../../utils/helpers';

const CompactTaskItem = ({ task, onToggle, onEdit, onDelete, isSelected, onSelect }) => {
  const priorityColor = getPriorityColor(task.priority);
  
  // Determine if the task is complete for styling
  const isCompleted = task.completed;

  return (
    <div className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-150 text-sm ${isCompleted ? 'opacity-70' : ''}`}>
      
      {/* 1. Left Side: Selection, Toggle, and Title */}
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task._id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        
        {/* Completion Toggle */}
        <button
          onClick={() => onToggle(task._id)}
          className="flex-shrink-0"
          aria-label={isCompleted ? "Mark as active" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-600 transition" fill="currentColor" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-500 transition" />
          )}
        </button>

        {/* Title */}
        <span className={`font-medium truncate ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.title}
        </span>
      </div>
      
      {/* 2. Right Side: Priority and Actions */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        
        {/* Priority Badge */}
        <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
          {task.priority}
        </span>
        
        {/* Edit Button */}
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        
        {/* Delete Button */}
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