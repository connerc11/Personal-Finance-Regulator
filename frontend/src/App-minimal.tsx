import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Simple test theme
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Test component that uses AuthContext
const TestComponent: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Personal Finance Regulator - AuthContext Test</h1>
      <p>AuthContext is working!</p>
      <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>User: {user ? `${user.firstName} ${user.lastName}` : 'Not logged in'}</p>
    </div>
  );
};

// Minimal App to test AuthContext functionality
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
