const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, tags, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const tasks = await Task.find(query).sort(sortOptions);
    console.log('Tasks fetched for user:', req.user.id, 'Count:', tasks.length);
    
    // Transform tasks to include both _id and id fields for frontend compatibility
    const transformedTasks = tasks.map(task => ({
      ...task.toObject(),
      id: task._id.toString() // Add id field that matches _id
    }));
    
    console.log('Transformed tasks with id field:', transformedTasks.map(t => ({ id: t.id, title: t.title })));
    res.json(transformedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Task.aggregate([
      { $match: { user: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          },
          totalEstimatedTime: { $sum: '$estimatedTime' },
          totalActualTime: { $sum: '$actualTime' }
        }
      }
    ]);
    
    const dailyStats = await Task.aggregate([
      { $match: { user: new ObjectId(userId) } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          },
          created: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      overview: stats[0] || {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        totalEstimatedTime: 0,
        totalActualTime: 0
      },
      daily: dailyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('reminderDate').optional().isISO8601().withMessage('Invalid reminder date format'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('estimatedTime').optional().isInt({ min: 0 }).withMessage('Estimated time must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      description, 
      status = 'todo',
      priority = 'medium', 
      dueDate, 
      reminderDate,
      tags = [],
      estimatedTime = 0,
      recurring = { type: 'none', interval: 1 }
    } = req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderDate: reminderDate ? new Date(reminderDate) : undefined,
      tags,
      estimatedTime,
      recurring,
      user: req.user.id
    });

    await task.save();
    console.log('Task created successfully:', task._id, 'for user:', req.user.id);
    
    // Transform task to include both _id and id fields for frontend compatibility
    const transformedTask = {
      ...task.toObject(),
      id: task._id.toString() // Add id field that matches _id
    };
    
    console.log('Created task with id field:', { id: transformedTask.id, title: transformedTask.title });
    res.status(201).json(transformedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', [
  auth,
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('reminderDate').optional().isISO8601().withMessage('Invalid reminder date format'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
], async (req, res) => {
  try {
    console.log('Task update request:', { 
      taskId: req.params.id, 
      userId: req.user.id,
      body: req.body 
    });

    const { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      reminderDate,
      tags,
      estimatedTime,
      actualTime,
      recurring
    } = req.body;

    // Validate task ID
    if (!req.params.id || req.params.id === 'undefined') {
      console.error('Invalid task ID:', req.params.id);
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    let task = await Task.findOne({ _id: new ObjectId(req.params.id), user: req.user.id });
    if (!task) {
      console.log('Task not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Task not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (reminderDate !== undefined) {
      updateData.reminderDate = reminderDate ? new Date(reminderDate) : null;
    }
    if (tags !== undefined) updateData.tags = tags;
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;
    if (actualTime !== undefined) updateData.actualTime = actualTime;
    if (recurring !== undefined) updateData.recurring = recurring;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Transform task to include both _id and id fields for frontend compatibility
    const transformedTask = {
      ...task.toObject(),
      id: task._id.toString() // Add id field that matches _id
    };

    console.log('Task updated successfully:', transformedTask.id);
    res.json(transformedTask);
  } catch (error) {
    console.error('Task update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Delete task request:', { taskId: req.params.id, userId: req.user.id });
    
    const task = await Task.findOne({ _id: new ObjectId(req.params.id), user: req.user.id });
    if (!task) {
      console.log('Task not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    console.log('Task deleted successfully:', req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
