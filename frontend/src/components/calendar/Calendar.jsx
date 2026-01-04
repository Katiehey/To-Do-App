import { useState, useMemo, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Repeat } from 'lucide-react';
import { cardClasses, darkClass } from '../../utils/darkMode';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarEvent = ({ event }) => (
  <div className="flex items-center justify-between overflow-hidden px-1">
    <span className="truncate text-[10px] sm:text-xs font-bold">{event.title}</span>
    {event.resource?.recurring?.enabled && (
      <Repeat className="w-3 h-3 ml-1 flex-shrink-0 opacity-80" />
    )}
  </div>
);

const TaskCalendar = ({ tasks, onSelectTask, onSelectSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const events = useMemo(() => tasks
    .filter(t => t.dueDate)
    .map(t => ({
      id: t._id,
      title: t.title,
      start: new Date(t.dueDate),
      end: new Date(t.dueDate),
      resource: t,
    })), [tasks]);

  const eventStyleGetter = useCallback((event) => {
    const task = event.resource;
    const isCompleted = task.taskStatus === 'completed';
    
    // Updated Priority Hex Map for better contrast in both modes
    const priorityMap = {
      high: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', darkBg: '#450a0a', darkText: '#fecaca' },
      medium: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', darkBg: '#451a03', darkText: '#fef3c7' },
      low: { bg: '#D1FAE5', border: '#10B981', text: '#065F46', darkBg: '#022c22', darkText: '#d1fae5' }
    };

    const colors = priorityMap[task.priority] || priorityMap.medium;
    const isDarkMode = document.documentElement.classList.contains('dark');

    return {
      style: {
        backgroundColor: isCompleted 
          ? (isDarkMode ? '#334155' : '#F3F4F6') 
          : (isDarkMode ? colors.darkBg : colors.bg),
        color: isCompleted 
          ? '#9CA3AF' 
          : (isDarkMode ? colors.darkText : colors.text),
        borderLeft: `4px solid ${isCompleted ? '#D1D5DB' : colors.border}`,
        borderRadius: '4px',
        textDecoration: isCompleted ? 'line-through' : 'none',
        borderTop: 'none', borderRight: 'none', borderBottom: 'none'
      }
    };
  }, []);

  return (
    <div className={darkClass(cardClasses, "p-4 rounded-xl shadow-sm transition-colors duration-300")} style={{ height: '700px' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={(e) => onSelectTask(e.resource)}
        onSelectSlot={(slot) => onSelectSlot(slot.start)}
        selectable={true}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
          month: { 
            dateHeader: ({ label }) => ( 
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span> 
            ) 
          }
        }}
        views={['month', 'week', 'day', 'agenda']}
        popup
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default TaskCalendar;