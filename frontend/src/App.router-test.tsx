import React from 'react';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const Login = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4">Login Page</Typography>
  </Box>
);

const Dashboard = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4">Dashboard Page</Typography>
  </Box>
);

function App() {
  return (
    <Router>
      {/* @ts-ignore */}
      <Routes>
        {/* @ts-ignore */}
        <Route path="/login" element={<Login />} />
        {/* @ts-ignore */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* @ts-ignore */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* @ts-ignore */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
