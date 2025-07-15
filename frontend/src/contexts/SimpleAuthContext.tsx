import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple auth types
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SimpleAuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (email: string, password: string) => {
    setIsLoading(true);
    // Simple demo login
    setTimeout(() => {
      if (email === 'demo@test.com' && password === 'demo') {
        setUser({
          id: 1,
          username: 'demo',
          email: 'demo@test.com',
          firstName: 'Demo',
          lastName: 'User',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  const value: SimpleAuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = (): SimpleAuthContextType => {
  return useContext(SimpleAuthContext);
};
