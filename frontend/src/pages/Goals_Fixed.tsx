import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  Avatar,
  LinearProgress,
  Chip,
  Alert,
  Stack,
  IconButton,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  Flag as GoalIcon,
  Timeline as ProgressIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompletedIcon,
  MonetizationOn as MoneyIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as MagicIcon,
  TrendingDown as ExpenseIcon,
  Psychology as AiIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface FinancialGoal {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetDate: string;
  isCompleted: boolean;
  userId: number;
  createdAt: string;
  monthlySavingsNeeded?: number;
  progress?: number;
}

interface SavingsStrategy {
  id: string;
  title: string;
  description: string;
  monthlySavings: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedImpact: number;
}

const GOALS_STORAGE_KEY = 'personal_finance_goals';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetDate: '',
  });

  const categories = [
    'Emergency Fund',
    'Home Purchase',
    'Car Purchase',
    'Vacation/Travel',
    'Education',
    'Wedding',
    'Retirement',
    'Debt Payoff',
    'Investment',
    'Electronics',
    'Home Improvement',
    'Healthcare',
    'Other'
  ];

  const savingsStrategies: SavingsStrategy[] = [
    {
      id: '1',
      title: 'Automate Your Savings',
      description: 'Set up automatic transfers to a dedicated savings account for each goal',
      monthlySavings: 200,
      category: 'automation',
      difficulty: 'easy',
      estimatedImpact: 85
    },
    {
      id: '2',
      title: 'Side Hustle Income',
      description: 'Start a side gig or freelance work to boost your savings rate',
      monthlySavings: 500,
      category: 'income',
      difficulty: 'hard',
      estimatedImpact: 90
    },
    {
      id: '3',
      title: 'Reduce Dining Out',
      description: 'Cook more meals at home and limit restaurant visits',
      monthlySavings: 150,
      category: 'expense_reduction',
      difficulty: 'medium',
      estimatedImpact: 75
    },
    {
      id: '4',
      title: 'Cancel Unused Subscriptions',
      description: 'Review and cancel streaming services, gym memberships, and other subscriptions',
      monthlySavings: 80,
      category: 'expense_reduction',
      difficulty: 'easy',
      estimatedImpact: 70
    },
    {
      id: '5',
      title: 'Cashback & Rewards',
      description: 'Use cashback credit cards and reward programs strategically',
      monthlySavings: 50,
      category: 'optimization',
      difficulty: 'easy',
      estimatedImpact: 60
    }
  ];

  // TODO: Replace with API call to load goals from backend
  useEffect(() => {
    if (user?.id) {
      loadGoals();
    }
  }, [user?.id]);

  const loadGoals = () => {
    if (!user?.id) return;
    
    try {
      // TODO: Replace with API call to load goals from backend
      if (stored) {
        const allGoals = JSON.parse(stored);
        const userGoals = allGoals.filter((goal: FinancialGoal) => goal.userId === user.id);
        
        // Calculate additional fields
        const goalsWithCalculations = userGoals.map((goal: FinancialGoal) => ({
          ...goal,
          progress: (goal.currentAmount / goal.targetAmount) * 100,
          monthlySavingsNeeded: calculateMonthlySavingsNeeded({
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: goal.targetDate
          })
        }));
        
        setGoals(goalsWithCalculations);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoalsToStorage = (updatedGoals: FinancialGoal[]) => {
    try {
      // TODO: Replace with API call to load goals from backend
      const allGoals = stored ? JSON.parse(stored) : [];
      
      // Remove old goals for this user
      const otherUsersGoals = allGoals.filter((goal: FinancialGoal) => goal.userId !== user?.id);
      
      // Add updated goals for this user
      const newAllGoals = [...otherUsersGoals, ...updatedGoals];
      
      // TODO: Replace with API call to save goals to backend
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const calculateMonthlySavingsNeeded = ({ targetAmount, currentAmount, targetDate }: {
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  }) => {
    const today = new Date();
    const target = new Date(targetDate);
    const monthsRemaining = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const remainingAmount = targetAmount - currentAmount;
    return Math.max(0, remainingAmount / monthsRemaining);
  };

  const handleOpenDialog = (goal?: FinancialGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        category: goal.category,
        priority: goal.priority,
        targetDate: goal.targetDate,
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '0',
        category: '',
        priority: 'medium',
        targetDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
  };

  const handleSaveGoal = () => {
    if (!user?.id) return;

    const goalData: FinancialGoal = {
      id: editingGoal?.id || Date.now(),
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      category: formData.category,
      priority: formData.priority,
      targetDate: formData.targetDate,
      isCompleted: false,
      userId: user.id,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      progress: (parseFloat(formData.currentAmount) || 0) / parseFloat(formData.targetAmount) * 100,
      monthlySavingsNeeded: calculateMonthlySavingsNeeded({
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate
      })
    };

    let updatedGoals;
    if (editingGoal) {
      updatedGoals = goals.map(g => g.id === editingGoal.id ? goalData : g);
    } else {
      updatedGoals = [...goals, goalData];
    }

    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
    handleCloseDialog();
  };

  const handleDeleteGoal = (goalId: number) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const handleUpdateProgress = (goalId: number, newAmount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = {
          ...goal,
          currentAmount: newAmount,
          progress: (newAmount / goal.targetAmount) * 100,
          monthlySavingsNeeded: calculateMonthlySavingsNeeded({
            targetAmount: goal.targetAmount,
            currentAmount: newAmount,
            targetDate: goal.targetDate
          })
        };
        return updatedGoal;
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const handleMarkCompleted = (goalId: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, isCompleted: true, currentAmount: goal.targetAmount, progress: 100 }
        : goal
    );
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'primary';
    }
  };

  const getStrategyIcon = (category: string) => {
    switch (category) {
      case 'automation': return <MagicIcon />;
      case 'income': return <TrendingUpIcon />;
      case 'expense_reduction': return <ExpenseIcon />;
      case 'optimization': return <StarIcon />;
      default: return <SavingsIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          Financial Goals
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Set, track, and achieve your financial aspirations
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <GoalIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {activeGoals.length}
                </Typography>
                <Typography variant="body2">
                  Active Goals
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <MoneyIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {formatCurrency(totalTargetAmount)}
                </Typography>
                <Typography variant="body2">
                  Total Target
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <SavingsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {formatCurrency(totalCurrentAmount)}
                </Typography>
                <Typography variant="body2">
                  Total Saved
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <ProgressIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {overallProgress.toFixed(1)}%
                </Typography>
                <Typography variant="body2">
                  Overall Progress
                </Typography>
              </Box>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={overallProgress} 
              sx={{ 
                mt: 1, 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }} 
            />
          </CardContent>
        </Card>
      </Box>

      {/* Goals List */}
      {goals.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <GoalIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Financial Goals Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your financial journey by setting your first goal!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          {goals.map((goal) => (
            <Card key={goal.id} sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              },
              opacity: goal.isCompleted ? 0.7 : 1
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {goal.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(goal)}
                      disabled={goal.isCompleted}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {goal.progress?.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(goal.progress || 0, 100)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={goal.category}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={goal.priority}
                    size="small"
                    color={getPriorityColor(goal.priority) as any}
                  />
                  <Chip
                    icon={<CalendarIcon />}
                    label={formatDate(goal.targetDate)}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {goal.monthlySavingsNeeded && goal.monthlySavingsNeeded > 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Save {formatCurrency(goal.monthlySavingsNeeded)}/month to reach your goal
                    </Typography>
                  </Alert>
                )}

                {!goal.isCompleted ? (
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        const newAmount = prompt(
                          `Update progress for "${goal.title}"\nCurrent: ${formatCurrency(goal.currentAmount)}\nTarget: ${formatCurrency(goal.targetAmount)}\n\nEnter new amount:`,
                          goal.currentAmount.toString()
                        );
                        if (newAmount && !isNaN(parseFloat(newAmount))) {
                          handleUpdateProgress(goal.id, parseFloat(newAmount));
                        }
                      }}
                    >
                      Update Progress
                    </Button>
                    {goal.currentAmount >= goal.targetAmount && (
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => handleMarkCompleted(goal.id)}
                        startIcon={<CompletedIcon />}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Button variant="contained" color="success" fullWidth disabled>
                    Goal Completed! 🎉
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Savings Strategies Section */}
      {goals.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            AI-Powered Savings Strategies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Smart strategies to help you reach your goals faster
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {savingsStrategies.map((strategy) => (
              <Card key={strategy.id} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: getDifficultyColor(strategy.difficulty) + '.main' }}>
                      {getStrategyIcon(strategy.category)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {strategy.title}
                      </Typography>
                      <Chip
                        label={strategy.difficulty}
                        size="small"
                        color={getDifficultyColor(strategy.difficulty) as any}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {strategy.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Potential Monthly Savings: <strong>{formatCurrency(strategy.monthlySavings)}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Estimated Impact: {strategy.estimatedImpact}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={strategy.estimatedImpact}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Floating Action Button */}
      <Tooltip title="Add New Goal">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Financial Goal' : 'Create New Financial Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              label="Goal Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            
            <TextField
              label="Category"
              select
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Target Amount"
              type="number"
              fullWidth
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              InputProps={{ startAdornment: '$' }}
            />
            
            <TextField
              label="Current Amount"
              type="number"
              fullWidth
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              InputProps={{ startAdornment: '$' }}
            />
            
            <TextField
              label="Priority"
              select
              fullWidth
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            
            <TextField
              label="Target Date"
              type="date"
              fullWidth
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your goal and why it's important to you..."
          />
          
          {formData.targetAmount && formData.targetDate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                You'll need to save approximately <strong>
                  {formatCurrency(
                    calculateMonthlySavingsNeeded({
                      targetAmount: parseFloat(formData.targetAmount) || 0,
                      currentAmount: parseFloat(formData.currentAmount) || 0,
                      targetDate: formData.targetDate
                    })
                  )}
                </strong> per month to reach this goal.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveGoal}
            variant="contained"
            disabled={!formData.title || !formData.targetAmount || !formData.category || !formData.targetDate}
          >
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goals;
