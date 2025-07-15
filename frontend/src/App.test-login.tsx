import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

// Test importing Login only first
import Login from './pages/Login';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00ff88' },
    background: { default: '#0a0a0a', paper: '#1a1a1a' },
    text: { primary: '#ffffff', secondary: '#cccccc' },
  },
});

function App() {
  console.log('App rendering, Login component:', typeof Login, Login);
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <div style={{ padding: '20px', color: 'white' }}>
          <h1>Testing Login Import</h1>
          <p>Login component type: {typeof Login}</p>
          <p>Login component name: {Login?.name || 'undefined'}</p>
          {typeof Login === 'function' ? (
            <Login />
          ) : (
            <p>ERROR: Login is not a function, it is: {typeof Login}</p>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
