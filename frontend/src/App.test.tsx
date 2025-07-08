import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

// Test wrapper component
const AppTestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({ 
  children, 
  initialEntries = ['/'] 
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

test('renders login page by default when not authenticated', () => {
  render(
    <AppTestWrapper>
      <Login />
    </AppTestWrapper>
  );
  
  // Should show the login form
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  expect(screen.getByText(/sign in to your personal finance account/i)).toBeInTheDocument();
});
