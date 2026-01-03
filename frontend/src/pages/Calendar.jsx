import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCalendar from '../components/calendar/Calendar';
import DayViewModal from '../components/calendar/DayViewModal';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { useProject } from '../context/ProjectContext';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';

const CalendarPage = () => {
  const { tasks, fetchTasks, createTask, updateTask } = useTask();
  const { projects } = useProject();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSelectTask = (task) => { setSelectedTask(task); setIsTaskModalOpen(true); setIsDayModalOpen(false); };
  const handleSelectSlot = (date) => { setSelectedDate(date); setIsDayModalOpen(true); };
  
  const handleTaskSubmit = async (taskData) => {
    const finalData = { ...taskData, dueDate: taskData.dueDate || (selectedDate?.toISOString() || null) };
    const result = selectedTask ? await updateTask(selectedTask._id, finalData) : await createTask(finalData);
    if (result.success) { await fetchTasks(); setIsTaskModalOpen(false); }
    return result;
  };

  const stats = [
    { label: 'This Month', icon: Calendar, color: 'text-blue-500', count: tasks.filter(t => t.dueDate && new Date(t.dueDate).getMonth() === new Date().getMonth()).length },
    { label: 'This Week', icon: Clock, color: 'text-purple-500', count: tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate); const now = new Date();
      return d >= new Date(now.setDate(now.getDate() - now.getDay())) && d <= new Date(now.setDate(now.getDate() - now.getDay() + 6));
    }).length },
    { label: 'Today', icon: CheckCircle, color: 'text-green-500', count: tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length },
    { label: 'Overdue', icon: AlertCircle, color: 'text-red-500', count: tasks.filter(t => t.dueDate && t.taskStatus !== 'completed' && new Date(t.dueDate) < new Date()).length },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen transition-colors duration-300">
      <div className="mb-6">
        <h1 className={darkClass("text-3xl font-bold", textClasses)}>Task Calendar</h1>
        <p className={subtextClasses}>View and manage your schedule at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={darkClass(cardClasses, "p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border")}>
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</span>
            </div>
            <p className={darkClass("text-2xl font-bold", s.label === 'Overdue' ? 'text-red-600' : textClasses)}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className={darkClass(cardClasses, "p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border mb-6 flex flex-wrap items-center justify-between gap-4")}>
        <div className="flex items-center space-x-6 text-[11px] font-bold">
          <span className="text-gray-400 uppercase tracking-widest">Priority Key:</span>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2" /> <span className={subtextClasses}>High</span></div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2" /> <span className={subtextClasses}>Medium</span></div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2" /> <span className={subtextClasses}>Low</span></div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-400 mr-2" /> <span className={subtextClasses}>Completed</span></div>
        </div>
      </div>

      <div className={darkClass(cardClasses, "rounded-2xl shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden transition-colors")}>
        <TaskCalendar tasks={tasks} onSelectTask={handleSelectTask} onSelectSlot={handleSelectSlot} />
      </div>

      <DayViewModal date={selectedDate || new Date()} tasks={tasks} isOpen={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} onCreateTask={(d) => { setSelectedDate(d); setSelectedTask(null); setIsDayModalOpen(false); setIsTaskModalOpen(true); }} onSelectTask={handleSelectTask} />
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }} onSubmit={handleTaskSubmit} initialTask={selectedTask} projects={projects} defaultDate={selectedDate} />
    </div>
  );
};

export default CalendarPage;