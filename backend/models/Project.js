const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    color: {
      type: String,
      default: '#3B82F6', // Blue
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color'],
    },
    icon: {
      type: String,
      default: 'folder',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    completedTaskCount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
projectSchema.index({ user: 1, isArchived: 1 });
projectSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Project', projectSchema);
