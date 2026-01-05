import { useState, forwardRef } from 'react'; // ✅ Import forwardRef correctly
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Edit2, 
  Calendar, 
  Tag, 
  Clock, 
  Folder, 
  ChevronDown, 
  ChevronUp, 
  Repeat
} from 'lucide-react';
import { formatDate, getPriorityColor } from '../../utils/helpers'; 
import StatusBadge from './StatusBadge';
import { InlineSuccessCheck } from '../common/SuccessAnimation';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';
import { fadeInUp } from '../../utils/animations';
import { TooltipIconButton } from '../common/Tooltip';   

// Helper for project color style
const getProjectColorStyle = (color) => {
  return color && color.match(/^#[0-9A-F]{6}$/i)
    ? { backgroundColor: color, color: '#ffffff' }
    : { backgroundColor: '#3B82F6', color: '#ffffff' }; 
};

// ✅ Wrap the entire component in forwardRef
// ✅ (props, ref) must be the arguments
const TaskItem = forwardRef(({ 
  task, 
  onUpdateStatus, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelectTask 
}, ref) => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStatusClick = async () => {
    const nextStatusMap = {
      pending: "in-progress",
      "in-progress": "completed",
      completed: "archived",
      archived: "pending",
    };
    const nextStatus = nextStatusMap[task.taskStatus] || "pending";
    
    if (nextStatus === 'completed') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
    
    await onUpdateStatus(task._id, nextStatus);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(async () => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await onDelete(task._id);
      } else {
        setIsDeleting(false);
      }
    }, 400);
  };

  const priorityColor = getPriorityColor(task.priority);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.taskStatus !== "completed";
  const isProcessing = isDeleting || task.isUpdating;
  const project = task.project;

  return (
    <motion.div
      ref={ref} // ✅ Ref is now correctly received and attached
      layout
      variants={fadeInUp}
      initial="hidden"
      animate={isDeleting ? "shake" : "visible"}
      exit="exit"
      whileHover={{ y: -2 }}
      className={darkClass(
        cardClasses,
        "relative rounded-xl shadow-sm border-l-4 transition-all duration-200 border border-gray-200 dark:border-dark-border mb-3",
        task.taskStatus === "completed" ? 'opacity-70' : 'opacity-100',
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      )}
      style={{ borderLeftColor: priorityColor.includes('#') ? priorityColor : undefined }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Left: Checkbox */}
          <div className="flex flex-col items-center gap-3 mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectTask(task._id)}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge
                status={task.taskStatus}
                onClick={handleStatusClick}
                disabled={isProcessing}
              />
              <motion.h3
                layout
                className={darkClass(
                  "text-base font-bold break-words transition-colors",
                  task.taskStatus === "completed"
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : textClasses
                )}
              >
                {task.title}
                {showSuccess && <InlineSuccessCheck />}
              </motion.h3>

              {(task.description || task.subtasks?.length > 0) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              )}
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {task.description && (
                    <p className={darkClass("mt-2 text-sm break-words", subtextClasses)}>
                      {task.description}
                    </p>
                  )}
                  {task.subtasks?.length > 0 && (
                    <div className="mt-3 space-y-2 pl-2 border-l-2 border-gray-100 dark:border-gray-700">
                      {task.subtasks.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${sub.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={sub.completed ? 'line-through text-gray-400' : textClasses}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Meta Info */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm"
                  style={getProjectColorStyle(project.color)}
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {project.name.toUpperCase()}
                </span>
              )}
              {task.recurring?.enabled && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  <Repeat className="w-3 h-3 mr-1" />
                  {task.recurring.frequency.toUpperCase()}
                </span>
              )}
              {task.dueDate && (
                <span className={darkClass(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border",
                  isOverdue 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800' 
                    : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-slate-700'
                )}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(task.dueDate)}
                </span>
              )}
              {task.tags?.map((tag, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-center gap-1 ml-2">
            <TooltipIconButton
              icon={Edit2}
              tooltip="Edit task"
              onClick={() => onEdit(task)}
              variant="default"
              disabled={isProcessing}
            />
            <TooltipIconButton
              icon={isDeleting ? Clock : Trash2}
              tooltip="Delete task"
              onClick={handleDelete}
              variant="danger"
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ✅ Added DisplayName for easier debugging
TaskItem.displayName = 'TaskItem';

export default TaskItem;