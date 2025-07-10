export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  // Extended profile information
  phoneNumber?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  bio?: string;
  occupation?: string;
  annualIncome?: number;
  currency?: string;
  timezone?: string;
  // Preferences
  notifications?: {
    email: boolean;
    push: boolean;
    budgetAlerts: boolean;
    weeklyReports: boolean;
  };
  // Security settings
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  // Financial goals and preferences
  monthlyBudget?: number;
  savingsGoal?: number;
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  userId: number;
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  userId: number;
}

export interface ScheduledPurchase {
  id: number;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDue: string;
  isActive: boolean;
  userId: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface FinancialGoal {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  isCompleted: boolean;
  userId: number;
  createdAt: string;
  monthlySavingsNeeded?: number;
  progress?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}