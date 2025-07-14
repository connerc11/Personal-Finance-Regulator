import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CashCoach from '../pages/CashCoach';
import { AuthProvider } from '../contexts/AuthContext';
import { analyticsAPI, transactionAPI, budgetAPI, scheduledPurchaseAPI } from '../services/apiService';

// Mock the API services
jest.mock('../services/apiService', () => ({
  analyticsAPI: {
    getDashboardData: jest.fn(),
    getMonthlyTrend: jest.fn(),
    getCategoryBreakdown: jest.fn(),
    getBudgetPerformance: jest.fn(),
    getFinancialGoals: jest.fn(),
    getFinancialInsights: jest.fn(),
  },
  transactionAPI: {
    getAll: jest.fn(),
  },
  budgetAPI: {
    getAll: jest.fn(),
  },
  scheduledPurchaseAPI: {
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

// Mock analytics data
const mockAnalyticsData = {
  totalIncome: 5000,
  totalExpenses: 3500,
  savingsRate: 30,
  budgetUtilization: 70,
  financialScore: 85,
};

const mockTransactions = [
  {
    id: 1,
    description: 'Salary',
    amount: 5000,
    type: 'income' as const,
    category: 'Salary',
    date: '2025-01-01',
    userId: 1,
  },
  {
    id: 2,
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
    period: 'MONTHLY' as const,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    userId: 1,
  },
];

const mockScheduledPurchases = [
  {
    id: 1,
    name: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    frequency: 'monthly' as const,
    nextDue: '2025-02-01',
    isActive: true,
    userId: 1,
  },
];

const mockInsights = [
  {
    id: '1',
    type: 'spending_pattern',
    title: 'High Spending on Dining',
    description: 'You spent 25% more on dining out this month compared to last month.',
    severity: 'warning' as const,
    actionable: true,
    category: 'Food & Dining',
    amount: 450,
    suggestion: 'Consider cooking more meals at home to save money.',
    date: '2025-01-20',
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

// Mock the AuthContext to provide user data
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
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
const mockedScheduledPurchaseAPI = scheduledPurchaseAPI as jest.Mocked<typeof scheduledPurchaseAPI>;

describe('CashCoach Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful API responses
    mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
      success: true,
      data: mockAnalyticsData,
      message: 'Analytics data loaded successfully',
    });

    mockedAnalyticsAPI.getFinancialInsights.mockResolvedValue({
      success: true,
      data: mockInsights,
      message: 'Insights loaded successfully',
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

    mockedScheduledPurchaseAPI.getAll.mockResolvedValue({
      success: true,
      data: mockScheduledPurchases,
      message: 'Scheduled purchases loaded successfully',
    });
  });

  describe('Component Rendering', () => {
    test('should render cash coach page with header', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      // Check for header
      expect(screen.getByText('Cash Coach AI')).toBeInTheDocument();
      expect(screen.getByText('Analyzing your financial patterns...')).toBeInTheDocument();

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText(/financial/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('should display loading state initially', () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      // Should show some loading indicator
      expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeTruthy();
    });

    test('should display AI coach avatar and branding', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      // Check for AI coach branding elements
      expect(screen.getByText('Cash Coach AI')).toBeInTheDocument();
      
      await waitFor(() => {
        // Should have AI-related icons or avatars
        const aiElements = screen.getAllByTestId(/ai|coach|brain|psychology/i);
        expect(aiElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Financial Analysis', () => {
    test('should display financial score and metrics', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should display financial score
        expect(screen.getByText('85') || screen.getByText('Financial Score: 85')).toBeInTheDocument();
      });

      // Should display key metrics
      expect(screen.getByText(/income/i)).toBeInTheDocument();
      expect(screen.getByText(/expenses/i)).toBeInTheDocument();
      expect(screen.getByText(/savings/i)).toBeInTheDocument();
    });

    test('should show spending analysis and insights', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show insights about spending patterns
        expect(screen.getByText(/spending/i) || screen.getByText(/insight/i)).toBeInTheDocument();
      });

      // Check for specific insight
      await waitFor(() => {
        expect(screen.getByText(/dining/i) || screen.getByText(/food/i)).toBeInTheDocument();
      });
    });

    test('should display coaching recommendations', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show recommendations or suggestions
        expect(screen.getByText(/recommend/i) || screen.getByText(/suggest/i) || screen.getByText(/tip/i)).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Features', () => {
    test('should allow user to ask questions or get advice', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Look for input field or chat interface
        const chatInput = screen.getByPlaceholderText(/ask|question|advice/i) || 
                         screen.getByLabelText(/message|question/i);
        if (chatInput) {
          expect(chatInput).toBeInTheDocument();
        }
      });
    });

    test('should provide actionable advice buttons', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Look for action buttons
        const actionButtons = screen.getAllByRole('button');
        expect(actionButtons.length).toBeGreaterThan(0);
      });
    });

    test('should allow refreshing analysis', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Look for refresh button
        const refreshButton = screen.getByLabelText(/refresh/i) || 
                             screen.getByText(/refresh/i) ||
                             screen.getByRole('button', { name: /refresh/i });
        if (refreshButton) {
          expect(refreshButton).toBeInTheDocument();
        }
      });
    });
  });

  describe('Goal Tracking', () => {
    test('should display financial goals and progress', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show goals or progress tracking
        expect(screen.getByText(/goal/i) || screen.getByText(/progress/i) || screen.getByText(/target/i)).toBeInTheDocument();
      });
    });

    test('should show coaching goals based on user data', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should generate and display coaching goals
        expect(screen.getByText(/emergency/i) || screen.getByText(/save/i) || screen.getByText(/budget/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Integration', () => {
    test('should integrate with user transactions', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should reference user's actual transaction data
        expect(mockedTransactionAPI.getAll).toHaveBeenCalled();
      });
    });

    test('should integrate with user budgets', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should reference user's budget data
        expect(mockedBudgetAPI.getAll).toHaveBeenCalled();
      });
    });

    test('should integrate with scheduled purchases', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should reference user's scheduled purchases
        expect(mockedScheduledPurchaseAPI.getAll).toHaveBeenCalled();
      });
    });
  });

  describe('Personalization', () => {
    test('should address user by name', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should use user's name in the interface
        expect(screen.getByText(/test/i) || screen.getByText(mockUser.firstName)).toBeInTheDocument();
      });
    });

    test('should provide personalized recommendations', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show personalized content based on user data
        expect(screen.getByText(/your/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to load analytics data',
      });

      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show error message or fallback content
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i) || screen.getByText(/try again/i)).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      mockedAnalyticsAPI.getDashboardData.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle network errors gracefully
        expect(screen.getByText(/error/i) || screen.getByText(/connection/i)).toBeInTheDocument();
      });
    });

    test('should handle missing data scenarios', async () => {
      // Mock empty data responses
      mockedTransactionAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No transactions found',
      });

      mockedBudgetAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No budgets found',
      });

      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle empty data gracefully
        expect(screen.getByText(/no data/i) || screen.getByText(/get started/i) || screen.getByText(/add/i)).toBeInTheDocument();
      });
    });
  });

  describe('AI Features', () => {
    test('should display AI-generated insights', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show AI-generated insights
        expect(screen.getByText(/insight/i) || screen.getByText(/analysis/i) || screen.getByText(/pattern/i)).toBeInTheDocument();
      });
    });

    test('should provide smart recommendations', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show smart recommendations
        expect(screen.getByText(/recommend/i) || screen.getByText(/consider/i) || screen.getByText(/suggest/i)).toBeInTheDocument();
      });
    });

    test('should show coaching tips and strategies', async () => {
      render(
        <TestWrapper>
          <CashCoach />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should display coaching content
        expect(screen.getByText(/tip/i) || screen.getByText(/strategy/i) || screen.getByText(/advice/i)).toBeInTheDocument();
      });
    });
  });
});
