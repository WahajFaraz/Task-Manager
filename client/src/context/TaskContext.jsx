import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { tasksAPI } from '@/services/api';
import { toast } from 'sonner';

const TaskContext = createContext(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

      const [tasksResponse, statsResponse] = await Promise.all([
        tasksAPI.getTasks(),
        tasksAPI.getTaskStats()
      ]);
            
      
      setTasks(tasksResponse.data);
      
      const dailyStats = statsResponse.data.daily || [];
      const transformedActivityData = dailyStats.map((stat) => ({
        date: stat._id,
        created: stat.created,
        completed: stat.completed
      }));
      
      setActivityData(transformedActivityData);
    } catch (error) {
      setTasks([]);
      setActivityData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const addTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      const newTask = response.data;
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
      return newTask;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      
      if (!id || id === 'undefined') {
        throw new Error('Task ID is undefined or invalid');
      }
      
      const response = await tasksAPI.updateTask(id, updates);
      const updatedTask = response.data;
      
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      
      toast.success('Task updated successfully!');
      return updatedTask;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const moveTask = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }
      
      await updateTask(id, { status: newStatus });
    } catch (error) {
      toast.error('Failed to move task');
      throw error;
    }
  };

  const searchTasks = (query) => {
    if (!query.trim()) return tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const filterTasks = ({ priority, status, tags }) => {
    return tasks.filter(task => {
      if (priority && task.priority !== priority) return false;
      if (status && task.status !== status) return false;
      if (tags && tags.length > 0) {
        const hasMatchingTag = tags.some(tag => task.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    
    const now = new Date();
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate) < now;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate
    };
  };

  const value = {
    tasks,
    activityData,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    searchTasks,
    filterTasks,
    getTaskStats,
    refreshTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskProvider };
export default TaskProvider;
