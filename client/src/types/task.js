export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const Task = {
  id: 'string',
  _id: 'string', // MongoDB _id field (optional)
  title: 'string',
  description: 'string',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: 'string', // optional
  tags: 'array',
  createdAt: 'string',
  updatedAt: 'string',
  estimatedTime: 'number', // in minutes (optional)
  actualTime: 'number', // in minutes (optional)
  isRecurring: 'boolean', // optional
  recurringInterval: 'string', // 'daily' | 'weekly' | 'monthly' (optional)
  reminder: 'string' // optional
};

export const TaskStats = {
  total: 'number',
  completed: 'number',
  inProgress: 'number',
  todo: 'number',
  overdue: 'number',
  completionRate: 'number'
};

export const DailyActivity = {
  date: 'string',
  created: 'number',
  completed: 'number'
};
