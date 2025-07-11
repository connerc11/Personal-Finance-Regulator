import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Analytics from '../pages/Analytics';
import { AuthProvider } from '../contexts/AuthContext';
import { analyticsAPI } from '../services/apiService';

// Mock the API service
jest.mock('../services/apiService', () => ({
  analyticsAPI: {
    getDashboardData: jest.fn(),
    getMonthlyTrend: jest.fn(),
    getCategoryBreakdown: jest.fn(),
    getBudgetPerformance: jest.fn(),
    getFinancialGoals: jest.fn(),
    getFinancialInsights: jest.fn(),
    exportReport: jest.fn(),
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
const mockDashboardData = {
  totalIncome: 5000,
  totalExpenses: 3500,
  netIncome: 1500,
  savingsRate: 30,
  budgetUtilization: 70,
  financialScore: 85,
  monthlyComparison: {
    incomeChange: 5.2,
    expenseChange: -2.1,
    savingsChange: 12.5,
  },
};

const mockMonthlyTrend = [
  { month: 'Jan', income: 5000, expenses: 3500, savings: 1500 },
  { month: 'Feb', income: 5200, expenses: 3400, savings: 1800 },
  { month: 'Mar', income: 4800, expenses: 3600, savings: 1200 },
];

const mockCategoryBreakdown = [
  { category: 'Food & Dining', amount: 800, percentage: 23 },
  { category: 'Transportation', amount: 500, percentage: 14 },
  { category: 'Entertainment', amount: 300, percentage: 9 },
  { category: 'Utilities', amount: 400, percentage: 11 },
  { category: 'Shopping', amount: 600, percentage: 17 },
  { category: 'Other', amount: 900, percentage: 26 },
];

const mockBudgetPerformance = [
  { category: 'Food & Dining', budgeted: 600, spent: 800, performance: -33 },
  { category: 'Transportation', budgeted: 400, spent: 500, performance: -25 },
  { category: 'Entertainment', budgeted: 200, spent: 300, performance: -50 },
];

const mockFinancialGoals = [
  { name: 'Emergency Fund', target: 10000, current: 5000, progress: 50 },
  { name: 'Vacation', target: 3000, current: 2500, progress: 83 },
];

const mockInsights = [
  {
    id: '1',
    type: 'spending_pattern',
    title: 'High Spending on Dining',
    description: 'You spent 25% more on dining out this month.',
    severity: 'warning',
    category: 'Food & Dining',
    amount: 450,
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

describe('Analytics Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful API responses
    mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
      success: true,
      data: mockDashboardData,
      message: 'Dashboard data loaded successfully',
    });

    mockedAnalyticsAPI.getMonthlyTrend.mockResolvedValue({
      success: true,
      data: mockMonthlyTrend,
      message: 'Monthly trend loaded successfully',
    });

    mockedAnalyticsAPI.getCategoryBreakdown.mockResolvedValue({
      success: true,
      data: mockCategoryBreakdown,
      message: 'Category breakdown loaded successfully',
    });

    mockedAnalyticsAPI.getBudgetPerformance.mockResolvedValue({
      success: true,
      data: mockBudgetPerformance,
      message: 'Budget performance loaded successfully',
    });

    mockedAnalyticsAPI.getFinancialGoals.mockResolvedValue({
      success: true,
      data: mockFinancialGoals,
      message: 'Financial goals loaded successfully',
    });

    mockedAnalyticsAPI.getFinancialInsights.mockResolvedValue({
      success: true,
      data: mockInsights,
      message: 'Insights loaded successfully',
    });
  });

  describe('Component Rendering', () => {
    test('should render analytics page with header', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      // Check for header
      expect(screen.getByText('Financial Analytics')).toBeInTheDocument();
      expect(screen.getByText(/comprehensive view of your financial performance/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/total income/i) || screen.getByText(/income/i)).toBeInTheDocument();
      });
    });

    test('should display loading state initially', () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should display time range selector', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should have time range selector (6 months, 1 year, etc.)
        expect(screen.getByText(/6 months/i) || screen.getByText(/1 year/i) || screen.getByText(/time range/i)).toBeInTheDocument();
      });
    });
  });

  describe('Financial Overview', () => {
    test('should display key financial metrics', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for income
        expect(screen.getByText('$5,000') || screen.getByText('5000') || screen.getByText('5,000.00')).toBeInTheDocument();
        
        // Check for expenses
        expect(screen.getByText('$3,500') || screen.getByText('3500') || screen.getByText('3,500.00')).toBeInTheDocument();
        
        // Check for savings
        expect(screen.getByText('$1,500') || screen.getByText('1500') || screen.getByText('1,500.00')).toBeInTheDocument();
      });

      // Check for savings rate
      expect(screen.getByText('30%') || screen.getByText('30.0%')).toBeInTheDocument();
    });

    test('should display financial score', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('85') || screen.getByText('Financial Score: 85')).toBeInTheDocument();
      });
    });

    test('should show month-over-month comparisons', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show percentage changes
        expect(screen.getByText(/5.2%/i) || screen.getByText(/increase/i) || screen.getByText(/\+/)).toBeInTheDocument();
      });
    });
  });

  describe('Charts and Visualizations', () => {
    test('should display monthly trend chart', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show trend chart or related elements
        expect(screen.getByText(/trend/i) || screen.getByText(/monthly/i) || screen.getByText(/chart/i)).toBeInTheDocument();
      });
    });

    test('should display category breakdown chart', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show category breakdown
        expect(screen.getByText('Food & Dining')).toBeInTheDocument();
        expect(screen.getByText('Transportation')).toBeInTheDocument();
        expect(screen.getByText('Entertainment')).toBeInTheDocument();
      });

      // Should show percentages
      expect(screen.getByText('23%')).toBeInTheDocument();
      expect(screen.getByText('14%')).toBeInTheDocument();
    });

    test('should display budget performance chart', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show budget performance data
        expect(screen.getByText(/budget/i) || screen.getByText(/performance/i)).toBeInTheDocument();
        expect(screen.getByText(/budgeted/i) || screen.getByText(/spent/i)).toBeInTheDocument();
      });
    });

    test('should display financial goals progress', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show goals
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
        expect(screen.getByText('Vacation')).toBeInTheDocument();
        
        // Should show progress
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('83%')).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Features', () => {
    test('should allow changing time range', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(async () => {
        // Look for time range selector
        const timeRangeSelector = screen.getByLabelText(/time range/i) || 
                                 screen.getByText(/6 months/i) ||
                                 screen.getByRole('button', { name: /months/i });
        
        if (timeRangeSelector) {
          await userEvent.click(timeRangeSelector);
          
          // Should call API with new time range
          await waitFor(() => {
            expect(mockedAnalyticsAPI.getDashboardData).toHaveBeenCalled();
          });
        }
      });
    });

    test('should allow exporting reports', async () => {
      mockedAnalyticsAPI.exportReport.mockResolvedValue(new Blob(['test'], { type: 'application/pdf' }));

      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        const exportButton = screen.getByText(/export/i) || screen.getByText(/download/i);
        if (exportButton) {
          expect(exportButton).toBeInTheDocument();
        }
      });
    });

    test('should allow drilling down into specific categories', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Food & Dining')).toBeInTheDocument();
      });

      // Click on a category
      const categoryItem = screen.getByText('Food & Dining');
      await userEvent.click(categoryItem);

      // Should show more details or drill down
      // The exact behavior depends on your implementation
    });
  });

  describe('Insights and Recommendations', () => {
    test('should display financial insights', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show insights
        expect(screen.getByText('High Spending on Dining')).toBeInTheDocument();
        expect(screen.getByText(/25% more on dining/i)).toBeInTheDocument();
      });
    });

    test('should show actionable recommendations', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should show recommendations based on data
        expect(screen.getByText(/recommend/i) || screen.getByText(/consider/i) || screen.getByText(/tip/i)).toBeInTheDocument();
      });
    });

    test('should highlight areas for improvement', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should highlight negative budget performance
        expect(screen.getByText(/-33%/i) || screen.getByText(/over budget/i) || screen.getByText(/warning/i)).toBeInTheDocument();
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
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      mockedAnalyticsAPI.getDashboardData.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument();
      });
    });

    test('should handle missing data scenarios', async () => {
      mockedAnalyticsAPI.getDashboardData.mockResolvedValue({
        success: true,
        data: {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          savingsRate: 0,
          budgetUtilization: 0,
          financialScore: 0,
        },
        message: 'No data available',
      });

      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle zero/empty data gracefully
        expect(screen.getByText(/no data/i) || screen.getByText('$0') || screen.getByText('0%')).toBeInTheDocument();
      });
    });
  });

  describe('Data Accuracy', () => {
    test('should display correct calculations', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Net income should be income - expenses (5000 - 3500 = 1500)
        expect(screen.getByText('$1,500') || screen.getByText('1500')).toBeInTheDocument();
        
        // Savings rate should be (savings / income) * 100 = (1500 / 5000) * 100 = 30%
        expect(screen.getByText('30%')).toBeInTheDocument();
      });
    });

    test('should show correct category percentages', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Food & Dining: $800 out of total expenses should be 23%
        expect(screen.getByText('23%')).toBeInTheDocument();
        
        // Transportation: $500 should be 14%
        expect(screen.getByText('14%')).toBeInTheDocument();
      });
    });

    test('should display budget variance correctly', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Food & Dining: spent $800 vs budgeted $600 = -33% performance
        expect(screen.getByText(/-33%/i) || screen.getByText('33%') || screen.getByText('over')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    test('should load multiple data sources efficiently', async () => {
      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // All API calls should be made
        expect(mockedAnalyticsAPI.getDashboardData).toHaveBeenCalled();
        expect(mockedAnalyticsAPI.getMonthlyTrend).toHaveBeenCalled();
        expect(mockedAnalyticsAPI.getCategoryBreakdown).toHaveBeenCalled();
        expect(mockedAnalyticsAPI.getBudgetPerformance).toHaveBeenCalled();
      });
    });

    test('should handle large datasets without performance issues', async () => {
      // Mock large dataset
      const largeCategoryBreakdown = Array.from({ length: 50 }, (_, i) => ({
        category: `Category ${i}`,
        amount: Math.random() * 1000,
        percentage: Math.random() * 20,
      }));

      mockedAnalyticsAPI.getCategoryBreakdown.mockResolvedValue({
        success: true,
        data: largeCategoryBreakdown,
        message: 'Large dataset loaded',
      });

      render(
        <TestWrapper>
          <Analytics />
        </TestWrapper>
      );

      await waitFor(() => {
        // Should handle large datasets
        expect(screen.getByText('Category 0') || screen.getByText(/category/i)).toBeInTheDocument();
      });
    });
  });
});
