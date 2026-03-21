/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  if (!window.isSecureContext) {
    console.warn('Notifications require a secure context (HTTPS or localhost)');
    return false;
  }
  if (Notification.permission === 'granted') return true;

  try {
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return false;
  }
};

export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Subscribe the current browser to Web Push and send the subscription to the backend.
 * Returns true on success.
 */
export const subscribeToPush = async (apiInstance) => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    const registration = await navigator.serviceWorker.ready;
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.warn('VITE_VAPID_PUBLIC_KEY is not set');
      return false;
    }

    // Convert base64 VAPID public key to Uint8Array
    const keyBytes = Uint8Array.from(
      atob(vapidKey.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyBytes,
    });

    await apiInstance.post('/push/subscribe', subscription.toJSON());
    return true;
  } catch (err) {
    console.warn('Push subscription failed:', err);
    return false;
  }
};

/**
 * Unsubscribe the current browser from Web Push.
 */
export const unsubscribeFromPush = async (apiInstance) => {
  try {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await apiInstance.delete('/push/unsubscribe', { data: { endpoint: subscription.endpoint } });
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.warn('Push unsubscribe failed:', err);
  }
};

/**
 * Show browser notification
 */
export const showNotification = (title, options = {}) => {
  console.log("🔔 Creating Notification:", title, options);
  if (!areNotificationsEnabled()) return null;

  const defaultOptions = {
    icon: '/logo.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    silent: false,
    requireInteraction: false,
    ...options,
  };

  return new Notification(title, defaultOptions);
};

/**
 * Show task reminder notification
 */
export const showTaskReminder = (task) => {
  const options = {
    body: task.description || 'You have a task due soon!',
    tag: `task-${task._id}`,
    requireInteraction: true,
    data: { taskId: task._id },
  };

  const notification = showNotification(`📋 ${task.title}`, options);

  if (notification) {
    notification.onclick = () => {
      window.focus();
      window.location.href = `/tasks?id=${task._id}`;
      notification.close();
    };
  }
  return notification;
};

/**
 * Show overdue task notification
 */
export const showOverdueNotification = (tasks) => {
  tasks.forEach(task => {
    const options = {
      body: task.description || 'This task is overdue!',
      tag: `overdue-${task._id}`,
      requireInteraction: true,
      data: { taskId: task._id },
    };
    const notification = showNotification(`⚠️ Overdue: ${task.title}`, options);
    if (notification) {
      notification.onclick = () => {
        window.focus();
        window.location.href = `/tasks?id=${task._id}`;
        notification.close();
      };
    }
  });
};

/**
 * Show upcoming task notification
 */
export const showUpcomingNotification = (task, minutesUntilDue) => {
  const options = {
    body: `Due in ${minutesUntilDue} minutes`,
    tag: `upcoming-${task._id}`,
    requireInteraction: true,
    data: { taskId: task._id },
  };
  const notification = showNotification(`⏰ Upcoming: ${task.title}`, options);
  if (notification) {
    notification.onclick = () => {
      window.focus();
      window.location.href = `/tasks?id=${task._id}`;
      notification.close();
    };
  }
};

/**
 * Check for tasks needing reminders
 */
export const checkTaskReminders = (tasks) => {
  const now = new Date();
  const reminders = [];

  tasks.forEach(task => {
    if (!task) return;
    if (task.taskStatus === 'completed' || !task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    const diffInMinutes = Math.floor((dueDate - now) / 1000 / 60);

    // Overdue (less than a day overdue)
    if (diffInMinutes < 0 && diffInMinutes > -1440) {
      reminders.push({ type: 'overdue', task, minutesUntilDue: diffInMinutes });
    }
    // Due soon (within 30 minutes)
    else if (diffInMinutes > 0 && diffInMinutes <= 30) {
      reminders.push({ type: 'due-soon', task, minutesUntilDue: diffInMinutes });
    }
  });

  return reminders;
};
