import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Alert,
  Stack,
  Paper,
  LinearProgress,
  Avatar,
  Fab,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ExecuteIcon,
  Pause as PauseIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Analytics as AnalyticsIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { ScheduledPurchase } from '../types';
import { useScheduledPurchases, PastPurchase } from '../hooks/useScheduledPurchases';
import { useAuth } from '../contexts/AuthContext';
import ScheduledInsights from '../components/ScheduledInsights';

const CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Insurance',
  'Subscriptions',
  'Other'
];

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

const ScheduledPurchases: React.FC = () => {
  const { user } = useAuth();
  const {
    scheduledPurchases,
    pastPurchases,
    upcomingPurchases,
    loading,
    error,
    createScheduledPurchase,
    updateScheduledPurchase,
    deleteScheduledPurchase,
    toggleActive,
    executeNow,
    getTotalMonthlyAmount,
    refreshData,
  } = useScheduledPurchases(user?.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<ScheduledPurchase | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    nextDue: new Date(),
    isActive: true,
  });

  const handleCreateOrUpdate = async () => {
    try {
      const purchaseData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        frequency: formData.frequency,
        nextDue: formData.nextDue.toISOString().split('T')[0],
        isActive: formData.isActive,
        userId: 1, // In real app, get from auth context
      };

      if (editingPurchase) {
        await updateScheduledPurchase(editingPurchase.id, purchaseData);
      } else {
        await createScheduledPurchase(purchaseData);
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save scheduled purchase:', error);
      handleCloseDialog();
    }
  };

  const handleEdit = (purchase: ScheduledPurchase) => {
    setEditingPurchase(purchase);
    setFormData({
      name: purchase.name,
      amount: purchase.amount.toString(),
      category: purchase.category,
      frequency: purchase.frequency,
      nextDue: new Date(purchase.nextDue),
      isActive: purchase.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteScheduledPurchase(id);
  };

  const handleToggleActive = async (purchase: ScheduledPurchase) => {
    await toggleActive(purchase.id);
  };

  const handleExecuteNow = async (purchase: ScheduledPurchase) => {
    await executeNow(purchase.id);
    alert(`Executed ${purchase.name} for $${purchase.amount}`);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPurchase(null);
    setFormData({
      name: '',
      amount: '',
      category: '',
      frequency: 'monthly',
      nextDue: new Date(),
      isActive: true,
    });
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Housing': <Box sx={{ color: '#8884d8' }}><CategoryIcon /></Box>,
      'Food & Dining': <Box sx={{ color: '#82ca9d' }}><CategoryIcon /></Box>,
      'Transportation': <Box sx={{ color: '#ffc658' }}><CategoryIcon /></Box>,
      'Subscriptions': <Box sx={{ color: '#ff7300' }}><CategoryIcon /></Box>,
      'Insurance': <Box sx={{ color: '#d084d0' }}><CategoryIcon /></Box>,
      'Healthcare': <Box sx={{ color: '#8dd1e1' }}><CategoryIcon /></Box>,
      'Bills & Utilities': <Box sx={{ color: '#ffb347' }}><CategoryIcon /></Box>,
    };
    return iconMap[category] || <CategoryIcon />;
  };

  const getFrequencyColor = (frequency: string) => {
    const colorMap: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      'daily': 'error',
      'weekly': 'warning',
      'monthly': 'primary',
      'yearly': 'success',
    };
    return colorMap[frequency] || 'default';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Scheduled Purchases
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Loading your scheduled purchases...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Scheduled Purchases
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Scheduled Purchase
          </Button>
        </Box>

        {/* Overview Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Schedules
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {scheduledPurchases.filter(p => p.isActive).length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Monthly Total
                  </Typography>
                  <Typography variant="h4" component="h2">
                    ${getTotalMonthlyAmount().toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Due This Week
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {upcomingPurchases.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <CalendarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab icon={<ListIcon />} label="Scheduled Purchases" />
            <Tab icon={<TimeIcon />} label="Past Purchases" />
            <Tab icon={<AnalyticsIcon />} label="Insights & Analytics" />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {currentTab === 0 && (
          <>
            {/* Check if user has no scheduled purchases */}
            {scheduledPurchases.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 6 }}>
                <CardContent>
                  <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Scheduled Purchases Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start by adding your recurring expenses like subscriptions, bills, or other regular payments to keep track of your upcoming financial commitments.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                  >
                    Add Your First Scheduled Purchase
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Upcoming Purchases Alert */}
                {upcomingPurchases.length > 0 && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Upcoming Purchases This Week
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {upcomingPurchases.map((purchase, index) => (
                        <Typography key={purchase.id} variant="body2">
                          • {purchase.name} - ${purchase.amount} (Due in {getDaysUntilDue(purchase.nextDue)} days)
                        </Typography>
                      ))}
                    </Box>
                  </Alert>
                )}

                {/* Scheduled Purchases List */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      All Scheduled Purchases
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                      {scheduledPurchases.map((purchase) => {
                    const daysUntil = getDaysUntilDue(purchase.nextDue);
                    const isOverdue = daysUntil < 0;
                    const isDueSoon = daysUntil <= 3 && daysUntil >= 0;

                    return (
                      <Paper
                        key={purchase.id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          border: isOverdue ? '2px solid' : '1px solid',
                          borderColor: isOverdue ? 'error.main' : isDueSoon ? 'warning.main' : 'divider',
                          opacity: purchase.isActive ? 1 : 0.6,
                        }}
                      >
                        <Avatar sx={{ bgcolor: purchase.isActive ? 'primary.main' : 'grey.400' }}>
                          {getCategoryIcon(purchase.category)}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" component="div">
                              {purchase.name}
                            </Typography>
                            <Chip
                              label={purchase.frequency}
                              color={getFrequencyColor(purchase.frequency)}
                              size="small"
                            />
                            {!purchase.isActive && (
                              <Chip label="Paused" color="default" size="small" />
                            )}
                          </Box>
                          
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              <strong>${purchase.amount}</strong> • {purchase.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Next due: {new Date(purchase.nextDue).toLocaleDateString()}
                            </Typography>
                            {isOverdue && (
                              <Chip
                                icon={<WarningIcon />}
                                label={`Overdue by ${Math.abs(daysUntil)} days`}
                                color="error"
                                size="small"
                              />
                            )}
                            {isDueSoon && !isOverdue && (
                              <Chip
                                icon={<TimeIcon />}
                                label={`Due in ${daysUntil} days`}
                                color="warning"
                                size="small"
                              />
                            )}
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title={purchase.isActive ? "Pause" : "Resume"}>
                            <IconButton
                              onClick={() => handleToggleActive(purchase)}
                              color={purchase.isActive ? "warning" : "success"}
                            >
                              {purchase.isActive ? <PauseIcon /> : <CheckCircleIcon />}
                            </IconButton>
                          </Tooltip>
                          
                          {purchase.isActive && (
                            <Tooltip title="Execute Now">
                              <IconButton
                                onClick={() => handleExecuteNow(purchase)}
                                color="primary"
                              >
                                <ExecuteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(purchase)} color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(purchase.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Paper>
                    );
                  })}
                    </Box>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}

        {/* Past Purchases Tab */}
        {currentTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Past Purchases History
              </Typography>
              {pastPurchases.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No past purchases yet. Execute some scheduled purchases to see them here.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                  {pastPurchases
                    .sort((a, b) => new Date(b.executedDate).getTime() - new Date(a.executedDate).getTime())
                    .map((purchase) => (
                      <Paper key={purchase.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <CheckCircleIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6">
                              {purchase.name}
                            </Typography>
                            <Chip label={purchase.category} size="small" variant="outlined" />
                          </Box>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              <strong>${purchase.amount}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Executed: {new Date(purchase.executedDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Originally due: {new Date(purchase.scheduledDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>
                        <Chip 
                          icon={<CheckCircleIcon />}
                          label="Completed" 
                          color="success" 
                          size="small" 
                        />
                      </Paper>
                    ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Insights Tab */}
        {currentTab === 2 && (
          <ScheduledInsights 
            scheduledPurchases={scheduledPurchases} 
            totalMonthlyAmount={getTotalMonthlyAmount()}
          />
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPurchase ? 'Edit Scheduled Purchase' : 'Add Scheduled Purchase'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Netflix Subscription"
              />

              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                InputProps={{
                  startAdornment: '$',
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                >
                  {FREQUENCIES.map((freq) => (
                    <MenuItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Next Due Date"
                type="date"
                fullWidth
                value={formData.nextDue.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, nextDue: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleCreateOrUpdate} 
              variant="contained"
              disabled={!formData.name || !formData.amount || !formData.category}
            >
              {editingPurchase ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

export default ScheduledPurchases;

// Module export to prevent TS1208 isolatedModules warnings
export {};
