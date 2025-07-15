import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Local storage keys
const USERS_STORAGE_KEY = 'personalfinance_users';
const CURRENT_USER_KEY = 'personalfinance_current_user';
const TOKEN_KEY = 'personalfinance_token';
const SESSION_EXPIRY_KEY = 'personalfinance_session_expiry';

// Session timeout: 1 hour
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

// User database interface
interface UserAccount extends User {
  password: string; // In real app, this would be hashed
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo accounts and check for existing session
  useEffect(() => {
    initializeDemoAccounts();
    migrateUserIds(); // Migrate large timestamp IDs to sequential IDs
    
    // Check for stored token and user on app start
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    const storedExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    
    if (storedToken && storedUser && storedExpiry) {
      const expiryDate = new Date(storedExpiry);
      
      // Check if session is still valid
      if (expiryDate > new Date()) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  // Initialize demo accounts if they don't exist
  const initializeDemoAccounts = () => {
    const existingUsers = getUserDatabase();
    
    // Add demo account if it doesn't exist
    if (!existingUsers.find(u => u.email === 'demo@personalfinance.com')) {
      const demoUser: UserAccount = {
        id: 1,
        username: 'demo',
        email: 'demo@personalfinance.com',
        firstName: 'Demo',
        lastName: 'User',
        password: 'demo123',
        createdAt: new Date('2024-01-01').toISOString(),
      };
      
      const updatedUsers = [...existingUsers, demoUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    }
  };

  // Get user database from localStorage
  const getUserDatabase = (): UserAccount[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Save user database to localStorage
  const saveUserDatabase = (users: UserAccount[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  // Find user by email
  const findUserByEmail = (email: string): UserAccount | undefined => {
    const users = getUserDatabase();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  // Find user by username
  const findUserByUsername = (username: string): UserAccount | undefined => {
    const users = getUserDatabase();
    return users.find(user => user.username.toLowerCase() === username.toLowerCase());
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Find user in our database
      const userAccount = findUserByEmail(email);
      
      if (!userAccount) {
        throw new Error('No account found with this email. Please sign up first.');
      }
      
      // Check password (in real app, this would be hashed comparison)
      if (userAccount.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }

      // Create user object without password
      const authenticatedUser: User = {
        id: userAccount.id,
        username: userAccount.username,
        email: userAccount.email,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        createdAt: userAccount.createdAt,
      };

      const authToken = `jwt-token-${userAccount.id}-${Date.now()}`;

      setUser(authenticatedUser);
      setToken(authToken);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(SESSION_EXPIRY_KEY, new Date(Date.now() + SESSION_TIMEOUT).toISOString());
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUserByEmail = findUserByEmail(userData.email);
      if (existingUserByEmail) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      const existingUserByUsername = findUserByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('This username is already taken. Please choose a different username.');
      }

      // Generate a smaller, sequential user ID
      const existingUsers = getUserDatabase();
      const maxId = existingUsers.length > 0 ? Math.max(...existingUsers.map(u => u.id)) : 0;
      const newUserId = maxId + 1;

      // Create new user account
      const newUserAccount: UserAccount = {
        id: newUserId, // Use sequential ID instead of timestamp
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
      };

      // Save to user database
      const users = getUserDatabase();
      users.push(newUserAccount);
      saveUserDatabase(users);

      // Create user object without password
      const authenticatedUser: User = {
        id: newUserAccount.id,
        username: newUserAccount.username,
        email: newUserAccount.email,
        firstName: newUserAccount.firstName,
        lastName: newUserAccount.lastName,
        createdAt: newUserAccount.createdAt,
      };

      const authToken = `jwt-token-${newUserAccount.id}-${Date.now()}`;

      setUser(authenticatedUser);
      setToken(authToken);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticatedUser));
      localStorage.setItem(SESSION_EXPIRY_KEY, new Date(Date.now() + SESSION_TIMEOUT).toISOString());
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  };

  // Migrate users with large timestamp IDs to sequential IDs
  const migrateUserIds = () => {
    const users = getUserDatabase();
    let hasChanges = false;
    
    // Find users with large timestamp IDs (greater than 1 million)
    const usersWithLargeIds = users.filter(user => user.id > 1000000);
    
    if (usersWithLargeIds.length > 0) {
      // Create a mapping of old to new IDs
      const idMapping: { [oldId: number]: number } = {};
      let nextId = 1;
      
      // Assign new sequential IDs
      users.forEach(user => {
        if (user.id > 1000000) {
          // Skip demo user (ID 1) and other small IDs
          while (users.some(u => u.id === nextId && u.id <= 1000000)) {
            nextId++;
          }
          idMapping[user.id] = nextId;
          user.id = nextId;
          nextId++;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        saveUserDatabase(users);
        
        // Update current user if they have a large ID
        const currentUser = user;
        if (currentUser && currentUser.id > 1000000 && idMapping[currentUser.id]) {
          const updatedUser = { ...currentUser, id: idMapping[currentUser.id] };
          setUser(updatedUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        }
        
        console.log('Migrated user IDs from timestamps to sequential numbers');
      }
    }
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