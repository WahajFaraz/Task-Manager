import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://task-manager-back-psi.vercel.app/api';

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
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (name, email, password) => api.post('/api/auth/register', { name, email, password }),
  getProfile: () => api.get('/api/auth/me'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params = {}) => api.get('/api/tasks', { params }),
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (taskData) => api.post('/api/tasks', taskData),
  updateTask: (id, taskData) => {
    if (!id || id === 'undefined') {
      throw new Error('Task ID is undefined or invalid');
    }
    return api.put(`/api/tasks/${id}`, taskData);
  },
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  getTaskStats: () => api.get('/api/tasks/stats'),
  searchTasks: (query) => api.get('/api/tasks/search', { params: { q: query } }),
  bulkUpdateTasks: (taskIds, updates) => api.put('/api/tasks/bulk', { taskIds, updates }),
  bulkDeleteTasks: (taskIds) => api.delete('/api/tasks/bulk', { data: { taskIds } }),
};

export default api;
