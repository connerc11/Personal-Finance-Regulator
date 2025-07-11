import axios from 'axios';
import { ApiResponse, User, Transaction, Budget, ScheduledPurchase, FinancialGoal } from '../types';
import { mockGoalsAPI } from './mockGoalsAPI';
import { mockTransactionAPI } from './mockTransactionAPI';
import { mockBudgetAPI } from './mockBudgetAPI';

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

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/users/profile', userData);
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (): Promise<ApiResponse<Transaction[]>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockTransactionAPI.getAll();
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.get('/transactions');
    // return response.data;
  },
  
  create: async (transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockTransactionAPI.create(transaction);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.post('/transactions', transaction);
    // return response.data;
  },
  
  update: async (id: number, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockTransactionAPI.update(id, transaction);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.put(`/transactions/${id}`, transaction);
    // return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockTransactionAPI.delete(id);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.delete(`/transactions/${id}`);
    // return response.data;
  },
};

// Budget API
export const budgetAPI = {
  getAll: async (): Promise<ApiResponse<Budget[]>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockBudgetAPI.getAll();
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.get('/budgets');
    // return response.data;
  },
  
  create: async (budget: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockBudgetAPI.create(budget);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.post('/budgets', budget);
    // return response.data;
  },
  
  update: async (id: number, budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockBudgetAPI.update(id, budget);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.put(`/budgets/${id}`, budget);
    // return response.data;
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockBudgetAPI.delete(id);
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.delete(`/budgets/${id}`);
    // return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: async (timeRange: string = '6months'): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/analytics/dashboard?timeRange=${timeRange}`);
    return response.data;
  },
  
  getMonthlyTrend: async (timeRange: string = '6months'): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/analytics/trend?timeRange=${timeRange}`);
    return response.data;
  },
  
  getCategoryBreakdown: async (timeRange: string = '6months'): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/analytics/categories?timeRange=${timeRange}`);
    return response.data;
  },
  
  getBudgetPerformance: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/analytics/budget-performance');
    return response.data;
  },
  
  getFinancialGoals: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/analytics/goals');
    return response.data;
  },
  
  getFinancialInsights: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/analytics/insights');
    return response.data;
  },
  
  exportReport: async (format: string = 'pdf', timeRange: string = '6months'): Promise<Blob> => {
    const response = await apiClient.get(`/analytics/export?format=${format}&timeRange=${timeRange}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

// Scheduled Purchase API
export const scheduledPurchaseAPI = {
  getAll: async (): Promise<ApiResponse<ScheduledPurchase[]>> => {
    const response = await apiClient.get('/scheduled-purchases');
    return response.data;
  },
  
  create: async (scheduledPurchase: Omit<ScheduledPurchase, 'id'>): Promise<ApiResponse<ScheduledPurchase>> => {
    const response = await apiClient.post('/scheduled-purchases', scheduledPurchase);
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
  getAll: async (): Promise<ApiResponse<FinancialGoal[]>> => {
    // For now, use mock API. Replace with real API calls when backend is ready
    return mockGoalsAPI.getAll();
    
    // Real API implementation (uncomment when backend is ready):
    // const response = await apiClient.get('/goals');
    // return response.data;
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