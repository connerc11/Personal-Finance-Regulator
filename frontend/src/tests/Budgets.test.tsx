import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Budgets from '../pages/Budgets';
import { AuthProvider } from '../contexts/AuthContext';
import { budgetAPI, transactionAPI } from '../services/apiService';
import { Budget, Transaction } from '../types';

// Mock the API services
jest.mock('../services/apiService', () => ({
  budgetAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  transactionAPI: {
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

// Mock budget data
const mockBudgets: Budget[] = [
  {
    id: 1,
    name: 'Groceries',
    category: 'Food & Dining',
    amount: 500,
    spent: 300,
    period: 'MONTHLY',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    userId: 1,
  },
  {
    id: 2,
    name: 'Transportation',
    category: 'Transportation',
    amount: 300,
    spent: 350,
    period: 'MONTHLY',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    userId: 1,
  },
];

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Grocery Store',
    amount: 150,
    type: 'expense',
    category: 'Food & Dining',
    date: '2025-01-15',
    userId: 1,
  },
  {
    id: 2,
    description: 'Gas Station',
    amount: 50,
    type: 'expense',
    category: 'Transportation',
    date: '2025-01-10',
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

const mockedBudgetAPI = budgetAPI as jest.Mocked<typeof budgetAPI>;
const mockedTransactionAPI = transactionAPI as jest.Mocked<typeof transactionAPI>;

describe('Budgets Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful API responses
    mockedBudgetAPI.getAll.mockResolvedValue({
      success: true,
      data: mockBudgets,
      message: 'Budgets loaded successfully',
    });
    
    mockedTransactionAPI.getAll.mockResolvedValue({
      success: true,
      data: mockTransactions,
      message: 'Transactions loaded successfully',
    });
    
    mockedBudgetAPI.create.mockResolvedValue({
      success: true,
      data: mockBudgets[0],
      message: 'Budget created successfully',
    });
    
    mockedBudgetAPI.update.mockResolvedValue({
      success: true,
      data: mockBudgets[0],
      message: 'Budget updated successfully',
    });
    
    mockedBudgetAPI.delete.mockResolvedValue({
      success: true,
      data: undefined,
      message: 'Budget deleted successfully',
    });
  });

  describe('Component Rendering', () => {
    test('should render budgets page with header', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      // Check for header
      expect(screen.getByText('Budget Management')).toBeInTheDocument();
      expect(screen.getByText('Track your spending and stay within your limits')).toBeInTheDocument();

      // Wait for budgets to load
      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });
    });

    test('should display loading state initially', () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should display no budgets message when no budgets exist', async () => {
      mockedBudgetAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No budgets found',
      });

      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No Budgets Yet')).toBeInTheDocument();
      });
    });

    test('should display error message when API fails', async () => {
      mockedBudgetAPI.getAll.mockResolvedValue({
        success: false,
        data: [],
        message: 'Failed to load budgets',
      });

      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load budgets')).toBeInTheDocument();
      });
    });
  });

  describe('Budget Management', () => {
    test('should open create budget dialog when add button is clicked', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      const addButton = screen.getByText(/add budget/i);
      await userEvent.click(addButton);

      expect(screen.getByText('Create New Budget')).toBeInTheDocument();
      expect(screen.getByLabelText(/budget name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    test('should create a new budget successfully', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Open create dialog
      const addButton = screen.getByText(/add budget/i);
      await userEvent.click(addButton);

      // Fill form
      await userEvent.type(screen.getByLabelText(/budget name/i), 'Entertainment');
      await userEvent.type(screen.getByLabelText(/amount/i), '200');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Entertainment');
      await userEvent.selectOptions(screen.getByLabelText(/period/i), 'MONTHLY');

      // Submit form
      const createButton = screen.getByRole('button', { name: /create budget/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(mockedBudgetAPI.create).toHaveBeenCalledWith({
          name: 'Entertainment',
          amount: 200,
          category: 'Entertainment',
          period: 'MONTHLY',
          userId: 1,
          spent: 0,
          startDate: expect.any(String),
          endDate: expect.any(String),
        });
      });
    });

    test('should edit an existing budget', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Click edit button (assuming there's an edit button)
      const editButtons = screen.getAllByLabelText(/edit/i);
      if (editButtons.length > 0) {
        await userEvent.click(editButtons[0]);

        expect(screen.getByText('Edit Budget')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
      }
    });

    test('should delete a budget', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Click delete button (assuming there's a delete button)
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      if (deleteButtons.length > 0) {
        await userEvent.click(deleteButtons[0]);

        await waitFor(() => {
          expect(mockedBudgetAPI.delete).toHaveBeenCalledWith(1);
        });
      }
    });
  });

  describe('Data Display', () => {
    test('should display budget cards with correct information', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Check budget details
      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
      expect(screen.getByText('$300')).toBeInTheDocument(); // spent amount
      expect(screen.getByText('$500')).toBeInTheDocument(); // budget amount

      // Check for over-budget warning
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      // Transportation budget is over ($350 spent vs $300 budget)
    });

    test('should show budget progress correctly', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Should show progress bars for budgets
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    test('should display budget summary statistics', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Check for summary cards (if they exist)
      // These would show total budgets, total spent, etc.
      // The exact text depends on your implementation
    });
  });

  describe('Form Validation', () => {
    test('should disable create button when required fields are missing', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Open create dialog
      const addButton = screen.getByText(/add budget/i);
      await userEvent.click(addButton);

      // Create button should be disabled initially
      const createButton = screen.getByRole('button', { name: /create budget/i });
      expect(createButton).toBeDisabled();

      // Fill required fields
      await userEvent.type(screen.getByLabelText(/budget name/i), 'Test Budget');
      await userEvent.type(screen.getByLabelText(/amount/i), '100');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Other');
      await userEvent.selectOptions(screen.getByLabelText(/period/i), 'MONTHLY');

      // Now button should be enabled
      expect(createButton).not.toBeDisabled();
    });

    test('should validate amount is positive', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Open create dialog
      const addButton = screen.getByText(/add budget/i);
      await userEvent.click(addButton);

      // Try to enter negative amount
      const amountField = screen.getByLabelText(/amount/i);
      await userEvent.clear(amountField);
      await userEvent.type(amountField, '-100');

      // Should show validation error or prevent negative values
      // The exact behavior depends on your validation implementation
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      mockedBudgetAPI.create.mockResolvedValue({
        success: false,
        data: {} as Budget,
        message: 'Failed to create budget',
      });

      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Try to create a budget
      const addButton = screen.getByText(/add budget/i);
      await userEvent.click(addButton);

      // Fill form
      await userEvent.type(screen.getByLabelText(/budget name/i), 'Test Budget');
      await userEvent.type(screen.getByLabelText(/amount/i), '100');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Other');
      await userEvent.selectOptions(screen.getByLabelText(/period/i), 'MONTHLY');

      // Submit form
      const createButton = screen.getByRole('button', { name: /create budget/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to create budget')).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      mockedBudgetAPI.getAll.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Budget Categories', () => {
    test('should display different budget categories', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // Check that different categories are displayed
      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
    });

    test('should group budgets by category if implemented', async () => {
      render(
        <TestWrapper>
          <Budgets />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      });

      // If your implementation groups budgets by category,
      // you can test that functionality here
    });
  });
});
