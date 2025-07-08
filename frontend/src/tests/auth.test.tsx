import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import App from '../App';

// Test wrapper with required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
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
      await userEvent.type(passwordInput, 'weak');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
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
        expect(localStorage.getItem('user')).toBeTruthy();
        expect(localStorage.getItem('token')).toBeTruthy();
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
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    test('should successfully login with valid credentials', async () => {
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
        expect(localStorage.getItem('user')).toBeTruthy();
        expect(localStorage.getItem('token')).toBeTruthy();
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
        expect(localStorage.getItem('user')).toBeTruthy();
        expect(localStorage.getItem('token')).toBeTruthy();
      });
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
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Should show authenticated content
      await waitFor(() => {
        expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
      });

      // Click logout in user menu
      const userMenu = screen.getByRole('button', { name: /account of current user/i });
      await userEvent.click(userMenu);

      const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
      await userEvent.click(logoutButton);

      // Should clear localStorage and redirect to login
      await waitFor(() => {
        expect(localStorage.getItem('user')).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
      });
    });
  });

  describe('Route Protection', () => {
    test('should redirect unauthenticated users to login', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Should redirect to login when not authenticated
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    test('should allow authenticated users to access protected routes', async () => {
      // Set up authenticated state
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Should show dashboard for authenticated users
      await waitFor(() => {
        expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
      });
    });

    test('should redirect authenticated users away from login/signup', async () => {
      // Set up authenticated state
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');

      // Try to access login page while authenticated
      window.history.pushState({}, 'Login', '/login');

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Should redirect to dashboard instead
      await waitFor(() => {
        expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
      });
    });
  });
});

export default {};
