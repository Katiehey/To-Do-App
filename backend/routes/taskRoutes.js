const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
  getRecurringTasks,
  createNextOccurrenceManually,
  reorderTasks,
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

router.get('/recurring', getRecurringTasks);
router.post('/:id/create-next', createNextOccurrenceManually);

// Persist manual drag-and-drop order (must be before the '/:id' routes)
router.patch('/reorder', reorderTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

// Toggle completion
router.patch('/:id/toggle', toggleTaskCompletion);

module.exports = router;
