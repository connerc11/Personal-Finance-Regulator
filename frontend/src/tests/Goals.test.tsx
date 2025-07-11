import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Goals from '../pages/Goals';
import { AuthProvider } from '../contexts/AuthContext';
import { goalsAPI } from '../services/apiService';
import { FinancialGoal } from '../types';

// Mock the API service
jest.mock('../services/apiService', () => ({
  goalsAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateProgress: jest.fn(),
    markCompleted: jest.fn(),
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

// Mock goals data
const mockGoals: FinancialGoal[] = [
  {
    id: 1,
    title: 'Emergency Fund',
    description: 'Build a 6-month emergency fund',
    targetAmount: 10000,
    currentAmount: 5000,
    category: 'Emergency Fund',
    priority: 'high',
    targetDate: '2025-12-31',
    isCompleted: false,
    userId: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    progress: 50,
    monthlySavingsNeeded: 500,
  },
  {
    id: 2,
    title: 'Vacation Fund',
    description: 'Save for European vacation',
    targetAmount: 5000,
    currentAmount: 5000,
    category: 'Vacation/Travel',
    priority: 'medium',
    targetDate: '2025-06-01',
    isCompleted: true,
    userId: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    progress: 100,
    monthlySavingsNeeded: 0,
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

const mockedGoalsAPI = goalsAPI as jest.Mocked<typeof goalsAPI>;

describe('Goals Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful API responses
    mockedGoalsAPI.getAll.mockResolvedValue({
      success: true,
      data: mockGoals,
      message: 'Goals loaded successfully',
    });
    
    mockedGoalsAPI.create.mockResolvedValue({
      success: true,
      data: mockGoals[0],
      message: 'Goal created successfully',
    });
    
    mockedGoalsAPI.update.mockResolvedValue({
      success: true,
      data: mockGoals[0],
      message: 'Goal updated successfully',
    });
    
    mockedGoalsAPI.delete.mockResolvedValue({
      success: true,
      data: undefined,
      message: 'Goal deleted successfully',
    });
  });

  describe('Component Rendering', () => {
    test('should render goals page with header and summary cards', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      // Check for header
      expect(screen.getByText('Financial Goals')).toBeInTheDocument();
      expect(screen.getByText('Set, track, and achieve your financial aspirations')).toBeInTheDocument();

      // Wait for goals to load
      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Check for summary cards
      expect(screen.getByText('Active Goals')).toBeInTheDocument();
      expect(screen.getByText('Total Target')).toBeInTheDocument();
      expect(screen.getByText('Total Saved')).toBeInTheDocument();
      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    });

    test('should display loading state initially', () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should display no goals message when no goals exist', async () => {
      mockedGoalsAPI.getAll.mockResolvedValue({
        success: true,
        data: [],
        message: 'No goals found',
      });

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No Financial Goals Yet')).toBeInTheDocument();
        expect(screen.getByText('Start your financial journey by setting your first goal!')).toBeInTheDocument();
      });
    });

    test('should display error message when API fails', async () => {
      mockedGoalsAPI.getAll.mockResolvedValue({
        success: false,
        data: [],
        message: 'Failed to load goals',
      });

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load goals')).toBeInTheDocument();
      });
    });
  });

  describe('Goal Management', () => {
    test('should open create goal dialog when FAB is clicked', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      const fab = screen.getByLabelText(/add new goal/i);
      await userEvent.click(fab);

      expect(screen.getByText('Create New Financial Goal')).toBeInTheDocument();
      expect(screen.getByLabelText(/goal title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target amount/i)).toBeInTheDocument();
    });

    test('should create a new goal successfully', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Open create dialog
      const fab = screen.getByLabelText(/add new goal/i);
      await userEvent.click(fab);

      // Fill form
      await userEvent.type(screen.getByLabelText(/goal title/i), 'New Car');
      await userEvent.type(screen.getByLabelText(/target amount/i), '25000');
      await userEvent.type(screen.getByLabelText(/current amount/i), '5000');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Car Purchase');
      await userEvent.selectOptions(screen.getByLabelText(/priority/i), 'high');
      await userEvent.type(screen.getByLabelText(/target date/i), '2025-12-31');
      await userEvent.type(screen.getByLabelText(/description/i), 'Save for a new car');

      // Submit form
      const createButton = screen.getByRole('button', { name: /create goal/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(mockedGoalsAPI.create).toHaveBeenCalledWith({
          title: 'New Car',
          description: 'Save for a new car',
          targetAmount: 25000,
          currentAmount: 5000,
          category: 'Car Purchase',
          priority: 'high',
          targetDate: '2025-12-31',
          isCompleted: false,
          userId: 1,
        });
      });
    });

    test('should edit an existing goal', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Click edit button
      const editButtons = screen.getAllByLabelText(/edit/i);
      await userEvent.click(editButtons[0]);

      expect(screen.getByText('Edit Financial Goal')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    });

    test('should delete a goal', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockedGoalsAPI.delete).toHaveBeenCalledWith(1);
      });
    });

    test('should update goal progress', async () => {
      // Mock window.prompt
      const mockPrompt = jest.fn().mockReturnValue('7000');
      global.prompt = mockPrompt;

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Click update progress button
      const updateButton = screen.getByText(/update progress/i);
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockPrompt).toHaveBeenCalled();
        expect(mockedGoalsAPI.updateProgress).toHaveBeenCalledWith(1, 7000);
      });
    });

    test('should mark goal as completed', async () => {
      // Mock a goal that's ready to be completed
      const completableGoal = {
        ...mockGoals[0],
        currentAmount: 10000, // Equal to target amount
      };

      mockedGoalsAPI.getAll.mockResolvedValue({
        success: true,
        data: [completableGoal],
        message: 'Goals loaded successfully',
      });

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Click mark as completed button
      const completeButton = screen.getByText(/mark as completed/i);
      await userEvent.click(completeButton);

      await waitFor(() => {
        expect(mockedGoalsAPI.markCompleted).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Data Display', () => {
    test('should display correct summary statistics', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Check active goals count (should be 1, since one goal is completed)
      expect(screen.getByText('1')).toBeInTheDocument(); // Active goals

      // Check total target amount (only active goals)
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();

      // Check total saved amount (only active goals)
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();

      // Check overall progress (50%)
      expect(screen.getByText('50.0%')).toBeInTheDocument();
    });

    test('should display goal cards with correct information', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Check goal details
      expect(screen.getByText('Build a 6-month emergency fund')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00 / $10,000.00')).toBeInTheDocument();
      expect(screen.getByText('50.0%')).toBeInTheDocument();
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    test('should display savings strategies when goals exist', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Check for savings strategies section
      expect(screen.getByText('AI-Powered Savings Strategies')).toBeInTheDocument();
      expect(screen.getByText('Smart strategies to help you reach your goals faster')).toBeInTheDocument();
      expect(screen.getByText('Automate Your Savings')).toBeInTheDocument();
      expect(screen.getByText('Side Hustle Income')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should disable create button when required fields are missing', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Open create dialog
      const fab = screen.getByLabelText(/add new goal/i);
      await userEvent.click(fab);

      // Create button should be disabled initially
      const createButton = screen.getByRole('button', { name: /create goal/i });
      expect(createButton).toBeDisabled();

      // Fill required fields
      await userEvent.type(screen.getByLabelText(/goal title/i), 'Test Goal');
      await userEvent.type(screen.getByLabelText(/target amount/i), '1000');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Other');
      await userEvent.type(screen.getByLabelText(/target date/i), '2025-12-31');

      // Now button should be enabled
      expect(createButton).not.toBeDisabled();
    });

    test('should show monthly savings calculation', async () => {
      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Open create dialog
      const fab = screen.getByLabelText(/add new goal/i);
      await userEvent.click(fab);

      // Fill form with values that will trigger calculation
      await userEvent.type(screen.getByLabelText(/goal title/i), 'Test Goal');
      await userEvent.type(screen.getByLabelText(/target amount/i), '12000');
      await userEvent.type(screen.getByLabelText(/current amount/i), '0');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Other');
      await userEvent.type(screen.getByLabelText(/target date/i), '2025-12-31');

      // Should show monthly savings calculation
      await waitFor(() => {
        expect(screen.getByText(/save approximately/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      mockedGoalsAPI.create.mockResolvedValue({
        success: false,
        data: {} as FinancialGoal,
        message: 'Failed to create goal',
      });

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });

      // Try to create a goal
      const fab = screen.getByLabelText(/add new goal/i);
      await userEvent.click(fab);

      // Fill form
      await userEvent.type(screen.getByLabelText(/goal title/i), 'Test Goal');
      await userEvent.type(screen.getByLabelText(/target amount/i), '1000');
      await userEvent.selectOptions(screen.getByLabelText(/category/i), 'Other');
      await userEvent.type(screen.getByLabelText(/target date/i), '2025-12-31');

      // Submit form
      const createButton = screen.getByRole('button', { name: /create goal/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to create goal')).toBeInTheDocument();
      });
    });

    test('should handle network errors', async () => {
      mockedGoalsAPI.getAll.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <Goals />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed to load goals. Please try again.')).toBeInTheDocument();
      });
    });
  });
});
