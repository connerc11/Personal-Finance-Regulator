import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import only Login to test
import Login from './pages/Login';

// Dark theme configuration for Personal Finance Regulator
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88', // Signature green color
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
});

// Route wrapper to test basic routing
const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();
  
  // Show loading while AuthContext is initializing
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#0a0a0a'
        }}
      >
        <Typography variant="h6" sx={{ color: '#00ff88' }}>
          Loading Personal Finance Regulator...
        </Typography>
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Test with just login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component - Simplified for testing
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;