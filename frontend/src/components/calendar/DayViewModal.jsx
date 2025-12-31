import { X, Plus, Calendar as CalendarIcon, Folder, Tag, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import RecurringBadge from '../tasks/RecurringBadge';
import { getPriorityColor } from '../../utils/helpers';

const DayViewModal = ({ date, tasks, isOpen, onClose, onCreateTask, onSelectTask }) => {
  if (!isOpen || !date) return null;

  const dayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).toDateString() === date.toDateString();
  });

  const completedCount = dayTasks.filter(t => t.taskStatus === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{format(date, 'EEEE, MMM d')}</h2>
            <p className="text-sm text-gray-500 font-medium">
              {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'} • {completedCount} completed
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tasks List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {dayTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-gray-500 mb-6">No tasks scheduled for this day</p>
              <button
                onClick={() => onCreateTask(date)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm"
              >
                <Plus className="w-4 h-4" /> <span>Add Task</span>
              </button>
            </div>
          ) : (
            dayTasks.map(task => {
              const isComp = task.taskStatus === 'completed';
              return (
                <div
                  key={task._id}
                  onClick={() => onSelectTask(task)}
                  className={`group relative p-4 rounded-xl border-2 transition cursor-pointer ${
                    isComp ? 'border-gray-100 bg-gray-50/50' : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-gray-800 ${isComp ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                    {isComp && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>

                  {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.recurring?.enabled && <RecurringBadge recurring={task.recurring} size="sm" />}
                    {task.project && (
                      <span className="flex items-center text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        <Folder className="w-3 h-3 mr-1" /> {task.project.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {dayTasks.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <button
              onClick={() => onCreateTask(date)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayViewModal;