const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  reminderDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  recurring: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 0
  },
  actualTime: {
    type: Number, // in minutes
    default: 0
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'done') {
    this.completed = true;
  } else {
    this.completed = false;
  }
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
