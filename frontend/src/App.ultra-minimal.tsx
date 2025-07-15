import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a simple theme directly
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h1>Ultra Minimal Test</h1>
        <p>This should work without any context errors.</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
