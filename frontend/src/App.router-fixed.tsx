import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import SessionManager from './components/SessionManager';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPage from './pages/BudgetPage';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
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

// Type casting to fix React Router type issues
const RoutesComponent = Routes as any;
const RouteComponent = Route as any;
const NavigateComponent = Navigate as any;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <RoutesComponent>
            <RouteComponent path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <RouteComponent path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <RouteComponent path="/" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/dashboard" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/transactions" element={
              <PrivateRoute>
                <Layout><Transactions /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/budgets" element={
              <PrivateRoute>
                <Layout><BudgetPage /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/analytics" element={
              <PrivateRoute>
                <Layout><Analytics /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/reports" element={
              <PrivateRoute>
                <Layout><Reports /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/scheduled" element={
              <PrivateRoute>
                <Layout><ScheduledPurchases /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/cash-coach" element={
              <PrivateRoute>
                <Layout><CashCoach /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/goals" element={
              <PrivateRoute>
                <Layout><Goals /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/profile" element={
              <PrivateRoute>
                <Layout><Profile /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="/settings" element={
              <PrivateRoute>
                <Layout><Settings /></Layout>
              </PrivateRoute>
            } />
            <RouteComponent path="*" element={<NavigateComponent to="/dashboard" replace />} />
          </RoutesComponent>
          <SessionManager />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
