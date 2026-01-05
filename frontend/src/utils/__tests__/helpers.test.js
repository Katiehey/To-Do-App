import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getPriorityColor,
  truncateText,
  isOverdue,
  getCompletionPercentage,
  sortByPriority,
  groupByProject
} from '../helpers'; // Adjust this path to where your actual helpers live

describe('Utility Helper Functions', () => {

  describe('Date Formatting', () => {
    it('formats date correctly', () => {
      const date = new Date('2026/01/15 12:00:00');
      // Note: Be mindful of timezone offsets; Jan 15 is the goal
      expect(formatDate(date)).toContain('Jan 15, 2026');
    });

    it('handles null or undefined dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('Color Helpers', () => {
    it('returns the correct color for priorities', () => {
      expect(getPriorityColor('high')).toContain('red'); // or your specific hex/class
      expect(getPriorityColor('low')).toContain('green');
    });

    it('returns a default color for unknown status', () => {
      expect(getPriorityColor('unknown')).toContain('green');
    });
  });

  describe('Text Utilities', () => {
    it('truncates long text correctly', () => {
      const longText = 'This is a very long task description that needs cutting';
      expect(truncateText(longText, 10)).toBe('This is a...');
    });

    it('does not truncate short text', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });
  });

  describe('Date Checks (isOverdue)', () => {
    it('identifies past dates as overdue', () => {
      const pastDate = new Date('2020-01-01');
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('identifies future dates as not overdue', () => {
      const futureDate = new Date('2099-01-01');
      expect(isOverdue(futureDate)).toBe(false);
    });
  });

  describe('Calculations', () => {
    it('calculates completion percentage correctly', () => {
      const tasks = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'todo' },
        { status: 'todo' },
      ];
      expect(getCompletionPercentage(tasks)).toBe(50);
    });

    it('returns 0 for empty task lists', () => {
      expect(getCompletionPercentage([])).toBe(0);
    });
  });

  describe('Sorting & Filtering', () => {
    it('sorts tasks by priority (High to Low)', () => {
      const tasks = [
        { priority: 'low' },
        { priority: 'high' },
        { priority: 'medium' }
      ];
      const sorted = sortByPriority(tasks);
      expect(sorted[0].priority).toBe('high');
      expect(sorted[2].priority).toBe('low');
    });
  });

  describe('Grouping', () => {
    it('groups tasks by project ID', () => {
      const tasks = [
        { title: 'T1', projectId: 'A' },
        { title: 'T2', projectId: 'B' },
        { title: 'T3', projectId: 'A' }
      ];
      const grouped = groupByProject(tasks);
      expect(grouped['A']).toHaveLength(2);
      expect(grouped['B']).toHaveLength(1);
    });
  });
});