
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { LoggedInUser, RegistrationData } from '../types';
import { api } from '../services/mockApi';

interface AuthContextType {
  user: LoggedInUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await api.login(username, password);
      if (userData) {
        setUser(userData as LoggedInUser);
        return true;
      } else {
        setError("Invalid username or password.");
        return false;
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError("An unexpected error occurred during login.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
        const newUser = await api.register(data);
        if (newUser) {
            setUser(newUser);
            return true;
        } else {
            setError("Username already exists. Please choose another one.");
            return false;
        }
    } catch (e) {
        console.error("Registration failed:", e);
        setError("An unexpected error occurred during registration.");
        return false;
    } finally {
        setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};