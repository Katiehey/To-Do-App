import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCalendar from '../components/calendar/Calendar';
import DayViewModal from '../components/calendar/DayViewModal';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { useProject } from '../context/ProjectContext';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'; // Added icons for stats

const CalendarPage = () => {
  const { tasks, fetchTasks, createTask, updateTask } = useTask();
  const { projects } = useProject();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Handlers ---
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
    setIsDayModalOpen(false);
  };

  const handleSelectSlot = (date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const handleCreateTaskFromDay = (date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsDayModalOpen(false);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    const finalData = {
      ...taskData,
      dueDate: taskData.dueDate || (selectedDate ? selectedDate.toISOString() : null)
    };
    const result = selectedTask ? await updateTask(selectedTask._id, finalData) : await createTask(finalData);
    if (result.success) {
      await fetchTasks();
      handleCloseTaskModal();
    }
    return result;
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Calendar</h1>
        <p className="text-gray-500">View and manage your schedule at a glance.</p>
      </div>

      {/* ✅ Stats Section Added */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tasks.filter(t => {
              if (!t.dueDate) return false;
              const d = new Date(t.dueDate);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">This Week</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tasks.filter(t => {
              if (!t.dueDate) return false;
              const date = new Date(t.dueDate);
              const now = new Date();
              const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
              const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
              return date >= weekStart && date <= weekEnd;
            }).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {tasks.filter(t => {
              if (!t.dueDate || t.taskStatus === 'completed') return false;
              return new Date(t.dueDate) < new Date();
            }).length}
          </p>
        </div>
      </div>

      {/* Legend & Info */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6 text-sm font-medium">
          <span className="text-gray-400 uppercase text-[10px] tracking-widest">Priority Key:</span>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2" /> High</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2" /> Medium</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2" /> Low</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-300 mr-2" /> Completed</div>
        </div>
        <p className="text-xs text-gray-400 italic">Tip: Click a date to see all tasks for that day.</p>
      </div>

      {/* Main Calendar Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <TaskCalendar tasks={tasks} onSelectTask={handleSelectTask} onSelectSlot={handleSelectSlot} />
      </div>

      {/* Modals */}
      <DayViewModal
        date={selectedDate || new Date()}
        tasks={tasks}
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        onCreateTask={handleCreateTaskFromDay}
        onSelectTask={handleSelectTask}
      />

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSubmit={handleTaskSubmit}
        initialTask={selectedTask}
        projects={projects}
        defaultDate={selectedDate} 
      />
    </div>
  );
};

export default CalendarPage;