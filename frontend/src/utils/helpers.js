// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-green-600 bg-green-100',
  };
  return colors[priority] || colors.low;
};

// Get priority badge
export const getPriorityBadge = (priority) => {
  const badges = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
  };
  return badges[priority] || badges.low;
};


// src/utils/helpers.js

export const truncateText = (text, limit) => {
  if (!text) return '';
  return text.length > limit ? text.substring(0, limit).trim() + '...' : text;
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

export const getCompletionPercentage = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed' || t.taskStatus === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const sortByPriority = (tasks) => {
  const weights = { high: 3, medium: 2, low: 1 };
  return [...tasks].sort((a, b) => weights[b.priority] - weights[a.priority]);
};

export const groupByProject = (tasks) => {
  return tasks.reduce((acc, task) => {
    const key = task.projectId || 'unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});
};