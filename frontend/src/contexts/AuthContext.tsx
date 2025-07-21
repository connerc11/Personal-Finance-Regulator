import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authAPI, setAuthToken } from '../services/apiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, do not use localStorage for session persistence
  // On mount, restore token from localStorage if present
  useEffect(() => {
    const storedToken = localStorage.getItem('personalfinance_token');
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }
    setIsLoading(false);
  }, []);


  // Login using backend API
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(email, password);
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      setUser(result.data.user);
      setToken(result.data.token);
      setAuthToken(result.data.token);
      localStorage.setItem('personalfinance_token', result.data.token);
      console.log('Auth token set after login:', result.data.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register using backend API
  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await authAPI.register(userData);
      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }
      setUser(result.data.user);
      setToken(result.data.token);
      setAuthToken(result.data.token);
      console.log('Auth token set after registration:', result.data.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = (): void => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('personalfinance_token');
  };




  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;