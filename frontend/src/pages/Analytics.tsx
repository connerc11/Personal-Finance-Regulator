import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  Assessment as AssessmentIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { data: analyticsData, loading, error } = useAnalytics('6months');

  const handleExportData = () => {
    if (!analyticsData) return;

    const exportData = {
      summary: {
        totalIncome: analyticsData.totalIncome,
        totalExpenses: analyticsData.totalExpenses,
        netSavings: analyticsData.netSavings,
        savingsRate: analyticsData.savingsRate,
      },
      monthlyTrend: analyticsData.monthlyTrend,
      categoryBreakdown: analyticsData.categoryBreakdown,
      budgetPerformance: analyticsData.budgetPerformance,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#00ff88',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
          }}
        >
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error"
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#f44336',
            border: '1px solid rgba(244, 67, 54, 0.3)',
          }}
        >
          Failed to load analytics data. Please try again.
        </Alert>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Card
          sx={{
            backgroundColor: 'rgba(13, 13, 13, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
            textAlign: 'center',
            py: 6,
          }}
        >
          <CardContent>
            <AssessmentIcon 
              sx={{ 
                fontSize: 80, 
                color: 'rgba(0, 255, 136, 0.3)',
                mb: 2,
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#fff', 
                mb: 2,
                fontWeight: 'bold',
              }}
            >
              No Data Available
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#888',
                mb: 3,
              }}
            >
              Start adding transactions and budgets to see your financial analytics.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const pieColors = ['#00ff88', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            color: '#00ff88',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
          }}
        >
          Financial Analytics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          onClick={handleExportData}
          sx={{
            borderColor: '#00ff88',
            color: '#00ff88',
            '&:hover': {
              borderColor: '#00ff88',
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
            },
          }}
        >
          Export Data
        </Button>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#888' }} gutterBottom variant="body2">
                  Total Income
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  ${analyticsData.totalIncome.toLocaleString()}
                </Typography>
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label="This Month" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: '1px solid #00ff88',
                  }}
                />
              </Box>
              <Avatar sx={{ 
                bgcolor: '#00ff88', 
                color: '#000',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
              }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#888' }} gutterBottom variant="body2">
                  Total Expenses
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  ${analyticsData.totalExpenses.toLocaleString()}
                </Typography>
                <Chip 
                  icon={<TrendingDownIcon />} 
                  label="This Month" 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid #ff6b6b',
                  }}
                />
              </Box>
              <Avatar sx={{ 
                bgcolor: '#ff6b6b', 
                color: '#fff',
                boxShadow: '0 0 15px rgba(255, 107, 107, 0.5)',
              }}>
                <TrendingDownIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#888' }} gutterBottom variant="body2">
                  Net Savings
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  ${analyticsData.netSavings.toLocaleString()}
                </Typography>
                <Chip 
                  icon={<SavingsIcon />} 
                  label={`${analyticsData.savingsRate.toFixed(1)}%`} 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: '1px solid #00ff88',
                  }}
                />
              </Box>
              <Avatar sx={{ 
                bgcolor: '#00ff88', 
                color: '#000',
                boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
              }}>
                <SavingsIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#888' }} gutterBottom variant="body2">
                  Savings Rate
                </Typography>
                <Typography variant="h5" component="h2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  {analyticsData.savingsRate.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(analyticsData.savingsRate, 100)} 
                  sx={{ 
                    mt: 1, 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#00ff88',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    },
                  }}
                />
              </Box>
              <Avatar sx={{ 
                bgcolor: '#4ecdc4', 
                color: '#000',
                boxShadow: '0 0 15px rgba(78, 205, 196, 0.5)',
              }}>
                <AccountBalanceIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Charts Row */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Trend Chart */}
        <Card sx={{ 
          flex: 2,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Income vs Expenses Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.monthlyTrend}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']} 
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 13, 0.95)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#00ff88" 
                  fillOpacity={1} 
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ff6b6b" 
                  fillOpacity={1} 
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Distribution Pie Chart */}
        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Expense Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {analyticsData.categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 13, 0.95)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Budget Performance */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Budget Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.budgetPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="category" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(13, 13, 13, 0.95)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="budgeted" fill="#4ecdc4" name="Budgeted" />
                <Bar dataKey="spent" fill="#ff6b6b" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: 1,
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Budget Status
            </Typography>
            <Stack spacing={2}>
              {analyticsData.budgetPerformance.map((budget: any, index: number) => {
                const isOverBudget = budget.spent > budget.budgeted;
                const percentage = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
                
                return (
                  <Box key={budget.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 'medium' }}>
                        {budget.category}
                      </Typography>
                      <Typography sx={{ color: isOverBudget ? '#ff6b6b' : '#00ff88' }}>
                        ${budget.spent} / ${budget.budgeted}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: isOverBudget ? '#ff6b6b' : '#00ff88',
                          boxShadow: `0 0 10px ${isOverBudget ? 'rgba(255, 107, 107, 0.5)' : 'rgba(0, 255, 136, 0.5)'}`,
                        },
                      }}
                    />
                    {isOverBudget && (
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#ff6b6b', mt: 0.5, display: 'block' }}
                      >
                        Over budget by ${(budget.spent - budget.budgeted).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Transactions Table */}
      {analyticsData.monthlyTrend && analyticsData.monthlyTrend.length > 0 && (
        <Card sx={{ 
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Monthly Savings Trend
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#888', borderBottom: '1px solid rgba(0, 255, 136, 0.3)' }}>
                      Month
                    </TableCell>
                    <TableCell sx={{ color: '#888', borderBottom: '1px solid rgba(0, 255, 136, 0.3)' }} align="right">
                      Income
                    </TableCell>
                    <TableCell sx={{ color: '#888', borderBottom: '1px solid rgba(0, 255, 136, 0.3)' }} align="right">
                      Expenses
                    </TableCell>
                    <TableCell sx={{ color: '#888', borderBottom: '1px solid rgba(0, 255, 136, 0.3)' }} align="right">
                      Savings
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.monthlyTrend.slice(-6).map((monthData: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {monthData.month}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: '#00ff88',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          fontWeight: 'bold',
                        }}
                      >
                        +${monthData.income.toLocaleString()}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: '#ff6b6b',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          fontWeight: 'bold',
                        }}
                      >
                        -${monthData.expenses.toLocaleString()}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: monthData.savings >= 0 ? '#00ff88' : '#ff6b6b',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          fontWeight: 'bold',
                        }}
                      >
                        {monthData.savings >= 0 ? '+' : ''}${monthData.savings.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Analytics;