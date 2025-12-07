const asyncHandler = require('../middleware/asyncHandler');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by pre-save middleware
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getPublicProfile(),
      token,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      user: user.getPublicProfile(),
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  // Use findByIdAndUpdate for robust partial updates that bypass the pre('save') hook
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id, // User ID from the protect middleware
    { 
      $set: {
        name: req.body.name,
        avatar: req.body.avatar,
        preferences: req.body.preferences,
      },
    },
    {
      new: true, // Return the modified document rather than the original
      runValidators: true, // Run schema validators on the update operation
      // Note: This method naturally handles partial updates and skips 'pre.save' hooks
    }
  ).select('-password'); // Exclude password from the final response

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser.getPublicProfile(),
    },
  });
});


/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordMatch = await user.matchPassword(currentPassword);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
};