const asyncHandler = require('../middleware/asyncHandler');
const { Task, Project } = require('../models');
const { shouldGenerateNextOccurrence, createNextOccurrence } = require('../utils/recurringTasks');

/**
 * @desc    Get all tasks for logged-in user
 */
const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    taskStatus,
    priority,
    project,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = { user: req.user._id };

  if (taskStatus) query.taskStatus = taskStatus;
  if (priority) query.priority = priority;
  if (project) query.project = project;
  
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query.tags = { $in: tagArray };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const tasks = await Task.find(query)
    .populate('project', 'name color')
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip);

  const totalTasks = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total: totalTasks,
    page: parseInt(page),
    pages: Math.ceil(totalTasks / parseInt(limit)),
    data: { tasks },
  });
});

/**
 * @desc    Get single task by ID
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project', 'name color');

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found or unauthorized');
  }

  res.status(200).json({ success: true, data: { task } });
});

/**
 * @desc    Create new task
 */
const createTask = asyncHandler(async (req, res) => {
  const taskData = {
    ...req.body,
    user: req.user._id,
    taskStatus: req.body.taskStatus || 'pending',
  };

  if (!taskData.project) {
    const defaultProject = await Project.findOne({ user: req.user._id, isDefault: true });
    if (defaultProject) taskData.project = defaultProject._id;
  }

  const task = await Task.create(taskData);
  await task.populate('project', 'name color');

  if (task.project) {
    const updateData = { $inc: { taskCount: 1 } };
    if (task.taskStatus === 'completed') {
      updateData.$inc.completedTaskCount = 1;
    }
    await Project.findByIdAndUpdate(task.project, updateData);
  }

  res.status(201).json({ success: true, message: 'Task created', data: { task } });
});

/**
 * @desc    Update task
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found or unauthorized');
  }

  const wasCompleted = task.taskStatus === 'completed';
  const newStatus = req.body.taskStatus || task.taskStatus;
  const isNowCompleted = newStatus === 'completed';

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('project', 'name color');

  if (task.project && wasCompleted !== isNowCompleted) {
    const increment = isNowCompleted ? 1 : -1;
    await Project.findByIdAndUpdate(task.project, {
      $inc: { completedTaskCount: increment },
    });
  }

  if (!wasCompleted && isNowCompleted && shouldGenerateNextOccurrence(task)) {
    const nextTask = await createNextOccurrence(Task, task);
    if (nextTask) {
      await nextTask.populate('project', 'name color');
      return res.status(200).json({
        success: true,
        message: 'Task completed and next occurrence created',
        data: { task, nextTask },
      });
    }
  }

  res.status(200).json({ success: true, message: 'Task updated', data: { task } });
});

/**
 * @desc    Delete task
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found or unauthorized');
  }

  if (task.project) {
    const decData = { $inc: { taskCount: -1 } };
    if (task.taskStatus === 'completed') decData.$inc.completedTaskCount = -1;
    await Project.findByIdAndUpdate(task.project, decData);
  }

  await task.deleteOne();
  res.status(200).json({ success: true, message: 'Task deleted' });
});

/**
 * @desc    Toggle task completion
 */
const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found');
  }

  const wasCompleted = task.taskStatus === 'completed';
  
  if (wasCompleted) {
    task.taskStatus = 'pending';
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, { $inc: { completedTaskCount: -1 } });
    }
  } else {
    task.taskStatus = 'completed';
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, { $inc: { completedTaskCount: 1 } });
    }
  }

  await task.save();
  await task.populate('project', 'name color');

  let nextTask = null;
  if (!wasCompleted && task.taskStatus === 'completed' && shouldGenerateNextOccurrence(task)) {
    nextTask = await createNextOccurrence(Task, task);
    if (nextTask) await nextTask.populate('project', 'name color');
  }

  res.status(200).json({
    success: true,
    message: `Task marked as ${task.taskStatus}${nextTask ? ' and next occurrence created' : ''}`,
    data: { task, nextTask },
  });
});

/**
 * @desc    Get task statistics
 */
const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$taskStatus', count: { $sum: 1 } } },
  ]);

  const overall = stats.reduce(
    (acc, s) => {
      acc.total += s.count;
      acc[s._id] = s.count;
      return acc;
    },
    { total: 0, pending: 0, 'in-progress': 0, completed: 0, archived: 0 }
  );

  res.status(200).json({
    success: true,
    data: { stats: { overall: [overall], byStatus: stats } },
  });
});

/**
 * @desc    Get recurring tasks
 */
const getRecurringTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user._id,
    'recurring.enabled': true,
  })
    .populate('project', 'name color')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: { tasks },
  });
});

/**
 * @desc    Manually trigger next occurrence creation
 */
const createNextOccurrenceManually = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found or unauthorized');
  }

  if (!task.recurring || !task.recurring.enabled) {
    res.status(400);
    throw new Error('Task is not a recurring task');
  }

  const nextTask = await createNextOccurrence(Task, task);
  if (!nextTask) {
    res.status(400);
    throw new Error('Cannot create next occurrence (limit reached or already exists)');
  }

  await nextTask.populate('project', 'name color');

  res.status(201).json({
    success: true,
    message: 'Next occurrence created successfully',
    data: { task: nextTask },
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
  getRecurringTasks,
  createNextOccurrenceManually,
};