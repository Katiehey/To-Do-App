const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    // ✅ Unified status field
    taskStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'archived'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Tag cannot be more than 30 characters'],
    }],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Recurring task fields
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: null,
      },
      interval: { type: Number, default: 1, min: 1 },
      endDate: { type: Date, default: null },
      nextOccurrence: { type: Date, default: null },
    },
    // Subtasks
    subtasks: [{
      title: { type: String, required: true, trim: true, maxlength: 200 },
      taskStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
      },
      createdAt: { type: Date, default: Date.now },
    }],
    // Attachments/Links
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now },
    }],
    // Collaboration
    sharedWith: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      permission: { type: String, enum: ['view', 'edit'], default: 'view' },
    }],
    // Metadata
    completedAt: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for performance
taskSchema.index({ user: 1, taskStatus: 1 });
taskSchema.index({ user: 1, project: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, tags: 1 });

// Virtual for overdue check
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.taskStatus === 'completed') return false;
  return new Date() > this.dueDate;
});

// Methods
taskSchema.methods.markCompleted = function() {
  this.taskStatus = 'completed';
  this.completedAt = new Date();
  return this.save();
};

taskSchema.methods.markIncomplete = function() {
  this.taskStatus = 'pending';
  this.completedAt = null;
  return this.save();
};

// Static method with filters
taskSchema.statics.findByUserWithFilters = function(userId, filters = {}) {
  const query = { user: userId };

  if (filters.taskStatus) {
    query.taskStatus = filters.taskStatus;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }
  if (filters.project) {
    query.project = filters.project;
  }
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  return this.find(query)
    .populate('project', 'name color')
    .sort(filters.sort || '-createdAt');
};

module.exports = mongoose.model('Task', taskSchema);
