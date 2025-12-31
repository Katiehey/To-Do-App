import { useState, useMemo, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US'; // ✅ Standardized Import
import { Repeat } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Custom Event Component to show Recurring Icon
const CalendarEvent = ({ event }) => (
  <div className="flex items-center justify-between overflow-hidden">
    <span className="truncate">{event.title}</span>
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
    const isCompleted = task.taskStatus === 'completed'; // ✅ Matches backend
    
    // Priority Hex Map
    const priorityMap = {
      high: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
      medium: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
      low: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' }
    };

    const colors = priorityMap[task.priority] || priorityMap.medium;

    return {
      style: {
        backgroundColor: isCompleted ? '#F3F4F6' : colors.bg,
        color: isCompleted ? '#9CA3AF' : colors.text,
        borderLeft: `4px solid ${isCompleted ? '#D1D5DB' : colors.border}`,
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textDecoration: isCompleted ? 'line-through' : 'none',
        borderTop: 'none', borderRight: 'none', borderBottom: 'none'
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200" style={{ height: '700px' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={(e) => onSelectTask(e.resource)}
        onSelectSlot={(slot) => onSelectSlot(slot.start)}
        selectable
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent, // ✅ Show Repeat icon on events
          month: { dateHeader: ({ label }) => ( <span className="text-xs font-bold text-gray-700">{label}</span> ) }
        }}
        views={['month', 'week', 'day', 'agenda']}
        popup
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default TaskCalendar;