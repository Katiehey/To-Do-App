import { useState } from 'react';
import { Trash2, Edit2, Calendar, Tag, AlertCircle, Clock, Folder } from 'lucide-react';
import { formatDate, getPriorityColor } from '../../utils/helpers'; 
import StatusBadge from './StatusBadge';

// Helper function for project color/style
const getProjectColorStyle = (color) => {
  return color && color.match(/^#[0-9A-F]{6}$/i)
    ? { backgroundColor: color, color: '#ffffff' }
    : { backgroundColor: '#3B82F6', color: '#ffffff' }; // Default blue
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

  const handleEdit = () => {
    onEdit(task);
  };

  const priorityColor = getPriorityColor(task.priority);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.taskStatus !== "completed";
  const isProcessing = isDeleting || task.isUpdating;
  const project = task.project;

  return (
    <div
      className={`flex justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-150 ${
        task.taskStatus === "completed" ? 'opacity-70' : ''
      }`}
    >
      {/* Left side: checkbox + content */}
      <div className="flex-1 min-w-0">
        {/* Top row: checkbox, status, title */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectTask(task._id)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
          />
          <StatusBadge
            status={task.taskStatus}
            onClick={handleStatusClick}
            disabled={isProcessing}
          />
          <h3
            className={`text-lg font-semibold break-words ${
              task.taskStatus === "completed"
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-1 text-sm text-gray-600 break-words">
            {task.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
          {project && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-white"
              style={getProjectColorStyle(project.color)}
            >
              <Folder className="w-3 h-3 mr-1" />
              {project.name}
            </span>
          )}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${priorityColor}`}
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {task.priority}
          </span>
          {task.dueDate && (
            <span
              className={`flex items-center ${
                isOverdue ? 'text-red-500 font-semibold' : ''
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
              {isOverdue && (
                <Clock className="w-3 h-3 ml-1 text-red-500" title="Overdue" />
              )}
            </span>
          )}
          {task.tags?.length > 0 && (
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
        </div>
      </div>

      {/* Right side: actions */}
      <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
        <button
          onClick={handleEdit}
          className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
          disabled={isProcessing}
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
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
