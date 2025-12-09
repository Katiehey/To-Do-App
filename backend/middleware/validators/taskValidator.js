const { body, query, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Create task validation rules
 */
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'archived'])
    .withMessage('Status must be pending, in-progress, completed, or archived'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('reminderDate')
    .optional()
    .isISO8601()
    .withMessage('Reminder date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters'),
  
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  
  body('recurring.enabled')
    .optional()
    .isBoolean()
    .withMessage('Recurring enabled must be a boolean'),
  
  body('recurring.frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurring frequency must be daily, weekly, monthly, or yearly'),
  
  validate,
];

/**
 * Update task validation rules
 */
const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'archived'])
    .withMessage('Status must be pending, in-progress, completed, or archived'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('reminderDate')
    .optional()
    .isISO8601()
    .withMessage('Reminder date must be a valid date'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  
  validate,
];

/**
 * Query validation for filtering
 */
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'archived'])
    .withMessage('Status must be pending, in-progress, completed, or archived'),
  
  validate,
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  queryValidation,
};
