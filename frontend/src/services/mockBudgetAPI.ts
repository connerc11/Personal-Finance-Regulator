import { Budget, ApiResponse } from '../types';

const BUDGETS_STORAGE_KEY = 'personal_finance_budgets';

// Sample budgets data
const sampleBudgets: Budget[] = [
  {
    id: 1,
    name: 'Groceries Budget',
    category: 'Groceries',
    amount: 400,
    spent: 250,
    period: 'monthly',
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
  },
  {
    id: 2,
    name: 'Entertainment Budget',
    category: 'Entertainment',
    amount: 200,
    spent: 150,
    period: 'monthly',
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
  },
  {
    id: 3,
    name: 'Transportation Budget',
    category: 'Transportation',
    amount: 300,
    spent: 225,
    period: 'monthly',
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
  },
  {
    id: 4,
    name: 'Food Budget',
    category: 'Food',
    amount: 500,
    spent: 350,
    period: 'monthly',
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
  },
  {
    id: 5,
    name: 'Shopping Budget',
    category: 'Shopping',
    amount: 400,
    spent: 300,
    period: 'monthly',
    userId: 1,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
  },
];

// Initialize localStorage with sample data if empty
const initializeData = () => {
  const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(sampleBudgets));
  }
};

// Mock API service that simulates backend responses while using localStorage
export const mockBudgetAPI = {
  getAll: async (): Promise<ApiResponse<Budget[]>> => {
    // Initialize data if needed
    initializeData();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
      const budgets = stored ? JSON.parse(stored) : [];
      
      return {
        success: true,
        data: budgets,
        message: 'Budgets loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load budgets'
      };
    }
  },

  create: async (budget: Omit<Budget, 'id'>): Promise<ApiResponse<Budget>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
      const budgets = stored ? JSON.parse(stored) : [];
      
      const newBudget: Budget = {
        ...budget,
        id: Date.now(),
      };

      budgets.push(newBudget);
      localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));

      return {
        success: true,
        data: newBudget,
        message: 'Budget created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Budget,
        message: 'Failed to create budget'
      };
    }
  },

  update: async (id: number, updates: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
      const budgets = stored ? JSON.parse(stored) : [];
      
      const index = budgets.findIndex((b: Budget) => b.id === id);
      if (index === -1) {
        return {
          success: false,
          data: {} as Budget,
          message: 'Budget not found'
        };
      }

      budgets[index] = { ...budgets[index], ...updates };
      localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));

      return {
        success: true,
        data: budgets[index],
        message: 'Budget updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Budget,
        message: 'Failed to update budget'
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
      const budgets = stored ? JSON.parse(stored) : [];
      
      const filteredBudgets = budgets.filter((b: Budget) => b.id !== id);
      localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(filteredBudgets));

      return {
        success: true,
        data: undefined,
        message: 'Budget deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: 'Failed to delete budget'
      };
    }
  },
};
