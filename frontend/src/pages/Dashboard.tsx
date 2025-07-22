import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, CreditCard } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import FinancialDataForm from '../components/FinancialDataForm';
import { financialDataAPI } from '../services/apiService';

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
  const { user, token } = useAuth();
  const [userFinancialData, setUserFinancialData] = useState<FinancialData | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);


  useEffect(() => {
    if (user) {
      (async () => {
        const result = await financialDataAPI.get();
        if (result.success && result.data) {
          setUserFinancialData(result.data);
          setShowSetupForm(false);
        } else {
          setShowSetupForm(true);
        }
      })();
    }
  }, [user]);

  const handleSaveFinancialData = async (data: FinancialData) => {
    if (!user || !token) {
      alert('You must be logged in to save your financial profile.');
      return;
    }
    const result = await financialDataAPI.save(data);
    if (result.success) {
      setUserFinancialData(result.data);
      setShowSetupForm(false);
    }
  };

  // Calculate stats from user's financial data
  const calculateUserStats = (data: FinancialData) => {
    const totalBankBalance = (data.bankAccounts || []).reduce((sum, account) => sum + account.balance, 0);
    const totalCreditDebt = (data.creditCards || []).reduce((sum, card) => sum + card.balance, 0);
    const totalExpenses = Object.values(data.monthlyExpenses || {}).reduce((sum, expense) => sum + expense, 0);
    const netWorth = totalBankBalance - totalCreditDebt;

    return [
      { title: 'Net Worth', value: `$${(netWorth ?? 0).toLocaleString()}`, icon: <AccountBalance />, color: netWorth >= 0 ? 'success' : 'error' },
      { title: 'Monthly Income', value: `$${(data.monthlyIncome ?? 0).toLocaleString()}`, icon: <TrendingUp />, color: 'success' },
      { title: 'Monthly Expenses', value: `$${(totalExpenses ?? 0).toLocaleString()}`, icon: <TrendingDown />, color: 'error' },
      { title: 'Bank Accounts', value: (data.bankAccounts?.length ?? 0).toString(), icon: <AccountBalance />, color: 'info' },
    ];
  };

  const stats = userFinancialData ? calculateUserStats(userFinancialData) : [];

  // If user needs to set up financial data
  if (showSetupForm) {
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
        Here's your financial overview for today
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

      {/* Detailed Account Information */}
      {userFinancialData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#00ff88', mb: 2 }}>
            Bank Accounts
          </Typography>
          {userFinancialData.bankAccounts.length === 0 ? (
            <Typography color="textSecondary">No bank accounts found.</Typography>
          ) : (
            userFinancialData.bankAccounts.map(account => (
              <Card key={account.id} sx={{ mb: 2, backgroundColor: '#222', border: '1px solid #00ff88' }}>
                <CardContent>
                  <Typography variant="subtitle1">{account.name} ({account.type})</Typography>
                  <Typography>Balance: ${account.balance.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            ))
          )}

          <Typography variant="h5" sx={{ color: '#00ff88', mt: 4, mb: 2 }}>
            Credit Cards
          </Typography>
          {userFinancialData.creditCards.length === 0 ? (
            <Typography color="textSecondary">No credit cards found.</Typography>
          ) : (
            userFinancialData.creditCards.map(card => (
              <Card key={card.id} sx={{ mb: 2, backgroundColor: '#222', border: '1px solid #00ff88' }}>
                <CardContent>
                  <Typography variant="subtitle1">{card.name}</Typography>
                  <Typography>Limit: ${card.limit.toLocaleString()}</Typography>
                  <Typography>Balance: ${card.balance.toLocaleString()}</Typography>
                  <Typography>APR: {card.apr}%</Typography>
                </CardContent>
              </Card>
            ))
          )}
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
              Recent Transactions
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#888',
              }}
            >
              Your transaction history will be displayed here
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
              Budget Overview
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#888',
              }}
            >
              Your budget status will be displayed here
            </Typography>
          </Paper>
        </Box>
      </Box>

      {userFinancialData && (
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