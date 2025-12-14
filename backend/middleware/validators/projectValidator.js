const { body, validationResult } = require('express-validator');

/**
 * Validation middleware to check for errors and format the response.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Standardize error response structure
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        // Use err.param or err.path depending on validator version,
        // using err.path which is common in recent versions.
        field: err.path,
        message: err.msg,
        // Optionally include the invalid value
        // value: err.value,
      })),
    });
  }
  next();
};

/**
 * Create project validation rules
 */
const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color (e.g., #3B82F6)'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),
    
  // Run the validation middleware
  validate,
];

/**
 * Update project validation rules (all fields are optional)
 */
const updateProjectValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty') // This fires only if 'name' is provided but is an empty string
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),

  body('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be a boolean (true or false)'),

  // Run the validation middleware
  validate,
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};