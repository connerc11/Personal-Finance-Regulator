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
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Stack,
  Badge,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  AccountBox as AccountBoxIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { User, UserPreferences } from '../types';
import { userAPI } from '../services/apiService';

interface AccountStats {
  totalTransactions: number;
  totalBudgets: number;
  totalScheduled: number;
  accountAge: number;
  lastLogin: string;
}

const Profile: React.FC = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState<User | null>(authUser);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Profile editing states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  // Password change states
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // User-specific preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      transactionAlerts: true,
      weeklyReports: false,
    },
    privacy: {
      profilePublic: false,
      shareAnalytics: true,
    },
    appearance: {
      darkMode: false,
      currency: 'USD',
      language: 'English',
    },
  });

  // User-specific account stats (calculated from real data)
  const [accountStats, setAccountStats] = useState<AccountStats>({
    totalTransactions: 0,
    totalBudgets: 0,
    totalScheduled: 0,
    accountAge: 0,
    lastLogin: new Date().toISOString(),
  });

  // TODO: Replace with API call to load user-specific data from backend
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setProfileForm({
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        email: authUser.email || '',
        username: authUser.username || '',
      });

      // Load user-specific preferences
      loadUserPreferences();
      
      // Calculate account stats from real data
      calculateAccountStats();
    }
  }, [authUser]);

  const loadUserPreferences = () => {
    if (!authUser) return;

    try {
      // TODO: Replace with API call to load preferences from backend
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        setPreferences(parsedPreferences);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const saveUserPreferences = (newPreferences: UserPreferences) => {
    if (!authUser) return;

    try {
      // TODO: Replace with API call to save preferences to backend
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      setError('Failed to save preferences');
    }
  };

  const calculateAccountStats = () => {
    if (!authUser) return;

    try {
      // Get user transactions
      // TODO: Replace with API call to load transactions from backend
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];

      // Get user budgets
      // TODO: Replace with API call to load budgets from backend
      const budgets = storedBudgets ? JSON.parse(storedBudgets) : [];

      // Calculate account age in days
      const createdAt = new Date(authUser.createdAt);
      const now = new Date();
      const accountAge = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // For scheduled purchases, we'll use a simple estimate based on recurring transactions
      const recurringTransactions = transactions.filter((t: any) => 
        t.description?.toLowerCase().includes('subscription') || 
        t.description?.toLowerCase().includes('recurring') ||
        t.description?.toLowerCase().includes('monthly')
      );

      setAccountStats({
        totalTransactions: transactions.length,
        totalBudgets: budgets.length,
        totalScheduled: recurringTransactions.length,
        accountAge: Math.max(accountAge, 0),
        lastLogin: authUser.lastLoginAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to calculate account stats:', error);
    }
  };

  const getRecentActivity = () => {
    if (!authUser) return [];

    const activities: { description: string; time: string }[] = [];

    try {
      // Get recent transactions (last 5)
      // TODO: Replace with API call to load transactions from backend
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      
      const recentTransactions = transactions
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

      recentTransactions.forEach((transaction: any) => {
        activities.push({
          description: `${transaction.type === 'income' ? 'Received' : 'Spent'} $${Math.abs(transaction.amount)} - ${transaction.description}`,
          time: new Date(transaction.date).toLocaleDateString(),
        });
      });

      // Get recent budgets (last 2)
      // TODO: Replace with API call to load budgets from backend
      const budgets = storedBudgets ? JSON.parse(storedBudgets) : [];
      
      const recentBudgets = budgets
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 2);

      recentBudgets.forEach((budget: any) => {
        activities.push({
          description: `Created budget for '${budget.category}' - $${budget.amount}`,
          time: budget.createdAt ? new Date(budget.createdAt).toLocaleDateString() : 'Recently',
        });
      });

    } catch (error) {
      console.error('Failed to get recent activity:', error);
    }

    return activities.slice(0, 5); // Return max 5 activities
  };

  // Load user profile data
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // In real app, fetch extended profile data from API
      // const response = await userAPI.getProfile();
      // setUser(response.data);
      
      // For now, use the authenticated user data with some defaults
      if (authUser) {
        const extendedUser: User = {
          ...authUser,
          phoneNumber: authUser.phoneNumber || '',
          dateOfBirth: authUser.dateOfBirth || '',
          profilePicture: authUser.profilePicture || '',
          bio: authUser.bio || '',
          occupation: authUser.occupation || '',
          annualIncome: authUser.annualIncome || 0,
          currency: authUser.currency || 'USD',
          timezone: authUser.timezone || 'UTC',
          notifications: authUser.notifications || {
            email: true,
            push: true,
            budgetAlerts: true,
            weeklyReports: false,
          },
          twoFactorEnabled: authUser.twoFactorEnabled || false,
          lastLoginAt: authUser.lastLoginAt || new Date().toISOString(),
          monthlyBudget: authUser.monthlyBudget || 0,
          savingsGoal: authUser.savingsGoal || 0,
          riskTolerance: authUser.riskTolerance || 'medium',
        };
        
        setUser(extendedUser);
        setProfileForm({
          firstName: extendedUser.firstName,
          lastName: extendedUser.lastName,
          email: extendedUser.email,
          username: extendedUser.username,
        });
      }
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      // In real app, call API
      // await userAPI.updateProfile(profileForm);
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          username: profileForm.username,
        });
      }
      
      setEditingProfile(false);
      setError(null);
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      });
    }
    setEditingProfile(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      // In real app, call password change API
      // await userAPI.changePassword(passwordForm);
      
      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setError(null);
      alert('Password changed successfully!');
    } catch (error) {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (category: keyof UserPreferences, key: string, value: any) => {
    const newPreferences = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value,
      },
    };
    
    // TODO: Replace with API call to save data to backend
    saveUserPreferences(newPreferences);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatAccountAge = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Loading your profile...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load user profile. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Profile Settings
        </Typography>
        <Chip
          icon={<CheckCircleIcon />}
          label="Account Verified"
          color="success"
          variant="outlined"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SettingsIcon />} label="Preferences" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<AnalyticsIcon />} label="Account Stats" />
        </Tabs>
      </Card>

      {/* Profile Tab */}
      {currentTab === 0 && (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '0 0 300px', minWidth: '300px' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <CameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '2rem',
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </Avatar>
                </Badge>
                <Typography variant="h5" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Personal Information
                  </Typography>
                  {!editingProfile ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditingProfile(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    disabled={!editingProfile}
                    variant={editingProfile ? 'outlined' : 'filled'}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    disabled={!editingProfile}
                    variant={editingProfile ? 'outlined' : 'filled'}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={!editingProfile}
                    variant={editingProfile ? 'outlined' : 'filled'}
                  />
                  <TextField
                    label="Username"
                    fullWidth
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    disabled={!editingProfile}
                    variant={editingProfile ? 'outlined' : 'filled'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Preferences Tab */}
      {currentTab === 1 && (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notifications
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
                    <Switch
                      checked={preferences.notifications.email}
                      onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Push Notifications" secondary="Receive push notifications" />
                    <Switch
                      checked={preferences.notifications.push}
                      onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Budget Alerts" secondary="Get notified when approaching budget limits" />
                    <Switch
                      checked={preferences.notifications.budgetAlerts}
                      onChange={(e) => handlePreferenceChange('notifications', 'budgetAlerts', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Transaction Alerts" secondary="Get notified of new transactions" />
                    <Switch
                      checked={preferences.notifications.transactionAlerts}
                      onChange={(e) => handlePreferenceChange('notifications', 'transactionAlerts', e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Weekly Reports" secondary="Receive weekly spending reports" />
                    <Switch
                      checked={preferences.notifications.weeklyReports}
                      onChange={(e) => handlePreferenceChange('notifications', 'weeklyReports', e.target.checked)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 400px' }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Privacy Settings
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Public Profile" secondary="Make your profile visible to others" />
                      <Switch
                        checked={preferences.privacy.profilePublic}
                        onChange={(e) => handlePreferenceChange('privacy', 'profilePublic', e.target.checked)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Share Analytics" secondary="Allow anonymous analytics sharing" />
                      <Switch
                        checked={preferences.privacy.shareAnalytics}
                        onChange={(e) => handlePreferenceChange('privacy', 'shareAnalytics', e.target.checked)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Appearance
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Dark Mode" secondary="Use dark theme" />
                      <Switch
                        checked={preferences.appearance.darkMode}
                        onChange={(e) => handlePreferenceChange('appearance', 'darkMode', e.target.checked)}
                      />
                    </ListItem>
                  </List>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                      select
                      label="Currency"
                      sx={{ flex: 1 }}
                      value={preferences.appearance.currency}
                      onChange={(e) => handlePreferenceChange('appearance', 'currency', e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </TextField>
                    <TextField
                      select
                      label="Language"
                      sx={{ flex: 1 }}
                      value={preferences.appearance.language}
                      onChange={(e) => handlePreferenceChange('appearance', 'language', e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </TextField>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Security Tab */}
      {currentTab === 2 && (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Password & Security
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LockIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Change Password"
                      secondary="Last changed 30 days ago"
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setPasswordDialog(true)}
                    >
                      Change
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security"
                    />
                    <Button variant="outlined" color="primary">
                      Enable
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Login Sessions"
                      secondary="Manage your active sessions"
                    />
                    <Button variant="outlined">
                      View
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Danger Zone
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Export Data"
                      secondary="Download all your data"
                    />
                    <Button variant="outlined">
                      Export
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Delete Account"
                      secondary="Permanently delete your account and all data"
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Account Stats Tab */}
      {currentTab === 3 && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">
                  {accountStats.totalTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">
                  {accountStats.totalBudgets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Budgets
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main">
                  {accountStats.totalScheduled}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled Purchases
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="info.main">
                  {formatAccountAge(accountStats.accountAge)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Age
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {getRecentActivity().length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity to display
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Start by creating transactions or budgets
                  </Typography>
                </Box>
              ) : (
                <List>
                  {getRecentActivity().map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Last login: ${new Date(accountStats.lastLogin).toLocaleDateString()}`}
                      secondary={new Date(accountStats.lastLogin).toLocaleTimeString()}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              fullWidth
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    edge="end"
                  >
                    {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              fullWidth
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    edge="end"
                  >
                    {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              fullWidth
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    edge="end"
                  >
                    {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;