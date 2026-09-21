const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  shouldGenerateNextOccurrence,
  createNextOccurrence,
} = require('../utils/recurringTasks');

const makeRecurringTask = (overrides = {}) => ({
  title: 'Weekly outreach',
  description: 'Follow up',
  priority: 'medium',
  taskStatus: 'completed',
  dueDate: new Date('2026-09-22T09:00:00Z'),
  reminderDate: null,
  tags: [],
  project: null,
  user: 'user-1',
  subtasks: [],
  recurring: {
    enabled: true,
    frequency: 'weekly',
    interval: 1,
    endDate: null,
    nextOccurrence: null,
  },
  async save() {},
  ...overrides,
});

test('does not generate a second successor for a completed occurrence', () => {
  const task = makeRecurringTask({
    recurring: {
      enabled: true,
      frequency: 'weekly',
      interval: 1,
      nextOccurrence: new Date('2026-09-29T09:00:00Z'),
    },
  });

  assert.equal(shouldGenerateNextOccurrence(task), false);
});

test('creates one successor and leaves it ready for its own future successor', async () => {
  const originalTask = makeRecurringTask();
  let createdTask;
  const Task = {
    async create(data) {
      createdTask = { ...data, async populate() {} };
      return createdTask;
    },
  };

  const nextTask = await createNextOccurrence(Task, originalTask);

  assert.equal(nextTask, createdTask);
  assert.equal(createdTask.dueDate.toISOString(), '2026-09-29T09:00:00.000Z');
  assert.equal(createdTask.recurring.nextOccurrence, null);
  assert.equal(originalTask.recurring.nextOccurrence.toISOString(), '2026-09-29T09:00:00.000Z');
  assert.equal(shouldGenerateNextOccurrence(originalTask), false);
  assert.equal(
    shouldGenerateNextOccurrence({ ...createdTask, taskStatus: 'completed' }),
    true
  );
});
