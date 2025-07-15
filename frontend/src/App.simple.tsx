import React from 'react';
import { CustomThemeProvider, useCustomTheme } from './contexts/SimpleThemeContext';
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
  const { theme } = useCustomTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">
          Personal Finance Regulator - Simple Theme Test
        </Typography>
        <Typography variant="body1">
          If you see this, the simple theme context is working!
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
