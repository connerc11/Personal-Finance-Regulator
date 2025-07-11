import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
}

interface CreditCard {
  id: string;
  name: string;
  limit: number;
  balance: number;
  apr: number;
}

interface FinancialData {
  monthlyIncome: number;
  bankAccounts: BankAccount[];
  creditCards: CreditCard[];
  monthlyExpenses: {
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
    entertainment: number;
    other: number;
  };
}

interface FinancialDataFormProps {
  onSave: (data: FinancialData) => void;
  initialData?: Partial<FinancialData>;
}

const FinancialDataForm: React.FC<FinancialDataFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<FinancialData>({
    monthlyIncome: initialData?.monthlyIncome || 0,
    bankAccounts: initialData?.bankAccounts || [],
    creditCards: initialData?.creditCards || [],
    monthlyExpenses: {
      housing: initialData?.monthlyExpenses?.housing || 0,
      food: initialData?.monthlyExpenses?.food || 0,
      transportation: initialData?.monthlyExpenses?.transportation || 0,
      utilities: initialData?.monthlyExpenses?.utilities || 0,
      entertainment: initialData?.monthlyExpenses?.entertainment || 0,
      other: initialData?.monthlyExpenses?.other || 0,
    },
  });

  const [newBankAccount, setNewBankAccount] = useState<Omit<BankAccount, 'id'>>({
    name: '',
    type: 'checking',
    balance: 0,
  });

  const [newCreditCard, setNewCreditCard] = useState<Omit<CreditCard, 'id'>>({
    name: '',
    limit: 0,
    balance: 0,
    apr: 0,
  });

  const [success, setSuccess] = useState(false);

  const addBankAccount = () => {
    if (newBankAccount.name) {
      setFormData(prev => ({
        ...prev,
        bankAccounts: [
          ...prev.bankAccounts,
          { ...newBankAccount, id: Date.now().toString() }
        ]
      }));
      setNewBankAccount({ name: '', type: 'checking', balance: 0 });
    }
  };

  const removeBankAccount = (id: string) => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(account => account.id !== id)
    }));
  };

  const addCreditCard = () => {
    if (newCreditCard.name) {
      setFormData(prev => ({
        ...prev,
        creditCards: [
          ...prev.creditCards,
          { ...newCreditCard, id: Date.now().toString() }
        ]
      }));
      setNewCreditCard({ name: '', limit: 0, balance: 0, apr: 0 });
    }
  };

  const removeCreditCard = (id: string) => {
    setFormData(prev => ({
      ...prev,
      creditCards: prev.creditCards.filter(card => card.id !== id)
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const totalBankBalance = formData.bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalCreditBalance = formData.creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalExpenses = Object.values(formData.monthlyExpenses).reduce((sum, expense) => sum + expense, 0);

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
          mb: 3,
        }}
      >
        Set Up Your Financial Profile
      </Typography>
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            color: '#00ff88',
            '& .MuiAlert-icon': {
              color: '#00ff88',
            },
          }}
        >
          Financial data saved successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Monthly Income */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px', maxWidth: '600px' }}>
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
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ color: '#00ff88', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Monthly Income
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Monthly Income"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#00ff88' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Bank Accounts */}
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
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ color: '#00ff88', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Bank Accounts
              </Typography>
            </Box>
            
            {/* Add new bank account */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <TextField
                label="Account Name"
                value={newBankAccount.name}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, name: e.target.value }))}
                sx={{
                  flex: '1 1 200px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <FormControl sx={{ flex: '1 1 150px' }}>
                <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#00ff88' } }}>Type</InputLabel>
                <Select
                  value={newBankAccount.type}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, type: e.target.value as any }))}
                  sx={{
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff88' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff88' },
                  }}
                >
                  <MenuItem value="checking">Checking</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="investment">Investment</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Balance"
                value={newBankAccount.balance}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, balance: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  flex: '1 1 150px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <Button
                variant="contained"
                onClick={addBankAccount}
                startIcon={<AddIcon />}
                sx={{
                  flex: '0 0 auto',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  '&:hover': { backgroundColor: '#00cc6a' },
                }}
              >
                Add
              </Button>
            </Box>

            {/* Existing bank accounts */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.bankAccounts.map((account) => (
                <Chip
                  key={account.id}
                  label={`${account.name} (${account.type}): $${account.balance.toLocaleString()}`}
                  sx={{ 
                    backgroundColor: '#2a2a2a', 
                    color: '#fff',
                    '& .MuiChip-deleteIcon': { color: '#ff6b6b' }
                  }}
                  onDelete={() => removeBankAccount(account.id)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ color: '#00ff88' }}>
              Total Bank Balance: ${totalBankBalance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Credit Cards */}
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
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreditCard sx={{ color: '#00ff88', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Credit Cards
              </Typography>
            </Box>
            
            {/* Add new credit card */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <TextField
                label="Card Name"
                value={newCreditCard.name}
                onChange={(e) => setNewCreditCard(prev => ({ ...prev, name: e.target.value }))}
                sx={{
                  flex: '1 1 200px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <TextField
                type="number"
                label="Credit Limit"
                value={newCreditCard.limit}
                onChange={(e) => setNewCreditCard(prev => ({ ...prev, limit: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  flex: '1 1 150px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <TextField
                type="number"
                label="Current Balance"
                value={newCreditCard.balance}
                onChange={(e) => setNewCreditCard(prev => ({ ...prev, balance: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  flex: '1 1 150px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <TextField
                type="number"
                label="APR (%)"
                value={newCreditCard.apr}
                onChange={(e) => setNewCreditCard(prev => ({ ...prev, apr: Number(e.target.value) }))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{
                  flex: '1 1 100px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#00ff88' },
                    '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                  },
                  '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                }}
              />
              <Button
                variant="contained"
                onClick={addCreditCard}
                startIcon={<AddIcon />}
                sx={{
                  flex: '0 0 auto',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  '&:hover': { backgroundColor: '#00cc6a' },
                }}
              >
                Add Card
              </Button>
            </Box>

            {/* Existing credit cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.creditCards.map((card) => (
                <Chip
                  key={card.id}
                  label={`${card.name}: $${card.balance.toLocaleString()} / $${card.limit.toLocaleString()} (${card.apr}% APR)`}
                  sx={{ 
                    backgroundColor: '#2a2a2a', 
                    color: '#fff',
                    '& .MuiChip-deleteIcon': { color: '#ff6b6b' }
                  }}
                  onDelete={() => removeCreditCard(card.id)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
              Total Credit Card Debt: ${totalCreditBalance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
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
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingDown sx={{ color: '#00ff88', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Monthly Expenses
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {Object.entries(formData.monthlyExpenses).map(([category, amount]) => (
                <TextField
                  key={category}
                  type="number"
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  value={amount}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthlyExpenses: {
                      ...prev.monthlyExpenses,
                      [category]: Number(e.target.value)
                    }
                  }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{
                    flex: '1 1 200px',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2a2a2a',
                      color: '#fff',
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#00ff88' },
                      '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                    },
                    '& .MuiInputLabel-root': { color: '#888', '&.Mui-focused': { color: '#00ff88' } },
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ color: '#ff6b6b', mt: 2 }}>
              Total Monthly Expenses: ${totalExpenses.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: formData.monthlyIncome - totalExpenses >= 0 ? '#00ff88' : '#ff6b6b', mt: 1 }}>
              Monthly Net Income: ${(formData.monthlyIncome - totalExpenses).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#00ff88',
              color: '#000',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#00cc6a',
                boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)',
              },
            }}
          >
            Save Financial Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FinancialDataForm;
