import { useState } from 'react';
import { Trash2, Edit2, Calendar, Tag, AlertCircle, Clock, Folder } from 'lucide-react';
import { formatDate, getPriorityColor } from '../../utils/helpers'; 
import StatusBadge from './StatusBadge';
import RecurringBadge from './RecurringBadge';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode'; // ✅ Added

// Helper function for project color/style
const getProjectColorStyle = (color) => {
  return color && color.match(/^#[0-9A-F]{6}$/i)
    ? { backgroundColor: color, color: '#ffffff' }
    : { backgroundColor: '#3B82F6', color: '#ffffff' }; 
};

const TaskItem = ({ task, onUpdateStatus, onEdit, onDelete, isSelected, onSelectTask }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusClick = async () => {
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

  const handleEdit = () => onEdit(task);

  const priorityColor = getPriorityColor(task.priority);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.taskStatus !== "completed";
  const isProcessing = isDeleting || task.isUpdating;
  const project = task.project;

  return (
    <div
      className={darkClass(
        cardClasses,
        "flex justify-between p-4 rounded-xl shadow-sm transition-all duration-150",
        task.taskStatus === "completed" ? 'opacity-60' : 'opacity-100',
        "hover:shadow-md border border-gray-200 dark:border-dark-border"
      )}
    >
      {/* Left side: checkbox + content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectTask(task._id)}
            className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          />
          <StatusBadge
            status={task.taskStatus}
            onClick={handleStatusClick}
            disabled={isProcessing}
          />
          <h3
            className={darkClass(
              "text-lg font-semibold break-words transition-colors",
              task.taskStatus === "completed"
                ? 'line-through text-gray-400 dark:text-gray-500'
                : textClasses
            )}
          >
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className={darkClass("mt-1 text-sm break-words transition-colors", subtextClasses)}>
            {task.description}
          </p>
        )}

        {/* Meta Info Section */}
        <div className="mt-3 flex flex-wrap items-center text-xs gap-x-4 gap-y-2">
          {task.recurring?.enabled && (
            <RecurringBadge recurring={task.recurring} size="sm" />
          )}

          {project && (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-white shadow-sm"
              style={getProjectColorStyle(project.color)}
            >
              <Folder className="w-3 h-3 mr-1" />
              {project.name}
            </span>
          )}
          
          <span
            className={darkClass("inline-flex items-center px-2.5 py-0.5 rounded-full font-medium", priorityColor)}
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {task.priority}
          </span>

          {task.dueDate && (
            <span
              className={darkClass(
                "flex items-center",
                isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
              {isOverdue && (
                <Clock className="w-3 h-3 ml-1" title="Overdue" />
              )}
            </span>
          )}

          {task.tags?.length > 0 && (
            <span className="flex items-center text-gray-500 dark:text-gray-400">
              <Tag className="w-3 h-3 mr-1" />
              {task.tags.slice(0, 2).join(', ')}
              {task.tags.length > 2 && (
                <span className="ml-1 text-xs opacity-60">
                  +{task.tags.length - 2}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Right side: actions */}
      <div className="flex-shrink-0 flex items-center space-x-1 ml-4">
        <button
          onClick={handleEdit}
          className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
          disabled={isProcessing}
          aria-label="Edit task"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50"
          disabled={isProcessing}
          aria-label="Delete task"
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