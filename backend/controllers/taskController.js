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
    completed,
    priority,
    status,
    project,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = { user: req.user._id };

  // Filters
  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  if (priority) {
    query.priority = priority;
  }

  if (status) {
    query.status = status;
  }

  if (project) {
    query.project = project;
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query.tags = { $in: tagArray };
  }

  // Search in title and description
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

  // Get total count for pagination
  const totalTasks = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total: totalTasks,
    page: parseInt(page),
    pages: Math.ceil(totalTasks / parseInt(limit)),
    data: {
      tasks,
    },
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

  // Check if task belongs to user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
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
  };

  // Validate project belongs to user if provided
  if (taskData.project) {
    const project = await Project.findById(taskData.project);
    if (!project || project.user.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Invalid project');
    }
  }

  const task = await Task.create(taskData);
  
  // Populate project details
  await task.populate('project', 'name color');

  // Update project task count
  if (task.project) {
    await Project.findByIdAndUpdate(task.project, {
      $inc: { taskCount: 1 },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task,
    },
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

  // Check if task belongs to user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Track if completion status changed
  const wasCompleted = task.completed;
  const isCompleted = req.body.completed !== undefined ? req.body.completed : task.completed;

  // Update task
  task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('project', 'name color');

  // Update project completion count if needed
  if (task.project && wasCompleted !== isCompleted) {
    const increment = isCompleted ? 1 : -1;
    await Project.findByIdAndUpdate(task.project, {
      $inc: { completedTaskCount: increment },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task,
    },
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

  // Check if task belongs to user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  // Update project task counts
  if (task.project) {
    const decrement = { taskCount: -1 };
    if (task.completed) {
      decrement.completedTaskCount = -1;
    }
    await Project.findByIdAndUpdate(task.project, {
      $inc: decrement,
    });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});

/**
 * @desc    Toggle task completion
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private
 */
const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if task belongs to user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Toggle completion
  if (task.completed) {
    await task.markIncomplete();
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, {
        $inc: { completedTaskCount: -1 },
      });
    }
  } else {
    await task.markCompleted();
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, {
        $inc: { completedTaskCount: 1 },
      });
    }
  }

  await task.populate('project', 'name color');

  res.status(200).json({
    success: true,
    message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
    data: {
      task,
    },
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
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        byPriority: [
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 },
            },
          },
        ],
        overall: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: { $cond: ['$completed', 1, 0] },
              },
              pending: {
                $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] },
              },
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: stats[0],
    },
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
};