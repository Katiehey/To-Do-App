import { useState } from 'react';
import { Repeat, ChevronDown, ChevronRight, Calendar, Info, Edit2, CheckCircle } from 'lucide-react';
import RecurringBadge from './RecurringBadge';
import { formatDate } from '../../utils/helpers';

const RecurringTasksList = ({ tasks, onEdit, onToggle }) => {
  const [expandedTasks, setExpandedTasks] = useState({});

  const recurringTasks = tasks.filter(t => t.recurring?.enabled);

  if (recurringTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Repeat className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No recurring tasks found</p>
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
            className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
              isExpanded ? 'shadow-md border-blue-200' : 'shadow-sm border-gray-200'
            }`}
          >
            {/* Main Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleExpand(task._id)}
                  className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-semibold truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <RecurringBadge recurring={task.recurring} size="sm" />
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-500">
                    {task.dueDate && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {formatDate(task.dueDate)}
                      </span>
                    )}
                    {nextOccurrence && (
                      <span className="flex items-center text-blue-600 font-medium">
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
                  className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isCompleted 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {isCompleted ? 'Reopen' : 'Complete'}
                </button>
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Details Section */}
            {isExpanded && (
              <div className="px-11 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      <Info className="w-3 h-3 mr-1" /> Recurring Pattern
                    </h4>
                    <p className="text-sm text-gray-700">
                      Repeats <span className="font-semibold text-blue-700">
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
                      <p className="text-xs text-gray-500">
                        Ending on {formatDate(task.recurring.endDate)}
                      </p>
                    )}
                  </div>

                  {task.description && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 italic">"{task.description}"</p>
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