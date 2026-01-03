import { useState } from 'react';
import { Repeat, ChevronDown, ChevronRight, Calendar, Info, Edit2, CheckCircle } from 'lucide-react';
import RecurringBadge from './RecurringBadge';
import { formatDate } from '../../utils/helpers';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../../utils/darkMode';

const RecurringTasksList = ({ tasks, onEdit, onToggle }) => {
  const [expandedTasks, setExpandedTasks] = useState({});

  const recurringTasks = tasks.filter(t => t.recurring?.enabled);

  if (recurringTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 transition-colors">
        <Repeat className="w-12 h-12 text-gray-300 dark:text-slate-600 mb-3" />
        <p className={subtextClasses}>No recurring tasks found</p>
      </div>
    );
  }

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="space-y-4">
      {recurringTasks.map(task => {
        const isExpanded = expandedTasks[task._id];
        const isCompleted = task.taskStatus === 'completed';
        const nextOccurrence = task.recurring?.nextOccurrence;

        return (
          <div 
            key={task._id} 
            className={darkClass(cardClasses, `overflow-hidden transition-all duration-200 border ${
              isExpanded 
                ? 'shadow-md border-blue-200 dark:border-blue-900/50' 
                : 'shadow-sm border-gray-200 dark:border-slate-700'
            }`)}
          >
            {/* Main Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleExpand(task._id)}
                  className="mt-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-bold truncate ${isCompleted ? 'line-through text-gray-400' : darkClass('', textClasses)}`}>
                      {task.title}
                    </h3>
                    <RecurringBadge recurring={task.recurring} size="sm" />
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 mt-1 text-xs font-medium">
                    {task.dueDate && (
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {formatDate(task.dueDate)}
                      </span>
                    )}
                    {nextOccurrence && (
                      <span className="flex items-center text-blue-600 dark:text-blue-400">
                        <Repeat className="w-3 h-3 mr-1" />
                        Next: {formatDate(nextOccurrence)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onToggle(task._id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    isCompleted 
                      ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600' 
                      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {isCompleted ? 'Reopen' : 'Complete'}
                </button>
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Details Section */}
            {isExpanded && (
              <div className="px-11 pb-4 pt-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center">
                      <Info className="w-3 h-3 mr-1" /> Recurring Pattern
                    </h4>
                    <p className={darkClass("text-sm", textClasses)}>
                      Repeats <span className="font-bold text-blue-600 dark:text-blue-400">
                        {task.recurring.interval === 1
                          ? task.recurring.frequency.charAt(0).toUpperCase() + task.recurring.frequency.slice(1)
                          : `Every ${task.recurring.interval} ${
                              task.recurring.frequency === 'daily' ? 'days' :
                              task.recurring.frequency === 'weekly' ? 'weeks' :
                              task.recurring.frequency === 'monthly' ? 'months' : 'years'
                            }`}
                      </span>
                    </p>
                    {task.recurring.endDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Ends {formatDate(task.recurring.endDate)}
                      </p>
                    )}
                  </div>

                  {task.description && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Description</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">"{task.description}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecurringTasksList;