import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskStats, DailyActivity } from '@/types/task';
import { tasksAPI } from '@/services/api';
import { toast } from 'sonner';

// Demo data
const generateDemoTasks = (): Task[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the new marketing landing page',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['design', 'marketing'],
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTime: 480,
      actualTime: 240,
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: 'Go through pending PRs and provide feedback',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['development', 'review'],
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTime: 120,
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      status: 'done',
      priority: 'low',
      tags: ['documentation'],
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTime: 180,
      actualTime: 150,
    },
    {
      id: '4',
      title: 'Fix authentication bug',
      description: 'Users are getting logged out unexpectedly - investigate and fix',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date().toISOString(),
      tags: ['bug', 'urgent'],
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTime: 240,
      actualTime: 180,
    },
    {
      id: '5',
      title: 'Weekly team standup',
      description: 'Prepare and lead the weekly team standup meeting',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['meeting'],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurring: true,
      recurringInterval: 'weekly',
    },
    {
      id: '6',
      title: 'Database optimization',
      description: 'Optimize slow queries and add proper indexing',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['backend', 'performance'],
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTime: 360,
    },
    {
      id: '7',
      title: 'User feedback analysis',
      description: 'Analyze user feedback from the last sprint and create action items',
      status: 'done',
      priority: 'medium',
      tags: ['research', 'ux'],
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 120,
      actualTime: 90,
    },
    {
      id: '8',
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      status: 'done',
      priority: 'high',
      tags: ['devops', 'infrastructure'],
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 480,
      actualTime: 600,
    },
  ];
};

const generateActivityData = (): DailyActivity[] => {
  const data: DailyActivity[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      created: Math.floor(Math.random() * 5) + 1,
      completed: Math.floor(Math.random() * 4),
    });
  }
  
  return data;
};

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  activityData: DailyActivity[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByDate: (date: string) => Task[];
  searchTasks: (query: string) => Task[];
  filterTasks: (filters: { priority?: TaskPriority; status?: TaskStatus; tags?: string[] }) => Task[];
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityData, setActivityData] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on mount
  const refreshTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('taskflow_token');
      
      if (!token) {
        // No token, set empty state
        setTasks([]);
        setActivityData([]);
        return;
      }

      console.log('Fetching tasks from database...');
      const [tasksResponse, statsResponse] = await Promise.all([
        tasksAPI.getTasks(),
        tasksAPI.getTaskStats()
      ]);
      
      console.log('Tasks fetched from database:', tasksResponse.data);
      console.log('Task count:', tasksResponse.data.length);
      
      // Log each task's ID for debugging
      tasksResponse.data.forEach((task: Task, index: number) => {
        console.log(`Task ${index + 1}:`, { id: task.id, title: task.title });
      });
      
      setTasks(tasksResponse.data);
      
      // Transform daily stats to match our interface
      const dailyStats = statsResponse.data.daily || [];
      const transformedActivityData: DailyActivity[] = dailyStats.map((stat: any) => ({
        date: stat._id,
        created: stat.created,
        completed: stat.completed
      }));
      
      setActivityData(transformedActivityData);
      console.log('Database fetch completed successfully');
    } catch (error: any) {
      console.error('Failed to fetch tasks from database:', error);
      if (error.response?.status !== 401) {
        // Only show error toast if it's not an auth error (401 is handled by auth interceptor)
        toast.error('Failed to load tasks from database');
      }
      // Set empty state on error
      setTasks([]);
      setActivityData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
    get completionRate() {
      return this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
    },
  };

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding task to database:', taskData);
      const response = await tasksAPI.createTask(taskData);
      const newTask = response.data;
      console.log('Task added to database:', newTask);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully in database');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task in database';
      toast.error(message);
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      console.log('Updating task in database:', { id, updates });
      
      // Validate ID
      if (!id || id === 'undefined') {
        console.error('Invalid task ID for update:', id);
        throw new Error('Invalid task ID');
      }

      const response = await tasksAPI.updateTask(id, updates);
      const updatedTask = response.data;
      console.log('Task updated in database:', updatedTask);
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? updatedTask : task
        )
      );
      toast.success('Task updated successfully in database');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task in database';
      toast.error(message);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      console.log('Deleting task from database:', id);
      await tasksAPI.deleteTask(id);
      console.log('Task deleted from database:', id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully from database');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task from database';
      toast.error(message);
      throw error;
    }
  }, []);

  const moveTask = useCallback(async (id: string, newStatus: TaskStatus) => {
    await updateTask(id, { status: newStatus });
  }, [updateTask]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.split('T')[0] === date;
    });
  }, [tasks]);

  const searchTasks = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(
      task =>
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [tasks]);

  const filterTasks = useCallback(
    (filters: { priority?: TaskPriority; status?: TaskStatus; tags?: string[] }) => {
      return tasks.filter(task => {
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.status && task.status !== filters.status) return false;
        if (filters.tags && filters.tags.length > 0) {
          if (!filters.tags.some(tag => task.tags.includes(tag))) return false;
        }
        return true;
      });
    },
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        activityData,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        getTasksByStatus,
        getTasksByDate,
        searchTasks,
        filterTasks,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
