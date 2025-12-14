const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  toggleProjectArchive,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const {
  createProjectValidation,
  updateProjectValidation,
} = require('../middleware/validators/projectValidator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Main CRUD routes
router.route('/')
  .get(getProjects)
  .post(createProjectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProjectValidation, updateProject)
  .delete(deleteProject);

// Additional routes
router.get('/:id/stats', getProjectStats);
router.patch('/:id/archive', toggleProjectArchive);

module.exports = router;
