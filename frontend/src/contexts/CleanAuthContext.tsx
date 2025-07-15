import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple types for auth
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simple demo login - in real app this would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@personalfinance.com' && password === 'demo123') {
          const demoUser: User = {
            id: 1,
            username: 'demo',
            email: 'demo@personalfinance.com',
            firstName: 'Demo',
            lastName: 'User',
          };
          setUser(demoUser);
          // Store in localStorage for persistence
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
};
