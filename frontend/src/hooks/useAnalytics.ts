import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI } from '../services/apiService';

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

export const useAnalytics = (timeRange: string) => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Always use the actual user ID
        const userId = user.id;

        // Fetch data from the backend APIs
        const [dashboardResponse, monthlyTrendResponse, categoryResponse, budgetResponse] = await Promise.all([
          analyticsAPI.getDashboardData(userId, timeRange),
          analyticsAPI.getMonthlyTrend(userId, timeRange),
          analyticsAPI.getCategoryBreakdown(userId, timeRange),
          analyticsAPI.getBudgetPerformance(userId)
        ]);

        if (dashboardResponse.success) {
          const analyticsData: AnalyticsData = {
            totalIncome: dashboardResponse.data.totalIncome || 0,
            totalExpenses: dashboardResponse.data.totalExpenses || 0,
            netSavings: dashboardResponse.data.netSavings || 0,
            savingsRate: parseFloat(dashboardResponse.data.savingsRate || '0'),
            monthlyTrend: monthlyTrendResponse.success ? monthlyTrendResponse.data : [],
            categoryBreakdown: categoryResponse.success ? categoryResponse.data : [],
            budgetPerformance: budgetResponse.success ? budgetResponse.data : [],
            financialGoals: [] // Will be implemented later
          };

          setData(analyticsData);
        } else {
          throw new Error(dashboardResponse.message || 'Failed to fetch analytics data');
        }
      } catch (err: any) {
        console.error('Analytics data fetch error:', err);
        setError(err.message || 'Failed to load analytics data');
        
        // Set empty data instead of fallback demo data
        setData({
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          savingsRate: 0,
          monthlyTrend: [],
          categoryBreakdown: [],
          budgetPerformance: [],
          financialGoals: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user, timeRange]);

  const refreshData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const userId = user.email === 'demo@personalfinance.com' ? 1 : user.id;

      const [dashboardResponse, monthlyTrendResponse, categoryResponse, budgetResponse] = await Promise.all([
        analyticsAPI.getDashboardData(userId, timeRange),
        analyticsAPI.getMonthlyTrend(userId, timeRange),
        analyticsAPI.getCategoryBreakdown(userId, timeRange),
        analyticsAPI.getBudgetPerformance(userId)
      ]);

      if (dashboardResponse.success) {
        const analyticsData: AnalyticsData = {
          totalIncome: dashboardResponse.data.totalIncome || 0,
          totalExpenses: dashboardResponse.data.totalExpenses || 0,
          netSavings: dashboardResponse.data.netSavings || 0,
          savingsRate: parseFloat(dashboardResponse.data.savingsRate || '0'),
          monthlyTrend: monthlyTrendResponse.success ? monthlyTrendResponse.data : [],
          categoryBreakdown: categoryResponse.success ? categoryResponse.data : [],
          budgetPerformance: budgetResponse.success ? budgetResponse.data : [],
          financialGoals: []
        };

        setData(analyticsData);
      }
    } catch (err: any) {
      console.error('Error refreshing analytics:', err);
      setError(err.message || 'Failed to refresh analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: string = 'pdf') => {
    try {
      if (!data) {
        alert('No data available to export');
        return;
      }

      const reportText = `
Financial Analytics Report
Generated: ${new Date().toLocaleDateString()}
Time Range: ${timeRange}

=== SUMMARY ===
Total Income: $${data.totalIncome.toFixed(2)}
Total Expenses: $${data.totalExpenses.toFixed(2)}
Net Savings: $${data.netSavings.toFixed(2)}
Savings Rate: ${data.savingsRate.toFixed(1)}%

=== CATEGORY BREAKDOWN ===
${data.categoryBreakdown.map(cat => 
  `${cat.name}: $${(cat.value || cat.amount || 0).toFixed(2)}`
).join('\n')}

=== BUDGET PERFORMANCE ===
${data.budgetPerformance.map(budget => 
  `${budget.category}: $${budget.actual || budget.spent || 0}/$${budget.budgeted} (${budget.performance || budget.percentage || 0}%)`
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


