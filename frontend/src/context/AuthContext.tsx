import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import type { User } from '../types';

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

const USER_STORAGE_KEY = 'chatterbox_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialUser = (): User | null => {
    try {
      const item = window.localStorage.getItem(USER_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading user from localStorage', error);
      return null;
    }
  };

  const initialUser = getInitialUser();
  
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialUser);
  // Only show the initial loading state if there's no user persisted.
  // If there is a user, we render the app optimistically while we verify.
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);

  const handleSessionUpdate = (userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
    if (userData) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  };
  
  const verifyUser = useCallback(async () => {
    const storedUser = getInitialUser();
    if (!storedUser) {
        setIsLoading(false); // Ensure loading is false if no user to check
        return;
    }

    try {
      // Quietly verify in the background. If this fails, it will throw an error.
      await api.get('/auth/verify');
      // If we are here, the session is valid. State is already correct from the optimistic load.
      // We just need to turn off the loading spinner if it was on.
      setIsLoading(false);
    } catch (error) {
      console.error("Session verification failed, logging out.", error);
      handleSessionUpdate(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = async (credentials: object) => {
    const { data } = await api.post('/auth/login', credentials);
    handleSessionUpdate(data.user);
  };

  const signup = async (details: object) => {
    const { data } = await api.post('/auth/signup', details);
    handleSessionUpdate(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed, clearing session locally.", error);
    } finally {
      handleSessionUpdate(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
