import React from 'react';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Box } from '@mui/material';

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AuthTestComponent() {
  const { user, isLoading } = useAuth();
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">
        Personal Finance Regulator - Testing Auth Context
      </Typography>
      <Typography variant="body1">
        Theme Context: ✅ Working
      </Typography>
      <Typography variant="body1">
        Auth Context: {isLoading ? "Loading..." : user ? `✅ User: ${user.email}` : "❌ No user"}
      </Typography>
    </Box>
  );
}

export default App;
