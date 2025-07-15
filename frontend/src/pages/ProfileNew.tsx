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
  Grid,
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
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { User, UserPreferences } from '../types';
import { userAPI } from '../services/apiService';

interface AccountStats {
  totalTransactions: number;
  totalBudgets: number;
  accountAge: number;
  lastLogin: string;
}

const Profile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
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
    phoneNumber: '',
  });
  
  // Password change states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
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
  
  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Load user profile and preferences
  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser) return;
      
      setLoading(true);
      try {
        // Load user profile
        const profileResponse = await userAPI.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data);
          setProfileForm({
            firstName: profileResponse.data.firstName || '',
            lastName: profileResponse.data.lastName || '',
            email: profileResponse.data.email || '',
            phoneNumber: profileResponse.data.phoneNumber || '',
          });
        }
        
        // Load user preferences
        const preferencesResponse = await userAPI.getPreferences();
        if (preferencesResponse.success) {
          setPreferences(preferencesResponse.data);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [authUser]);

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await userAPI.updateProfile(profileForm);
      if (response.success) {
        setUser(response.data);
        setEditingProfile(false);
        setSuccessMessage('Profile updated successfully');
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await userAPI.uploadAvatar(file);
      if (response.success) {
        setUser(prev => prev ? { ...prev, avatarUrl: response.data.avatarUrl } : null);
        setSuccessMessage('Avatar updated successfully');
      } else {
        setError(response.message || 'Failed to upload avatar');
      }
    } catch (error) {
      setError('Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await userAPI.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (response.success) {
        setChangePasswordOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setSuccessMessage('Password changed successfully');
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Handle preference changes
  const handlePreferenceChange = async (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    
    try {
      const response = await userAPI.updatePreferences(updatedPreferences);
      if (response.success) {
        setSuccessMessage('Preferences updated');
      } else {
        setError(response.message || 'Failed to update preferences');
        // Revert on error
        setPreferences(preferences);
      }
    } catch (error) {
      setError('Failed to update preferences');
      setPreferences(preferences);
    }
  };

  const calculateAccountAge = () => {
    if (!user?.createdAt) return 0;
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderProfileTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  size="small"
                  component="label"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <CameraIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAvatarUpload(file);
                      }
                    }}
                  />
                </IconButton>
              }
            >
              <Avatar
                src={user?.avatarUrl}
                sx={{ width: 100, height: 100 }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </Badge>
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user?.createdAt || '').toLocaleDateString()}
              </Typography>
            </Box>
            <Button
              variant={editingProfile ? "contained" : "outlined"}
              startIcon={editingProfile ? <SaveIcon /> : <EditIcon />}
              onClick={editingProfile ? handleSaveProfile : () => setEditingProfile(true)}
              disabled={saving}
            >
              {editingProfile ? 'Save' : 'Edit'}
            </Button>
            {editingProfile && (
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setEditingProfile(false);
                  setProfileForm({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phoneNumber: user?.phoneNumber || '',
                  });
                }}
                sx={{ ml: 1 }}
              >
                Cancel
              </Button>
            )}
          </Box>

          {editingProfile ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  fullWidth
                />
              </Grid>
            </Grid>
          ) : (
            <List>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Full Name" secondary={`${user?.firstName} ${user?.lastName}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><EmailIcon /></ListItemIcon>
                <ListItemText primary="Email" secondary={user?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon><PhoneIcon /></ListItemIcon>
                <ListItemText primary="Phone" secondary={user?.phoneNumber || 'Not set'} />
              </ListItem>
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderPreferencesTab = () => {
    if (!preferences) return <Typography>Loading preferences...</Typography>;

    return (
      <Box>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Push Notifications" secondary="Receive push notifications" />
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Budget Alerts" secondary="Get notified when approaching budget limits" />
                <Switch
                  checked={preferences.budgetAlerts}
                  onChange={(e) => handlePreferenceChange('budgetAlerts', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Transaction Alerts" secondary="Get notified of new transactions" />
                <Switch
                  checked={preferences.transactionAlerts}
                  onChange={(e) => handlePreferenceChange('transactionAlerts', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Security Alerts" secondary="Get notified of security events" />
                <Switch
                  checked={preferences.securityAlerts}
                  onChange={(e) => handlePreferenceChange('securityAlerts', e.target.checked)}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Profile Visibility" secondary="Make your profile visible to others" />
                <Switch
                  checked={preferences.profileVisible}
                  onChange={(e) => handlePreferenceChange('profileVisible', e.target.checked)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Share Data for Analytics" secondary="Help improve our service with anonymous data" />
                <Switch
                  checked={preferences.shareData}
                  onChange={(e) => handlePreferenceChange('shareData', e.target.checked)}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appearance & Language
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Theme"
                  select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Language"
                  select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Currency"
                  select
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderSecurityTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Password & Security
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setChangePasswordOpen(true)}
            sx={{ mb: 2 }}
          >
            Change Password
          </Button>
          <Typography variant="body2" color="text.secondary">
            Last password change: Never
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These actions cannot be undone. Please be careful.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Handle account deletion
                alert('Account deletion functionality not implemented yet');
              }
            }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );

  const renderAccountStatsTab = () => {
    const stats: AccountStats = {
      totalTransactions: 0, // This would come from API
      totalBudgets: 0, // This would come from API
      accountAge: calculateAccountAge(),
      lastLogin: 'Today', // This would come from API
    };

    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4">{stats.totalTransactions}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccountBoxIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4">{stats.totalBudgets}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Budgets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4">{stats.accountAge}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Days Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4">{stats.lastLogin}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Login
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" icon={<PersonIcon />} />
          <Tab label="Preferences" icon={<SettingsIcon />} />
          <Tab label="Security" icon={<SecurityIcon />} />
          <Tab label="Account Stats" icon={<AnalyticsIcon />} />
        </Tabs>
      </Paper>

      {currentTab === 0 && renderProfileTab()}
      {currentTab === 1 && renderPreferencesTab()}
      {currentTab === 2 && renderSecurityTab()}
      {currentTab === 3 && renderAccountStatsTab()}

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained" disabled={saving}>
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
