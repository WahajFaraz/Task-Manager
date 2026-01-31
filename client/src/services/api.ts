import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AxiosResponse> => {
    return api.post('/auth/login', { email, password });
  },
  
  register: async (name: string, email: string, password: string): Promise<AxiosResponse> => {
    return api.post('/auth/register', { username: name, email, password });
  },
  
  getProfile: async (): Promise<AxiosResponse> => {
    return api.get('/auth/me');
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    tags?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<AxiosResponse> => {
    return api.get('/tasks', { params });
  },
  
  getTaskStats: async (): Promise<AxiosResponse> => {
    return api.get('/tasks/stats');
  },
  
  createTask: async (taskData: any): Promise<AxiosResponse> => {
    return api.post('/tasks', taskData);
  },
  
  updateTask: async (id: string, taskData: any): Promise<AxiosResponse> => {
    console.log('API: Updating task with ID:', id, 'Data:', taskData);
    
    // Validate ID before making request
    if (!id || id === 'undefined') {
      console.error('API: Invalid task ID for update:', id);
      throw new Error('Invalid task ID');
    }
    
    return api.put(`/tasks/${id}`, taskData);
  },
  
  deleteTask: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/tasks/${id}`);
  },
};

export default api;
