import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import PageTransition from '../components/common/PageTransition';
import TaskCalendar from '../components/calendar/Calendar';
import DayViewModal from '../components/calendar/DayViewModal';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { Calendar as CalIcon } from 'lucide-react';
import { cardClasses, textClasses, subtextClasses, darkClass } from '../utils/darkMode';

const CalendarPage = () => {
  const { tasks, fetchTasks, createTask, updateTask } = useTask();
  const { projects } = useProject();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Handle clicking a task to edit it
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsDayModalOpen(false); // Close day view if open
    setIsTaskModalOpen(true);
  };

  // Handle clicking an empty slot to add a task
  const handleSelectSlot = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsDayModalOpen(true); // Open day view first
  };

  // Handler for "Add Task" button inside the DayViewModal
  const handleAddNewFromDay = () => {
    setSelectedTask(null);
    setIsDayModalOpen(false);
    setIsTaskModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className={darkClass("text-3xl font-bold flex items-center gap-2", textClasses)}>
              <CalIcon className="text-blue-600" /> Task Calendar
            </h1>
            <p className={subtextClasses}>View and manage your schedule at a glance.</p>
          </div>

          {/* RESTORED PRIORITY LEGEND */}
          <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
            {[
              { label: 'High', color: 'bg-red-500' },
              { label: 'Medium', color: 'bg-amber-500' },
              { label: 'Low', color: 'bg-emerald-500' }
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${p.color}`} />
                <span className={darkClass("text-[10px] font-bold uppercase", textClasses)}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={darkClass(cardClasses, "rounded-2xl shadow-lg border dark:border-dark-border overflow-hidden")}>
          <TaskCalendar 
            tasks={tasks} 
            onSelectTask={handleSelectTask} 
            onSelectSlot={handleSelectSlot} 
          />
        </div>

        <DayViewModal 
          date={selectedDate || new Date()} 
          tasks={tasks} 
          isOpen={isDayModalOpen} 
          onClose={() => setIsDayModalOpen(false)} 
          onSelectTask={handleSelectTask}
          onCreateTask={handleAddNewFromDay} 
        />

        <AddTaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }} 
          onSubmit={selectedTask ? updateTask : createTask} 
          initialTask={selectedTask}
          defaultDate={selectedDate}
        />
      </div>
    </PageTransition>
  );
};

export default CalendarPage;