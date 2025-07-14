import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Chip,
  IconButton,
  Alert,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Budget } from '../types';
import { budgetAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const BudgetPage: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'MONTHLY' as Budget['period'],
    startDate: '',
    endDate: '',
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Gifts & Donations',
    'Other',
  ];

  // Load budgets from API
  useEffect(() => {
    const loadBudgets = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await budgetAPI.getAll(user.id);
        
        if (response.success) {
          setBudgets(response.data);
        } else {
          setError(response.message || 'Failed to load budgets');
        }
      } catch (error) {
        console.error('Error loading budgets:', error);
        setError('Failed to load budgets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [user]);

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        name: budget.name,
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        name: '',
        category: '',
        amount: '',
        period: 'MONTHLY',
        startDate: '',
        endDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
  };

  const handleSaveBudget = () => {
    if (!formData.name || !formData.category || !formData.amount) {
      return;
    }

    const budgetData: Omit<Budget, 'id' | 'spent' | 'userId'> = {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    if (editingBudget) {
      // Update existing budget
      setBudgets(prev =>
        prev.map(budget =>
          budget.id === editingBudget.id
            ? { ...budget, ...budgetData }
            : budget
        )
      );
    } else {
      // Create new budget
      const newBudget: Budget = {
        ...budgetData,
        id: Date.now(),
        spent: 0,
        userId: 1,
      };
      setBudgets(prev => [...prev, newBudget]);
    }

    handleCloseDialog();
  };

  const handleDeleteBudget = (id: number) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'error' as const };
    if (percentage >= 80) return { status: 'warning', color: 'warning' as const };
    return { status: 'good', color: 'success' as const };
  };

  const getBudgetIcon = (status: string) => {
    switch (status) {
      case 'exceeded':
        return <WarningIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudgeted - totalSpent;

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading budgets...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Budget Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Create Budget
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        mb: 4,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Budgeted
            </Typography>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              ${totalBudgeted.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: 3, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Spent
            </Typography>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
              ${totalSpent.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: 3, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remaining
            </Typography>
            <Typography 
              variant="h4" 
              color={remainingBudget >= 0 ? 'success.main' : 'error.main'}
              sx={{ fontWeight: 'bold' }}
            >
              ${remainingBudget.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <Card sx={{ borderRadius: 2, boxShadow: 3, textAlign: 'center', py: 6 }}>
          <CardContent>
            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No budgets created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first budget to start tracking your expenses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}>
          {budgets.map((budget) => {
            const { status, color } = getBudgetStatus(budget);
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
            
            return (
              <Card key={budget.id} sx={{ borderRadius: 2, boxShadow: 3, height: 'fit-content' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {budget.name}
                      </Typography>
                      <Chip 
                        label={budget.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {getBudgetIcon(status)}
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(budget)}
                        sx={{ ml: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteBudget(budget.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Spent: ${budget.spent.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Budget: ${budget.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage}
                      color={color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mt: 1, textAlign: 'center' }}
                    >
                      {percentage.toFixed(1)}% used
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={budget.period} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ${(budget.amount - budget.spent).toLocaleString()} left
                    </Typography>
                  </Box>

                  {status === 'exceeded' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Budget exceeded by ${(budget.spent - budget.amount).toLocaleString()}
                    </Alert>
                  )}
                  {status === 'warning' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Approaching budget limit
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Floating Action Button */}
      <Tooltip title="Create Budget">
        <Fab
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Create/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Create New Budget'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
            gap: 2, 
            mt: 1 
          }}>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                label="Budget Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Box>
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as Budget['period'] })}
              required
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                label="Budget Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveBudget} 
            variant="contained"
            disabled={!formData.name || !formData.category || !formData.amount}
          >
            {editingBudget ? 'Update' : 'Create'} Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetPage;
