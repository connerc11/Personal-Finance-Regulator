import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Test importing Login without AuthContext
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
      <div style={{ padding: '20px', color: 'white' }}>
        <h1>Testing Login Import (No AuthContext)</h1>
        <p>Login component type: {typeof Login}</p>
        <p>Login component name: {Login?.name || 'undefined'}</p>
        {typeof Login === 'function' ? (
          <div>
            <p>✅ Login is a function - attempting to render...</p>
            <Login />
          </div>
        ) : (
          <p>❌ ERROR: Login is not a function, it is: {typeof Login}</p>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
