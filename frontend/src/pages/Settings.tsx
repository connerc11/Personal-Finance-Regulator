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
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Stack,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Backup as BackupIcon,
  CloudSync as CloudSyncIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  Assessment as ReportIcon,
  Schedule as ScheduleIcon,
  VolumeUp as VolumeIcon,
  Vibration as VibrationIcon,
  Email as EmailIcon,
  Smartphone as PhoneIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AutoMode as AutoModeIcon,
} from '@mui/icons-material';

interface AppSettings {
  general: {
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    fiscalYearStart: string;
  };
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    sound: boolean;
    vibration: boolean;
    budgetAlerts: boolean;
    transactionAlerts: boolean;
    billReminders: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    goalUpdates: boolean;
    securityAlerts: boolean;
    soundVolume: number;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    colorScheme: string;
    fontSize: string;
    compactMode: boolean;
    showAnimations: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReporting: boolean;
    usageStats: boolean;
    locationServices: boolean;
    dataSharing: boolean;
    cookieConsent: boolean;
    biometricAuth: boolean;
    autoLock: boolean;
    autoLockDelay: number;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: string;
    cloudSync: boolean;
    dataRetention: number;
    exportFormat: string;
    compressionEnabled: boolean;
  };
  advanced: {
    debugMode: boolean;
    betaFeatures: boolean;
    experimentalFeatures: boolean;
    apiTimeout: number;
    cacheSize: number;
    logLevel: string;
  };
}

