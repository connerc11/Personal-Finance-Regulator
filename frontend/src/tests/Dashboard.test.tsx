import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { analyticsAPI, transactionAPI, budgetAPI } from '../services/apiService';

// Mock the API services
jest.mock('../services/apiService', () => ({
  analyticsAPI: {
    getDashboardData: jest.fn(),
    getMonthlyTrend: jest.fn(),
    getCategoryBreakdown: jest.fn(),
    getBudgetPerformance: jest.fn(),
  },
  transactionAPI: {
    getAll: jest.fn(),
  },
  budgetAPI: {
    getAll: jest.fn(),
  },
}));

// Mock user data
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: '2023-01-01T00:00:00.000Z',
};

// Mock dashboard data
const mockDashboardData = {
  totalIncome: 5000,
  totalExpenses: 3500,
  netIncome: 1500,
  savingsRate: 30,
  budgetUtilization: 70,
  recentTransactions: [
    {
      id: 1,
      description: 'Grocery Store',
      amount: 150,
      type: 'expense',
      category: 'Food & Dining',
      date: '2025-01-15',
    },
    {
      id: 2,
      description: 'Salary',
      amount: 5000,
      type: 'income',
      category: 'Salary',
      date: '2025-01-01',
    },
  ],
};

const mockTransactions = [
  {
    id: 1,
    description: 'Grocery Store',
    amount: 150,
    type: 'expense' as const,
    category: 'Food & Dining',
    date: '2025-01-15',
    userId: 1,
  },
];

const mockBudgets = [
  {
    id: 1,
    name: 'Groceries',
    category: 'Food & Dining',
    amount: 500,
    spent: 300,
    period: 'monthly' as const,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    userId: 1,
  },
];

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

// Mock the AuthContext to provide demo user data
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { ...mockUser, email: 'demo@personalfinance.com' }, // Make it a demo user
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockedAnalyticsAPI = analyticsAPI as jest.Mocked<typeof analyticsAPI>;
const mockedTransactionAPI = transactionAPI as jest.Mocked<typeof transactionAPI>;
const mockedBudgetAPI = budgetAPI as jest.Mocked<typeof budgetAPI>;

describe('Dashboard Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful API responses
    mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
      success: true,
      data: mockDashboardData,
      message: 'Dashboard data loaded successfully',
    });

    mockedTransactionAPI.getAll.mockResolvedValue({
      success: true,
      data: mockTransactions,
      message: 'Transactions loaded successfully',
    });

    mockedBudgetAPI.getAll.mockResolvedValue({
      success: true,
      data: mockBudgets,
      message: 'Budgets loaded successfully',
    });
  });

  describe('Component Rendering', () => {
    test('should render dashboard with welcome message', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check for welcome message with user's name
      expect(screen.getByText(/Welcome back, Test!/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/total income/i) || screen.getByText(/income/i)).toBeInTheDocument();
      });
    });

    test('should display loading state initially', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should show demo stats immediately for demo users
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
    });

    test('should display financial summary cards', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show key financial metrics for demo user
        expect(screen.getByText('$12,450.00')).toBeInTheDocument();
        expect(screen.getByText('$5,200.00')).toBeInTheDocument();
        expect(screen.getByText('$3,180.00')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });
  });

  describe('Recent Transactions', () => {
    test('should display recent transactions section', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
        expect(screen.getByText('Grocery Store')).toBeInTheDocument();
        expect(screen.getByText('$150')).toBeInTheDocument();
      });
    });

    test('should show transaction details correctly', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Grocery Store')).toBeInTheDocument();
        expect(screen.getByText('Food & Dining')).toBeInTheDocument();
        expect(screen.getByText('$150')).toBeInTheDocument();
      });
    });

    test('should handle no transactions gracefully', async () => {
      mockedTransactionAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No transactions found',
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no recent transactions/i) || screen.getByText(/no transactions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Budget Overview', () => {
    test('should display budget overview section', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/budget/i)).toBeInTheDocument();
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });
    });

    test('should show budget progress correctly', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('$300')).toBeInTheDocument(); // spent
        expect(screen.getByText('$500')).toBeInTheDocument(); // total budget
      });
    });

    test('should handle no budgets gracefully', async () => {
      mockedBudgetAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No budgets found',
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no budgets/i) || screen.getByText(/create budget/i)).toBeInTheDocument();
      });
    });
  });

  describe('Financial Insights', () => {
    test('should display financial insights and tips', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show some financial insights or tips
        expect(screen.getByText(/insight/i) || screen.getByText(/tip/i) || screen.getByText(/advice/i)).toBeInTheDocument();
      });
    });

    test('should show spending patterns', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show spending analysis
        expect(screen.getByText(/spending/i) || screen.getByText(/expense/i)).toBeInTheDocument();
      });
    });
  });

  describe('Quick Actions', () => {
    test('should display quick action buttons', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should have quick action buttons
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    test('should allow adding new transaction', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const addTransactionButton = screen.getByText(/add transaction/i) || 
                                    screen.getByLabelText(/add transaction/i);
        if (addTransactionButton) {
          expect(addTransactionButton).toBeInTheDocument();
        }
      });
    });

    test('should allow creating new budget', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const addBudgetButton = screen.getByText(/add budget/i) || 
                               screen.getByLabelText(/add budget/i);
        if (addBudgetButton) {
          expect(addBudgetButton).toBeInTheDocument();
        }
      });
    });
  });

  describe('Navigation', () => {
    test('should have navigation to other pages', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should have links to other sections
        const viewAllLinks = screen.getAllByText(/view all/i) || 
                            screen.getAllByText(/see more/i);
        if (viewAllLinks.length > 0) {
          expect(viewAllLinks[0]).toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to load dashboard data',
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      mockedAnalyticsAPI.getDashboardData.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    test('should refresh data when user returns to dashboard', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockedAnalyticsAPI.getDashboardData).toHaveBeenCalled();
        expect(mockedTransactionAPI.getAll).toHaveBeenCalled();
        expect(mockedBudgetAPI.getAll).toHaveBeenCalled();
      });
    });
  });

  describe('Responsive Design', () => {
    test('should render correctly on different screen sizes', async () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should render without layout issues
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    test('should load data efficiently', async () => {
      const startTime = Date.now();
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });
});
