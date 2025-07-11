import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { Add, Edit, Delete, AccountBalanceWallet } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Empty export to satisfy TypeScript isolatedModules requirement
export {};

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

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

// Local storage keys
const BUDGETS_KEY = 'personalfinance_budgets';
const TRANSACTIONS_KEY = 'personalfinance_transactions';

const Budgets: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  // Budget categories
  const budgetCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Rent/Mortgage',
    'Insurance',
    'Savings',
    'Investments',
    'Personal Care',
    'Gifts & Donations',
    'Other',
  ];

  // Load budgets and transactions from localStorage on component mount
  useEffect(() => {
    if (user) {
      // Load budgets
      const storedBudgets = localStorage.getItem(`${BUDGETS_KEY}_${user.id}`);
      if (storedBudgets) {
        try {
          const parsedBudgets = JSON.parse(storedBudgets);
          setBudgets(Array.isArray(parsedBudgets) ? parsedBudgets : []);
        } catch (error) {
          console.error('Error parsing stored budgets:', error);
          setBudgets([]);
        }
      } else {
        setBudgets([]);
      }
      
      // Load transactions
      const storedTransactions = localStorage.getItem(`${TRANSACTIONS_KEY}_${user.id}`);
      if (storedTransactions) {
        try {
          const parsedTransactions = JSON.parse(storedTransactions);
          setTransactions(Array.isArray(parsedTransactions) ? parsedTransactions : []);
        } catch (error) {
          console.error('Error parsing stored transactions:', error);
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
    } else {
      // Clear data if no user
      setBudgets([]);
      setTransactions([]);
    }
  }, [user]);

  // Function to calculate spending for a budget based on transactions
  const calculateSpentAmount = (budget: Budget, userTransactions: Transaction[]) => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    
    return userTransactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'expense' &&
          transaction.category === budget.category &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      })
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  };

  // Update budgets with calculated spending whenever transactions change
  useEffect(() => {
    if (budgets.length > 0 && transactions.length >= 0) {
      const updatedBudgets = budgets.map(budget => ({
        ...budget,
        spent: calculateSpentAmount(budget, transactions)
      }));
      
      // Only update if there are actual changes to prevent infinite loops
      const hasChanges = updatedBudgets.some((budget, index) => 
        budget.spent !== budgets[index].spent
      );
      
      if (hasChanges) {
        setBudgets(updatedBudgets);
        // Immediately save to localStorage when spending is recalculated
        if (user) {
          localStorage.setItem(`${BUDGETS_KEY}_${user.id}`, JSON.stringify(updatedBudgets));
        }
      }
    }
  }, [transactions, user]); // Include user in dependencies

  // Save budgets to localStorage whenever budgets change (separate from spending calculation)
  useEffect(() => {
    if (user && budgets.length > 0) {
      localStorage.setItem(`${BUDGETS_KEY}_${user.id}`, JSON.stringify(budgets));
    }
  }, [budgets, user]);

  // Calculate end date based on period and start date
  const calculateEndDate = (startDate: string, period: string) => {
    const start = new Date(startDate);
    let end = new Date(start);
    
    switch (period) {
      case 'weekly':
        end.setDate(start.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(start.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(start.getFullYear() + 1);
        break;
    }
    
    return end.toISOString().split('T')[0];
  };

  // Update end date when period or start date changes
  useEffect(() => {
    if (formData.startDate && formData.period) {
      const newEndDate = calculateEndDate(formData.startDate, formData.period);
      setFormData(prev => ({ ...prev, endDate: newEndDate }));
    }
  }, [formData.startDate, formData.period]);

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);
    
    if (!formData.name || !formData.category || !amount || amount <= 0) {
      return; // Basic validation
    }
    
    let updatedBudgets;
    
    if (editingBudget) {
      const updatedBudget = { 
        ...editingBudget, 
        ...formData, 
        amount,
        spent: calculateSpentAmount({...editingBudget, ...formData, amount, spent: 0}, transactions)
      };
      updatedBudgets = budgets.map(b => 
        b.id === editingBudget.id ? updatedBudget : b
      );
    } else {
      const newBudget: Budget = {
        id: Date.now(),
        ...formData,
        amount,
        spent: 0, // Will be calculated automatically
      };
      updatedBudgets = [...budgets, newBudget];
    }
    
    // Update state
    setBudgets(updatedBudgets);
    
    // Immediately save to localStorage
    if (user) {
      localStorage.setItem(`${BUDGETS_KEY}_${user.id}`, JSON.stringify(updatedBudgets));
    }
    
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBudget(null);
    setFormData({
      name: '',
      category: '',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    
    // Immediately save to localStorage
    if (user) {
      localStorage.setItem(`${BUDGETS_KEY}_${user.id}`, JSON.stringify(updatedBudgets));
    }
  };

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage < 70) return 'success';
    if (percentage < 90) return 'warning';
    return 'error';
  };

  const getProgressPercentage = (spent: number, amount: number) => {
    return Math.min((spent / amount) * 100, 100);
  };

  return (
    <Box sx={{ p: 3 }}>
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
          Budgets
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#00ff88',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#00cc6a',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
            },
          }}
        >
          Add Budget
        </Button>
      </Box>

      {budgets.length === 0 ? (
        <Card sx={{
          backgroundColor: 'rgba(13, 13, 13, 0.9)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
          textAlign: 'center',
          py: 6,
        }}>
          <CardContent>
            <AccountBalanceWallet sx={{ 
              fontSize: 80, 
              color: 'rgba(0, 255, 136, 0.3)', 
              mb: 2,
            }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              No Budgets Yet
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#888',
                mb: 3,
              }}
            >
              Create your first budget to track your spending goals. Your spending will be automatically calculated from your transactions.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: '#00ff88',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#00cc6a',
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                },
              }}
            >
              Create Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: 'rgba(13, 13, 13, 0.9)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Budget
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Category
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Period
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Amount
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Spent
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Progress
                </TableCell>
                <TableCell sx={{ 
                  color: '#00ff88', 
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.05)' } }}>
                  <TableCell sx={{ 
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {budget.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      {budget.startDate} - {budget.endDate}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <Chip 
                      label={budget.category} 
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        border: '1px solid rgba(0, 255, 136, 0.5)',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <Chip 
                      label={budget.period} 
                      size="small"
                      variant="outlined"
                      sx={{
                        color: '#888',
                        borderColor: '#555',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#fff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: 'bold',
                  }}>
                    ${budget.amount.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ 
                    color: budget.spent > budget.amount ? '#ff6b6b' : '#00ff88',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: 'bold',
                  }}>
                    ${budget.spent.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(budget.spent, budget.amount)}
                        color={getProgressColor(budget.spent, budget.amount)}
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            boxShadow: budget.spent > budget.amount 
                              ? '0 0 10px rgba(255, 107, 107, 0.5)'
                              : '0 0 10px rgba(0, 255, 136, 0.5)',
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ 
                        color: budget.spent > budget.amount ? '#ff6b6b' : '#00ff88',
                        minWidth: '40px',
                        fontWeight: 'bold',
                      }}>
                        {Math.round(getProgressPercentage(budget.spent, budget.amount))}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(budget)}
                      sx={{ 
                        color: '#00ff88',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 136, 0.1)',
                          boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                        },
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(budget.id)}
                      sx={{ 
                        color: '#ff6b6b',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          boxShadow: '0 0 10px rgba(255, 107, 107, 0.3)',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Budget Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: 2,
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1a1a1a', 
          borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
          fontWeight: 'bold',
        }}>
          {editingBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1a1a1a' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Budget Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
              }}
            />
            
            <FormControl 
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
                '& .MuiSelect-icon': { color: '#888' },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                    },
                  },
                }}
              >
                {budgetCategories.map((category) => (
                  <MenuItem 
                    key={category} 
                    value={category}
                    sx={{
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      },
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Budget Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
              }}
            />
            
            {/* Display calculated spending (read-only) */}
            {editingBudget && (
              <Box sx={{
                p: 2,
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 1,
                mt: 1,
              }}>
                <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                  Current Spending (Auto-calculated from transactions)
                </Typography>
                <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                  ${editingBudget.spent.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  This amount is calculated from your expense transactions in the "{editingBudget.category}" category within the budget period.
                </Typography>
              </Box>
            )}
            
            <FormControl 
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
                '& .MuiSelect-icon': { color: '#888' },
              }}
            >
              <InputLabel>Period</InputLabel>
              <Select
                value={formData.period}
                label="Period"
                onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'weekly' | 'yearly' })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                    },
                  },
                }}
              >
                <MenuItem value="weekly" sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  },
                }}>Weekly</MenuItem>
                <MenuItem value="monthly" sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  },
                }}>Monthly</MenuItem>
                <MenuItem value="yearly" sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  },
                }}>Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
              }}
            />
            
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Auto-calculated based on period and start date"
              FormHelperTextProps={{ sx: { color: '#888' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#00ff88' },
                  '&.Mui-focused fieldset': { 
                    borderColor: '#00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': { color: '#00ff88' },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(0, 255, 136, 0.3)' }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: '#888',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                color: '#00ff88',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              backgroundColor: '#00ff88',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#00cc6a',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
              },
            }}
          >
            {editingBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Export the component
export { Budgets };
export default Budgets;

// Module export to prevent TS1208 isolatedModules warnings
export {};