const Settings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
  }>({ open: false, title: '', content: '', action: () => {} });

  const [settings, setSettings] = useState<AppSettings>({
    general: {
      currency: 'USD',
      language: 'English',
      timezone: 'America/New_York',
      dateFormat: 'MM/dd/yyyy',
      numberFormat: 'US',
      fiscalYearStart: 'January',
    },
    notifications: {
      push: true,
      email: true,
      sms: false,
      sound: true,
      vibration: true,
      budgetAlerts: true,
      transactionAlerts: true,
      billReminders: true,
      weeklyReports: false,
      monthlyReports: true,
      goalUpdates: true,
      securityAlerts: true,
      soundVolume: 70,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    },
    appearance: {
      theme: 'light',
      colorScheme: 'blue',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true,
      highContrast: false,
      reducedMotion: false,
    },
    privacy: {
      analyticsEnabled: true,
      crashReporting: true,
      usageStats: false,
      locationServices: false,
      dataSharing: false,
      cookieConsent: true,
      biometricAuth: false,
      autoLock: true,
      autoLockDelay: 5,
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      cloudSync: false,
      dataRetention: 365,
      exportFormat: 'JSON',
      compressionEnabled: true,
    },
    advanced: {
      debugMode: false,
      betaFeatures: false,
      experimentalFeatures: false,
      apiTimeout: 30,
      cacheSize: 100,
      logLevel: 'info',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In real app, load from API or localStorage
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // In real app, save to API
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setConfirmDialog({
      open: true,
      title: 'Reset All Settings',
      content: 'Are you sure you want to reset all settings to default values? This action cannot be undone.',
      action: () => {
        // Reset to default values
        setSettings({
          general: {
            currency: 'USD',
            language: 'English',
            timezone: 'America/New_York',
            dateFormat: 'MM/dd/yyyy',
            numberFormat: 'US',
            fiscalYearStart: 'January',
          },
          notifications: {
            push: true,
            email: true,
            sms: false,
            sound: true,
            vibration: true,
            budgetAlerts: true,
            transactionAlerts: true,
            billReminders: true,
            weeklyReports: false,
            monthlyReports: true,
            goalUpdates: true,
            securityAlerts: true,
            soundVolume: 70,
            quietHours: {
              enabled: false,
              start: '22:00',
              end: '08:00',
            },
          },
          appearance: {
            theme: 'light',
            colorScheme: 'blue',
            fontSize: 'medium',
            compactMode: false,
            showAnimations: true,
            highContrast: false,
            reducedMotion: false,
          },
          privacy: {
            analyticsEnabled: true,
            crashReporting: true,
            usageStats: false,
            locationServices: false,
            dataSharing: false,
            cookieConsent: true,
            biometricAuth: false,
            autoLock: true,
            autoLockDelay: 5,
          },
          data: {
            autoBackup: true,
            backupFrequency: 'weekly',
            cloudSync: false,
            dataRetention: 365,
            exportFormat: 'JSON',
            compressionEnabled: true,
          },
          advanced: {
            debugMode: false,
            betaFeatures: false,
            experimentalFeatures: false,
            apiTimeout: 30,
            cacheSize: 100,
            logLevel: 'info',
          },
        });
        setSuccess('Settings reset to defaults');
        setConfirmDialog({ open: false, title: '', content: '', action: () => {} });
      },
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `personal-finance-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess('Settings exported successfully');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...importedSettings });
          setSuccess('Settings imported successfully');
        } catch (error) {
          setError('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const updateSetting = (category: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const updateNestedSetting = (category: keyof AppSettings, nestedKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [nestedKey]: {
          ...(prev[category] as any)[nestedKey],
          [key]: value,
        },
      },
    }));
  };

  const clearCache = () => {
    setConfirmDialog({
      open: true,
      title: 'Clear Cache',
      content: 'This will clear all cached data. The app may take longer to load initially.',
      action: () => {
        // Clear cache logic here
        setSuccess('Cache cleared successfully');
        setConfirmDialog({ open: false, title: '', content: '', action: () => {} });
      },
    });
  };

  const clearData = () => {
    setConfirmDialog({
      open: true,
      title: 'Clear All Data',
      content: 'This will permanently delete all your financial data. This action cannot be undone!',
      action: () => {
        // Clear all data logic here
        setSuccess('All data cleared');
        setConfirmDialog({ open: false, title: '', content: '', action: () => {} });
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Loading settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetSettings}
            color="warning"
          >
            Reset All
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<PaletteIcon />} label="Appearance" />
          <Tab icon={<SecurityIcon />} label="Privacy & Security" />
          <Tab icon={<StorageIcon />} label="Data & Backup" />
          <Tab icon={<InfoIcon />} label="Advanced" />
        </Tabs>
      </Card>

      {/* General Settings */}
      {currentTab === 0 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Currency & Localization
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.general.currency}
                    label="Currency"
                    onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                  >
                    <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
                    <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
                    <MenuItem value="JPY">JPY (¥) - Japanese Yen</MenuItem>
                    <MenuItem value="CAD">CAD ($) - Canadian Dollar</MenuItem>
                    <MenuItem value="AUD">AUD ($) - Australian Dollar</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.general.language}
                    label="Language"
                    onChange={(e) => updateSetting('general', 'language', e.target.value)}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Español</MenuItem>
                    <MenuItem value="French">Français</MenuItem>
                    <MenuItem value="German">Deutsch</MenuItem>
                    <MenuItem value="Italian">Italiano</MenuItem>
                    <MenuItem value="Portuguese">Português</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.general.dateFormat}
                    label="Date Format"
                    onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                  >
                    <MenuItem value="MM/dd/yyyy">MM/dd/yyyy (US)</MenuItem>
                    <MenuItem value="dd/MM/yyyy">dd/MM/yyyy (UK)</MenuItem>
                    <MenuItem value="yyyy-MM-dd">yyyy-MM-dd (ISO)</MenuItem>
                    <MenuItem value="dd.MM.yyyy">dd.MM.yyyy (German)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Fiscal Year Start</InputLabel>
                  <Select
                    value={settings.general.fiscalYearStart}
                    label="Fiscal Year Start"
                    onChange={(e) => updateSetting('general', 'fiscalYearStart', e.target.value)}
                  >
                    <MenuItem value="January">January</MenuItem>
                    <MenuItem value="April">April</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="October">October</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Notifications Settings */}
      {currentTab === 1 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Channels
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary="Push Notifications" secondary="Receive notifications on this device" />
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VolumeIcon /></ListItemIcon>
                  <ListItemText primary="Sound Notifications" secondary="Play sound for notifications" />
                  <Switch
                    checked={settings.notifications.sound}
                    onChange={(e) => updateSetting('notifications', 'sound', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VibrationIcon /></ListItemIcon>
                  <ListItemText primary="Vibration" secondary="Vibrate for notifications" />
                  <Switch
                    checked={settings.notifications.vibration}
                    onChange={(e) => updateSetting('notifications', 'vibration', e.target.checked)}
                  />
                </ListItem>
              </List>

              {settings.notifications.sound && (
                <Box sx={{ mt: 2, px: 2 }}>
                  <Typography gutterBottom>Sound Volume</Typography>
                  <Slider
                    value={settings.notifications.soundVolume}
                    onChange={(e, value) => updateSetting('notifications', 'soundVolume', value)}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={100}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Types
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Budget Alerts" secondary="When approaching budget limits" />
                  <Switch
                    checked={settings.notifications.budgetAlerts}
                    onChange={(e) => updateSetting('notifications', 'budgetAlerts', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Transaction Alerts" secondary="For new transactions" />
                  <Switch
                    checked={settings.notifications.transactionAlerts}
                    onChange={(e) => updateSetting('notifications', 'transactionAlerts', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Bill Reminders" secondary="Before bills are due" />
                  <Switch
                    checked={settings.notifications.billReminders}
                    onChange={(e) => updateSetting('notifications', 'billReminders', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Weekly Reports" secondary="Weekly spending summaries" />
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Monthly Reports" secondary="Monthly financial reports" />
                  <Switch
                    checked={settings.notifications.monthlyReports}
                    onChange={(e) => updateSetting('notifications', 'monthlyReports', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Security Alerts" secondary="For security-related events" />
                  <Switch
                    checked={settings.notifications.securityAlerts}
                    onChange={(e) => updateSetting('notifications', 'securityAlerts', e.target.checked)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quiet Hours
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.quietHours.enabled}
                    onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Quiet Hours"
                sx={{ mb: 2 }}
              />
              
              {settings.notifications.quietHours.enabled && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={settings.notifications.quietHours.start}
                    onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'start', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    value={settings.notifications.quietHours.end}
                    onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'end', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Appearance Settings */}
      {currentTab === 2 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Theme & Display
              </Typography>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Theme</FormLabel>
                <RadioGroup
                  value={settings.appearance.theme}
                  onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                  row
                >
                  <FormControlLabel 
                    value="light" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeIcon /> Light
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="dark" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeIcon /> Dark
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="auto" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoModeIcon /> Auto
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Color Scheme</InputLabel>
                  <Select
                    value={settings.appearance.colorScheme}
                    label="Color Scheme"
                    onChange={(e) => updateSetting('appearance', 'colorScheme', e.target.value)}
                  >
                    <MenuItem value="blue">Blue</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="purple">Purple</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                    <MenuItem value="red">Red</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={settings.appearance.fontSize}
                    label="Font Size"
                    onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                    <MenuItem value="extra-large">Extra Large</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <List sx={{ mt: 2 }}>
                <ListItem>
                  <ListItemText primary="Compact Mode" secondary="Reduce spacing and padding" />
                  <Switch
                    checked={settings.appearance.compactMode}
                    onChange={(e) => updateSetting('appearance', 'compactMode', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Show Animations" secondary="Enable smooth transitions and animations" />
                  <Switch
                    checked={settings.appearance.showAnimations}
                    onChange={(e) => updateSetting('appearance', 'showAnimations', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="High Contrast" secondary="Increase contrast for better readability" />
                  <Switch
                    checked={settings.appearance.highContrast}
                    onChange={(e) => updateSetting('appearance', 'highContrast', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Reduced Motion" secondary="Minimize animations for motion sensitivity" />
                  <Switch
                    checked={settings.appearance.reducedMotion}
                    onChange={(e) => updateSetting('appearance', 'reducedMotion', e.target.checked)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Privacy & Security Settings */}
      {currentTab === 3 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Biometric Authentication" secondary="Use fingerprint or face unlock" />
                  <Switch
                    checked={settings.privacy.biometricAuth}
                    onChange={(e) => updateSetting('privacy', 'biometricAuth', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Auto Lock" secondary="Automatically lock the app when inactive" />
                  <Switch
                    checked={settings.privacy.autoLock}
                    onChange={(e) => updateSetting('privacy', 'autoLock', e.target.checked)}
                  />
                </ListItem>
              </List>

              {settings.privacy.autoLock && (
                <Box sx={{ mt: 2, px: 2 }}>
                  <Typography gutterBottom>Auto Lock Delay (minutes)</Typography>
                  <Slider
                    value={settings.privacy.autoLockDelay}
                    onChange={(e, value) => updateSetting('privacy', 'autoLockDelay', value)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks={[
                      { value: 1, label: '1m' },
                      { value: 5, label: '5m' },
                      { value: 15, label: '15m' },
                      { value: 30, label: '30m' },
                    ]}
                    min={1}
                    max={30}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Analytics" secondary="Help improve the app by sharing usage data" />
                  <Switch
                    checked={settings.privacy.analyticsEnabled}
                    onChange={(e) => updateSetting('privacy', 'analyticsEnabled', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Crash Reporting" secondary="Automatically send crash reports" />
                  <Switch
                    checked={settings.privacy.crashReporting}
                    onChange={(e) => updateSetting('privacy', 'crashReporting', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Usage Statistics" secondary="Share anonymous usage statistics" />
                  <Switch
                    checked={settings.privacy.usageStats}
                    onChange={(e) => updateSetting('privacy', 'usageStats', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Data Sharing" secondary="Allow sharing data with partner services" />
                  <Switch
                    checked={settings.privacy.dataSharing}
                    onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Data & Backup Settings */}
      {currentTab === 4 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <BackupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Backup Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Auto Backup" secondary="Automatically backup your data" />
                  <Switch
                    checked={settings.data.autoBackup}
                    onChange={(e) => updateSetting('data', 'autoBackup', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Cloud Sync" secondary="Sync data across devices" />
                  <Switch
                    checked={settings.data.cloudSync}
                    onChange={(e) => updateSetting('data', 'cloudSync', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Compression" secondary="Compress backup files to save space" />
                  <Switch
                    checked={settings.data.compressionEnabled}
                    onChange={(e) => updateSetting('data', 'compressionEnabled', e.target.checked)}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select
                    value={settings.data.backupFrequency}
                    label="Backup Frequency"
                    onChange={(e) => updateSetting('data', 'backupFrequency', e.target.value)}
                    disabled={!settings.data.autoBackup}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={settings.data.exportFormat}
                    label="Export Format"
                    onChange={(e) => updateSetting('data', 'exportFormat', e.target.value)}
                  >
                    <MenuItem value="JSON">JSON</MenuItem>
                    <MenuItem value="CSV">CSV</MenuItem>
                    <MenuItem value="Excel">Excel</MenuItem>
                    <MenuItem value="PDF">PDF</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>Data Retention Period (days)</Typography>
                <Slider
                  value={settings.data.dataRetention}
                  onChange={(e, value) => updateSetting('data', 'dataRetention', value)}
                  valueLabelDisplay="auto"
                  step={30}
                  marks={[
                    { value: 30, label: '30' },
                    { value: 365, label: '1Y' },
                    { value: 1095, label: '3Y' },
                    { value: 1825, label: '5Y' },
                  ]}
                  min={30}
                  max={1825}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportSettings}
                  >
                    Export Settings
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    component="label"
                  >
                    Import Settings
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      style={{ display: 'none' }}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BackupIcon />}
                    color="primary"
                  >
                    Create Backup
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RestoreIcon />}
                    color="info"
                  >
                    Restore Backup
                  </Button>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={clearCache}
                    color="warning"
                  >
                    Clear Cache
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={clearData}
                    color="error"
                  >
                    Clear All Data
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Advanced Settings */}
      {currentTab === 5 && (
        <Stack spacing={3}>
          <Alert severity="warning">
            <Typography variant="subtitle2" gutterBottom>
              Advanced Settings
            </Typography>
            These settings are for advanced users only. Changing these values may affect app performance or functionality.
          </Alert>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Developer Options
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Debug Mode" secondary="Enable debugging features and logs" />
                  <Switch
                    checked={settings.advanced.debugMode}
                    onChange={(e) => updateSetting('advanced', 'debugMode', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Beta Features" secondary="Enable experimental beta features" />
                  <Switch
                    checked={settings.advanced.betaFeatures}
                    onChange={(e) => updateSetting('advanced', 'betaFeatures', e.target.checked)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Experimental Features" secondary="Enable highly experimental features" />
                  <Switch
                    checked={settings.advanced.experimentalFeatures}
                    onChange={(e) => updateSetting('advanced', 'experimentalFeatures', e.target.checked)}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                <TextField
                  label="API Timeout (seconds)"
                  type="number"
                  value={settings.advanced.apiTimeout}
                  onChange={(e) => updateSetting('advanced', 'apiTimeout', parseInt(e.target.value))}
                  inputProps={{ min: 5, max: 120 }}
                />

                <TextField
                  label="Cache Size (MB)"
                  type="number"
                  value={settings.advanced.cacheSize}
                  onChange={(e) => updateSetting('advanced', 'cacheSize', parseInt(e.target.value))}
                  inputProps={{ min: 10, max: 1000 }}
                />

                <FormControl fullWidth>
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={settings.advanced.logLevel}
                    label="Log Level"
                    onChange={(e) => updateSetting('advanced', 'logLevel', e.target.value)}
                  >
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warn">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="debug">Debug</MenuItem>
                    <MenuItem value="verbose">Verbose</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="App Version" secondary="1.0.0" />
                  <Chip label="Latest" color="success" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Database Version" secondary="3.2.1" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last Updated" secondary={new Date().toLocaleDateString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Storage Used" secondary="15.2 MB" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={confirmDialog.action} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;