import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, User, Transaction, Budget, BudgetCreateRequest, BudgetUpdateRequest, ScheduledPurchase, FinancialGoal } from '../types';
import { mockGoalsAPI, initializeGoalsDemoData } from './mockGoalsAPI';
import { mockTransactionAPI, initializeTransactionDemoData } from './mockTransactionAPI';
import { mockBudgetAPI, initializeBudgetDemoData } from './mockBudgetAPI';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('personalfinance_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create separate clients for microservices when API gateway is not available
const budgetServiceClient = axios.create({
  baseURL: 'http://localhost:8083',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const analyticsServiceClient = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await apiClient.post('/api/users/auth/signin', { username, password });
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
      if (username === 'demo@personalfinance.com' && password === 'demo123') {
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
    try {
      // Try real API first
      if (userId) {
        const response = await apiClient.get(`/api/transactions/user/${userId}`);
        return {
          success: true,
          data: response.data.content || response.data, // Handle paginated response
          message: 'Transactions retrieved successfully'
        };
      } else {
        // If no userId, fall back to mock data
        return mockTransactionAPI.getAll();
      }
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      
      // Check if this is a demo user (userId 999) or new user
      const isDemoUser = userId === 999;
      
      if (isDemoUser) {
        // Initialize and return mock data for demo user
        initializeTransactionDemoData();
        return mockTransactionAPI.getAll();
      }
      
      // For new users, return empty data
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
      console.warn('Real API failed for summary:', error);
      // Generate mock summary from transaction data
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
      console.warn('Real API failed for category expenses:', error);
      // Generate mock category data
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
  }
};

// Budget API
export const budgetAPI = {
  getAll: async (userId: number): Promise<ApiResponse<Budget[]>> => {
    try {
      // Use real budget service API
      const response = await apiClient.get(`/api/budgets/user/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'Budgets retrieved successfully'
      };
    } catch (error) {
      console.warn('Budget API failed:', error);
      
      // Check if this is a demo user (userId 999 for demo) or new user
      const isDemoUser = userId === 999;
      
      if (isDemoUser) {
        // Initialize and return mock data for demo user
        initializeBudgetDemoData();
        return mockBudgetAPI.getAll();
      }
      
      // For all other users (new users), return empty data
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
    try {
      // Try to get real data from transaction service analytics endpoint
      const response = await analyticsServiceClient.get(`/analytics/user/${userId}/dashboard?timeRange=${timeRange}`);
      return {
        success: true,
        data: response.data,
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error) {
      console.warn('Analytics API failed, using mock data:', error);
    }

    // Check if this is a demo user (userId 1) or new user
    const isDemo = isDemoUser(userId, userEmail);
    
    if (isDemo) {
      // Return mock data only for demo user
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
            { name: 'Entertainment', value: 200, color: '#0088fe' },
            { name: 'Shopping', value: 180, color: '#00c49f' }
          ],
          timeRange
        },
        message: 'Mock dashboard data provided'
      };
    }

    // For new users, return empty data
    return {
      success: true,
      data: {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: '0',
        categoryBreakdown: [],
        timeRange
      },
      message: 'No dashboard data available - start by adding transactions and budgets'
    };
  },
  
  getMonthlyTrend: async (userId: number, timeRange: string = '6months'): Promise<ApiResponse<any[]>> => {
    try {
      // Try to get real data from transaction service analytics endpoint
      const response = await analyticsServiceClient.get(`/analytics/user/${userId}/monthly-trend?timeRange=${timeRange}`);
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
      const response = await analyticsServiceClient.get(`/analytics/user/${userId}/category-breakdown?timeRange=${timeRange}`);
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
    try {
      // Try to get real data from transaction service analytics endpoint
      const response = await analyticsServiceClient.get(`/analytics/user/${userId}/budget-performance`);
      return {
        success: true,
        data: response.data,
        message: 'Budget performance retrieved successfully'
      };
    } catch (error) {
      console.warn('Budget performance API failed:', error);
    }

    // Check if this is a demo user (userId 999) or new user
    const isDemoUser = userId === 999;
    
    if (isDemoUser) {
      // Return mock data only for demo user
      return {
        success: true,
        data: [
          { category: 'Groceries', budgeted: 900, actual: 800, performance: 88.9 },
          { category: 'Dining', budgeted: 400, actual: 450, performance: 112.5 },
          { category: 'Transportation', budgeted: 350, actual: 300, performance: 85.7 },
          { category: 'Entertainment', budgeted: 250, actual: 200, performance: 80.0 }
        ],
        message: 'Mock budget performance data'
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

// Goals API - Using mock for now until backend is implemented
export const goalsAPI = {
  getAll: async (userId?: number): Promise<ApiResponse<FinancialGoal[]>> => {
    try {
      // Try real API first if we have userId
      if (userId) {
        // Real API implementation (when backend is ready):
        // const response = await apiClient.get(`/goals/user/${userId}`);
        // return response.data;
      }
    } catch (error) {
      console.warn('Goals API failed:', error);
    }
    
    // Check if this is a demo user (userId 999) or new user
    const isDemoUser = userId === 999;
    
    if (isDemoUser) {
      // Initialize and return demo goals for demo user
      initializeGoalsDemoData();
      return mockGoalsAPI.getAll();
    }
    
    // For new users, return empty data
    return {
      success: true,
      data: [],
      message: 'No goals found - create your first goal to get started'
    };
  },
  
  create: async (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'progress' | 'monthlySavingsNeeded'>): Promise<ApiResponse<FinancialGoal>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.create(goal);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.post('/goals', goal);
    // return response.data;
  },
  
  update: async (id: number, goal: Partial<FinancialGoal>): Promise<ApiResponse<FinancialGoal>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.update(id, goal);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.put(`/goals/${id}`, goal);
    // return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.delete(id);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.delete(`/goals/${id}`);
    // return response.data;
  },
  
  updateProgress: async (id: number, currentAmount: number): Promise<ApiResponse<FinancialGoal>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.updateProgress(id, currentAmount);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.patch(`/goals/${id}/progress`, { currentAmount });
    // return response.data;
  },
  
  markCompleted: async (id: number): Promise<ApiResponse<FinancialGoal>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.markCompleted(id);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.patch(`/goals/${id}/complete`);
    // return response.data;
  },
};

export default apiClient;