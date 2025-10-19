import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import type { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: object) => Promise<void>;
  signup: (details: object) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/auth/verify');
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error('Verification failed. This could be a network issue or a problem with the backend server.');
      if (axios.isAxiosError(error)) {
        if (error.message === 'Network Error') {
            console.error('Hint: A "Network Error" often means the backend server (expected at http://localhost:8080) is not running or is unreachable from the browser. Please ensure your backend server is active and that there are no CORS issues.');
        } else {
            console.error('Axios error details:', error.toJSON());
        }
      } else {
        console.error('Non-Axios error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = async (credentials: object) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const signup = async (details: object) => {
    const { data } = await api.post('/auth/signup', details);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};