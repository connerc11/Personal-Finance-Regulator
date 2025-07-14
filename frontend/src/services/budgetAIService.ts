import { Transaction } from '../types';
import { transactionAPI } from './apiService';

export interface BudgetRecommendation {
  category: string;
  recommendedAmount: number;
  averageSpending: number;
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  reasoning: string;
}

export interface BudgetAnalysis {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  recommendations: BudgetRecommendation[];
  suggestedSavingsGoal: number;
  emergencyFundRecommendation: number;
}

export const budgetAIService = {
  /**
   * Analyze user's transaction history and generate budget recommendations
   */
  generateBudgetRecommendations: async (userId: number): Promise<BudgetAnalysis> => {
    try {
      // Get user's transaction history
      const transactionsResponse = await transactionAPI.getAll(userId);
      const transactions = transactionsResponse.success ? transactionsResponse.data : [];

      if (transactions.length === 0) {
        return generateEmptyBudgetTemplate();
      }

      // Analyze the last 3 months of data
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const recentTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transactionDate || t.date);
        return transactionDate >= threeMonthsAgo;
      });

      return analyzeTransactionsAndGenerateRecommendations(recentTransactions);
    } catch (error) {
      console.error('Error generating budget recommendations:', error);
      return generateEmptyBudgetTemplate();
    }
  },

  /**
   * Generate starter budgets for users with limited transaction history
   */
  generateStarterBudgets: (monthlyIncome: number): BudgetRecommendation[] => {
    // 50/30/20 rule as baseline
    const needs = monthlyIncome * 0.5;
    const wants = monthlyIncome * 0.3;
    const savings = monthlyIncome * 0.2;

    return [
      {
        category: 'Groceries',
        recommendedAmount: needs * 0.3, // 15% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.7,
        reasoning: 'Based on 50/30/20 rule - essential food expenses typically represent 15% of income'
      },
      {
        category: 'Transportation',
        recommendedAmount: needs * 0.3, // 15% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.7,
        reasoning: 'Transportation costs including gas, public transit, car payments typically 15% of income'
      },
      {
        category: 'Bills & Utilities',
        recommendedAmount: needs * 0.2, // 10% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.8,
        reasoning: 'Utilities, phone, internet typically represent 10% of monthly income'
      },
      {
        category: 'Entertainment',
        recommendedAmount: wants * 0.4, // 12% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.6,
        reasoning: 'Entertainment and leisure activities from the "wants" category'
      },
      {
        category: 'Food & Dining',
        recommendedAmount: wants * 0.3, // 9% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.6,
        reasoning: 'Dining out and non-essential food expenses'
      },
      {
        category: 'Shopping',
        recommendedAmount: wants * 0.3, // 9% of income
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.6,
        reasoning: 'Clothing, personal items, and discretionary purchases'
      },
      {
        category: 'Savings',
        recommendedAmount: savings,
        averageSpending: 0,
        spendingTrend: 'stable',
        confidence: 0.9,
        reasoning: 'Emergency fund and savings - 20% of income recommended'
      }
    ];
  }
};

function generateEmptyBudgetTemplate(): BudgetAnalysis {
  return {
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0,
    recommendations: [],
    suggestedSavingsGoal: 0,
    emergencyFundRecommendation: 0
  };
}

