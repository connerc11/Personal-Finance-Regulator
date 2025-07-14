import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Assessment,
  PieChart as PieChartIcon,
  Timeline,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI, budgetAPI, goalsAPI } from '../services/apiService';
import { Transaction, Budget, FinancialGoal } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real user data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  // Clear all cached data and reset state
  const resetReportsData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setError(null);
    setTabValue(0);
    setTimeRange('6months');
  };

  // Load user data on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    } else {
      // Clear data when no user is logged in
      resetReportsData();
      setLoading(false);
    }
  }, [user?.id, timeRange]);

  // Reset data when user changes (including switching between demo and new users)
  useEffect(() => {
    resetReportsData();
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear existing data first to prevent showing old data
      setTransactions([]);
      setBudgets([]);
      setGoals([]);

      // Load transactions, budgets, and goals in parallel with proper user isolation
      const [transactionsRes, budgetsRes, goalsRes] = await Promise.all([
        transactionAPI.getAll(user?.id || 1),
        budgetAPI.getAll(user?.id || 1),
        goalsAPI.getAll(user?.id || 1),
      ]);

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data);
      }
      if (budgetsRes.success) {
        setBudgets(budgetsRes.data);
      }
      if (goalsRes.success) {
        setGoals(goalsRes.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process transactions for analytics
  const processTransactionsData = () => {
    if (!transactions.length) return { spendingData: [], monthlyTrends: [], netWorthData: [] };

    // Filter transactions by time range
    const now = new Date();
    const timeRangeMap = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12,
    };
    const monthsBack = timeRangeMap[timeRange as keyof typeof timeRangeMap] || 6;
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate
    );

    // Process spending by category
    const categorySpending = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = ['#00ff88', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const spendingData = Object.entries(categorySpending).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));

    // Process monthly trends
    const monthlyData = filteredTransactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0, savings: 0 };
      }
      if (t.type === 'INCOME') {
        acc[month].income += t.amount;
      } else {
        acc[month].expenses += t.amount;
      }
      acc[month].savings = acc[month].income - acc[month].expenses;
      return acc;
    }, {} as Record<string, any>);

    const monthlyTrends = Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    // Calculate net worth over time (simplified)
    let runningBalance = 0;
    const netWorthData = monthlyTrends.map((month: any) => {
      runningBalance += month.savings;
      return {
        month: month.month,
        netWorth: runningBalance,
      };
    });

    return { spendingData, monthlyTrends, netWorthData };
  };

  // Process budget performance
  const processBudgetData = () => {
    return budgets.map(budget => {
      const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
      const remaining = Math.max(0, budget.amount - budget.spent);
      return {
        ...budget,
        progress,
        remaining,
        status: progress > 100 ? 'over' : progress > 80 ? 'warning' : 'good',
      };
    });
  };

  const { spendingData, monthlyTrends, netWorthData } = processTransactionsData();
  const budgetPerformance = processBudgetData();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            color: '#00ff88',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
          }}
        >
          Reports & Analytics
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Insights based on your financial data
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#00ff88' }} />
          <Typography sx={{ ml: 2, color: '#888' }}>Loading your financial data...</Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#2a1a1a', color: '#ff6b6b' }}>
          {error}
        </Alert>
      )}

      {/* No Data State */}
      {!loading && !error && transactions.length === 0 && (
        <Card sx={{ 
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 2,
          textAlign: 'center',
          py: 6,
        }}>
          <CardContent>
            <Assessment sx={{ fontSize: 64, color: '#555', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#888' }}>
              No Data Available
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Start by adding transactions, budgets, and goals to see your financial insights here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Data Available */}
      {!loading && !error && transactions.length > 0 && (
        <>
          {/* Time Range Selector */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: '#888' }}>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ff88',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ff88',
                  },
                }}
              >
                <MenuItem value="1month">Last Month</MenuItem>
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

      {/* Tabs */}
      <Paper sx={{ 
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 2,
        mb: 3,
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#888',
              '&.Mui-selected': {
                color: '#00ff88',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#00ff88',
            },
          }}
        >
          <Tab label="Spending Analysis" />
          <Tab label="Income vs Expenses" />
          <Tab label="Net Worth Trends" />
          <Tab label="Budget Performance" />
        </Tabs>

        {/* Spending Analysis Tab */}
        <TabPanel value={tabValue} index={0}>
          {spendingData.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', py: 4 }}>
              No expense data available for the selected time period.
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Card sx={{ 
                backgroundColor: '#2a2a2a',
                border: '1px solid #00ff88',
                height: 400,
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#00ff88' }}>
                    Spending by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card sx={{ 
                backgroundColor: '#2a2a2a',
                border: '1px solid #00ff88',
                height: 400,
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#00ff88' }}>
                    Top Spending Categories
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {spendingData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((category, index) => (
                        <Box key={category.name} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00ff88' }}>
                              ${category.value.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: '100%', 
                            height: 8, 
                            backgroundColor: '#333',
                            borderRadius: 4,
                          }}>
                            <Box sx={{ 
                              width: `${(category.value / Math.max(...spendingData.map(d => d.value))) * 100}%`,
                              height: '100%',
                              backgroundColor: category.color,
                              borderRadius: 4,
                            }} />
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </TabPanel>

        {/* Income vs Expenses Tab */}
        <TabPanel value={tabValue} index={1}>
          {monthlyTrends.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', py: 4 }}>
              No transaction data available for the selected time period.
            </Typography>
          ) : (
            <Card sx={{ 
              backgroundColor: '#2a2a2a',
              border: '1px solid #00ff88',
              height: 500,
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#00ff88' }}>
                  Monthly Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={(value: any) => `$${value.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #00ff88',
                        color: '#fff',
                      }}
                      formatter={(value: any, name: string) => [`$${value.toLocaleString()}`, name]}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#00ff88" name="Income" />
                    <Bar dataKey="expenses" fill="#ff6b6b" name="Expenses" />
                    <Bar dataKey="savings" fill="#4ecdc4" name="Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        {/* Net Worth Trends Tab */}
        <TabPanel value={tabValue} index={2}>
          {netWorthData.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', py: 4 }}>
              No data available to calculate net worth trends.
            </Typography>
          ) : (
            <Card sx={{ 
              backgroundColor: '#2a2a2a',
              border: '1px solid #00ff88',
              height: 500,
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#00ff88' }}>
                  Net Worth Growth
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={(value: any) => `$${value.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #00ff88',
                        color: '#fff',
                      }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Net Worth']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="netWorth" 
                      stroke="#00ff88" 
                      strokeWidth={3}
                      dot={{ fill: '#00ff88', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        {/* Budget Performance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ color: '#00ff88', mb: 3 }}>
            Budget Performance Analysis
          </Typography>
          {budgetPerformance.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#888' }}>
              No budgets created yet. Create budgets to track your spending performance.
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              {budgetPerformance.map((budget, index) => (
                <Card key={budget.id} sx={{ 
                  backgroundColor: '#2a2a2a',
                  border: `1px solid ${budget.status === 'over' ? '#ff6b6b' : budget.status === 'warning' ? '#f9ca24' : '#00ff88'}`,
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {budget.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: budget.status === 'over' ? '#ff6b6b' : budget.status === 'warning' ? '#f9ca24' : '#00ff88' 
                      }}>
                        {budget.progress.toFixed(1)}% used
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        backgroundColor: '#333',
                        borderRadius: 4,
                      }}>
                        <Box sx={{ 
                          width: `${Math.min(budget.progress, 100)}%`,
                          height: '100%',
                          backgroundColor: budget.status === 'over' ? '#ff6b6b' : budget.status === 'warning' ? '#f9ca24' : '#00ff88',
                          borderRadius: 4,
                        }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Spent: ${budget.spent.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#888' }}>
                        Budget: ${budget.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    {budget.remaining > 0 && (
                      <Typography variant="body2" sx={{ color: '#00ff88', mt: 1 }}>
                        Remaining: ${budget.remaining.toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>
      </>
      )}
    </Box>
  );
};

export default Reports;
