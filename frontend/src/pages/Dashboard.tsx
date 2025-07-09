import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, CreditCard } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import FinancialDataForm from '../components/FinancialDataForm';

// Local storage key for user financial data
const FINANCIAL_DATA_KEY = 'personalfinance_user_data';

interface FinancialData {
  monthlyIncome: number;
  bankAccounts: Array<{
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'investment';
    balance: number;
  }>;
  creditCards: Array<{
    id: string;
    name: string;
    limit: number;
    balance: number;
    apr: number;
  }>;
  monthlyExpenses: {
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
    entertainment: number;
    other: number;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userFinancialData, setUserFinancialData] = useState<FinancialData | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);

  // Check if user is demo account
  const isDemoUser = user?.email === 'demo@personalfinance.com';

  useEffect(() => {
    if (!isDemoUser && user) {
      // Load user's financial data from localStorage
      const storedData = localStorage.getItem(`${FINANCIAL_DATA_KEY}_${user.id}`);
      if (storedData) {
        setUserFinancialData(JSON.parse(storedData));
      } else {
        setShowSetupForm(true);
      }
    }
  }, [user, isDemoUser]);

  const handleSaveFinancialData = (data: FinancialData) => {
    if (user) {
      // Save to localStorage with user ID
      localStorage.setItem(`${FINANCIAL_DATA_KEY}_${user.id}`, JSON.stringify(data));
      setUserFinancialData(data);
      setShowSetupForm(false);
    }
  };

  // Demo data for demo users
  const demoStats = [
    { title: 'Total Balance', value: '$12,450.00', icon: <AccountBalance />, color: 'primary' },
    { title: 'Monthly Income', value: '$5,200.00', icon: <TrendingUp />, color: 'success' },
    { title: 'Monthly Expenses', value: '$3,180.00', icon: <TrendingDown />, color: 'error' },
    { title: 'Active Budgets', value: '8', icon: <CreditCard />, color: 'info' },
  ];

  // Calculate stats from user's financial data
  const calculateUserStats = (data: FinancialData) => {
    const totalBankBalance = data.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalCreditDebt = data.creditCards.reduce((sum, card) => sum + card.balance, 0);
    const totalExpenses = Object.values(data.monthlyExpenses).reduce((sum, expense) => sum + expense, 0);
    const netWorth = totalBankBalance - totalCreditDebt;

    return [
      { title: 'Net Worth', value: `$${netWorth.toLocaleString()}`, icon: <AccountBalance />, color: netWorth >= 0 ? 'success' : 'error' },
      { title: 'Monthly Income', value: `$${data.monthlyIncome.toLocaleString()}`, icon: <TrendingUp />, color: 'success' },
      { title: 'Monthly Expenses', value: `$${totalExpenses.toLocaleString()}`, icon: <TrendingDown />, color: 'error' },
      { title: 'Bank Accounts', value: data.bankAccounts.length.toString(), icon: <AccountBalance />, color: 'info' },
    ];
  };

  const stats = isDemoUser ? demoStats : (userFinancialData ? calculateUserStats(userFinancialData) : []);

  // If non-demo user needs to set up financial data
  if (!isDemoUser && showSetupForm) {
    return (
      <Box>
        <FinancialDataForm onSave={handleSaveFinancialData} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          color: '#00ff88',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
          mb: 2,
        }}
      >
        Welcome back, {user?.firstName || 'User'}!
      </Typography>
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: '#888',
        }}
      >
        {isDemoUser 
          ? "Here's your demo financial overview for today" 
          : "Here's your financial overview for today"
        }
      </Typography>
      
      {stats.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
              <Card sx={{
                backgroundColor: '#1a1a1a',
                border: '2px solid #00ff88',
                borderRadius: 3,
                boxShadow: `
                  0 0 20px rgba(0, 255, 136, 0.3),
                  0 0 40px rgba(0, 255, 136, 0.1)
                `,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `
                    0 0 30px rgba(0, 255, 136, 0.4),
                    0 0 50px rgba(0, 255, 136, 0.2)
                  `,
                  transform: 'translateY(-2px)',
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ 
                      mr: 1, 
                      color: '#00ff88',
                      filter: 'drop-shadow(0 0 5px rgba(0, 255, 136, 0.5))',
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#888',
                    }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 60%', minWidth: '300px' }}>
          <Paper sx={{ 
            p: 2,
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff88',
            borderRadius: 3,
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.3),
              0 0 40px rgba(0, 255, 136, 0.1)
            `,
          }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
              }}
            >
              {isDemoUser ? 'Recent Transactions (Demo)' : 'Recent Transactions'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#888',
              }}
            >
              {isDemoUser 
                ? 'Demo transaction history will be displayed here'
                : 'Your transaction history will be displayed here'
              }
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 35%', minWidth: '250px' }}>
          <Paper sx={{ 
            p: 2,
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff88',
            borderRadius: 3,
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.3),
              0 0 40px rgba(0, 255, 136, 0.1)
            `,
          }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
              }}
            >
              {isDemoUser ? 'Budget Overview (Demo)' : 'Budget Overview'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#888',
              }}
            >
              {isDemoUser 
                ? 'Demo budget status will be displayed here'
                : 'Your budget status will be displayed here'
              }
            </Typography>
          </Paper>
        </Box>
      </Box>

      {!isDemoUser && userFinancialData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#00ff88' }}>
            Want to update your financial information?
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#00ff88', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              '&:hover': { color: '#00cc6a' }
            }}
            onClick={() => setShowSetupForm(true)}
          >
            Click here to edit your financial profile
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;