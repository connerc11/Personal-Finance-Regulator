import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';

// Test wrapper with required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Sign Up Functionality', () => {
    test('should render signup form with all required fields', () => {
      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('should validate required fields', async () => {
      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    test('should validate password requirements', async () => {
      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      await userEvent.type(passwordInput, 'weakpassword'); // 8+ chars but missing uppercase and number

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        // Check for password complexity validation (since it's 8+ chars but lacks complexity)
        expect(screen.getByText(/password must contain at least one uppercase letter, one lowercase letter, and one number/i)).toBeInTheDocument();
      });
    });

    test('should validate password confirmation match', async () => {
      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await userEvent.type(passwordInput, 'ValidPass123');
      await userEvent.type(confirmInput, 'DifferentPass123');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    test('should successfully register a new user', async () => {
      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      // Fill in valid form data
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/username/i), 'johndoe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'ValidPass123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Should redirect to dashboard after successful registration
      await waitFor(() => {
        expect(localStorage.getItem('personalfinance_current_user')).toBeTruthy();
        expect(localStorage.getItem('personalfinance_token')).toBeTruthy();
      });
    });

    test('should prevent duplicate email registration', async () => {
      // Pre-register a user
      const existingUser = {
        id: 1,
        username: 'existing',
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_users', JSON.stringify([existingUser]));

      render(
        <TestWrapper>
          <Signup />
        </TestWrapper>
      );

      // Try to register with the same email
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/username/i), 'johndoe');
      await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'ValidPass123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Should show error about existing email
      await waitFor(() => {
        expect(screen.getByText(/an account with this email already exists. please sign in instead./i)).toBeInTheDocument();
      });
    });
  });

  describe('Sign In Functionality', () => {
    test('should render login form', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('should validate required login fields', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        // Login shows a general validation message
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });

    test('should successfully login with valid credentials', async () => {
      // First register a user for login testing
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_users', JSON.stringify([userData]));

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('personalfinance_current_user')).toBeTruthy();
        expect(localStorage.getItem('personalfinance_token')).toBeTruthy();
      });
    });

    test('should work with demo login', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const demoButton = screen.getByRole('button', { name: /try demo/i });
      await userEvent.click(demoButton);

      await waitFor(() => {
        expect(localStorage.getItem('personalfinance_current_user')).toBeTruthy();
        expect(localStorage.getItem('personalfinance_token')).toBeTruthy();
      });
    });

    test('should require signup before login', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Try to login with non-existent user
      await userEvent.type(screen.getByLabelText(/email/i), 'nonexistent@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Should show error that user needs to sign up first
      await waitFor(() => {
        expect(screen.getByText(/no account found with this email. please sign up first./i)).toBeInTheDocument();
      });

      // Should not save anything to localStorage
      expect(localStorage.getItem('personalfinance_current_user')).toBeNull();
      expect(localStorage.getItem('personalfinance_token')).toBeNull();
    });
  });

  describe('Sign Out Functionality', () => {
    test('should clear user data and redirect to login', async () => {
      // Set up authenticated state
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_current_user', JSON.stringify(mockUser));
      localStorage.setItem('personalfinance_token', 'mock-token');

      render(
        <TestWrapper>
          <Layout><Dashboard /></Layout>
        </TestWrapper>
      );

      // Should show authenticated content (financial setup form for non-demo users)
      await waitFor(() => {
        expect(screen.getByText(/set up your financial profile/i)).toBeInTheDocument();
      });

      // Click logout in user menu
      const userMenu = screen.getByRole('button', { name: /account of current user/i });
      await userEvent.click(userMenu);

      const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
      await userEvent.click(logoutButton);

      // Should clear localStorage
      await waitFor(() => {
        expect(localStorage.getItem('personalfinance_current_user')).toBeNull();
        expect(localStorage.getItem('personalfinance_token')).toBeNull();
      });
    });
  });

  describe('Authentication State', () => {
    test('should show login form when not authenticated', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Should show login page content
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('should show dashboard when authenticated', async () => {
      // Set up authenticated state
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_current_user', JSON.stringify(mockUser));
      localStorage.setItem('personalfinance_token', 'mock-token');

      render(
        <TestWrapper>
          <Layout><Dashboard /></Layout>
        </TestWrapper>
      );

      // Should show dashboard for authenticated users (financial setup form for non-demo users)
      await waitFor(() => {
        expect(screen.getByText(/set up your financial profile/i)).toBeInTheDocument();
      });
    });

    test('should maintain authentication state across renders', async () => {
      // Set up authenticated state
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_current_user', JSON.stringify(mockUser));
      localStorage.setItem('personalfinance_token', 'mock-token');

      const { rerender } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should maintain state across re-renders (financial setup form for non-demo users)
      await waitFor(() => {
        expect(screen.getByText(/set up your financial profile/i)).toBeInTheDocument();
      });

      rerender(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/set up your financial profile/i)).toBeInTheDocument();
      });
    });

    test('should show demo dashboard for demo users', async () => {
      // Set up demo user authenticated state
      const demoUser = {
        id: 1,
        username: 'demo',
        email: 'demo@personalfinance.com',
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('personalfinance_current_user', JSON.stringify(demoUser));
      localStorage.setItem('personalfinance_token', 'mock-token');

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should show welcome message for demo users
      await waitFor(() => {
        expect(screen.getByText(/welcome back, demo/i)).toBeInTheDocument();
      });
    });
  });
});

export default {};
