const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordUpdateValidation,
} = require('../middleware/validators/authValidator');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes with validation and rate limiting
// Limiter and Validation run BEFORE the Controller function
router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, updateProfile);// Reordered validation
router.put('/password', protect, passwordResetLimiter, passwordUpdateValidation, updatePassword);// Reordered validation/limiter

module.exports = router;