function analyzeTransactionsAndGenerateRecommendations(transactions: Transaction[]): BudgetAnalysis {
  // Calculate income and expenses
  const income = transactions
    .filter(t => t.type === 'INCOME' || t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === 'EXPENSE' || t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Group expenses by category
  const categorySpending = new Map<string, number[]>();
  
  transactions
    .filter(t => t.type === 'EXPENSE' || t.type === 'expense')
    .forEach(transaction => {
      const category = normalizeCategory(transaction.category);
      const amount = Math.abs(transaction.amount);
      
      if (!categorySpending.has(category)) {
        categorySpending.set(category, []);
      }
      categorySpending.get(category)!.push(amount);
    });

  // Generate recommendations for each category
  const recommendations: BudgetRecommendation[] = [];
  
  categorySpending.forEach((amounts, category) => {
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / Math.max(1, getMonthsInData(transactions));
    const trend = calculateTrend(amounts);
    
    // Add 10-20% buffer based on trend
    let recommendedAmount = average;
    if (trend === 'increasing') {
      recommendedAmount = average * 1.2;
    } else if (trend === 'decreasing') {
      recommendedAmount = average * 1.1;
    } else {
      recommendedAmount = average * 1.15;
    }

    recommendations.push({
      category,
      recommendedAmount: Math.round(recommendedAmount),
      averageSpending: Math.round(average),
      spendingTrend: trend,
      confidence: calculateConfidence(amounts),
      reasoning: generateReasoning(category, average, trend, amounts.length)
    });
  });

  // Calculate metrics
  const monthlyIncome = income / Math.max(1, getMonthsInData(transactions));
  const monthlyExpenses = expenses / Math.max(1, getMonthsInData(transactions));
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return {
    totalIncome: Math.round(monthlyIncome),
    totalExpenses: Math.round(monthlyExpenses),
    savingsRate: Math.round(savingsRate * 100) / 100,
    recommendations: recommendations.sort((a, b) => b.recommendedAmount - a.recommendedAmount),
    suggestedSavingsGoal: Math.round(monthlyIncome * 0.2),
    emergencyFundRecommendation: Math.round(monthlyExpenses * 6)
  };
}

function normalizeCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'GROCERIES': 'Groceries',
    'DINING': 'Food & Dining',
    'TRANSPORTATION': 'Transportation',
    'UTILITIES': 'Bills & Utilities',
    'ENTERTAINMENT': 'Entertainment',
    'SHOPPING': 'Shopping',
    'HEALTHCARE': 'Healthcare',
    'EDUCATION': 'Education',
    'TRAVEL': 'Travel'
  };

  return categoryMap[category.toUpperCase()] || category;
}

function getMonthsInData(transactions: Transaction[]): number {
  if (transactions.length === 0) return 1;
  
  const dates = transactions.map(t => new Date(t.transactionDate || t.date));
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
  const latest = new Date(Math.max(...dates.map(d => d.getTime())));
  
  const months = (latest.getFullYear() - earliest.getFullYear()) * 12 + 
                 (latest.getMonth() - earliest.getMonth()) + 1;
  
  return Math.max(1, months);
}

function calculateTrend(amounts: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (amounts.length < 2) return 'stable';
  
  const firstHalf = amounts.slice(0, Math.ceil(amounts.length / 2));
  const secondHalf = amounts.slice(Math.floor(amounts.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, amt) => sum + amt, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, amt) => sum + amt, 0) / secondHalf.length;
  
  const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (percentChange > 10) return 'increasing';
  if (percentChange < -10) return 'decreasing';
  return 'stable';
}

function calculateConfidence(amounts: number[]): number {
  if (amounts.length === 0) return 0;
  if (amounts.length === 1) return 0.5;
  
  // Higher confidence with more data points and lower variance
  const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;
  
  // Normalize confidence score
  const dataPointScore = Math.min(amounts.length / 10, 1); // Max at 10 data points
  const stabilityScore = Math.max(0, 1 - coefficientOfVariation); // Lower variance = higher score
  
  return Math.round(((dataPointScore + stabilityScore) / 2) * 100) / 100;
}

function generateReasoning(category: string, average: number, trend: string, dataPoints: number): string {
  const trendText = {
    'increasing': 'Your spending in this category has been increasing',
    'decreasing': 'Your spending in this category has been decreasing', 
    'stable': 'Your spending in this category has been relatively stable'
  };

  const confidenceText = dataPoints >= 5 ? 'with good data confidence' : 'based on limited data';
  
  return `${trendText[trend]} (avg $${Math.round(average)}/month) ${confidenceText}. Budget includes a small buffer for unexpected expenses.`;
}
