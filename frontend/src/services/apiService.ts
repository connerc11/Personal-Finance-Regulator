import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, User, Transaction, Budget, BudgetCreateRequest, BudgetUpdateRequest, ScheduledPurchase, FinancialGoal } from '../types';
import { mockGoalsAPI, initializeGoalsDemoData } from './mockGoalsAPI';
import { mockTransactionAPI, initializeTransactionDemoData } from './mockTransactionAPI';
import { mockBudgetAPI, initializeBudgetDemoData } from './mockBudgetAPI';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management for all API clients
let currentToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;
}

function attachAuthToken(config: any) {
  if (currentToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
}

// Attach token to all requests
apiClient.interceptors.request.use(attachAuthToken);

// Attach after client declarations below

// Create separate clients for microservices when API gateway is not available

const budgetServiceClient = axios.create({
  baseURL: 'http://localhost:8083',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
budgetServiceClient.interceptors.request.use(attachAuthToken);


const analyticsServiceClient = axios.create({
  baseURL: 'http://localhost:8081', // Use user-service directly
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
analyticsServiceClient.interceptors.request.use(attachAuthToken);

// Auth API
// Unified Financial Data API
export const financialDataAPI = {
  get: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get('/api/users/financial-data');
      return { success: true, data: JSON.parse(response.data.data), message: 'Financial data loaded' };
    } catch (error: any) {
      return { success: false, data: null, message: error.response?.data?.message || 'Failed to load financial data' };
    }
  },
  save: async (data: any): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put('/api/users/financial-data', { data });
      return { success: true, data: JSON.parse(response.data.data), message: 'Financial data saved' };
    } catch (error: any) {
      return { success: false, data: null, message: error.response?.data?.message || 'Failed to save financial data' };
    }
  }
};
export const authAPI = {
  login: async (identifier: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post('/api/users/auth/signin', { identifier, password });
      return {
        success: true,
        data: {
          user: {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            phoneNumber: response.data.phoneNumber || '',
            createdAt: new Date().toISOString(),
          },
          token: response.data.token
        },
        message: 'Login successful'
      };
    } catch (error: any) {
      console.warn('Real auth API failed:', error);
      // For demo purposes, allow demo login with a unique demo user ID
      if (identifier === 'demo@personalfinance.com' && password === 'demo123') {
        return {
          success: true,
          data: {
            user: {
              id: 999, // Use a unique demo user ID instead of 1
              username: 'demo@personalfinance.com',
              email: 'demo@personalfinance.com',
              firstName: 'Demo',
              lastName: 'User',
              phoneNumber: '',
              createdAt: new Date().toISOString(),
            },
            token: 'demo_token_123'
          },
          message: 'Demo login successful'
        };
      }
      return {
        success: false,
        data: { user: {} as User, token: '' },
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },
  
  register: async (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post('/api/users/auth/signup', userData);
      return {
        success: true,
        data: {
          user: {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            phoneNumber: response.data.phoneNumber || '',
            createdAt: new Date().toISOString(),
          },
          token: response.data.token
        },
        message: 'Registration successful'
      };
    } catch (error: any) {
      return {
        success: false,
        data: { user: {} as User, token: '' },
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return {
        success: true,
        data: response.data,
        message: 'Profile retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as User,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },
  
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.put('/api/users/profile', userData);
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as User,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post('/api/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Avatar uploaded successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: { avatarUrl: '' },
        message: error.response?.data?.message || 'Failed to upload avatar'
      };
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post('/api/users/profile/change-password', {
        currentPassword,
        newPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: '',
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },

  getPreferences: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get('/api/users/preferences');
      return {
        success: true,
        data: response.data,
        message: 'Preferences retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to get preferences'
      };
    }
  },

  updatePreferences: async (preferences: any): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put('/api/users/preferences', preferences);
      return {
        success: true,
        data: response.data,
        message: 'Preferences updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: {},
        message: error.response?.data?.message || 'Failed to update preferences'
      };
    }
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (userId?: number): Promise<ApiResponse<Transaction[]>> => {
    // If no userId provided, return empty
    if (!userId) {
      return {
        success: true,
        data: [],
        message: 'No transactions found - add your first transaction to get started'
      };
    }

    // Only demo user gets mock data
    if (userId === 999) {
      initializeTransactionDemoData();
      return mockTransactionAPI.getAll();
    }

    try {
      // Try real API first
      const normalizedUserId = normalizeUserId(userId);
      const response = await apiClient.get(`/api/transactions/user/${normalizedUserId}`);
      return {
        success: true,
        data: response.data.content || response.data, // Handle paginated response
        message: 'Transactions retrieved successfully'
      };
    } catch (error) {
      // For all other users, return empty data if backend fails
      return {
        success: true,
        data: [],
        message: 'No transactions found - add your first transaction to get started'
      };
    }
  },
  
  create: async (transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> => {
    try {
      // Try real API first
      const response = await apiClient.post('/api/transactions', transaction);
      return {
        success: true,
        data: response.data,
        message: 'Transaction created successfully'
      };
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      return mockTransactionAPI.create(transaction);
    }
  },
  
  update: async (id: number, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    try {
      // Try real API first
      const response = await apiClient.put(`/transactions/${id}`, transaction);
      return {
        success: true,
        data: response.data,
        message: 'Transaction updated successfully'
      };
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      return mockTransactionAPI.update(id, transaction);
    }
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      // Try real API first
      await apiClient.delete(`/transactions/${id}`);
      return {
        success: true,
        data: undefined,
        message: 'Transaction deleted successfully'
      };
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      return mockTransactionAPI.delete(id);
    }
  },

  getSummary: async (userId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/transactions/user/${userId}/summary`);
      return {
        success: true,
        data: response.data,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      // Only demo user gets mock summary
      if (userId === 999) {
        const mockTransactions = await mockTransactionAPI.getAll();
        const summary = {
          totalIncome: 5000,
          totalExpenses: 3200,
          netSavings: 1800,
          transactionCount: mockTransactions.data?.length || 0
        };
        return {
          success: true,
          data: summary,
          message: 'Mock summary generated'
        };
      }
      // All other users get empty summary
      return {
        success: true,
        data: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          transactionCount: 0
        },
        message: 'No summary data available'
      };
    }
  },

  getCategoryExpenses: async (userId: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/transactions/user/${userId}/category-expenses`);
      return {
        success: true,
        data: response.data,
        message: 'Category expenses retrieved successfully'
      };
    } catch (error) {
      // Only demo user gets mock category data
      if (userId === 999) {
        const mockCategories = {
          'GROCERIES': 800,
          'DINING': 450,
          'TRANSPORTATION': 300,
          'UTILITIES': 250,
          'ENTERTAINMENT': 200,
          'SHOPPING': 150
        };
        return {
          success: true,
          data: mockCategories,
          message: 'Mock category data generated'
        };
      }
      // All other users get empty
      return {
        success: true,
        data: {},
        message: 'No category data available'
      };
    }
  }
};

// Budget API
export const budgetAPI = {
  getAll: async (userId: number): Promise<ApiResponse<Budget[]>> => {
    // Only demo user gets mock data
    if (userId === 999) {
      initializeBudgetDemoData();
      return mockBudgetAPI.getAll();
    }

    try {
      // Use real budget service API with normalized user ID
      const normalizedUserId = normalizeUserId(userId);
      const response = await apiClient.get(`/api/budgets/user/${normalizedUserId}`);
      return {
        success: true,
        data: response.data,
        message: 'Budgets retrieved successfully'
      };
    } catch (error) {
      // For all other users, return empty data if backend fails
      return {
        success: true,
        data: [],
        message: 'No budgets found - create your first budget to get started'
      };
    }
  },
  
  create: async (budget: BudgetCreateRequest): Promise<ApiResponse<Budget>> => {
    try {
      // Use real budget service API
      const response = await apiClient.post('/api/budgets', budget);
      return {
        success: true,
        data: response.data,
        message: 'Budget created successfully'
      };
    } catch (error) {
      console.warn('Budget API failed:', error);
      return {
        success: false,
        data: {} as Budget,
        message: 'Failed to create budget'
      };
    }
  },
  
  update: async (id: number, budget: BudgetUpdateRequest): Promise<ApiResponse<Budget>> => {
    try {
      // Use real budget service API
      const response = await apiClient.put(`/api/budgets/${id}`, budget);
      return {
        success: true,
        data: response.data,
        message: 'Budget updated successfully'
      };
    } catch (error) {
      console.warn('Budget API failed:', error);
      return {
        success: false,
        data: {} as Budget,
        message: 'Failed to update budget'
      };
    }
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      // Use real budget service API
      await apiClient.delete(`/api/budgets/${id}`);
      return {
        success: true,
        data: undefined,
        message: 'Budget deleted successfully'
      };
    } catch (error) {
      console.warn('Budget API failed:', error);
      return {
        success: false,
        data: undefined,
        message: 'Failed to delete budget'
      };
    }
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: async (userId: number, timeRange: string = '6months', userEmail?: string): Promise<ApiResponse<any>> => {
    // Only return mock data for explicit demo user
    if (userId === 999) {
      return {
        success: true,
        data: {
          totalIncome: 5200,
          totalExpenses: 3180,
          netSavings: 2020,
          savingsRate: '38.8',
          categoryBreakdown: [
            { name: 'Groceries', value: 800, color: '#8884d8' },
            { name: 'Dining', value: 450, color: '#82ca9d' },
            { name: 'Transportation', value: 300, color: '#ffc658' },
            { name: 'Utilities', value: 250, color: '#ff7300' },
            { name: 'Entertainment', value: 380, color: '#00ff88' }
          ],
          monthlyTrend: [
            { month: 'Jan', income: 4800, expenses: 3200 },
            { month: 'Feb', income: 5000, expenses: 2900 },
            { month: 'Mar', income: 5200, expenses: 3180 },
            { month: 'Apr', income: 4900, expenses: 3050 },
            { month: 'May', income: 5300, expenses: 3400 },
            { month: 'Jun', income: 5200, expenses: 3180 }
          ]
        },
        message: 'Mock dashboard data retrieved successfully'
      };
    }
    try {
      const normalizedUserId = normalizeUserId(userId);
      const response = await analyticsServiceClient.get(`/api/analytics/user/${normalizedUserId}/dashboard?timeRange=${timeRange}`);
      return {
        success: true,
        data: response.data,
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error) {
      // For all other users, return empty data if backend fails
      return {
        success: true,
        data: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          savingsRate: '0',
          categoryBreakdown: [],
          monthlyTrend: []
        },
        message: 'No analytics data available'
      };
    }
  },
  
  getMonthlyTrend: async (userId: number, timeRange: string = '6months'): Promise<ApiResponse<any[]>> => {
    // For users with large IDs or demo users, use mock data directly
    if (shouldUseMockData(userId)) {
      console.log(`Using mock monthly trend data for user ${userId}`);
      return {
        success: true,
        data: [
          { month: 'Jan', income: 4800, expenses: 3200 },
          { month: 'Feb', income: 5000, expenses: 2900 },
          { month: 'Mar', income: 5200, expenses: 3180 },
          { month: 'Apr', income: 4900, expenses: 3050 },
          { month: 'May', income: 5300, expenses: 3400 },
          { month: 'Jun', income: 5200, expenses: 3180 }
        ],
        message: 'Mock monthly trend data retrieved successfully'
      };
    }

    try {
      // Try to get real data from transaction service analytics endpoint
      const normalizedUserId = normalizeUserId(userId);
      const response = await analyticsServiceClient.get(`/api/analytics/user/${normalizedUserId}/monthly-trend?timeRange=${timeRange}`);
      return {
        success: true,
        data: response.data,
        message: 'Monthly trend data retrieved successfully'
      };
    } catch (error) {
      console.warn('Monthly trend API failed:', error);
    }

    // Check if this is a demo user (userId 999) or new user
    const isDemoUser = userId === 999;
    
    if (isDemoUser) {
      // Return mock data only for demo user
      const mockTrend = [
        { month: 'Jan', income: 5200, expenses: 3400, savings: 1800 },
        { month: 'Feb', income: 5200, expenses: 3200, savings: 2000 },
        { month: 'Mar', income: 5400, expenses: 3100, savings: 2300 },
        { month: 'Apr', income: 5200, expenses: 3300, savings: 1900 },
        { month: 'May', income: 5600, expenses: 3000, savings: 2600 },
        { month: 'Jun', income: 5200, expenses: 3180, savings: 2020 }
      ];

      return {
        success: true,
        data: mockTrend,
        message: 'Mock monthly trend data'
      };
    }

    // For new users, return empty data
    return {
      success: true,
      data: [],
      message: 'No monthly trend data available'
    };
  },
  
  getCategoryBreakdown: async (userId: number, timeRange: string = '6months'): Promise<ApiResponse<any[]>> => {
    try {
      // Try to get real data from transaction service analytics endpoint
      const response = await analyticsServiceClient.get(`/api/analytics/user/${userId}/category-breakdown?timeRange=${timeRange}`);
      return {
        success: true,
        data: response.data,
        message: 'Category breakdown retrieved successfully'
      };
    } catch (error) {
      console.warn('Category breakdown API failed:', error);
    }

    // Check if this is a demo user (userId 999) or new user
    const isDemoUser = userId === 999;
    
    if (isDemoUser) {
      // Return mock data only for demo user
      return {
        success: true,
        data: [
          { name: 'Groceries', value: 800, color: '#8884d8' },
          { name: 'Dining', value: 450, color: '#82ca9d' },
          { name: 'Transportation', value: 300, color: '#ffc658' },
          { name: 'Utilities', value: 250, color: '#ff7300' },
          { name: 'Entertainment', value: 200, color: '#0088fe' }
        ],
        message: 'Mock category breakdown data'
      };
    }

    // For new users, return empty data
    return {
      success: true,
      data: [],
      message: 'No category breakdown data available'
    };
  },
  
  getBudgetPerformance: async (userId: number): Promise<ApiResponse<any[]>> => {
    // For users with large IDs or demo users, use mock data directly
    if (shouldUseMockData(userId)) {
      console.log(`Using mock budget performance data for user ${userId}`);
      return {
        success: true,
        data: [
          { category: 'Groceries', budgeted: 900, actual: 800, performance: 88.9 },
          { category: 'Dining', budgeted: 400, actual: 450, performance: 112.5 },
          { category: 'Transportation', budgeted: 350, actual: 300, performance: 85.7 },
          { category: 'Entertainment', budgeted: 250, actual: 200, performance: 80.0 }
        ],
        message: 'Mock budget performance data retrieved successfully'
      };
    }

    try {
      // Try to get real data from transaction service analytics endpoint
      const normalizedUserId = normalizeUserId(userId);
      const response = await analyticsServiceClient.get(`/api/analytics/user/${normalizedUserId}/budget-performance`);
      return {
        success: true,
        data: response.data,
        message: 'Budget performance retrieved successfully'
      };
    } catch (error) {
      console.warn('Budget performance API failed:', error);
      
      // Always fall back to mock data when backend fails
      return {
        success: true,
        data: [
          { category: 'Groceries', budgeted: 900, actual: 800, performance: 88.9 },
          { category: 'Dining', budgeted: 400, actual: 450, performance: 112.5 },
          { category: 'Transportation', budgeted: 350, actual: 300, performance: 85.7 },
          { category: 'Entertainment', budgeted: 250, actual: 200, performance: 80.0 }
        ],
        message: 'Mock budget performance data retrieved successfully'
      };
    }

    // For new users, return empty data
    return {
      success: true,
      data: [],
      message: 'No budget performance data available'
    };
  }
};

// Helper function to check if a user is a demo user
const isDemoUser = (userId: number, userEmail?: string): boolean => {
  return userId === 999 || userEmail === 'demo@personalfinance.com';
};
function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'GROCERIES': '#8884d8',
    'DINING': '#82ca9d',
    'TRANSPORTATION': '#ffc658',
    'UTILITIES': '#ff7300',
    'ENTERTAINMENT': '#0088fe',
    'SHOPPING': '#00c49f',
    'HEALTHCARE': '#8dd1e1',
    'EDUCATION': '#d084d0',
    'TRAVEL': '#ffb347'
  };
  return colors[category] || '#8884d8';
}

