import React from 'react';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';
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
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">
          Personal Finance Regulator - Testing Context
        </Typography>
        <Typography variant="body1">
          If you can see this, the theme context is working correctly.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
