export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  // Extended profile information
  phoneNumber?: string;
  avatarUrl?: string;
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

export interface UserPreferences {
  id?: number;
  userId: number;
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  budgetAlerts: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  // Privacy preferences
  profileVisible: boolean;
  shareData: boolean;
  // Theme preferences
  theme: string;
  language: string;
  currency: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  userId: number;
  transactionDate?: string;  // Backend uses transactionDate
  merchant?: string;
  location?: string;
  notes?: string;
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  userId: number;
}

export interface BudgetCreateRequest {
  userId: number;
  name: string;
  category: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
}

export interface BudgetUpdateRequest {
  name: string;
  category: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
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
  isAuthenticated: boolean;
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