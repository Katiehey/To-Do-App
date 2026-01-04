import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import {
  requestNotificationPermission,
  areNotificationsEnabled,
  showTaskReminder,
  showOverdueNotification,
  showUpcomingNotification,
  checkTaskReminders,
} from '../services/notificationService';
import { useTask } from './TaskContext'; // 👈 import tasks from TaskContext
import { useTheme } from './ThemeContext';
import { darkClass, cardClasses, textClasses } from '../utils/darkMode';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notifiedTasks = useRef(new Set()); 
  const { tasks } = useTask(); // 👈 get tasks from TaskContext

  const [preferences, setPreferences] = useState({
    enabled: true,
    dueSoon: true,
    overdue: true,
    reminders: true,
    checkInterval: 1, // minutes
  });

  useEffect(() => {
    setNotificationsEnabled(areNotificationsEnabled());
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) setPreferences(JSON.parse(saved));
  }, []);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  };

  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
  };

  const checkAndNotify = useCallback((tasks) => {
    console.log("Checking tasks:", tasks);
    if (!notificationsEnabled || !preferences.enabled) return;

    const reminders = checkTaskReminders(tasks);

    console.log("Reminders found:", reminders);

    reminders.forEach(({ type, task, minutesUntilDue }) => {
      const notificationKey = `${task._id}-${type}`;
      if (notifiedTasks.current.has(notificationKey)) return;

      switch (type) {
        case 'overdue':
          if (preferences.overdue) {
            console.log("🚀 Triggering due-soon notification for:", task.title);
            showOverdueNotification([task]);
            notifiedTasks.current.add(notificationKey);
          }
          break;
        case 'due-soon':
          if (preferences.dueSoon) {
            console.log("🚀 Triggering due-soon notification for:", task.title);
            showUpcomingNotification(task, minutesUntilDue);
            notifiedTasks.current.add(notificationKey);
          }
          break;
        case 'reminder':
          if (preferences.reminders) {
            console.log("🚀 Triggering due-soon notification for:", task.title);
            showTaskReminder(task);
            notifiedTasks.current.add(notificationKey);
          }
          break;
        default:
          break;
      }
    });
  }, [notificationsEnabled, preferences]);

  // 👇 This is the heartbeat interval
  useEffect(() => {
    if (!notificationsEnabled) return;
    const interval = setInterval(() => {
      checkAndNotify(tasks);
    }, preferences.checkInterval * 60 * 1000); // every X minutes
    return () => clearInterval(interval);
  }, [notificationsEnabled, preferences, tasks, checkAndNotify]);

  const toastStyles = darkClass(
    "fixed top-4 right-4 p-4 rounded-lg shadow-xl border", 
    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"
  );

  const value = {
    notificationsEnabled,
    preferences,
    enableNotifications,
    updatePreferences,
    checkAndNotify,
    isDarkMode
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
