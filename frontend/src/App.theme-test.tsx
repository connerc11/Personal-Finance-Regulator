import React from 'react';
import { CustomThemeProvider, useCustomTheme } from './contexts/ThemeContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Box } from '@mui/material';

function App() {
  return (
    <CustomThemeProvider>
      <TestThemeComponent />
    </CustomThemeProvider>
  );
}

function TestThemeComponent() {
  try {
    const { theme } = useCustomTheme();
    
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 4 }}>
          <Typography variant="h4">
            Theme Context Test - SUCCESS
          </Typography>
          <Typography variant="body1">
            Theme is working correctly!
          </Typography>
        </Box>
      </ThemeProvider>
    );
  } catch (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="error">
          Theme Context Test - ERROR
        </Typography>
        <Typography variant="body1">
          Error: {error?.toString()}
        </Typography>
      </Box>
    );
  }
}

export default App;