function aggregateTransactionsByMonth(transactions: Transaction[]): any[] {
  const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'INCOME') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += transaction.amount;
    }
  });
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
    savings: data.income - data.expenses
  }));
}

// Scheduled Purchase API
export const scheduledPurchaseAPI = {
  getAll: async (): Promise<ApiResponse<ScheduledPurchase[]>> => {
    const response = await apiClient.get('/api/scheduled-purchases');
    return response.data;
  },
  
  create: async (scheduledPurchase: Omit<ScheduledPurchase, 'id'>): Promise<ApiResponse<ScheduledPurchase>> => {
    const response = await apiClient.post('/api/scheduled-purchases', scheduledPurchase);
    return response.data;
  },
  
  update: async (id: number, scheduledPurchase: Partial<ScheduledPurchase>): Promise<ApiResponse<ScheduledPurchase>> => {
    const response = await apiClient.put(`/scheduled-purchases/${id}`, scheduledPurchase);
    return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/scheduled-purchases/${id}`);
    return response.data;
  },
  
  toggleActive: async (id: number): Promise<ApiResponse<ScheduledPurchase>> => {
    const response = await apiClient.patch(`/scheduled-purchases/${id}/toggle`);
    return response.data;
  },
  
  executeNow: async (id: number): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post(`/scheduled-purchases/${id}/execute`);
    return response.data;
  },
  
  getUpcoming: async (days: number = 30): Promise<ApiResponse<ScheduledPurchase[]>> => {
    const response = await apiClient.get(`/scheduled-purchases/upcoming?days=${days}`);
    return response.data;
  },
};

// Goals API - Now using real backend endpoints
export const goalsAPI = {
  getAll: async (userId?: number): Promise<ApiResponse<FinancialGoal[]>> => {
    try {
      if (userId) {
        const response = await apiClient.get(`/api/goals/user/${userId}`);
        return { success: true, data: response.data, message: 'Goals retrieved successfully' };
      }
      return { success: false, data: [], message: 'User ID required' };
    } catch (error: any) {
      return { success: false, data: [], message: error.response?.data?.message || 'Failed to get goals' };
    }
  },
  create: async (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'progress' | 'monthlySavingsNeeded'>): Promise<ApiResponse<FinancialGoal>> => {
    try {
      const response = await apiClient.post('/api/goals', goal);
      return { success: true, data: response.data, message: 'Goal created successfully' };
    } catch (error: any) {
      return { success: false, data: {} as FinancialGoal, message: error.response?.data?.message || 'Failed to create goal' };
    }
  },
  update: async (id: number, goal: Partial<FinancialGoal>): Promise<ApiResponse<FinancialGoal>> => {
    try {
      const response = await apiClient.put(`/api/goals/${id}`, goal);
      return { success: true, data: response.data, message: 'Goal updated successfully' };
    } catch (error: any) {
      return { success: false, data: {} as FinancialGoal, message: error.response?.data?.message || 'Failed to update goal' };
    }
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/api/goals/${id}`);
      return { success: true, data: undefined, message: 'Goal deleted successfully' };
    } catch (error: any) {
      return { success: false, data: undefined, message: error.response?.data?.message || 'Failed to delete goal' };
    }
  },
};

export default apiClient;

// Helper function to normalize user ID for API calls
const normalizeUserId = (userId: number): number => {
  // If user ID is a large timestamp (> 1 million), convert to a smaller sequential ID
  if (userId > 1000000) {
    // For now, use a simple mapping based on the last 3 digits
    // In a real app, this would be handled by proper user ID migration
    const normalizedId = (userId % 1000) + 1;
    console.log(`Normalizing large user ID ${userId} to ${normalizedId}`);
    return normalizedId;
  }
  return userId;
};

// Helper function to determine if we should use mock data
const shouldUseMockData = (userId: number): boolean => {
  // Always use mock data for demo user or when backend is unavailable
  return userId === 999 || userId > 1000000;
};