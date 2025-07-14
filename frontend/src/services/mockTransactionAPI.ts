import { Transaction, ApiResponse } from '../types';

const TRANSACTIONS_STORAGE_KEY = 'personal_finance_transactions';

// Sample transactions data
const sampleTransactions: Transaction[] = [
  {
    id: 1,
    amount: 1500,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-07-01',
    type: 'INCOME',
    userId: 999,
  },
  {
    id: 2,
    amount: 800,
    category: 'Rent',
    description: 'Monthly rent payment',
    date: '2025-07-02',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 3,
    amount: 250,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: '2025-07-03',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 4,
    amount: 100,
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2025-07-04',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 5,
    amount: 50,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '2025-07-05',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 6,
    amount: 200,
    category: 'Food',
    description: 'Restaurant dinner',
    date: '2025-06-28',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 7,
    amount: 75,
    category: 'Transportation',
    description: 'Gas',
    date: '2025-06-25',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 8,
    amount: 300,
    category: 'Shopping',
    description: 'Clothing',
    date: '2025-06-20',
    type: 'EXPENSE',
    userId: 999,
  },
  {
    id: 9,
    amount: 1500,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-06-01',
    type: 'INCOME',
    userId: 999,
  },
  {
    id: 10,
    amount: 800,
    category: 'Rent',
    description: 'Monthly rent payment',
    date: '2025-06-02',
    type: 'EXPENSE',
    userId: 999,
  },
];

// Initialize localStorage with sample data if empty (only for demo user)
const initializeDemoData = () => {
  // Only initialize sample data if this is for the demo user (ID 999)
  // For new users, we want an empty transaction list
  const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  if (!stored) {
    // Initialize empty array instead of sample data
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Initialize demo data specifically for demo user
export const initializeTransactionDemoData = () => {
  // Force set sample data for demo user
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(sampleTransactions));
};

// Mock API service that simulates backend responses while using localStorage
export const mockTransactionAPI = {
  getAll: async (): Promise<ApiResponse<Transaction[]>> => {
    // Initialize empty data for new users
    initializeDemoData();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      const transactions = stored ? JSON.parse(stored) : [];
      
      return {
        success: true,
        data: transactions,
        message: 'Transactions loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load transactions'
      };
    }
  },

  create: async (transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      const transactions = stored ? JSON.parse(stored) : [];
      
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now(),
      };

      transactions.push(newTransaction);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

      return {
        success: true,
        data: newTransaction,
        message: 'Transaction created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Transaction,
        message: 'Failed to create transaction'
      };
    }
  },

  update: async (id: number, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      const transactions = stored ? JSON.parse(stored) : [];
      
      const index = transactions.findIndex((t: Transaction) => t.id === id);
      if (index === -1) {
        return {
          success: false,
          data: {} as Transaction,
          message: 'Transaction not found'
        };
      }

      transactions[index] = { ...transactions[index], ...updates };
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

      return {
        success: true,
        data: transactions[index],
        message: 'Transaction updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Transaction,
        message: 'Failed to update transaction'
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      const transactions = stored ? JSON.parse(stored) : [];
      
      const filteredTransactions = transactions.filter((t: Transaction) => t.id !== id);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(filteredTransactions));

      return {
        success: true,
        data: undefined,
        message: 'Transaction deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: 'Failed to delete transaction'
      };
    }
  },
};
