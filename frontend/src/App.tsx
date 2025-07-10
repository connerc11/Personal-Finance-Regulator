import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPage from './pages/BudgetPage';
import Analytics from './pages/Analytics';
import ScheduledPurchases from './pages/ScheduledPurchases';
import CashCoach from './pages/CashCoach';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <Layout><Transactions /></Layout>
              </PrivateRoute>
            } />
            <Route path="/budgets" element={
              <PrivateRoute>
                <Layout><BudgetPage /></Layout>
              </PrivateRoute>
            } />
            <Route path="/analytics" element={
              <PrivateRoute>
                <Layout><Analytics /></Layout>
              </PrivateRoute>
            } />
            <Route path="/scheduled" element={
              <PrivateRoute>
                <Layout><ScheduledPurchases /></Layout>
              </PrivateRoute>
            } />
            <Route path="/cash-coach" element={
              <PrivateRoute>
                <Layout><CashCoach /></Layout>
              </PrivateRoute>
            } />
            <Route path="/goals" element={
              <PrivateRoute>
                <Layout><Goals /></Layout>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout><Profile /></Layout>
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Layout><Settings /></Layout>
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
