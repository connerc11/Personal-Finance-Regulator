import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
}

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  monthlyTrend: any[];
  categoryBreakdown: any[];
  budgetPerformance: any[];
  financialGoals: any[];
}

// Local storage keys
const TRANSACTIONS_KEY = 'personalfinance_transactions';
const BUDGETS_KEY = 'personalfinance_budgets';

export const useAnalytics = (timeRange: string) => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is demo account
  const isDemoUser = user?.email === 'demo@personalfinance.com';

  // Demo data for demo users
  const demoData: AnalyticsData = {
    totalIncome: 8500,
    totalExpenses: 6200,
    netSavings: 2300,
    savingsRate: 27.1,
    monthlyTrend: [
      { month: 'Jan', income: 8200, expenses: 5800, savings: 2400 },
      { month: 'Feb', income: 8500, expenses: 6100, savings: 2400 },
      { month: 'Mar', income: 8300, expenses: 6300, savings: 2000 },
      { month: 'Apr', income: 8600, expenses: 6000, savings: 2600 },
      { month: 'May', income: 8400, expenses: 6400, savings: 2000 },
      { month: 'Jun', income: 8500, expenses: 6200, savings: 2300 },
    ],
    categoryBreakdown: [
      { name: 'Housing', amount: 2200, percentage: 35.5, color: '#8884d8' },
      { name: 'Food & Dining', amount: 1200, percentage: 19.4, color: '#82ca9d' },
      { name: 'Transportation', amount: 800, percentage: 12.9, color: '#ffc658' },
      { name: 'Entertainment', amount: 600, percentage: 9.7, color: '#ff7300' },
      { name: 'Shopping', amount: 500, percentage: 8.1, color: '#d084d0' },
      { name: 'Utilities', amount: 450, percentage: 7.3, color: '#8dd1e1' },
      { name: 'Healthcare', amount: 300, percentage: 4.8, color: '#ffb347' },
      { name: 'Other', amount: 150, percentage: 2.4, color: '#87d068' },
    ],
    budgetPerformance: [
      { category: 'Groceries', budgeted: 800, spent: 720, percentage: 90, status: 'good' },
      { category: 'Dining Out', budgeted: 400, spent: 480, percentage: 120, status: 'over' },
      { category: 'Transportation', budgeted: 600, spent: 550, percentage: 92, status: 'good' },
      { category: 'Entertainment', budgeted: 500, spent: 600, percentage: 120, status: 'over' },
      { category: 'Shopping', budgeted: 600, spent: 500, percentage: 83, status: 'good' },
    ],
    financialGoals: [
      { name: 'Emergency Fund', target: 10000, current: 7500, percentage: 75 },
      { name: 'Vacation', target: 3000, current: 1200, percentage: 40 },
      { name: 'New Car', target: 15000, current: 5000, percentage: 33 },
      { name: 'Investment Portfolio', target: 20000, current: 12000, percentage: 60 },
    ],
  };

  // Get date range based on timeRange parameter
  const getDateRange = () => {
    const now = new Date();
    const endDate = now;
    let startDate = new Date();

    switch (timeRange) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }

    return { startDate, endDate };
  };

  // Filter transactions by date range
  const filterTransactionsByDateRange = (transactions: Transaction[]) => {
    const { startDate, endDate } = getDateRange();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  // Calculate analytics from user data
  const calculateAnalytics = (transactions: Transaction[], budgets: Budget[]): AnalyticsData => {
    const filteredTransactions = filterTransactionsByDateRange(transactions);

    // Calculate totals
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Calculate monthly trend
    const monthlyData: { [key: string]: { income: number; expenses: number; month: string } } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += Math.abs(transaction.amount);
      }
    });

    const monthlyTrend = Object.values(monthlyData)
      .map(data => ({
        ...data,
        savings: data.income - data.expenses
      }))
      .sort((a, b) => new Date(a.month + ' 2024').getTime() - new Date(b.month + ' 2024').getTime());

    // Calculate category breakdown
    const categoryData: { [key: string]: number } = {};
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      categoryData[transaction.category] = (categoryData[transaction.category] || 0) + amount;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d084d0', '#8dd1e1', '#ffb347', '#87d068'];
    const categoryBreakdown = Object.entries(categoryData)
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate budget performance
    const budgetPerformance = budgets.map(budget => {
      const spent = budget.spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const status = percentage > 100 ? 'over' : percentage > 85 ? 'warning' : 'good';
      
      return {
        category: budget.name,
        budgeted: budget.amount,
        spent,
        percentage: Math.round(percentage),
        status
      };
    });

    // Placeholder financial goals (could be expanded to use localStorage)
    const financialGoals = [
      { name: 'Emergency Fund', target: 10000, current: Math.max(0, netSavings * 2), percentage: Math.min(100, Math.max(0, (netSavings * 2 / 10000) * 100)) },
      { name: 'Monthly Savings', target: 1000, current: Math.max(0, netSavings), percentage: Math.min(100, Math.max(0, (netSavings / 1000) * 100)) },
    ];

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      monthlyTrend,
      categoryBreakdown,
      budgetPerformance,
      financialGoals,
    };
  };

  useEffect(() => {
    const loadAnalytics = () => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          setData(null);
          setLoading(false);
          return;
        }

        if (isDemoUser) {
          // Use demo data for demo user
          setData(demoData);
        } else {
          // Load user's transactions and budgets
          const storedTransactions = localStorage.getItem(`${TRANSACTIONS_KEY}_${user.id}`);
          const storedBudgets = localStorage.getItem(`${BUDGETS_KEY}_${user.id}`);

          const transactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
          const budgets: Budget[] = storedBudgets ? JSON.parse(storedBudgets) : [];

          // Calculate analytics from user data
          const analyticsData = calculateAnalytics(transactions, budgets);
          setData(analyticsData);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, timeRange, isDemoUser]);

  const refreshData = () => {
    // Simply reload the data
    const loadAnalytics = () => {
      setLoading(true);
      try {
        if (!user) return;

        if (isDemoUser) {
          setData(demoData);
        } else {
          const storedTransactions = localStorage.getItem(`${TRANSACTIONS_KEY}_${user.id}`);
          const storedBudgets = localStorage.getItem(`${BUDGETS_KEY}_${user.id}`);

          const transactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
          const budgets: Budget[] = storedBudgets ? JSON.parse(storedBudgets) : [];

          const analyticsData = calculateAnalytics(transactions, budgets);
          setData(analyticsData);
        }
      } catch (error) {
        console.error('Error refreshing analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  };

  const exportReport = async (format: string = 'pdf') => {
    try {
      // Create a simple text report
      const reportData = data;
      if (!reportData) {
        alert('No data available to export');
        return;
      }

      const reportText = `
Financial Analytics Report
Generated: ${new Date().toLocaleDateString()}
Time Range: ${timeRange}

=== SUMMARY ===
Total Income: $${reportData.totalIncome.toFixed(2)}
Total Expenses: $${reportData.totalExpenses.toFixed(2)}
Net Savings: $${reportData.netSavings.toFixed(2)}
Savings Rate: ${reportData.savingsRate.toFixed(1)}%

=== CATEGORY BREAKDOWN ===
${reportData.categoryBreakdown.map(cat => 
  `${cat.name}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`
).join('\n')}

=== BUDGET PERFORMANCE ===
${reportData.budgetPerformance.map(budget => 
  `${budget.category}: $${budget.spent}/$${budget.budgeted} (${budget.percentage}%) - ${budget.status.toUpperCase()}`
).join('\n')}
      `;

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
    exportReport,
  };
};
