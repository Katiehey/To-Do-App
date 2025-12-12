import { useState } from 'react';
import { Trash2, Edit2, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';
import { formatDate, getPriorityColor } from '../../utils/helpers'; 
import StatusBadge from './StatusBadge';   // ✅ import reusable badge

const TaskItem = ({ task, onUpdateStatus, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers
  const handleStatusClick = async () => {
    // Cycle through statuses (or replace with dropdown logic if preferred)
    const nextStatusMap = {
      pending: "in-progress",
      "in-progress": "completed",
      completed: "archived",
      archived: "pending",
    };
    const nextStatus = nextStatusMap[task.taskStatus] || "pending";
    await onUpdateStatus(task._id, nextStatus);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await onDelete(task._id);
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  // Derived state/props
  const priorityColor = getPriorityColor(task.priority);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.taskStatus !== "completed";
  const isProcessing = isDeleting || task.isUpdating;

  return (
    <div className={`flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-150 ${task.taskStatus === "completed" ? 'opacity-70' : ''}`}>
      
      {/* 1. Status Badge */}
      <StatusBadge 
        status={task.taskStatus} 
        onClick={handleStatusClick} 
        disabled={isProcessing} 
      />

      {/* 2. Task Content */}
      <div className="flex-grow min-w-0 ml-3">
        
        {/* Title */}
        <h3 className={`text-lg font-semibold text-gray-800 ${task.taskStatus === "completed" ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        
        {/* Description */}
        {task.description && (
          <p className="mt-1 text-sm text-gray-600 break-words">
            {task.description}
          </p>
        )}
        
        {/* Meta Info Container */}
        <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 space-x-4">
          
          {/* Priority */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${priorityColor}`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {task.priority}
          </span>
          
          {/* Due Date */}
          {task.dueDate && (
            <span className={`flex items-center ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
              {isOverdue && (
                <Clock className="w-3 h-3 ml-1 text-red-500" title="Overdue" />
              )}
            </span>
          )}
          
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <span className="flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              {task.tags.slice(0, 2).join(', ')}
              {task.tags.length > 2 && (
                <span className="ml-1 text-xs text-gray-400">
                  +{task.tags.length - 2}
                </span>
              )}
            </span>
          )}
          
          {/* Project */}
          {task.project && (
            <span className="flex items-center">
              <AlertCircle className="w-3 h-3 mr-1 text-blue-500" />
              {task.project.name}
            </span>
          )}
        </div>
      </div>
      
      {/* 3. Actions */}
      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
        
        {/* Edit Button */}
        <button 
          onClick={handleEdit} 
          className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
          aria-label="Edit task"
          disabled={isProcessing}
        >
          <Edit2 className="w-5 h-5" />
        </button>
        
        {/* Delete Button */}
        <button 
          onClick={handleDelete} 
          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
          aria-label="Delete task"
          disabled={isProcessing}
        >
          {isDeleting ? (
            <Clock className="w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
