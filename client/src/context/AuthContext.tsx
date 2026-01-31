import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: { name: string; email: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const token = localStorage.getItem('taskflow_token');
    const storedUser = localStorage.getItem('taskflow_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        authAPI.getProfile()
          .then(response => {
            setUser(response.data.user);
            localStorage.setItem('taskflow_user', JSON.stringify(response.data.user));
          })
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem('taskflow_token');
            localStorage.removeItem('taskflow_user');
            setUser(null);
          });
      } catch (error) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Client: Logging in user...', email);
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;
      
      console.log('Client: Login successful, user data:', userData);
      setUser(userData);
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Client: Login failed:', error);
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Client: Registering user...', { name, email });
      const response = await authAPI.register(name, email, password);
      const { token, user: userData } = response.data;
      
      console.log('Client: Registration successful, user data:', userData);
      setUser(userData);
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Client: Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const updateUser = async (userData: { name: string; email: string }) => {
    try {
      // For now, just update local state
      // In a real app, you'd make an API call to update the user in the database
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
