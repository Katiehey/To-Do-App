const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const {
  createTaskValidation,
  updateTaskValidation,
  queryValidation,
} = require('../middleware/validators/taskValidator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id route)
router.get('/stats', getTaskStats);

// Main CRUD routes
router.route('/')
  .get(queryValidation, getTasks)
  .post(createTaskValidation, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

// Toggle completion
router.patch('/:id/toggle', toggleTaskCompletion);

module.exports = router;
