import React from 'react';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import CashCoach from './pages/CashCoach';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ScheduledPurchases from './pages/ScheduledPurchases';
import SaveSpotlight from './pages/SimpleSaveSpotlight';

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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        <Route path="/budgets" element={
          <Layout>
            <Budgets />
          </Layout>
        } />
        <Route path="/transactions" element={
          <Layout>
            <Transactions />
          </Layout>
        } />
        <Route path="/goals" element={
          <Layout>
            <Goals />
          </Layout>
        } />
        <Route path="/analytics" element={
          <Layout>
            <Analytics />
          </Layout>
        } />
        <Route path="/reports" element={
          <Layout>
            <Reports />
          </Layout>
        } />
        <Route path="/scheduled" element={
          <Layout>
            <ScheduledPurchases />
          </Layout>
        } />
        <Route path="/cash-coach" element={
          <Layout>
            <CashCoach />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <Settings />
          </Layout>
        } />
        <Route path="/simple-save" element={
          <Layout>
            <SaveSpotlight />
          </Layout>
        } />
        
        {/* Default redirects */}
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