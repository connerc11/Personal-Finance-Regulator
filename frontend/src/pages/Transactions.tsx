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
} from '@mui/material';
import { Add, Edit, Delete, AccountBalance } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/apiService';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}



const Transactions: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });


  // Load transactions from backend API on component mount or user change
  // Helper to map backend type to frontend type
  const mapBackendToFrontend = (tx) => ({
    ...tx,
    type: tx.type === 'INCOME' ? 'income' : tx.type === 'EXPENSE' ? 'expense' : tx.type
  });

  // Helper to map frontend type to backend type
  // Helper to map frontend type and category to backend type and enum value
  const mapFrontendToBackend = (tx) => ({
    ...tx,
    type: tx.type === 'income' ? 'INCOME' : tx.type === 'expense' ? 'EXPENSE' : tx.type,
    category: mapCategoryToEnum(tx.category)
  });

  // Map display category to backend enum value
  const mapCategoryToEnum = (category) => {
    switch (category) {
      case 'Salary': return 'SALARY';
      case 'Freelance': return 'BUSINESS';
      case 'Investment': return 'INVESTMENT';
      case 'Business': return 'BUSINESS';
      case 'Other Income': return 'OTHER_INCOME';
      case 'Food': return 'DINING';
      case 'Transportation': return 'TRANSPORTATION';
      case 'Shopping': return 'SHOPPING';
      case 'Entertainment': return 'ENTERTAINMENT';
      case 'Bills & Utilities': return 'UTILITIES';
      case 'Healthcare': return 'HEALTHCARE';
      case 'Education': return 'EDUCATION';
      case 'Travel': return 'TRAVEL';
      case 'Other Expense': return 'OTHER_EXPENSE';
      case 'Groceries': return 'GROCERIES';
      case 'Rent': return 'RENT';
      case 'Insurance': return 'INSURANCE';
      case 'Charity': return 'CHARITY';
      default: return 'OTHER_EXPENSE';
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        const response = await transactionAPI.getAll(user.id);
        if (response.success) {
          setTransactions(response.data.map(mapBackendToFrontend));
        } else {
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;
    const amount = parseFloat(formData.amount);
    const finalAmount = formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    if (editingTransaction) {
      // Update transaction in backend
      await transactionAPI.update(editingTransaction.id, mapFrontendToBackend({
        ...formData,
        amount: finalAmount,
      }));
    } else {
      // Create new transaction in backend
      await transactionAPI.create(mapFrontendToBackend({
        ...formData,
        amount: finalAmount,
        userId: user.id,
      }));
    }

    // Reload transactions from backend
    const response = await transactionAPI.getAll(user.id);
    setTransactions(response.success ? response.data.map(mapBackendToFrontend) : []);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(), // Show absolute value for editing
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    await transactionAPI.delete(id);
    const response = await transactionAPI.getAll(user.id);
    setTransactions(response.success ? response.data.map(mapBackendToFrontend) : []);
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
          Transactions
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
          Add Transaction
        </Button>
      </Box>

      {transactions.length === 0 ? (
        <Card sx={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #00ff88',
          borderRadius: 3,
          boxShadow: `
            0 0 20px rgba(0, 255, 136, 0.3),
            0 0 40px rgba(0, 255, 136, 0.1)
          `,
          textAlign: 'center',
          py: 6,
        }}>
          <CardContent>
            <AccountBalance sx={{ 
              fontSize: 64, 
              color: '#00ff88', 
              mb: 2,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))',
            }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                color: '#00ff88',
                fontWeight: 'bold',
              }}
            >
              No Transactions Yet
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#888',
                mb: 3,
              }}
            >
              Start tracking your finances by adding your first transaction
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
              Add Your First Transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff88',
            borderRadius: 3,
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.3),
              0 0 40px rgba(0, 255, 136, 0.1)
            `,
          }}
        >
        <Table sx={{
          '& .MuiTableHead-root': {
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
          },
          '& .MuiTableCell-head': {
            color: '#00ff88',
            fontWeight: 'bold',
            borderBottom: '2px solid #00ff88',
          },
          '& .MuiTableCell-root': {
            color: '#fff',
            borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: 'rgba(0, 255, 136, 0.05)',
          },
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={transaction.amount >= 0 ? 'success.main' : 'error.main'}
                    fontWeight="medium"
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(transaction)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(transaction.id)}
                    color="error"
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

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff88',
            borderRadius: 3,
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.3),
              0 0 40px rgba(0, 255, 136, 0.1)
            `,
          },
        }}
      >
        <DialogTitle sx={{ 
          color: '#00ff88', 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
        }}>
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1a1a1a' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              fullWidth
              helperText="Enter amount as positive number (type determines if it's income or expense)"
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
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                sx={{
                  '& .MuiMenuItem-root': {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #00ff88',
                    },
                  },
                }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
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
                sx={{
                  '& .MuiMenuItem-root': {
                    backgroundColor: '#1a1a1a',
                    color: '#00ff88',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 136, 0.3)',
                      },
                    },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #00ff88',
                    },
                  },
                }}
              >
                {formData.type === 'income' ? [
                    <MenuItem key="Salary" value="Salary">Salary</MenuItem>,
                    <MenuItem key="Freelance" value="Freelance">Freelance</MenuItem>,
                    <MenuItem key="Investment" value="Investment">Investment</MenuItem>,
                    <MenuItem key="Business" value="Business">Business</MenuItem>,
                    <MenuItem key="Other Income" value="Other Income">Other Income</MenuItem>,
                ] : [
                    <MenuItem key="Food" value="Food">Food & Dining</MenuItem>,
                    <MenuItem key="Transportation" value="Transportation">Transportation</MenuItem>,
                    <MenuItem key="Shopping" value="Shopping">Shopping</MenuItem>,
                    <MenuItem key="Entertainment" value="Entertainment">Entertainment</MenuItem>,
                    <MenuItem key="Bills & Utilities" value="Bills & Utilities">Bills & Utilities</MenuItem>,
                    <MenuItem key="Healthcare" value="Healthcare">Healthcare</MenuItem>,
                    <MenuItem key="Education" value="Education">Education</MenuItem>,
                    <MenuItem key="Travel" value="Travel">Travel</MenuItem>,
                    <MenuItem key="Other Expense" value="Other Expense">Other Expense</MenuItem>,
                ]}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;