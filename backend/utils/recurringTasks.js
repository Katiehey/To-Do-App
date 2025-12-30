/**
 * Calculate next occurrence date based on frequency
 */
const calculateNextOccurrence = (currentDate, frequency, interval = 1) => {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (7 * interval));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + interval);
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return date;
};

/**
 * Check if a recurring task should generate next occurrence
 */
const shouldGenerateNextOccurrence = (task) => {
  if (!task.recurring || !task.recurring.enabled) return false;

  // Only generate if task is completed
  if (task.taskStatus !== 'completed') return false;

  // End date check
  if (task.recurring.endDate && new Date(task.dueDate) >= new Date(task.recurring.endDate)) {
    return false;
  }

  // If next occurrence is already scheduled in the future
  //if (task.recurring.nextOccurrence && new Date() < new Date(task.recurring.nextOccurrence)) {
    //return false;
  //}

  return true;
};

/**
 * Create next occurrence of a recurring task
 */
const createNextOccurrence = async (Task, originalTask) => {
  const nextDate = calculateNextOccurrence(
    originalTask.dueDate || new Date(),
    originalTask.recurring.frequency,
    originalTask.recurring.interval || 1
  );

  // End date check
  if (originalTask.recurring.endDate && nextDate > new Date(originalTask.recurring.endDate)) {
    return null;
  }

  // Clone recurring object
  const recurring = { ...originalTask.recurring, nextOccurrence: nextDate };

  const newTaskData = {
    title: originalTask.title,
    description: originalTask.description,
    priority: originalTask.priority,
    taskStatus: 'pending', // ✅ use taskStatus
    dueDate: nextDate,
    reminderDate: originalTask.reminderDate
      ? calculateNextOccurrence(
          originalTask.reminderDate,
          originalTask.recurring.frequency,
          originalTask.recurring.interval || 1
        )
      : null,
    tags: originalTask.tags,
    project: originalTask.project,
    user: originalTask.user,
    recurring: { ...originalTask.recurring, nextOccurrence: nextDate },
    completed: false, // optional, depending on schema
    subtasks: originalTask.subtasks.map((st) => ({
      title: st.title,
      completed: false,
    })),
  };

  const newTask = await Task.create(newTaskData);

  // Update original task's next occurrence
  originalTask.recurring.nextOccurrence = nextDate;
  await originalTask.save();

  return newTask;
};

/**
 * Get recurring task pattern description
 */
const getRecurringDescription = (recurring) => {
  if (!recurring || !recurring.enabled) return null;

  const interval = recurring.interval || 1;
  const frequency = recurring.frequency;

  let description = '';

  if (interval === 1) {
    description =
      frequency === 'daily'
        ? 'Daily'
        : frequency === 'weekly'
        ? 'Weekly'
        : frequency === 'monthly'
        ? 'Monthly'
        : frequency === 'yearly'
        ? 'Yearly'
        : '';
  } else {
    description = `Every ${interval} ${
      frequency === 'daily'
        ? 'days'
        : frequency === 'weekly'
        ? 'weeks'
        : frequency === 'monthly'
        ? 'months'
        : frequency === 'yearly'
        ? 'years'
        : ''
    }`;
  }

  if (recurring.endDate) {
    const endDate = new Date(recurring.endDate).toLocaleDateString();
    description += ` until ${endDate}`;
  }

  return description;
};

module.exports = {
  calculateNextOccurrence,
  shouldGenerateNextOccurrence,
  createNextOccurrence,
  getRecurringDescription,
};
