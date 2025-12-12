const asyncHandler = require('../middleware/asyncHandler');
const { Task, Project } = require('../models');

/**
 * @desc    Get all tasks for logged-in user
 * @route   GET /api/tasks
 * @access  Private
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

  // Build query
  const query = { user: req.user._id };

  // Filters
  if (taskStatus) {
    query.taskStatus = taskStatus;
  }
  if (priority) {
    query.priority = priority;
  }
  if (project) {
    query.project = project;
  }
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

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Sort
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
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
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project', 'name color');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({ success: true, data: { task } });
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const taskData = {
    ...req.body,
    user: req.user._id,
    taskStatus: req.body.taskStatus || 'pending',
  };

  if (taskData.project) {
    const project = await Project.findById(taskData.project);
    if (!project || project.user.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Invalid project');
    }
  }

  const task = await Task.create(taskData);
  await task.populate('project', 'name color');

  if (task.project) {
    await Project.findByIdAndUpdate(task.project, { $inc: { taskCount: 1 } });
  }

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('project', 'name color');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  if (task.project) {
    await Project.findByIdAndUpdate(task.project, { $inc: { taskCount: -1 } });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});

/**
 * @desc    Toggle task completion (completed <-> pending)
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private
 */
const toggleTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  task.taskStatus = task.taskStatus === 'completed' ? 'pending' : 'completed';
  await task.save();
  await task.populate('project', 'name color');

  res.status(200).json({
    success: true,
    message: `Task marked as ${task.taskStatus}`,
    data: { task },
  });
});

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$taskStatus',
        count: { $sum: 1 },
      },
    },
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

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats,
};
