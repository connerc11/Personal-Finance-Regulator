import { FinancialGoal, ApiResponse } from '../types';

const GOALS_STORAGE_KEY = 'personal_finance_goals';

// Mock API service that simulates backend responses while using localStorage
export const mockGoalsAPI = {
  getAll: async (): Promise<ApiResponse<FinancialGoal[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      return {
        success: true,
        data: goals,
        message: 'Goals loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to load goals'
      };
    }
  },

  create: async (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'progress' | 'monthlySavingsNeeded'>): Promise<ApiResponse<FinancialGoal>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      const newGoal: FinancialGoal = {
        ...goal,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        progress: (goal.currentAmount / goal.targetAmount) * 100,
        monthlySavingsNeeded: calculateMonthlySavingsNeeded({
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate
        })
      };

      goals.push(newGoal);
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));

      return {
        success: true,
        data: newGoal,
        message: 'Goal created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as FinancialGoal,
        message: 'Failed to create goal'
      };
    }
  },

  update: async (id: number, goalUpdate: Partial<FinancialGoal>): Promise<ApiResponse<FinancialGoal>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      const goalIndex = goals.findIndex((g: FinancialGoal) => g.id === id);
      if (goalIndex === -1) {
        return {
          success: false,
          data: {} as FinancialGoal,
          message: 'Goal not found'
        };
      }

      const updatedGoal = {
        ...goals[goalIndex],
        ...goalUpdate,
        progress: ((goalUpdate.currentAmount || goals[goalIndex].currentAmount) / 
                  (goalUpdate.targetAmount || goals[goalIndex].targetAmount)) * 100,
        monthlySavingsNeeded: calculateMonthlySavingsNeeded({
          targetAmount: goalUpdate.targetAmount || goals[goalIndex].targetAmount,
          currentAmount: goalUpdate.currentAmount || goals[goalIndex].currentAmount,
          targetDate: goalUpdate.targetDate || goals[goalIndex].targetDate
        })
      };

      goals[goalIndex] = updatedGoal;
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));

      return {
        success: true,
        data: updatedGoal,
        message: 'Goal updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as FinancialGoal,
        message: 'Failed to update goal'
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      const filteredGoals = goals.filter((g: FinancialGoal) => g.id !== id);
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(filteredGoals));

      return {
        success: true,
        data: undefined,
        message: 'Goal deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: 'Failed to delete goal'
      };
    }
  },

  updateProgress: async (id: number, currentAmount: number): Promise<ApiResponse<FinancialGoal>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      const goalIndex = goals.findIndex((g: FinancialGoal) => g.id === id);
      if (goalIndex === -1) {
        return {
          success: false,
          data: {} as FinancialGoal,
          message: 'Goal not found'
        };
      }

      const updatedGoal = {
        ...goals[goalIndex],
        currentAmount,
        progress: (currentAmount / goals[goalIndex].targetAmount) * 100,
        monthlySavingsNeeded: calculateMonthlySavingsNeeded({
          targetAmount: goals[goalIndex].targetAmount,
          currentAmount,
          targetDate: goals[goalIndex].targetDate
        })
      };

      goals[goalIndex] = updatedGoal;
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));

      return {
        success: true,
        data: updatedGoal,
        message: 'Progress updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as FinancialGoal,
        message: 'Failed to update progress'
      };
    }
  },

  markCompleted: async (id: number): Promise<ApiResponse<FinancialGoal>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      const goals = stored ? JSON.parse(stored) : [];
      
      const goalIndex = goals.findIndex((g: FinancialGoal) => g.id === id);
      if (goalIndex === -1) {
        return {
          success: false,
          data: {} as FinancialGoal,
          message: 'Goal not found'
        };
      }

      const updatedGoal = {
        ...goals[goalIndex],
        isCompleted: true,
        currentAmount: goals[goalIndex].targetAmount,
        progress: 100
      };

      goals[goalIndex] = updatedGoal;
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));

      return {
        success: true,
        data: updatedGoal,
        message: 'Goal marked as completed'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as FinancialGoal,
        message: 'Failed to mark goal as completed'
      };
    }
  }
};

function calculateMonthlySavingsNeeded({ targetAmount, currentAmount, targetDate }: {
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}) {
  const today = new Date();
  const target = new Date(targetDate);
  const monthsRemaining = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const remainingAmount = targetAmount - currentAmount;
  return Math.max(0, remainingAmount / monthsRemaining);
}
