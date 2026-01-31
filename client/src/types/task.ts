export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  _id?: string; // MongoDB _id field
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  reminder?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionRate: number;
}

export interface DailyActivity {
  date: string;
  created: number;
  completed: number;
}
