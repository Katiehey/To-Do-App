const asyncHandler = require('../middleware/asyncHandler');
const { Project, Task } = require('../models');

/**
 * @desc    Get all projects for logged-in user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const { includeArchived = false } = req.query;

  const query = { user: req.user._id };
  
  if (!includeArchived || includeArchived === 'false') {
    query.isArchived = false;
  }

  const projects = await Project.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: {
      projects,
    },
  });
});

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if project belongs to user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.status(200).json({
    success: true,
    data: {
      project,
    },
  });
});

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = asyncHandler(async (req, res) => {
  const projectData = {
    ...req.body,
    user: req.user._id,
  };

  const project = await Project.create(projectData);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      project,
    },
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if project belongs to user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  // Prevent making default project non-default if it's the only one
  if (project.isDefault && req.body.isDefault === false) {
    const defaultProjects = await Project.countDocuments({
      user: req.user._id,
      isDefault: true,
    });
    
    if (defaultProjects <= 1) {
      res.status(400);
      throw new Error('Cannot remove default status from the only default project');
    }
  }

  project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: {
      project,
    },
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if project belongs to user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  // Prevent deleting default project
  if (project.isDefault) {
    res.status(400);
    throw new Error('Cannot delete default project');
  }

  // Check if project has tasks
  const taskCount = await Task.countDocuments({ project: project._id });
  
  if (taskCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete project with ${taskCount} task(s). Move or delete tasks first.`);
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {},
  });
});

/**
 * @desc    Get project statistics
 * @route   GET /api/projects/:id/stats
 * @access  Private
 */
const getProjectStats = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if project belongs to user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  // Get task statistics
  const stats = await Task.aggregate([
    { $match: { project: project._id } },
    {
      $facet: {
        byPriority: [
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 },
            },
          },
        ],
        byStatus: [
          {
            $group: {
              _id: '$status',
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
      project,
      stats: stats[0],
    },
  });
});

/**
 * @desc    Archive/Unarchive project
 * @route   PATCH /api/projects/:id/archive
 * @access  Private
 */
const toggleProjectArchive = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if project belongs to user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  // Prevent archiving default project
  if (project.isDefault && !project.isArchived) {
    res.status(400);
    throw new Error('Cannot archive default project');
  }

  project.isArchived = !project.isArchived;
  await project.save();

  res.status(200).json({
    success: true,
    message: `Project ${project.isArchived ? 'archived' : 'unarchived'} successfully`,
    data: {
      project,
    },
  });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  toggleProjectArchive,
};
