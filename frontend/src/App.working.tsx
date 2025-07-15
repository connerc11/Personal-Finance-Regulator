import React from 'react';
import { CustomThemeProvider, useCustomTheme } from './contexts/SimpleThemeContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import SessionManager from './components/SessionManager';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SaveSpotlight from './pages/SaveSpotlight';

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
      <AuthProvider>
        <Router>
          {/* @ts-ignore */}
          <Routes>
            {/* @ts-ignore */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            {/* @ts-ignore */}
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            {/* @ts-ignore */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            {/* @ts-ignore */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout><Dashboard /></Layout>
              </PrivateRoute>
            } />
            {/* @ts-ignore */}
            <Route path="/save-spotlight" element={
              <PrivateRoute>
                <Layout><SaveSpotlight /></Layout>
              </PrivateRoute>
            } />
            {/* @ts-ignore */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <SessionManager />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
